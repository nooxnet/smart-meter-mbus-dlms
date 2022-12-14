import { ApplicationDataProvisioning, ApplicationDataState, TelegramState } from "./enums";
import { TelegramReader } from "./telegram-reader";
import { Telegram } from "./telegram";
import { ApplicationProtocolDataUnit } from "./application-protocol-data-unit";
import { ApplicationDataDecrypter } from "./application-data-decrypter";

// transport layer - reads APDUs (application protocol data unit) from one or more TPDU (transport protocol data unit)
export class MultiTelegramReader {
	// either use addRawData() or addTelegrams() - not both

	private static readonly cypheringServiceGeneralGloCiphering = 0xDB;

	private applicationDataUnits: ApplicationProtocolDataUnit[] = [];
	private currentApplicationDataUnit = new ApplicationProtocolDataUnit();
	private currentApplicationDataUnits: Buffer[] = [];

	private currentSequenceNumber = 0;

	// telegramReader would not be needed if addTelegram() is not used, but it has to be defined in the calling code anyway
	constructor(private telegramReader: TelegramReader, private provisioning: ApplicationDataProvisioning = ApplicationDataProvisioning.all, private decrypt = true) {
	}

	public areApplicationDataUnitsAvailable(): ApplicationDataState {
		return this.applicationDataUnits.length > 0 ? ApplicationDataState.available : ApplicationDataState.pending;
	}

	public addRawData(newData: Buffer): ApplicationDataState {
		const telegramStatus = this.telegramReader.addRawData(newData);
		if (telegramStatus == TelegramState.available) {
			const telegrams = this.telegramReader.getTelegrams();
			return this.addTelegrams(telegrams);
		}
		return this.areApplicationDataUnitsAvailable();
	}

	public addTelegrams(newTelegrams: Telegram[]): ApplicationDataState {
		for (const newTelegram of newTelegrams) {
			if (newTelegram.sequenceNumber != this.currentSequenceNumber) {
				console.log(`MultiTelegramReader.addTelegrams: Sequence number does not match. Start over. Expected: ${this.currentSequenceNumber}. Received: ${newTelegram.sequenceNumber}`);
				this.resetSearch();
				continue;
			}

			if(!newTelegram.applicationData) {
				console.warn(`MultiTelegramReader.addTelegrams: Application data not set.`);
				this.resetSearch();
				continue;
			}

			if (newTelegram.sequenceNumber === 0) {
				if (newTelegram.applicationData.length < 17) {
					console.warn(`MultiTelegramReader.addTelegrams: Application data length of first telegram in sequence invalid. Start over. Expected: >= 17. Received: ${newTelegram.applicationData.length}`);
					this.resetSearch();
					continue;
				}

				this.currentApplicationDataUnit.cypheringService = newTelegram.applicationData[0];
				if (this.currentApplicationDataUnit.cypheringService != MultiTelegramReader.cypheringServiceGeneralGloCiphering) {
					console.warn(`MultiTelegramReader.addTelegrams: Application data cyphering service invalid. Start over. Expected: ${MultiTelegramReader.cypheringServiceGeneralGloCiphering.toString(16)}. Received: ${this.currentApplicationDataUnit.cypheringService.toString(16)}`);
					this.resetSearch();
					continue;
				}

				this.currentApplicationDataUnit.setSystemTitle(newTelegram.applicationData.subarray(2, 10));

				// length field has either 1 byte (length <= 127) or 3 bytes
				const lengthFieldLength = this.currentApplicationDataUnit.setLength(newTelegram.applicationData,10, 13);
				if (lengthFieldLength == 0) {
					console.warn('MultiTelegramReader.addTelegrams: Invalid length field length. Start over.');
					this.resetSearch();
					continue;
				}
				const offset = lengthFieldLength - 1;

				this.currentApplicationDataUnit.securityControl = newTelegram.applicationData[11 + offset];
				this.currentApplicationDataUnit.setFrameCounter(newTelegram.applicationData, 12 + offset, 16 + offset);
			}
			this.currentApplicationDataUnits.push(newTelegram.applicationData);

			if (!newTelegram.isLastSegment) {
				this.currentSequenceNumber++;
				continue;
			}

			// last segment:
			this.currentApplicationDataUnit.apduRaw = Buffer.concat(this.currentApplicationDataUnits);
			this.currentApplicationDataUnit.encryptedPayload = this.currentApplicationDataUnit.apduRaw.subarray(16 + this.currentApplicationDataUnit.lengthFieldLength - 1);

			// no decryption if testing
			if(this.decrypt) {
				ApplicationDataDecrypter.Decrypt(this.currentApplicationDataUnit);

				if (this.currentApplicationDataUnit.lengthEncryptedPayload != this.currentApplicationDataUnit.encryptedPayload.length) {
					console.warn(`addTelegrams: Application data length of combined segments invalid. Start over. Expected: ${this.currentApplicationDataUnit.lengthEncryptedPayload}. Received: ${this.currentApplicationDataUnit.encryptedPayload.length}`);
					//console.log(JSON.stringify(this.currentApplicationDataUnit));
					this.resetSearch();
					continue;
				}
			}


			// everything seems to be fine:
			if(this.provisioning == ApplicationDataProvisioning.all) {
				this.applicationDataUnits.push(this.currentApplicationDataUnit);
			} else {
				this.applicationDataUnits = [this.currentApplicationDataUnit];
			}
			this.resetSearch();
		}
		return this.areApplicationDataUnitsAvailable();
	}

	public getApplicationDataUnits(): ApplicationProtocolDataUnit[] {
		const ret = [...this.applicationDataUnits];
		this.applicationDataUnits = [];
		return ret;
	}

	private resetSearch() {
		this.currentSequenceNumber = 0;
		this.currentApplicationDataUnit = new ApplicationProtocolDataUnit();
		this.currentApplicationDataUnits = [];
	}
}

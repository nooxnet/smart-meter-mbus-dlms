import { ApplicationDataProvisioning, ApplicationDataState, TelegramState } from "./enums";
import { TelegramReader } from "./telegram-reader";
import { Telegram } from "./telegram";
import { ApplicationProtocolDataUnit } from "./application-protocol-data-unit";

// transport layer - reads APDUs (application protocol data unit) from one or more TPDU (transport protocol data unit)
export class MultiTelegramReader {
	// either use addRawData or addTelegrams

	private static readonly CypheringServiceGeneralGloCiphering = 0xDB;

	private applicationDataUnits: ApplicationProtocolDataUnit[] = [];
	private currentApplicationDataUnit = new ApplicationProtocolDataUnit();

	private currentSequenceNumber = 0;

	// telegramReader would not be needed if addTelegram() is not used, but then it has to be defined in the calling code anyway
	constructor(private telegramReader: TelegramReader, private provisioning: ApplicationDataProvisioning = ApplicationDataProvisioning.lastOnly) {
	}

	public areApplicationDataUnitsAvailable(): ApplicationDataState {
		return this.applicationDataUnits.length > 0 ? ApplicationDataState.available : ApplicationDataState.pending;
	}

	public addRawData(newData: number[]): ApplicationDataState {
		const telegramStatus = this.telegramReader.addRawData(newData);
		if (telegramStatus == TelegramState.available) {
			const telegrams = this.telegramReader.getTelegrams();
			return this.addTelegrams(telegrams);
		}
		return this.areApplicationDataUnitsAvailable();
	}


	public addTelegrams(newTelegrams: Telegram[]): ApplicationDataState {
		for (let newTelegram of newTelegrams) {
			if (newTelegram.sequenceNumber != this.currentSequenceNumber) {
				console.log(`addTelegrams: Sequence number does not match. Start over. Expected: ${this.currentSequenceNumber}. Received: ${newTelegram.sequenceNumber}`);
				this.resetSearch();
				continue;
			}

			if (newTelegram.sequenceNumber === 0) {
				if (newTelegram.applicationData.length < 17) {
					console.warn(`addTelegrams: Application data length of first telegram in sequence invalid. Start over. Expected: >= 17. Received: ${newTelegram.applicationData.length}`);
					this.resetSearch();
					continue;
				}

				this.currentApplicationDataUnit.cypheringService = newTelegram.applicationData[0];
				if (this.currentApplicationDataUnit.cypheringService != MultiTelegramReader.CypheringServiceGeneralGloCiphering) {
					console.warn(`addTelegrams: Application data cyphering service invalid. Start over. Expected: ${MultiTelegramReader.CypheringServiceGeneralGloCiphering.toString(16)}. Received: ${this.currentApplicationDataUnit.cypheringService.toString(16)}`);
					this.resetSearch();
					continue;
				}

				this.currentApplicationDataUnit.setSystemTitle(newTelegram.applicationData.slice(2, 10));

				// length filed has either 1 byte (length <= 127) or 3 bytes
				const lengthFieldLength = this.currentApplicationDataUnit.setLength(newTelegram.applicationData.slice(10, 13));
				const offset = lengthFieldLength - 1

				this.currentApplicationDataUnit.securityControl = newTelegram.applicationData[11 + offset];
				this.currentApplicationDataUnit.setFrameCounter(newTelegram.applicationData.slice(12 + offset, 16 + offset));

				this.currentApplicationDataUnit.encryptedPayload = newTelegram.applicationData.slice(16 + offset);
			} else {
				this.currentApplicationDataUnit.encryptedPayload.push(...newTelegram.applicationData);
			}

			if (!newTelegram.isLastSegment) {
				this.currentSequenceNumber++;
				continue;
			}

			// last segment:
			if (this.currentApplicationDataUnit.lengthEncryptedPayload != this.currentApplicationDataUnit.encryptedPayload.length) {
				console.warn(`addTelegrams: Application data length of combined segments invalid. Start over. Expected: ${this.currentApplicationDataUnit.lengthEncryptedPayload}. Received: ${this.currentApplicationDataUnit.encryptedPayload.length}`);
				console.log(JSON.stringify(this.currentApplicationDataUnit));
				this.resetSearch();
				continue;
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
	}
}

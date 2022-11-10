import { TelegramStatus } from "./enums";
import { Telegram } from "./Telegram";

// data link layer
export class TelegramReader {

	static readonly startByte: number = 0x68;
	static readonly stopByte: number = 0x16;

	private currentTelegram = new Telegram();
	private possibleStartFound = false;

	private data: number[] = []

	private telegrams: Telegram[] = [];


	public areTelegramsAvailable(): TelegramStatus {
		return this.telegrams.length > 0 ? TelegramStatus.available : TelegramStatus.pending;
	}

	private resetSearch() {
		this.possibleStartFound =false;
		this.currentTelegram = new Telegram();
	}

	public addRawData(newData: number[]): TelegramStatus {
		//console.log('addRawData', JSON.stringify(newData));
		if(!this.possibleStartFound) {
			const startByteIndex = newData.indexOf(TelegramReader.startByte);
			if(startByteIndex < 0) {
				return this.areTelegramsAvailable();
			}
			this.possibleStartFound = true;
			if(startByteIndex > 0) {
				newData = newData.slice(startByteIndex);
			}
		}
		this.data.push(...newData);
		// console.log('addRawData this.data', JSON.stringify(this.data), this.data.length);


		return this.checkTelegram()
	}

	// only fetch them once!
	public getTelegrams(): Telegram[] {
		console.log('getTelegrams this.telegrams.length', this.telegrams.length);
		const ret = [...this.telegrams];
		console.log('getTelegrams ret.length 1', ret.length);
		this.telegrams = [];
		console.log('getTelegrams ret.length 2', ret.length);
		return ret;
	}

	private checkTelegram(): TelegramStatus {
		if(this.data.length < 4){
			return this.areTelegramsAvailable();
		}

		if(this.currentTelegram.dataLen <= 0) {
			// check for telegram start sequence
			if(this.data[3] != TelegramReader.startByte || this.data[1] != this.data[2]) {
				return this.checkForNewStartIndex(1);
			}
			this.currentTelegram.dataLen = this.data[1];
		}

		if(this.currentTelegram.dataLen <= 3) {
			// control frame -> ignore
			return this.checkForNewStartIndex(1);
		}

		// long frame

		if(this.data.length < this.currentTelegram.totalLen!) {
			return this.areTelegramsAvailable();
		}

		if(this.data[this.currentTelegram.totalLen - 1] != TelegramReader.stopByte) {
			return this.checkForNewStartIndex(1);
		}

		const calculatedChecksum = this.checkChecksum();
		this.currentTelegram.checkSum = this.data[this.currentTelegram.totalLen! - 2];
		if(calculatedChecksum != this.currentTelegram.checkSum) {
			console.warn('Invalid checksum', calculatedChecksum, this.currentTelegram.checkSum);
			return this.checkForNewStartIndex(1);
		}

		// seems like everything is fine - set telegram fields
		this.currentTelegram.controlField = this.data[4];
		this.currentTelegram.addressField = this.data[5];
		this.currentTelegram.controlInformationField = this.data[6];

		this.currentTelegram.userData = this.data.slice(6, this.currentTelegram.dataLen - 2);

		// reset for next telegram
		console.log('checkTelegram this.currentTelegram', this.currentTelegram);
		this.telegrams.push(this.currentTelegram);
		console.log('checkTelegram this.telegrams.length', this.telegrams.length);
		const len = this.currentTelegram.totalLen;
		this.resetSearch();
		if(this.data.length > len) {
			this.data = this.data.slice(len)
			// maybe we have another one:
			return this.checkTelegram()
		}

		this.data = [];
		//return this.areTelegramsAvailable()
		return TelegramStatus.available;
	}

	private checkForNewStartIndex(firstPossibleIndex: number): TelegramStatus {
		this.resetSearch();
		const newStartByteIndex= this.data.indexOf(TelegramReader.startByte, firstPossibleIndex);
		if(newStartByteIndex < firstPossibleIndex) {
			this.data = [];
			return this.areTelegramsAvailable();
		}
		this.data = this.data.slice(newStartByteIndex);
		this.possibleStartFound = true;
		return this.checkTelegram();
	}

	private checkChecksum() {
		const start = 4;
		const end = this.currentTelegram.totalLen! - 2;
		let sum = 0;
		for(let i = start; i < end; i++) {
			sum += this.data[i];
		}
		return sum & 0xFF;
	}
}

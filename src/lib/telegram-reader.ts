import { TelegramState } from "./enums";
import { Telegram } from "./telegram";
import { ReceiveBuffer } from "./receive-buffer";

// data link layer
export class TelegramReader {

	static readonly startByte: number = 0x68;
	static readonly stopByte: number = 0x16;

	private currentTelegram = new Telegram();
	private possibleStartFound = false;

	static readonly receiveBufferInitialSize = 512;
	static readonly receiveBufferMaxSize = 8192;
	private receiveBuffer = new ReceiveBuffer(TelegramReader.receiveBufferInitialSize, TelegramReader.receiveBufferMaxSize);

	private telegrams: Telegram[] = [];

	public areTelegramsAvailable(): TelegramState {
		return this.telegrams.length > 0 ? TelegramState.available : TelegramState.pending;
	}

	public addRawData(newData: Buffer): TelegramState {
		//console.log('TelegramReader.addRawData', JSON.stringify(newData));
		//console.log(this.receiveBuffer.length);
		//console.log('addRawData', this.possibleStartFound);
		//console.log('addRawData', this.receiveBuffer);
		let sourceStart = 0;
		if(!this.possibleStartFound) {
			sourceStart = newData.indexOf(TelegramReader.startByte);
			if(sourceStart < 0) {
				return this.areTelegramsAvailable();
			}
			this.possibleStartFound = true;
		}
		if(!this.receiveBuffer.addBuffer(newData, sourceStart)) {
			// buffer overflow (receiveBufferMaxSize), ignore data and carry on
			this.receiveBuffer.reset();
			this.resetSearch();
			return this.areTelegramsAvailable();
		}
		// console.log('TelegramReader.addRawData this.data', JSON.stringify(this.data), this.data.length);
		return this.checkTelegram()
	}

	// only fetch them once!
	public getTelegrams(): Telegram[] {
		const ret = [...this.telegrams];
		this.telegrams = [];
		return ret;
	}

	private resetSearch() {
		this.possibleStartFound =false;
		this.currentTelegram = new Telegram();
	}

	private checkTelegram(): TelegramState {
		//console.log('checkTelegram receiveBuffer', this.receiveBuffer)
		if(this.receiveBuffer.length < 4){
			return this.areTelegramsAvailable();
		}

		//console.log('checkTelegram currentTelegram', this.currentTelegram)
		if(this.currentTelegram.lengthData <= 0) {
			// check for telegram start sequence
			if(this.receiveBuffer.buffer[3] != TelegramReader.startByte || this.receiveBuffer.buffer[1] != this.receiveBuffer.buffer[2]) {
				return this.checkForNewStartIndex();
			}
			this.currentTelegram.lengthData = this.receiveBuffer.buffer[1];
		}

		if(this.currentTelegram.lengthData <= 3) {
			// control frame -> ignore
			return this.checkForNewStartIndex();
		}

		// long frame

		if(this.receiveBuffer.length < this.currentTelegram.lengthTotal) {
			return this.areTelegramsAvailable();
		}

		if(this.receiveBuffer.buffer[this.currentTelegram.lengthTotal - 1] != TelegramReader.stopByte) {
			return this.checkForNewStartIndex();
		}

		const calculatedChecksum = this.checkChecksum();
		this.currentTelegram.checkSum = this.receiveBuffer.buffer[this.currentTelegram.lengthTotal - 2];
		if(calculatedChecksum != this.currentTelegram.checkSum) {
			console.warn('Invalid checksum', calculatedChecksum, this.currentTelegram.checkSum);
			return this.checkForNewStartIndex();
		}

		// seems like everything is fine - set telegram fields
		this.currentTelegram.telegramRaw = this.receiveBuffer.buffer.subarray(0, this.currentTelegram.lengthTotal);

		// rest of data link layer data:
		this.currentTelegram.controlField = this.receiveBuffer.buffer[4];   // should be 0x53 (83 dec)
		this.currentTelegram.addressField = this.receiveBuffer.buffer[5];   // should be 0xFF (255 dec) Broadcast without reply

		// transport layer data:
		this.currentTelegram.controlInformationField = this.receiveBuffer.buffer[6];
		this.currentTelegram.sourceAddress = this.receiveBuffer.buffer[7];
		this.currentTelegram.destinationAddress = this.receiveBuffer.buffer[8];

		// application layer data:
		this.currentTelegram.applicationData = this.receiveBuffer.buffer.subarray(9, this.currentTelegram.lengthTotal - 2);

		// reset for next telegram
		this.telegrams.push(this.currentTelegram);
		const len = this.currentTelegram.lengthTotal;
		this.resetSearch();
		if(this.receiveBuffer.length <= len) {
			this.receiveBuffer = new ReceiveBuffer(TelegramReader.receiveBufferInitialSize, TelegramReader.receiveBufferMaxSize);
			return TelegramState.available;
		}

		// more data in receiveBuffer:
		const oldReceiveBuffer = this.receiveBuffer;
		this.receiveBuffer = new ReceiveBuffer(TelegramReader.receiveBufferInitialSize, TelegramReader.receiveBufferMaxSize);
		this.receiveBuffer.addBuffer(oldReceiveBuffer.buffer.subarray(0, oldReceiveBuffer.length), len);

		return this.checkTelegram()
	}

	private checkForNewStartIndex(): TelegramState {
		this.resetSearch();
		if(!this.receiveBuffer.checkForNewStartIndex(TelegramReader.startByte)) {
			return this.areTelegramsAvailable();
		}
		this.possibleStartFound = true;
		// recursive - if multiple telegrams are within the raw data added at once
		return this.checkTelegram();
	}

	private checkChecksum() {
		const start = 4;
		const end = this.currentTelegram.lengthTotal! - 2;
		let sum = 0;
		for(let i = start; i < end; i++) {
			sum += this.receiveBuffer.buffer[i];
		}
		return sum & 0xFF;
	}
}


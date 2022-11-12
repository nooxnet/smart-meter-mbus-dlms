import { KeySet } from "./enums";
import { Tools } from "./tools";

export class ApplicationProtocolDataUnit {
	public cypheringService: number;

	public systemTitleLength: number;

	private _systemTitle: Buffer;
	private _systemTitleManufacturerId: string;
	private _systemTitleText: string;
	private _serialNumber: number;
	public setSystemTitle(rawData: Buffer) {
		this._systemTitle = rawData;
		this._systemTitleManufacturerId = rawData.subarray(0, 3).toString();
		this._serialNumber= Tools.getNumberFromBuffer(rawData, 5, 8);

		// system title text. at least for my KAIFA MA309M it seems to be:
		if(this._systemTitleManufacturerId == 'KFM') {
			let first = rawData[3].toString(16).padStart(2, '0');
			let second = rawData[4].toString(16).padStart(2, '0');
			let rest = Tools.getNumberFromBuffer(rawData, 5, 8).toString().padStart(7, '0');
			this._systemTitleText = first[0] + this._systemTitleManufacturerId + first[1] + second + rest;
		} else {
			// just a guess ...
			// if first letters after manufacturer ids are alphanumeric, treat it as characters
			// treat second part as decimal number
			let i = 0;
			while(i < 5 && rawData[3 + i] >= 48 && rawData[3 + i] <= 122 ) {
				i++;
			}
			let first = '';
			let second = ''

			if(i > 0) {
				first = rawData.subarray(3, 3 + i).toString();
			}
			if(3 + i < 8) {
				let padLength = (256 ** (5 - i)).toString().length;
				second = Tools.getNumberFromByteArray([...rawData.subarray(3 + i, 8)]).toString().padStart(padLength, '0');
			}
			this._systemTitleText = this._systemTitleManufacturerId + first + second;
		}
	}
	public get systemTitle(): Buffer {
		return this._systemTitle;
	}
	public get systemTitleManufacturerId(): string {
		return this._systemTitleManufacturerId;
	}
	public get systemTitleText(): string {
		return this._systemTitleText;
	}

	private _lengthFieldLength: number;
	private _lengthTotal: number;
	private _lengthEncryptedPayload: number;
	private _lengthField: number;
	public setLength(buffer: Buffer, start = 0, end?: number): number {
		if(end == undefined) end = buffer.length;
		// length of length field is variable: 1 or 3 bytes long
		if(buffer[start] == 0x82) {     // 130
			this._lengthField = Tools.getNumberFromBuffer(buffer, start + 1, end);
			this._lengthFieldLength = 3;
		} else {
			this._lengthField = buffer[start];
			this._lengthFieldLength = 1;
		}
		this._lengthEncryptedPayload = this._lengthField - 5;
		this._lengthTotal = this._lengthField + this._lengthFieldLength + 10;

		return this._lengthFieldLength;
	}
	public get lengthFieldLength(): number {
		return this._lengthFieldLength;
	}
	public get lengthTotal(): number {
		return this._lengthTotal;
	}
	public get lengthEncryptedPayload(): number {
		return this._lengthEncryptedPayload;
	}
	public get lengthField(): number {
		return this._lengthField;
	}

	private _securityControl: number;
	private _securitySuiteId: number;
	private _securityAuthentication: boolean;   // subfield "A"
	private _securityEncryption: boolean;       // subfield "E"
	private _securityKeySet: KeySet;           // subfield Key_Set
	private _securityCompression: boolean;

	public set securityControl(value: number) {
		this._securityControl = value;
		this._securitySuiteId =          this._securityControl & 0b00001111;
		this._securityAuthentication =  (this._securityControl & 0b00010000) == 0b00010000;
		this._securityEncryption =      (this._securityControl & 0b00100000) == 0b00100000;
		this._securityKeySet =          (this._securityControl & 0b01000000) == 0b01000000 ? KeySet.broadcast : KeySet.unicast;
		this._securityCompression =     (this._securityControl & 0b10000000) == 0b10000000;
	}

	public get securityControl(): number {
		return this._securityControl;
	}
	public get securitySuiteId(): number {
		return this._securitySuiteId;
	}
	public get securityAuthentication(): boolean {
		return this._securityAuthentication;
	}
	public get securityEncryption(): boolean {
		return this._securityEncryption;
	}
	public get securityKeySet(): KeySet {
		return this._securityKeySet;
	}
	public get securityCompression(): boolean {
		return this._securityCompression;
	}

	private _frameCounter: Buffer
	private _frameCounterNumber: number;
	public setFrameCounter(buffer: Buffer, start: number = 0, end?: number) {
		this._frameCounter = buffer.subarray(start, end);
		this._frameCounterNumber = Tools.getNumberFromBuffer(this._frameCounter);
	}
	public get frameCounter(): Buffer {
		return this._frameCounter;
	}
	public get frameCounterNumber(): number {
		return this._frameCounterNumber;
	}

	public encryptedPayload: Buffer;

	public decryptedPayload: Buffer;

	// raw APDU data
	public apduRaw: Buffer;
}

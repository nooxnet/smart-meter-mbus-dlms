
// represents data link, transport and application layer of single telegram
export class Telegram {
	// data link layer:

	private _lengthData: number = 0;
	private _lengthTotal: number = 0;
	private _lengthTransportData: number = 0;
	private _lengthApplicationData: number = 0;

	public set lengthData(len: number) {
		this._lengthData = len;
		this._lengthTotal = len + 6;   // 2x start, 2x len, checksum, stop
		this._lengthTransportData = len - 2;  // len user-data + C, A, CI field. CI is part of transport layer
		this._lengthApplicationData = len - 5; // transport minus CI, STSAP, DTSAP
	}
	public get lengthData(): number {
		return this._lengthData;
	}
	public get lengthTotal(): number {
		return this._lengthTotal;
	}
	public get lengthTransportData(): number {
		return this._lengthTransportData;
	}
	public get lengthApplicationData(): number {
		return this._lengthApplicationData;
	}

	public checkSum: number = -1;
	public controlField: number = 0;    // C field
	public addressField: number = 0;    // A field


	// transport layer
	// TPDU (transport protocol data unit)

	private _controlInformationField: number = 0;
	private _sequenceNumber: number = 0;
	private _isLastSegment: boolean = true; // or application data is only in one single telegram

	// CI field:
	public set controlInformationField(ciField: number) {
		this._controlInformationField = ciField;
		this._sequenceNumber = this._controlInformationField & 0b00001111;
		this._isLastSegment = (this._controlInformationField & 0b00010000) == 0b00010000;
	}
	public get controlInformationField(): number {
		return this._controlInformationField;
	}
	public get sequenceNumber(): number {
		return this._sequenceNumber;
	}
	public get isLastSegment(): boolean {
		return this._isLastSegment;
	}

	public sourceAddress: number = 0;           // STSAP (source transport service access point)
	public destinationAddress: number = 0;  	// DTSAP (destination transport service access point)

	// application layer
	// APDU (application protocol data unit)
	// may be incomplete if split up into multiple segments in multiple telegrams
	public applicationData: Buffer | undefined;

	// raw telegram data
	public telegramRaw: Buffer | undefined;
}

// data link layer data
export class Telegram {
	// public possibleStartFound: boolean = false;
	// public startFound: boolean = false;
	// public stopFound: boolean = false;

	private _dataLen: number = 0;
	private _totalLen: number = 0;

	public set dataLen(len: number) {
		this._dataLen = len;
		this._totalLen = len! + 6; // 2x start, 2x len, checksum, stop
	}
	public get dataLen(): number {
		return this._dataLen
	}
	public get totalLen(): number {
		return this._totalLen
	}

	public checkSum: number = -1;
	public controlField: number = 0;
	public addressField: number = 0;

	private _controlInformationField: number = 0;
	private _sequenceNumber: number = 0;
	private _lastIsLastSegment: boolean = true; // or application data is only in one single telegram

	public set controlInformationField(ciField: number) {
		this._controlInformationField = ciField;
		this._sequenceNumber = this._controlInformationField & 0b00001111;
		this._lastIsLastSegment = (this._controlInformationField & 0b00010000) == 0b00010000;
	}

	public get controlInformationField(): number {
		return this._controlInformationField;
	}

	public get sequenceNumber(): number {
		return this._sequenceNumber;
	}

	public get lastIsLastSegment(): boolean {
		return this._lastIsLastSegment;
	}

	public userData: number[] = [];


}

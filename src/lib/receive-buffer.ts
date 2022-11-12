export class ReceiveBuffer {

	public buffer: Buffer;
	private _length: number = 0;
	public get length(): number {
		return this._length;
	}


	public constructor(public initialSize: number, public maxSize: number = 8192) {
		this.buffer = Buffer.allocUnsafe(initialSize);
	}

	public reset() {
		this._length = 0;
	}

	public addBuffer(newBuffer: Buffer, newBufferStart = 0): boolean {
		const newLength = newBuffer.length - newBufferStart + this._length;
		if(newLength > this.buffer.length) {
			if(newLength > this.maxSize) {
				console.error(`ReceiveBuffer.addBuffer overflow. Buffer size: ${this.buffer.length}. Max size: ${this.maxSize}. Current length: ${this._length}. New data length: ${newBuffer.length - newBufferStart}`);
				return false;
			}
			if(this.buffer.length < this.maxSize) {
				console.warn(`ReceiveBuffer.addBuffer overflow. Buffer size: ${this.buffer.length}. Current length: ${this._length}. New data length: ${newBuffer.length - newBufferStart}. Size increased to ${this.maxSize}`);
				const maxSizeBuffer = Buffer.allocUnsafe(this.maxSize);
				if(this._length > 0) {
					this.buffer.copy(maxSizeBuffer, 0, 0, this._length);
				}
				this.buffer = maxSizeBuffer;
			}
		}
		newBuffer.copy(this.buffer, this._length, newBufferStart);
		this._length = newLength;
		return true;
	}

	// public removeStartTelegram(telegramLength: number) {
	// 	if(this._length <= telegramLength) {
	// 		this.buffer = Buffer.allocUnsafe(this.initialSize);
	// 		this._length = 0;
	// 		return;
	// 	}
	//
	// 	const oldBuffer = this.buffer.subarray(0, this._length);
	// 	this.buffer = Buffer.allocUnsafe(this.initialSize);
	// 	this._length = 0;
	// 	if(this._length > telegramLength) {
	// 		this.addBuffer(oldBuffer, telegramLength)
	// 	}
	// }

	public checkForNewStartIndex(startByte: number): boolean {
		const firstPossibleIndex = 1;
		const newStartByteIndex= this.buffer.indexOf(startByte, firstPossibleIndex);
		if(newStartByteIndex < firstPossibleIndex) {
			this._length = 0;
			return false;
		}
		this.buffer.copy(this.buffer, 0, newStartByteIndex)
		this._length -= newStartByteIndex;
		return true;
	}

	public asNumberArray(): number[] {
		//return [...this.buffer.subarray(0, this._length)];
		// stupid JS/Node: toJSON is 10 times faster.

		const result: number[] = new Array(this._length);
		for(let i = 0; i < this._length; i++) {
			result[i] = this.buffer[i];
		}
		return result;
	}

}

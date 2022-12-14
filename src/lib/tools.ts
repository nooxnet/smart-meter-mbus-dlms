
export class Tools {

	public static getStringFromByteArray(bytes: number[]): string {
		return String.fromCharCode(...bytes);
	}

	public static getNumberFromByteArray(bytes: number[]): number {
		let result = 0;
		for(let i = bytes.length - 1, multiplier = 1; i >= 0; i--) {
			result += bytes[i] * multiplier;
			multiplier *= 256;
		}
		return result;
	}

	public static getByteArrayFromHexString(hexString: string): number[] {
		// remove whitespaces
		hexString = hexString.replace(/\s+/g, '');
		const bytes = [];
		for (let c = 0; c < hexString.length; c += 2) {
			bytes.push(parseInt(hexString.substring(c, c + 2), 16));
		}
		return bytes;
	}

	public static getHexStringFromByteArray(bytes: number[], withSpaces = false) {
		const hexStrings = [];
		for (let i = 0; i < bytes.length; i++) {
			const current = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
			hexStrings.push((current >>> 4).toString(16));
			hexStrings.push((current & 0xF).toString(16));
		}
		return hexStrings.join(withSpaces ? ' ' : '');
	}

	public static getNumberFromBuffer(buffer: Buffer, start = 0, end?: number): number {
		if(end == undefined) end = buffer.length;
		let result = 0;
		for(let i = end - 1, multiplier = 1; i >= start; i--) {
			result += buffer[i] * multiplier;
			multiplier *= 256;
		}
		return result;
	}

	public static dateToLocalIso(date: Date) {
		const offset = date.getTimezoneOffset();
		let isoString = new Date(date.getTime() - offset * 60 * 1000).toISOString(); //.substring(0, 23);
		isoString = `${isoString.substring(0, 10)} ${isoString.substring(11, 19)}`;
		return isoString;
	}

	public static dateToLocalIsoWithMs(date: Date) {
		const offset = date.getTimezoneOffset();
		let isoString = new Date(date.getTime() - offset * 60 * 1000).toISOString(); //.substring(0, 23);
		isoString = `${isoString.substring(0, 10)} ${isoString.substring(11, 23)}`;
		return isoString;
	}

}

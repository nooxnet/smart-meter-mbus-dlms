
export class Tools {

	public static getStringFromByteArray(bytes: number[]): string {
		return String.fromCharCode(...bytes);
	}

	public static getNumberFromByteArray(bytes: number[]): number {
		let result = 0;
		for(let i = bytes.length - 1, multiplicator = 1; i >= 0; i--) {
			result += bytes[i] * multiplicator;
			multiplicator *= 256;
		}
		return result;
	}

	public static getByteArrayFromHexString(hexString: string): number[] {
		// remove whitespaces
		hexString = hexString.replace(/\s+/g, '')
		let bytes = [];
		for (let c = 0; c < hexString.length; c += 2) {
			bytes.push(parseInt(hexString.substring(c, c + 2), 16));
		}
		return bytes;
	}

	public static getHexStringFromByteArray(bytes: number[], withSpaces = false) {
		let hexStrings = [];
		for (let i = 0; i < bytes.length; i++) {
			const current = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
			hexStrings.push((current >>> 4).toString(16));
			hexStrings.push((current & 0xF).toString(16));
		}
		return hexStrings.join(withSpaces ? ' ' : '');
	}


}

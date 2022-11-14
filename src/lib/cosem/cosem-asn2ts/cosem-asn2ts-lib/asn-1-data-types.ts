
export enum Asn1LengthType {
	fixed,
	data,
	parameter
}

export class Asn1DataType {
	public getLengthType(): Asn1LengthType {
		return Asn1LengthType.fixed;
	}

	public getLength(): number | undefined {
		console.error(`${typeof this} getLength() not implemented`);
		return undefined;
	}

	public getLengthFromData(buffer: Buffer) {
		console.error(`${typeof this} getLengthFromData() not implemented`);
		return undefined;
	}

	public getLengthFromParameter(parameter: string) {
		console.error(`${typeof this} getLengthFromParameter() not implemented`);
		return undefined;
	}

	public hasSubType(): boolean {
		return false
	}
}

export class Asn1Boolean extends Asn1DataType {
	public getLength(): number | undefined {
		return 1;
	}
}

export class Asn1Integer extends Asn1DataType {
	public getLengthType(): Asn1LengthType {
		return Asn1LengthType.parameter;
	}

	// public getLengthFromParameter(parameter: string) {
	// 	console.error(`${typeof this} getLengthFromParameter() not implemented`);
	// 	return undefined;
	// }
}

export class Asn1BitString extends Asn1DataType {
	public getLengthType(): Asn1LengthType {
		return Asn1LengthType.parameter;
	}

	// public getLengthFromParameter(parameter: string) {
	// 	console.error(`${typeof this} getLengthFromParameter() not implemented`);
	// 	return undefined;
	// }
}

export class Asn1OctetString extends Asn1DataType {
	public getLengthType(): Asn1LengthType {
		return Asn1LengthType.data;
	}

	// public getLengthFromData(buffer: Buffer) {
	// 	console.error(`${typeof this} getLengthFromData() not implemented`);
	// 	return undefined;
	// }
}

export class Asn1Date extends Asn1DataType {
}

export class Asn1TimeOfDay extends Asn1DataType {
}

export class Asn1DateTime extends Asn1DataType {
}

export class Asn1Real extends Asn1DataType {
}


export class Asn1Enumerated extends Asn1DataType {
}


export class Asn1ObjectIdentifier extends Asn1DataType {
}

export class Asn1Sequence extends Asn1DataType {
}

export class Asn1SequenceOf extends Asn1DataType {
	public hasSubType(): boolean {
		return true
	}
}

export class Asn1Choice extends Asn1DataType {
}

export class Asn1Ia5String extends Asn1DataType {
}

export class Asn1VisibleString extends Asn1DataType {
}

export class Asn1BNumericString extends Asn1DataType {
}

export class Asn1Utf8String extends Asn1DataType {
}

export class Asn1Null extends Asn1DataType {
}

export class Asn1GeneralizedTime extends Asn1DataType {
	// https://obj-sys.com/asn1tutorial/node14.html
}


export interface Asn1DataTypes {
	[key: string] : Asn1DataType;
}

export const asn1DataTypes: Asn1DataTypes = {
	'BOOLEAN': new Asn1Boolean(),
	'INTEGER': new Asn1Integer(),
	'BIT STRING': new Asn1BitString(),
	'OCTET STRING': new Asn1OctetString(),
	'DATE': new Asn1Date(),
	'TIME-OF-DAY': new Asn1TimeOfDay(),
	'DATE-TIME': new Asn1DateTime(),
	'REAL': new Asn1Real(),
	'ENUMERATED': new Asn1Enumerated(),
	'OBJECT IDENTIFIER': new Asn1ObjectIdentifier(),
	'SEQUENCE': new Asn1Sequence(),
	'SEQUENCE OF': new Asn1SequenceOf(),
	'CHOICE': new Asn1Choice(),
	'IA5String': new Asn1Ia5String(),
	'VisibleString': new Asn1VisibleString(),
	'NumericString': new Asn1BNumericString(),
	'UTF8String': new Asn1Utf8String(),
	'NULL': new Asn1Null(),

	'GeneralizedTime': new Asn1GeneralizedTime()
}

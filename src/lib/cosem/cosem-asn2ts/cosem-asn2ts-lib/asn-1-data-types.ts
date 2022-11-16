import { Occurrence } from "./enums";

export enum Asn1LengthType {
	fixed,
	data,
	parameter
}

export enum Asn1ResultType {
	typeNumber,
	typeString,
	properties,
	subType,
	container,
}

export enum CosemResultType {
	typeNumber ,
	typeString,
	typeDate,
	typeObisKey
}



export interface IResult {
	name: string;
	typeName: string;
	dataLength: number;
	encodingLength: number;
	count: number;
	rawValue: Buffer;
	hexString: string;
	asn1ResultType: Asn1ResultType;
	cosemResultType: CosemResultType;
	numberValue: number;
	stringValue: string;
	dateValue: Date;
	subType: string;
	//typeParameter: string;
	results: Result[];
}
export class Result {
	public name: string = '';
	public typeName: string | undefined;
	public dataLength: number = 0;
	public encodingLength: number = 0;
	public count: number = 0;
	public rawValue: Buffer | undefined;
	public hexString: string = '';
	public asn1ResultType: Asn1ResultType | undefined;
	public cosemResultType: CosemResultType | undefined;
	public numberValue: number | undefined;
	public stringValue: string | undefined;
	public dateValue: Date | undefined;
	public subType: string | undefined;
	//public typeParameter: string | undefined;
	public results: Result[] = [];

	public constructor(init: Partial<IResult>) {
		if(init.name != undefined) this.name = init.name
		if(init.typeName != undefined) this.typeName = init.typeName
		if(init.dataLength != undefined) this.dataLength = init.dataLength
		if(init.encodingLength != undefined) this.encodingLength = init.encodingLength
		if(init.count != undefined) this.count = init.count
		if(init.rawValue != undefined) this.rawValue = init.rawValue
		if(init.hexString != undefined) this.hexString = init.hexString
		if(init.asn1ResultType != undefined) this.asn1ResultType = init.asn1ResultType
		if(init.cosemResultType != undefined) this.cosemResultType = init.cosemResultType
		if(init.numberValue != undefined) this.numberValue = init.numberValue
		if(init.stringValue != undefined) this.stringValue = init.stringValue
		if(init.dateValue != undefined) this.dateValue = init.dateValue
		if(init.subType != undefined) this.subType = init.subType
		//if(init.typeParameter != undefined) this.typeParameter = init.typeParameter
		if(init.results != undefined) this.results = init.results
	}

	public addSubResult(subResult: Result | undefined) {
		if(!subResult) return;
		// if(this.results == undefined) {
		// 	this.results = [subResult];
		// 	return;
		// }
		this.results.push(subResult);
		return;
	}
}


export class Asn1DataType {

	public constructor(public typeName: string) {
	}

	public getLengthType(): Asn1LengthType {
		return Asn1LengthType.fixed;
	}

	public hasSubType(): boolean {
		return false
	}

	// public getLength(): number | undefined {
	// 	console.error(`${typeof this} getLength() not implemented`);
	// 	return undefined;
	// }

	public getLengthAndValue(name: string, rawData: Buffer, index: number, subType: string | undefined, typeParameter: string | undefined, parentOccurrence: Occurrence, ancestorOccurrence: Occurrence): Result | undefined {
		console.error(`${this.constructor.name}.getLengthAndValueFromData() not implemented for ${name}`);
		return undefined;
	}



	protected static getOccurrence(parentOccurrence: Occurrence, ancestorOccurrence: Occurrence) {
		return parentOccurrence != Occurrence.none ? parentOccurrence : ancestorOccurrence;
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

	public getLengthAndValue(name: string, rawData: Buffer, index: number, subType: string | undefined, typeParameter: string | undefined, parentOccurrence: Occurrence, ancestorOccurrence: Occurrence): Result | undefined {
		parentOccurrence =  Asn1DataType.getOccurrence(parentOccurrence, ancestorOccurrence);
		if(parentOccurrence != Occurrence.implicit) {
			console.error('Asn1Integer.getLengthAndValue: IMPLICIT only implemented.')
			return undefined;
		}
		//(0..4294967295)
		if(!typeParameter) {
			console.error('Asn1Integer.getLengthAndValue: typeParameter missing.')
			return undefined;
		}
		const matches = typeParameter.match(/^\((-?\d+)\.\.(-?\d+)\)/);
		if(!matches  || matches.length != 3) {
			console.error(`Asn1Integer.getLengthAndValue: invalid parameter ${typeParameter}.`)
			return undefined;
		}
		const min = +matches[1];
		const max = +matches[2];
		const count = max - min;
		let length = 0;
		if(count <= 256) {
			length = 1;
		} else if(count <= 65536) {
			length = 2;
		// } else if(count <= 16777216) {
		// 	console.error(`Asn1Integer.getLengthAndValueFromParameter: 3 Byte Integer not implemented. ${parameter}. Unsure if exists`)
		// 	return undefined;
		} else if(count <= 4294967296) {
			length = 4;
		} else if(count <= 4294967296 * 4294967296) {
			length = 8;
			console.error(`Asn1Integer.getLengthAndValue: 64 bit integer not implemented. ${typeParameter}.`)
			return undefined;
		}
		const rawValue = rawData.subarray(index, index + length);
		let numberValue: number = 0;
		if(min == 0) {
			switch(length) {
				case 1:	numberValue = rawValue.readUint8();	break;
				case 2:	numberValue = rawValue.readUint16BE(); break;
				case 4: numberValue = rawValue.readUint32BE(); break;
				//case 8: bigNumberValue = rawValue.readBigUInt64BE(); break;
				default:
					console.error(`Asn1Integer.getLengthAndValue: Invalid length for unsigned. ${typeParameter}.`)
					return undefined;
			}
		} else if(-min == max + 1) {
			switch(length) {
				case 1:	numberValue = rawValue.readInt8();	break;
				case 2:	numberValue = rawValue.readInt16BE(); break;
				case 4: numberValue = rawValue.readInt32BE(); break;
				//case 8: bigNumberValue = rawValue.readBigUInt64BE(); break;
				default:
					console.error(`Asn1Integer.getLengthAndValue: Invalid length for signed. ${typeParameter}.`)
					return undefined;
			}
		}
		return new Result({
			name,
			typeName: this.typeName,
			dataLength: length,
			encodingLength: length,
			rawValue,
			hexString: rawValue.toString('hex'),
			asn1ResultType: Asn1ResultType.typeNumber,
			numberValue,
		});
	}
}

export class Asn1BitString extends Asn1DataType {
	public getLengthType(): Asn1LengthType {
		return Asn1LengthType.parameter;
	}
}

export class Asn1OctetString extends Asn1DataType {
	public getLengthType(): Asn1LengthType {
		return Asn1LengthType.data;
	}

	public getLengthAndValue(name: string, rawData: Buffer, index: number, subType: string | undefined, typeParameter: string | undefined, parentOccurrence: Occurrence, ancestorOccurrence: Occurrence): Result | undefined {
		parentOccurrence = Asn1DataType.getOccurrence(parentOccurrence, ancestorOccurrence);
		if (parentOccurrence != Occurrence.implicit) {
			console.error('Asn1OctetString.getLengthAndValue: IMPLICIT only implemented.')
			return undefined;
		}

		let length = rawData.readInt8(index);
		if(length > 127) {
			console.error(`Asn1OctetString.getLengthAndValue: First byte > 127 (${length}). Maybe special encoding applies if first bit is set.`)
			return undefined;
		}
		const rawValue = rawData.subarray(index + 1, index + 1 + length);
		return new Result({
			name,
			typeName: this.typeName,
			dataLength: length,
			encodingLength: length + 1,
			rawValue,
			hexString: rawValue.toString('hex'),
			asn1ResultType: Asn1ResultType.typeString,
			stringValue:  rawValue.toString(),
		});
	}
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
	public getLengthType(): Asn1LengthType {
		return Asn1LengthType.data;
	}

	public hasSubType(): boolean {
		return true
	}

	public getLengthAndValue(name: string, rawData: Buffer, index: number, subType: string | undefined, typeParameter: string | undefined, parentOccurrence: Occurrence, ancestorOccurrence: Occurrence): Result | undefined {
		parentOccurrence = Asn1DataType.getOccurrence(parentOccurrence, ancestorOccurrence);
		if (parentOccurrence != Occurrence.implicit) {
			console.error('Asn1SequenceOf.getLengthAndValue: IMPLICIT only implemented.')
			return undefined;
		}

		let count = rawData.readInt8(index);
		if(count > 127) {
			console.error(`Asn1SequenceOf.getLengthAndValue: First byte > 127 (${length}). Maybe special encoding applies if first bit is set.`)
			return undefined;
		}
		const rawValue = rawData.subarray(index, index + 1); // only length
		return new Result({
			name,
			typeName: this.typeName,
			dataLength: 0,
			encodingLength: 1,
			count,
			rawValue,
			hexString: rawValue.toString('hex'),
			asn1ResultType: Asn1ResultType.subType,
			numberValue: count,
			subType
		})
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




export const asn1DataTypes = new Map<string, Asn1DataType>([
	['BOOLEAN', new Asn1Boolean('BOOLEAN')],
	['INTEGER', new Asn1Integer('INTEGER')],
	['BIT STRING', new Asn1BitString('BIT STRING')],
	['OCTET STRING', new Asn1OctetString('OCTET STRING')],
	['DATE', new Asn1Date('DATE')],
	['TIME-OF-DAY', new Asn1TimeOfDay('TIME-OF-DAY')],
	['DATE-TIME', new Asn1DateTime('DATE-TIME')],
	['REAL', new Asn1Real('REAL')],
	['ENUMERATED', new Asn1Enumerated('ENUMERATED')],
	['OBJECT IDENTIFIER',new Asn1ObjectIdentifier('OBJECT IDENTIFIER')],
	['SEQUENCE', new Asn1Sequence('SEQUENCE')],
	['SEQUENCE OF', new Asn1SequenceOf('SEQUENCE OF')],
	['CHOICE', new Asn1Choice('CHOICE')],
	['IA5String', new Asn1Ia5String('IA5String')],
	['VisibleString', new Asn1VisibleString('VisibleString')],
	['NumericString', new Asn1BNumericString('NumericString')],
	['UTF8String', new Asn1Utf8String('UTF8String')],
	['NULL', new Asn1Null('NULL')],
	['GeneralizedTime', new Asn1GeneralizedTime('GeneralizedTime')]
]);


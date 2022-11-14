import { Occurrence } from "../cosem-asn2ts/cosem-asn2ts-lib/enums";

interface IProperty {
	name: string;
	tag: number | undefined;
	occurrence: Occurrence;
	customType: string;
	asn1Type: string;
	subType: string;
	typeParameter: string;
	isOptional: boolean;
}

export class Property {
	public name: string;
	public tag: number | undefined;
	public occurrence: Occurrence;
	public customType: string;
	public asn1Type: string;
	public subType: string;
	public typeParameter: string;
	public isOptional: boolean;

	public constructor(init: Partial<IProperty>) {
		this.name = init.name ?? '';
		this.tag = init.tag;
		this.occurrence = init.occurrence ?? Occurrence.none;
		this.customType = init.customType ?? '';
		this.asn1Type = init.asn1Type ?? '';
		this.subType = init.subType ?? '';
		this.typeParameter = init.typeParameter ?? '';
		this.isOptional = init.isOptional ?? false;
	}
}


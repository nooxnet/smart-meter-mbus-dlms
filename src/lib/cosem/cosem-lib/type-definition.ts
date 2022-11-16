import { BlockMode, Occurrence } from "../cosem-asn2ts/cosem-asn2ts-lib/enums";
import { BitString } from "./bit-string";
import { Property } from "./property";
import { Enumeration } from "./enumeration";
import { BitStrings, Enumerations, TaggedProperties } from "./interfaces";

export interface ITypeDefinition {
	name: string;
	blockMode: BlockMode;
	occurrence: Occurrence;
	tag: number | undefined;
	customTag: string;
	customType: string;
	asn1Type: string;
	typeParameter: string;

	properties: Property[];
	enumerations: Enumeration[];
	bitStrings: BitString[];
}


export class TypeDefinition {
	public name: string;
	public blockMode: BlockMode;
	public occurrence: Occurrence;
	public tag: number | undefined;
	public customTag: string | undefined;
	public customType: string | undefined
	public asn1Type: string | undefined;
	public typeParameter: string | undefined;

	public properties: Property[]
	public taggedProperties: TaggedProperties = {};

	public enumerations: Enumerations = {};
	public bitStrings: BitStrings = {};
	
	public constructor(init: Partial<ITypeDefinition>) {
		this.name = init.name ?? '';
		this.blockMode = init.blockMode ?? BlockMode.none;
		this.occurrence = init.occurrence ?? Occurrence.none;
		this.tag = init.tag;
		this.customTag = init.customTag;
		this.customType = init.customType;
		this.asn1Type = init.asn1Type;
		this.typeParameter = init.typeParameter;

		this.properties = init.properties ?? [];
		for(let property of this.properties) {
			if(property.tag != undefined) {
				this.taggedProperties[property.tag] = property;
			}
		}
		if(init.enumerations) {
			for(let enumeration of init.enumerations) {
				this.enumerations[enumeration.value] = enumeration;
			}
		}
		if(init.bitStrings) {
			for(let bitString of init.bitStrings) {
				this.bitStrings[bitString.bit] = bitString;
			}
		}
	}
}

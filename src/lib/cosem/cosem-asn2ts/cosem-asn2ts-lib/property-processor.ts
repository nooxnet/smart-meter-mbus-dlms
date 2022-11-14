import { Occurrence } from "./enums";
import { asn1DataTypes } from "./asn-1-data-types";
import { Identifier } from "./identifier";
import { DefinitionProcessor } from "./definition-processor";


export class PropertyProcessor {
	public name: string = '';
	public tag: number | undefined = undefined;
	public occurrence: Occurrence = Occurrence.none;
	public customType: string = '';
	public asn1Type: string = '';
	public subType: string = '';
	public typeParameter: string = '';
	public isOptional: boolean = false;

	constructor(public definition: DefinitionProcessor, public rawText: string) {
	}

	public generateCode() {
		return 'new Property({})';
	}

	public process() {
		const text = this.rawText.trim();
		const parts = text.split(/\s+/);

		let minLength = 2;
		if(parts.length < minLength) {
			console.error(`Property.process: rawText too short: ${text}`);
			process.exit(1);
		}

		this.name = parts[0];

		let currentIndex = 1;

		// check for tag
		if(parts[currentIndex][0] == '[') {
			const matches = parts[currentIndex].match(/^\[(\d{1,3})]$/);
			if(!matches || matches.length != 2) {
				console.error(`Property.process: identifier ${parts[currentIndex]} of property ${this.name} starts with "[" but does not seem to be a tag. rawText: ${text}`);
				process.exit(1);
			}
			this.tag = +matches[1];
			currentIndex++;
			minLength++;
		}

		if(parts.length < minLength) {
			console.error(`Property.process: rawText too short after tag check: ${text}`);
			process.exit(1);
		}

		// check for implizit or explizit:
		if(parts[currentIndex] == Identifier.implicit) {
			this.occurrence = Occurrence.implicit;
			currentIndex++;
			minLength++;
		} else if(parts[currentIndex] == Identifier.explicit) {
			this.occurrence = Occurrence.explicit;
			currentIndex++;
			minLength++;
		}

		if(parts.length < minLength) {
			console.error(`Property.process: rawText too short after IMPLICIT/EXPLICIT check: ${text}`);
			process.exit(1);
		}

		let endIndex = parts.length;

		// optional (last element)
		if(parts[parts.length - 1] == Identifier.optional) {
			this.isOptional = true;
			minLength++;
			endIndex--;
		}

		if(parts.length < minLength) {
			console.error(`Property.process: rawText too short after OPTIONAL check: ${text}`);
			process.exit(1);
		}

		const dataType = parts.slice(currentIndex, endIndex).join(' ');
		for(let asn1DataTypeName of Object.keys(asn1DataTypes)) {
			const foundIndex = dataType.indexOf(asn1DataTypeName)
			if(foundIndex != 0) {
				continue;
			}
			this.asn1Type = asn1DataTypeName;
			this.typeParameter = dataType.substring(asn1DataTypeName.length).trim();
			const asn1DataType = asn1DataTypes[asn1DataTypeName];
			if(asn1DataType.hasSubType()) {
				this.subType = this.typeParameter;
				this.typeParameter = '';
			}
		}
		if(!this.asn1Type) {
			this.customType = dataType;
		}
	}
}

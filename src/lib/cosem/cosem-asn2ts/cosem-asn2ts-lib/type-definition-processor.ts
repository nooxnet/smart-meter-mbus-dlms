import { BlockMode, Occurrence } from "./enums";
import { BitStringProcessors, EnumerationProcessors, TaggedPropertyProcessors } from "./interfaces";
import { PropertyProcessor } from "./property-processor";
import { Identifier } from "./identifier";
import { EnumerationProcessor } from "./enumeration-processor";
import { BitStringProcessor } from "./bit-string-processor";
import { asn1DataTypes } from "../../cosem-lib/asn-1-data-types";

export class RawContent {
	single: string = '';
	block: string[] = [];
}

export class TypeDefinitionProcessor {
	public isProcessed = false;

	public maxLevel: number = 0;
	public blockMode: BlockMode = BlockMode.none;
	public occurrence: Occurrence = Occurrence.none
	public tag: number | undefined = undefined;
	public customTag: string | undefined;
	public customType: string = '';
	public asn1Type: string = ''
	public typeParameter: string = ''

	public rawLevel1Content = new RawContent()

	public propertyProcessors: PropertyProcessor[] = [];
	public taggedPropertyProcessors: TaggedPropertyProcessors = {};

	public enumerationProcessors: EnumerationProcessors = {};
	public bitStringProcessors: BitStringProcessors = {};



	constructor(public name: string, public rawText: string) {
	}

	private getSaveName(): string {
		return this.name.replace(/\W+/g,"_");
	}

	public generateCode(): string {
		const saveName = this.getSaveName();
		const tagString = this.tag !== undefined ? `\n\ttag: ${this.tag},` : '';
		const customTagString = this.customTag ? `\n\tcustomTag: '${this.customTag}',` : '';
		const customTypeString = this.customType ? `\n\tcustomType: '${this.customType}',` : '';
		const asn1TypeString = this.asn1Type ? `\n\tasn1Type: '${this.asn1Type}',` : '';
		const typeParameterString = this.typeParameter ? `\n\ttypeParameter: '${this.typeParameter}',` : '';

		let propertyString = '';
		if(this.propertyProcessors.length > 0) {
			propertyString = `\n\tproperties: [
		${this.propertyProcessors.map(p => p.generateCode()).join(',\n\t\t')}
	],`
		}

		let enumerationString: string = '';
		const enumerationStringArray: string[] = []
		for(const key in this.enumerationProcessors) {
			enumerationStringArray.push(this.enumerationProcessors[key].generateCode());
		}
		if(enumerationStringArray.length > 0) {
			enumerationString = `\n\tenumerations: [
		${enumerationStringArray.join(',\n\t\t')}
	],`
		}

		let bitStringString: string = '';
		const bitStringStringArray: string[] = []
		for(const key in this.bitStringProcessors) {
			bitStringStringArray.push(this.bitStringProcessors[key].generateCode());
		}
		if(bitStringStringArray.length > 0) {
			bitStringString = `\n\tbitStrings: [
		${bitStringStringArray.join(',\n\t\t')}
	],`
		}

		return `const ${saveName} = new TypeDefinition({
	name: '${this.name}', 
	blockMode: BlockMode.${BlockMode[this.blockMode]},
	occurrence: Occurrence.${Occurrence[this.occurrence]}, ${tagString}${customTagString}${customTypeString}${asn1TypeString}${typeParameterString}${propertyString}${enumerationString}${bitStringString}
});`;
	}

	public generateAssignmentParts(): string[] {
		return [this.name, this.getSaveName()];
	}

	public process(): string[] {
// if(this.rawText.indexOf('(0)') >= 0) {
// 	console.log(this.key, this.rawText)
// }
		if(this.isProcessed) return [];
		this.rawLevel1Content = this.splitContent(this.rawText);
		this.setAttributes(this.rawLevel1Content.single);
		this.isProcessed = true;
		if(this.rawLevel1Content.block.length == 0) {
			return [];
		}

		const childTypes: string[] = [];
		if(this.blockMode == BlockMode.enumerated) {
			for(let rawEnumeration of this.rawLevel1Content.block){
				const enumeration = new EnumerationProcessor(this, rawEnumeration);
				enumeration.process();
				this.enumerationProcessors[enumeration.value] = enumeration;
			}
		} else if(this.blockMode == BlockMode.bitString) {
			for(let rawBitString of this.rawLevel1Content.block){
				const bitString = new BitStringProcessor(this, rawBitString);
				bitString.process();
				this.bitStringProcessors[bitString.bit] = bitString;
			}
		} else {
			for(let rawProperty of this.rawLevel1Content.block){
				const property = new PropertyProcessor(this, rawProperty);
				this.propertyProcessors.push(property);
				property.process();
				if(property.tag !== undefined) {
					this.taggedPropertyProcessors[property.tag] = property;
				}
// if(property.customType == 'Data' || property.subType == 'Data') {
// 	console.log('add Data to childTypes');
// }
				if(property.customType && !childTypes.includes(property.customType)) {
					childTypes.push(property.customType)
				}
				if(property.subType && !childTypes.includes(property.subType)) {
					childTypes.push(property.subType)
				}
			}
		}

		return childTypes;
	}


	private setAttributes(rawText: string): void {


		let text = rawText;

		// check for tag:
		if(text[0] == '[') {
			const endBracketIndex = text.indexOf(']', 1);
			if(endBracketIndex < 0) {
				console.error(`Definition.setAttributes: property ${this.name} starts with "[" but does not seem to be a tag. rawText: ${rawText}`);
				process.exit(1);
			}
			const tagText = text.substring(0, endBracketIndex + 1);
			const matches = tagText.match(/^\[(([A-Z]+)\s+)*(\d{1,3})]$/);
			if(!matches || matches.length != 4) {
				console.error(`Definition.setAttributes: identifier ${tagText} of property ${this.name} starts with "[" and ends with "]" but does not seem to be a tag. rawText: ${rawText}`);
				process.exit(1);
			}
			this.customTag = matches[2];
			this.tag = +matches[3];
			text = text.substring(matches[0].length).trim();
		}

		if(text.indexOf(Identifier.implicit) == 0) {
			this.occurrence = Occurrence.implicit
			text = text.substring(Identifier.implicit.length).trim();
		} else if(rawText.indexOf(Identifier.explicit) > 0) {
			this.occurrence = Occurrence.explicit
			text = text.substring(Identifier.explicit.length).trim();
		}


		if(this.maxLevel == 0) {
			this.blockMode = BlockMode.single;
			// check from asn1 data type::

			const dataType = text;
			for(let [asn1DataTypeName, asn1DataType] of asn1DataTypes) {
				const foundIndex = dataType.indexOf(asn1DataTypeName)
				if(foundIndex != 0) {
					continue;
				}
				this.asn1Type = asn1DataTypeName;
				this.typeParameter = dataType.substring(asn1DataTypeName.length).trim();
				// if(asn1DataType.hasSubType()) {
				// 	this.subType = this.typeParameter;
				// 	this.typeParameter = '';
				// }
			}
			if(!this.asn1Type) {
				this.customType = dataType;
			}

		} else {
			if(!text) {
				this.blockMode = BlockMode.none;
				console.error(`Definition.setAttributes(): Invalid single definition '${this.name}'. Child elements but no type defined (BlockMode.none).`);
				process.exit(0);
			}
			if(text.indexOf(Identifier.sequence) == 0) {
				this.blockMode = BlockMode.sequence;
				text = text.substring(Identifier.sequence.length).trim();
			} else if(text.indexOf(Identifier.choice) == 0) {
				this.blockMode = BlockMode.choice;
				text = text.substring(Identifier.choice.length).trim();
			} else if(text.indexOf(Identifier.enumerated) == 0) {
				this.blockMode = BlockMode.enumerated;
				text = text.substring(Identifier.enumerated.length).trim();
			} else if(text.indexOf(Identifier.bitString) == 0) {
				this.blockMode = BlockMode.bitString;
				text = text.substring(Identifier.bitString.length).trim();
			}
		}


 	}

	private splitContent(rawText: string): RawContent {
		const rawContent = new RawContent();
		const maxLen = rawText.length;
		let currentStartIndex = 0;
		let currentTextStartIndex = 0
		let curLevel = 0;
		while(true) {
			let separatorIndex = rawText.indexOf(',', currentStartIndex);
			let openIndex = rawText.indexOf('{', currentStartIndex);
			let closeIndex = rawText.indexOf('}', currentStartIndex);

			if(separatorIndex < 0 && openIndex < 0 && closeIndex < 0) {
				if(currentStartIndex == 0) {
					rawContent.single = rawText.trim();
				}
				if(curLevel != 0) {
					console.error(`Definition.splitContent(): Invalid number of "{" "}" in definition ${this.name}`);
					process.exit(0);
				}
				return rawContent;
			}

			if(separatorIndex < 0) separatorIndex = maxLen;
			if(openIndex < 0) openIndex = maxLen;
			if(closeIndex < 0) closeIndex = maxLen;

			if(openIndex < separatorIndex && openIndex < closeIndex) {
				if(curLevel == 0) {
					rawContent.single = rawText.substring(currentTextStartIndex, openIndex).trim();
				}
				curLevel++;
				if(curLevel > this.maxLevel) {
					this.maxLevel = curLevel;
				}
				currentStartIndex = openIndex + 1;
				if(curLevel == 1) {
					currentTextStartIndex = currentStartIndex;
				}
			} else if(separatorIndex < openIndex && separatorIndex < closeIndex) {
				if(curLevel == 0) {
					console.error(`Definition.splitContent(): "," not allowed outside of block "{ ... }" in definition ${this.name}`);
					process.exit(0);
				}
				rawContent.block.push(rawText.substring(currentTextStartIndex, separatorIndex).trim())
				currentStartIndex = separatorIndex + 1;
				if(curLevel == 1) {
					currentTextStartIndex = currentStartIndex;
				}
			} else if(closeIndex < openIndex && closeIndex < separatorIndex) {
				if(curLevel == 1) {
					rawContent.block.push(rawText.substring(currentTextStartIndex, closeIndex).trim())
				}
				curLevel--;
				if(curLevel < 0) {
					console.error(`Definition.splitContent(): illegal sequence of "{" and "}" in definition ${this.name}`);
					process.exit(0);
				}
				currentStartIndex = closeIndex + 1;
				if(curLevel == 0) {
					currentTextStartIndex = curLevel;
				}
			} else {
				console.error(`Definition.splitContent(): something wrong in definition ${this.name}`);
				process.exit(0);
			}
		}
	}


}



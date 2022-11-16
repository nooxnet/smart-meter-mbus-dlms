import { TypeDefinition } from "./cosem/cosem-lib/type-definition";
import { BlockMode, Occurrence } from "./cosem/cosem-asn2ts/cosem-asn2ts-lib/enums";
import { Property } from "./cosem/cosem-lib/property";
import { Result, Asn1ResultType, asn1DataTypes } from "./cosem/cosem-asn2ts/cosem-asn2ts-lib/asn-1-data-types";

export class CosemDataReader {

	private currentIndex = 0;
	private rawData: Buffer = Buffer.from('');

	public constructor(private cosemTypeDefinitionMap: Map<string, TypeDefinition>, private startTypeDefinitionName: string) {
	}

	public read(rawData: Buffer): Result | undefined {
		this.rawData = rawData
		this.currentIndex = 0;

		const result = this.readTypeDefinition(this.startTypeDefinitionName, Occurrence.explicit, Occurrence.explicit);
		console.log(result);

		return result;
	}

	private readProperty(definition: TypeDefinition, property: Property, parentOccurrence: Occurrence): Result | undefined {
		const result = this.getTypeValue(definition, property, parentOccurrence);
		//console.log('CosemDataReader.readProperty:', result);
		//if(!result) return;
		return result;
	}


	private readAsn1TypeValue(definition: TypeDefinition, property: Property | undefined, asn1TypeName: string, subType: string | undefined, typeParameter: string | undefined, parentOccurrence: Occurrence, ancestorOccurrence: Occurrence): Result | undefined {
		const asn1Type = asn1DataTypes.get(asn1TypeName)
		if(!asn1Type) {
			console.error(`CosemDataReader.readAsn1Type: definition ${definition.name}, property: ${property?.name}: Asn.1 Type not found: ${asn1TypeName}`);
			return undefined;
		}
		const name = property?.name ?? definition.name;

		const result = asn1Type.getLengthAndValue(name, this.rawData, this.currentIndex, subType, typeParameter, parentOccurrence, ancestorOccurrence);
		if(!result) return;

		this.currentIndex += result?.encodingLength;

		if(result?.asn1ResultType == Asn1ResultType.subType) {
			for(let i = 0; i < result.count; i++) {
				const subResult = this.readTypeDefinition(result.subType ?? '', parentOccurrence, ancestorOccurrence);
				result.addSubResult(subResult);
			}
		}
		return result;
	}


	private getTypeValue(definition: TypeDefinition, property: Property | undefined, parentOccurrence: Occurrence): Result | undefined {
		let customTypeName: string | undefined;
		let asn1TypeName: string | undefined;
		let occurrence = Occurrence.none
		let subType: string | undefined;
		let typeParameter: string | undefined;
		if(property) {
			customTypeName = property.customType;
			asn1TypeName = property.asn1Type
			occurrence = property.occurrence;
			subType = property.subType
			typeParameter = property.typeParameter
		} else {
			customTypeName = definition.customType;
			asn1TypeName = definition.asn1Type;
			occurrence = definition.occurrence;
			//subType = definition.subType
			typeParameter = definition.typeParameter
		}

		if(customTypeName) {
			return this.readTypeDefinition(customTypeName, occurrence, parentOccurrence);
		} else if(asn1TypeName) {
			return this.readAsn1TypeValue(definition, property, asn1TypeName, subType, typeParameter, occurrence, parentOccurrence);
		}

		console.error(`CosemDataReader.checkForType: definition ${definition.name}, property: ${property?.name}: Not implemented`, definition, property);
		return;
	}

	private readTypeDefinition(definitionName: string, parentOccurrence: Occurrence, ancestorOccurrence: Occurrence): Result | undefined {
		if(parentOccurrence == Occurrence.none) parentOccurrence = ancestorOccurrence;
		const typeDefinition = this.cosemTypeDefinitionMap.get(definitionName);
		if(!typeDefinition) {
			console.error(`CosemDataReader.definitionReader: definition not found: ${definitionName}`);
			return;
		}

		let result: Result | undefined = new Result({
			name: typeDefinition.name,
			typeName: typeDefinition.asn1Type ?? typeDefinition.customType,
			asn1ResultType: Asn1ResultType.container
		})

		switch(typeDefinition.blockMode) {
			case BlockMode.single:
				const getTypeValueResult = this.getTypeValue(typeDefinition, undefined, parentOccurrence);
				if(!typeDefinition.asn1Type) {
					result.addSubResult(getTypeValueResult);
				} else {
					result = getTypeValueResult;
				}
				//console.log('CosemDataReader.definitionReader BlockMode.single:', result);
				return result;
			case BlockMode.choice:
				const possibleTag = this.rawData.readInt8(this.currentIndex);
				const property = typeDefinition.taggedProperties[possibleTag];
				if(!property) {
					console.error(`CosemDataReader.definitionReader BlockMode.choice: definition ${definitionName}: CHOICE: property with tag ${possibleTag} not found.`);
					return;
				}
				this.currentIndex++;
				const propertyResult = this.readProperty(typeDefinition, property, parentOccurrence);
				result.addSubResult(propertyResult);
				return result;
			case BlockMode.sequence:
				for(const property of typeDefinition.properties) {
					result.addSubResult(this.readProperty(typeDefinition, property, parentOccurrence));
				}
				return result;
			default:
				console.error(`CosemDataReader.definitionReader: definition ${definitionName}: BlockMode not implemented: ${BlockMode[typeDefinition.blockMode]}`);
				return;
		}
	}
}

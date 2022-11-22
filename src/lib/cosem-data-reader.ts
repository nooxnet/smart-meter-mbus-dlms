import { TypeDefinition } from "./cosem/cosem-lib/type-definition";
import { BlockMode, Occurrence } from "./cosem/cosem-asn2ts/cosem-asn2ts-lib/enums";
import { Property } from "./cosem/cosem-lib/property";
import { Result, Asn1ResultType, asn1DataTypes, EnrichDataFunction, IResult } from "./cosem/cosem-lib/asn-1-data-types";
import { cosemEnumUnitMap } from "./cosem/cosem-lib/cosem-enum-units";

export class CosemDataReader {

	private currentIndex = 0;
	private rawData: Buffer = Buffer.from('');

	public constructor(private cosemTypeDefinitionMap: Map<string, TypeDefinition>, private startTypeDefinitionName: string) {
	}

	public read(rawData: Buffer): Result | undefined {
		this.rawData = rawData
		this.currentIndex = 0;

		const result = this.readTypeDefinition(this.startTypeDefinitionName, undefined, Occurrence.explicit, Occurrence.explicit, undefined);
		//console.log(result);
		return result;
	}

	private readProperty(definition: TypeDefinition, property: Property, parentOccurrence: Occurrence, enrichData: EnrichDataFunction): Result | undefined {
		if(property.name == 'enum') {
			enrichData = (partialResult: Partial<IResult>) => this.enrichDataWithCosemEnumUnits(partialResult);
		}
		const result = this.getTypeValue(definition, property, parentOccurrence, enrichData);
		//console.log('CosemDataReader.readProperty:', result);
		return result;
	}

	private enrichDataWithCosemEnumUnits(partialResult: Partial<IResult>): void {
		// In some cases the property names provide hints to the meaning of the data
		// But the actual data is often defined in nested descendants (ASN.1 data types).
		// And when these classes read the data they don't know anything about the property
		// So I inject this method.
		if (partialResult.typeName != 'INTEGER') return;
		if (partialResult.numberValue == undefined) return;

		const cosemEnumUnit = cosemEnumUnitMap.get(partialResult.numberValue);
		if(!cosemEnumUnit) return;
		partialResult.stringValue = cosemEnumUnit.unit;
	}


	private readAsn1TypeValue(definition: TypeDefinition, property: Property | undefined, asn1TypeName: string, subType: string | undefined, typeParameter: string | undefined, parentOccurrence: Occurrence, ancestorOccurrence: Occurrence, enrichData: EnrichDataFunction): Result | undefined {
		const asn1Type = asn1DataTypes.get(asn1TypeName)
		if(!asn1Type) {
			console.error(`CosemDataReader.readAsn1Type: definition ${definition.name}, property: ${property?.name}: Asn.1 Type not found: ${asn1TypeName}`);
			return undefined;
		}
		const propertyName = property?.name;

		const result = asn1Type.getLengthAndValue(propertyName, this.rawData, this.currentIndex, subType, typeParameter, parentOccurrence, ancestorOccurrence, enrichData);
		if(!result) return;

		this.currentIndex += result?.encodingLength;

		if(result?.asn1ResultType == Asn1ResultType.subType) {
			for(let i = 0; i < (result?.count ?? 0); i++) {
				const subResult = this.readTypeDefinition(result.subType ?? '', undefined, parentOccurrence, ancestorOccurrence, undefined);
				result.addSubResult(subResult);
			}
		}
		return result;
	}


	private getTypeValue(definition: TypeDefinition, property: Property | undefined, parentOccurrence: Occurrence, enrichData: EnrichDataFunction): Result | undefined {
		let customTypeName: string | undefined;
		let asn1TypeName: string | undefined;
		let occurrence: Occurrence;
		let subType: string | undefined;
		let typeParameter: string | undefined;
		let parentProperty: Property | undefined;
		if(property) {
			customTypeName = property.customType;
			asn1TypeName = property.asn1Type
			occurrence = property.occurrence;
			subType = property.subType
			typeParameter = property.typeParameter
			parentProperty = property;
		} else {
			customTypeName = definition.customType;
			asn1TypeName = definition.asn1Type;
			occurrence = definition.occurrence;
			//subType = definition.subType
			typeParameter = definition.typeParameter
		}

		if(customTypeName) {
			return this.readTypeDefinition(customTypeName, parentProperty, occurrence, parentOccurrence, enrichData);
		} else if(asn1TypeName) {
			return this.readAsn1TypeValue(definition, property, asn1TypeName, subType, typeParameter, occurrence, parentOccurrence, enrichData);
		}

		console.error(`CosemDataReader.checkForType: definition ${definition.name}, property: ${property?.name}: Not implemented`, definition, property);
		return;
	}

	private readTypeDefinition(definitionName: string, parentProperty: Property | undefined, parentOccurrence: Occurrence, ancestorOccurrence: Occurrence, enrichData: EnrichDataFunction): Result | undefined {
		if(parentOccurrence == Occurrence.none) parentOccurrence = ancestorOccurrence;
		const typeDefinition = this.cosemTypeDefinitionMap.get(definitionName);
		if(!typeDefinition) {
			console.error(`CosemDataReader.definitionReader: definition not found: ${definitionName}`);
			return;
		}

		let result: Result | undefined = new Result({
			propertyName: parentProperty?.name,
			typeName: typeDefinition.name,
			asn1ResultType: Asn1ResultType.container
		})

		switch(typeDefinition.blockMode) {
			case BlockMode.single:
				const getTypeValueResult = this.getTypeValue(typeDefinition, undefined, parentOccurrence, enrichData);
				result.addSubResult(getTypeValueResult);
				// if(!typeDefinition.asn1Type) {
				// 	result.addSubResult(getTypeValueResult);
				// } else {
				// 	result = getTypeValueResult;
				// }
				//console.log('CosemDataReader.definitionReader BlockMode.single:', result);
				return result;
			case BlockMode.choice:
				const possibleTag = this.rawData.readUint8(this.currentIndex);
				const property = typeDefinition.taggedProperties[possibleTag];
				if(!property) {
					console.error(`CosemDataReader.definitionReader BlockMode.choice: definition ${definitionName}: CHOICE: property with tag ${possibleTag} not found.`);
					return;
				}
				this.currentIndex++;
				const propertyResult = this.readProperty(typeDefinition, property, parentOccurrence, enrichData);
				result.addSubResult(propertyResult);
				return result;
			case BlockMode.sequence:
				if(enrichData) {
					console.warn(`CosemDataReader.definitionReader enrichData function set. Should not occur if multiple child properties exists.`);
				}
				for(const property of typeDefinition.properties) {
					result.addSubResult(this.readProperty(typeDefinition, property, parentOccurrence, undefined));
				}
				return result;
			default:
				console.error(`CosemDataReader.definitionReader: definition ${definitionName}: BlockMode not implemented: ${BlockMode[typeDefinition.blockMode]}`);
				return;
		}
	}
}

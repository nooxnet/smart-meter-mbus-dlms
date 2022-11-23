import { DateTime, Result } from "./cosem/cosem-lib/asn-1-data-types";
import { DataNotification, LongInvokeIdAndPriority, NotificationBody, ObisRaw, ObisValue } from "./result-interfaces";
import { DecodingSettings } from "./settings/setting-classes";
import { ObisTools } from "./obis-tools";

export class CosemObisDataProcessor {
	// The data-value part of the COSEM PDU ASN.1 specification is very flexible.
	// So this part is pretty much hard coded to extract the actual data from
	// the decoded result as delivered by the smart meter


	private areResultNamesOk(result: Result, propertyName: string | undefined, typeName: string | undefined): boolean {
		if(propertyName && result?.propertyName != propertyName) {
			console.error(`Invalid COSEM/ASN.1 result. Property '${propertyName}' missing. Found: ${result?.propertyName}`);
			return false;
		}
		if(typeName && result?.typeName != typeName) {
			console.error(`Invalid COSEM/ASN.1 result. Type '${typeName}' missing. Found: ${result?.typeName}`);
			return false;
		}
		return true;
	}

	public transform(cosemAsn1Result: Result): DataNotification | undefined {

		const dataNotificationResult = cosemAsn1Result?.results?.[0];
		if(!this.areResultNamesOk(dataNotificationResult, 'data-notification', 'Data-Notification')) return;

		const longInvokeIdAndPriority = this.getLongInvokeIdAndPriority (dataNotificationResult);
		if(!longInvokeIdAndPriority) return;

		const dateTime = this.getDataNotificationDateTime(dataNotificationResult);
		if(!dateTime) return;

		const notificationBody = this.getNotificationBody(dataNotificationResult);
		if(!notificationBody) return;

		const dataNotification = {
			longInvokeIdAndPriority,
			dateTime,
			notificationBody,
		};
		return dataNotification;
	}

	private getLongInvokeIdAndPriority(dataNotificationResult: Result): LongInvokeIdAndPriority | undefined {

		const longInvokeIdAndPriorityResult = dataNotificationResult?.results?.[0];
		if(!this.areResultNamesOk(longInvokeIdAndPriorityResult, 'long-invoke-id-and-priority', 'Long-Invoke-Id-And-Priority')) return;
		const unsigned32Result = longInvokeIdAndPriorityResult.results?.[0];
		if(!this.areResultNamesOk(unsigned32Result, undefined, 'Unsigned32')) return;
		const integerResult = unsigned32Result.results?.[0];
		if(!this.areResultNamesOk(integerResult, undefined, 'INTEGER')) return;

		return {
			hex: integerResult.hexString,
			dec: integerResult.numberValue ?? 0
		};
	}

	private getDataNotificationDateTime(dataNotificationResult: Result): DateTime | undefined {
		const dateTimeResult = dataNotificationResult?.results?.[1];
		if(!this.areResultNamesOk(dateTimeResult, 'date-time', 'OCTET STRING')) return;

		return dateTimeResult?.dateTimeValue;

		// if(!dateTimeResult?.dateTimeValue) return;
		//
		// return this.getDateTime(dateTimeResult.rawValue);
	}


	private getNotificationBody(dataNotificationResult: Result): NotificationBody | undefined {
		const notificationBodyResult = dataNotificationResult?.results?.[2];
		if(!this.areResultNamesOk(notificationBodyResult, 'notification-body', 'Notification-Body')) return;

		const dataValueResult = notificationBodyResult.results?.[0];
		if(!this.areResultNamesOk(dataValueResult, 'data-value', 'Data')) return;

		const structureLevel1Result = dataValueResult.results?.[0];
		if(!this.areResultNamesOk(structureLevel1Result, 'structure', 'SEQUENCE OF')) return;

		// the first two children belong to one obis value: datetime/timestamp

		if(structureLevel1Result.results.length < 2) {
			console.error(`Invalid COSEM/ASN.1 result. DataNotification.NotificationBody.DataValue.Structure does not contain children.`);
			return;
		}

		const dataLevel2Result0 = structureLevel1Result.results[0];
		if(!this.areResultNamesOk(dataLevel2Result0, '', 'Data')) return;
		const obisCodeDateTime = dataLevel2Result0.results[0];
		if(!this.areResultNamesOk(obisCodeDateTime, 'octet-string', 'OCTET STRING')) return;

		const dataLevel2Result1 = structureLevel1Result.results[1];
		if(!this.areResultNamesOk(dataLevel2Result1, '', 'Data')) return;
		const obisValueDateTime = dataLevel2Result1.results[0];
		if(!this.areResultNamesOk(obisValueDateTime, 'octet-string', 'OCTET STRING')) return;

		const obisValues: ObisValue[] = [];
		const obisRawValue: ObisRaw = {
			obisCodeRaw: obisCodeDateTime.rawValue,
			valueRaw: obisValueDateTime.rawValue
		};

		if(!obisCodeDateTime.rawValue) return;

		const obisCode = ObisTools.getObisCode(obisCodeDateTime.rawValue, DecodingSettings.language);

		const obisValue: ObisValue = {
			obisCode: obisCode.code,
			obisFullName: obisCode.fullName,
			obisName: obisCode.name,
			numberValue: obisValueDateTime.dateTimeValue?.epoch,
			stringValue: obisValueDateTime.dateTimeValue?.asString ?? '',
			unit: '',
			obisRaw: obisRawValue,
		};
		obisValues.push(obisValue);


		for(let i = 2; i < structureLevel1Result.results.length; i++) {
			const dataLevel2Result = structureLevel1Result.results[i];

			if(!this.areResultNamesOk(dataLevel2Result, '', 'Data')) return;
			const structureLevel3Result = dataLevel2Result.results?.[0];
			if(!this.areResultNamesOk(structureLevel3Result, 'structure', 'SEQUENCE OF')) continue;

			// obis:
			const obisCodeDataResult = structureLevel3Result.results?.[0];
			if(!this.areResultNamesOk(obisCodeDataResult, '', 'Data')) return;
			const obisCodeResult= obisCodeDataResult.results?.[0];
			if(!this.areResultNamesOk(obisCodeResult, 'octet-string', 'OCTET STRING')) return;
			if(!obisCodeResult.rawValue) return;
			const obisCode = ObisTools.getObisCode(obisCodeResult.rawValue, DecodingSettings.language);

			if(obisCode.code.startsWith('0')) {
				if(structureLevel3Result.results.length != 2) {
					console.error(`Invalid COSEM/ASN.1 result. Obis code ${obisCode.code} is "${obisCode.medium}" but parent element does not contain 2 children (obis code, obis value).`);
					return;
				}

				// abstract & seems to be just single obis value
				const obisValueDataResult = structureLevel3Result.results?.[1];
				if(!this.areResultNamesOk(obisValueDataResult, '', 'Data')) return;
				const obisValueResult = obisValueDataResult.results?.[0];
				if(!this.areResultNamesOk(obisValueResult, 'octet-string', 'OCTET STRING')) return;
				if(!obisValueResult.rawValue) return;

				const obisValue: ObisValue = {
					obisCode: obisCode.code,
					obisFullName: obisCode.fullName,
					obisName: obisCode.name,
					numberValue: obisValueResult.numberValue,
					stringValue: obisValueResult.stringValue ?? '',
					unit: '',
					obisRaw: {
						obisCodeRaw: obisCodeResult.rawValue,
						valueRaw: obisValueResult.rawValue
					},
				};
				obisValues.push(obisValue);

			} else {
				if(structureLevel3Result.results.length != 3) {
					console.error(`Invalid COSEM/ASN.1 result. Obis code ${obisCode.code} is "${obisCode.medium}" but parent element does not contain 3 children (obis code, obis raw value, obis value properties).`);
					return;
				}

				// physical value
				const obisValueDataResult = structureLevel3Result.results?.[1];
				if(!this.areResultNamesOk(obisValueDataResult, '', 'Data')) return;
				const obisValueLongUnsignedResult = obisValueDataResult.results?.[0];
				let obisValueResult: Result;
				if(obisValueLongUnsignedResult.propertyName == 'long-unsigned') {
					if(!this.areResultNamesOk(obisValueLongUnsignedResult, 'long-unsigned', 'Unsigned16')) return;
					obisValueResult = obisValueLongUnsignedResult.results?.[0];
					if(!this.areResultNamesOk(obisValueResult, '', 'INTEGER')) return;
				} else {
					if(!this.areResultNamesOk(obisValueLongUnsignedResult, 'double-long-unsigned', 'Unsigned32')) return;
					obisValueResult = obisValueLongUnsignedResult.results?.[0];
					if(!this.areResultNamesOk(obisValueResult, '', 'INTEGER')) return;
				}
				if(!obisValueResult.rawValue) return;

				// value properties
				const obisValuePropertiesDataResult = structureLevel3Result.results?.[2];
				if(!this.areResultNamesOk(obisValuePropertiesDataResult, '', 'Data')) return;
				const obisValuePropertiesStructureResult = obisValuePropertiesDataResult.results?.[0];
				if(!this.areResultNamesOk(obisValuePropertiesStructureResult, 'structure', 'SEQUENCE OF')) return;
				// scale (exponent)
				const obisValueScaleDataResult = obisValuePropertiesStructureResult.results?.[0];
				if(!this.areResultNamesOk(obisValueScaleDataResult, '', 'Data')) return;
				const obisValueScaleIntegerResult = obisValueScaleDataResult.results?.[0];
				if(!this.areResultNamesOk(obisValueScaleIntegerResult, 'integer', 'Integer8')) return;
				const obisValueScaleResult = obisValueScaleIntegerResult.results?.[0];
				if(!this.areResultNamesOk(obisValueScaleResult, '', 'INTEGER')) return;
				if(!obisValueScaleResult.rawValue) return;
				// unit
				const obisValueUnitDataResult = obisValuePropertiesStructureResult.results?.[1];
				if(!this.areResultNamesOk(obisValueUnitDataResult, '', 'Data')) return;
				const obisValueUnitEnumResult = obisValueUnitDataResult.results?.[0];
				if(!this.areResultNamesOk(obisValueUnitEnumResult, 'enum', 'Unsigned8')) return;
				const obisValueUnitResult = obisValueUnitEnumResult.results?.[0];
				if(!this.areResultNamesOk(obisValueUnitResult, '', 'INTEGER')) return;
				if(!obisValueUnitResult.rawValue) return;

				let numberValue =  (obisValueResult.numberValue ?? 0);
				const scale = obisValueScaleResult.numberValue ?? 0;
				if(scale != 0) {
					// numberValue *= (10**(obisValueScaleResult.numberValue ?? 0));
					// let round = 0;
					// if(scale < 0) {
					//
					// }
					// less rounding issues:
					let scaleTmp = scale;
					while(scaleTmp > 0) {
						numberValue *= 10;
						scaleTmp--;
					}
					while(scaleTmp< 0) {
						numberValue /= 10;
						scaleTmp++;
					}
				}

				const obisValue: ObisValue = {
					obisCode: obisCode.code,
					obisFullName: obisCode.fullName,
					obisName: obisCode.name,
					numberValue: numberValue,
					stringValue: `${numberValue} ${obisValueUnitResult.stringValue}`,
					unit: obisValueUnitResult.stringValue ?? '',
					obisRaw: {
						obisCodeRaw: obisCodeResult.rawValue,
						valueRaw: obisValueResult.rawValue,
						numberValue: obisValueResult.numberValue,
						scaling: obisValueScaleResult.numberValue
					},
				};
				obisValues.push(obisValue);
			}
		}

		return {
			obisValues
		};

	}
}

import { ObisMeasurement, ObisNames } from 'smartmeter-obis';
import { DateTime, Result } from "./cosem/cosem-asn2ts/cosem-asn2ts-lib/asn-1-data-types";
import { DataNotification, LongInvokeIdAndPriority, NotificationBody } from "./result-interfaces";

export class CosemObisDataProcessor {

	// pretty much hard coded to extract the actual data from the result based on the COSEM PDU ASN.1 specification.

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

		const longInvokeIdAndPriority = this.getLongInvokeIdAndPriority (dataNotificationResult)
		if(!longInvokeIdAndPriority) return;

		const dateTime = this.getDataNotificationDateTime(dataNotificationResult);
		if(!dateTime) return;

		const notificationBody = this.getNotificationBody();
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


	private getNotificationBody(): NotificationBody {
		return {
			obisValues: []
		}
	}
}

import { ObisMeasurement, ObisNames } from 'smartmeter-obis';
import { Result } from "./cosem/cosem-asn2ts/cosem-asn2ts-lib/asn-1-data-types";
import { ClockStatus, DataNotification, DateTime, LongInvokeIdAndPriority, NotificationBody } from "./result-interfaces";

export class CosemObisDataProcessor {

	// pretty much hard coded to extract the actual data from the result based on the COSEM PDU ASN.1 specification.

	private isResultNameOk(result: Result, name: string): boolean {
		if(result?.name != name) {
			console.error(`Invalid COSEM/ASN.1 result. '${name}' missing. Found: ${result?.name}`);
			return false;
		}
		return true;
	}

	public transform(cosemAsn1Result: Result): DataNotification | undefined {

		const dataNotificationResult = cosemAsn1Result?.results?.[0];
		if(!this.isResultNameOk(dataNotificationResult, 'Data-Notification')) return;

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
		if(!this.isResultNameOk(longInvokeIdAndPriorityResult, 'Long-Invoke-Id-And-Priority')) return;
		const unsigned32Result = longInvokeIdAndPriorityResult.results?.[0];
		if(!this.isResultNameOk(unsigned32Result, 'Unsigned32')) return;

		return {
			hex: unsigned32Result.hexString,
			dec: unsigned32Result.numberValue ?? 0
		};
	}

	private getDataNotificationDateTime(dataNotificationResult: Result): DateTime | undefined {
		const dateTimeResult = dataNotificationResult?.results?.[1];
		if(!this.isResultNameOk(dateTimeResult, 'date-time')) return;

		if(!dateTimeResult?.rawValue) return;

		return this.getDateTime(dateTimeResult.rawValue);
	}

	private getDateTime(rawValue: Buffer): DateTime {
		// DLMS/COSEM/OBIS Blue Book 4.1.6.1 Date formats
		const year = rawValue.readUInt16BE(0);
		const month = rawValue.readUint8(2);
		const day = rawValue.readUint8(3);
		const dayOfWeek = rawValue.readUint8(4);
		const hour = rawValue.readUint8(5);
		const minute = rawValue.readUint8(6);
		const second = rawValue.readUint8(7);
		const hundredthsOfSecond = rawValue.readUint8(8);
		let deviation: number | undefined = rawValue.readInt16BE(9);
		const clockStatusRaw = rawValue.readUint8(11);

		const date = new Date(year, month - 1, day, hour, minute, second, hundredthsOfSecond * 10);
		const epoch = date.getTime();
		if(rawValue.readUInt16BE(9) == 0x800) {
			deviation = undefined;
		}

		let clockStatus: ClockStatus | undefined;
		if(clockStatusRaw != 0xFF) {
			clockStatus = this.getClockStatus(clockStatusRaw);
		}

		return {
			date,
			epoch,
			asString: date.toLocaleString('sv'),  // JS still sucks at time formatting. Workaround with Swedish time format to get somewhat ISO with local time zone.
			deviation,
			clockStatus,
		};
	}

	private getClockStatus(clockStatusRaw: number): ClockStatus {
		return {
			clockStatusRaw,
			invalid:                (clockStatusRaw & 0b00000001) == 0b00000001,
			doubtful:               (clockStatusRaw & 0b00000010) == 0b00000010,
			differentClockBase:     (clockStatusRaw & 0b00000100) == 0b00000100,
			invalidClockStatus:     (clockStatusRaw & 0b00001000) == 0b00001000,
			daylightSavingActive:   (clockStatusRaw & 0b10000000) == 0b10000000,
		};
	}

	private getNotificationBody(): NotificationBody {
		return {
			obisValues: []
		}
	}
}

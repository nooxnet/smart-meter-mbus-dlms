import { DateTime } from "./cosem/cosem-asn2ts/cosem-asn2ts-lib/asn-1-data-types";

export interface DataNotification {
	longInvokeIdAndPriority: LongInvokeIdAndPriority;
	dateTime: DateTime;
	notificationBody: NotificationBody;
}

export interface LongInvokeIdAndPriority {
	hex: string;
	dec: number;
}

export interface NotificationBody {
	//DataValue: DataValue;
	obisValues: ObisValue[];
}

export interface ObisValue {
	obis: string;
	numberValue: number;
	stringValue: string,
	unit: string;
	obisRawValue: ObisRawValue
}

export interface ObisRawValue {
	obisRaw: string;
	ValueRaw: string;
	unitRaw: string;
	scaling: number;
}

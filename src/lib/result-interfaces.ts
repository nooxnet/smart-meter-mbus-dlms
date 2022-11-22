import { DateTime } from "./cosem/cosem-lib/asn-1-data-types";

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
	obisCode: string;
	obisFullName: string;
	obisName: string;
	numberValue: number | undefined;
	stringValue: string,
	unit: string;
	obisRaw: ObisRaw
}

export interface ObisRaw {
	obisCodeRaw?: Buffer;
	valueRaw?: Buffer;
	numberValue?: number;
	scaling?: number;
}

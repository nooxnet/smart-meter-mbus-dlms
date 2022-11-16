
export interface DataNotification {
	longInvokeIdAndPriority: LongInvokeIdAndPriority;
	dateTime: DateTime;
	notificationBody: NotificationBody;
}

export interface LongInvokeIdAndPriority {
	hex: string;
	dec: number;
}

export interface DateTime {
	date: Date,
	epoch: number,
	asString: string;
	deviation: number | undefined,
	clockStatus: ClockStatus | undefined;
}

export interface ClockStatus {
	clockStatusRaw: number;
	invalid: boolean;
	doubtful: boolean;
	differentClockBase: boolean;
	invalidClockStatus: boolean;
	daylightSavingActive: boolean;
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

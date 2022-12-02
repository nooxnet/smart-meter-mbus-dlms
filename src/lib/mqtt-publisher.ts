import { DataNotification } from './result-interfaces';
import { MqttSettings } from './settings/setting-classes';
import { MqttClientWrapper } from './mqtt-client-wrapper';

interface SingleObisJsonValue {
	code?: string;
	name: string;
	value: string;
	unit?: string;
}

export class MqttPublisher {

	private lastPublishEpoch: number = 0;
	private currentSecondsIntervalIndex: number = -1;
	private nextSecondIntervalEpoch: number = 0;
	private currentMinutesIntervalIndex: number = -1;
	private nextMinuteIntervalEpoch: number = 0;
	//private currentSecondsIndexSent: boolean = false;


	private readonly mqttClient: MqttClientWrapper | undefined = undefined;

	public constructor() {
		if(MqttSettings.enabled) {
			this.mqttClient = new MqttClientWrapper();
		}
	}


	public publish(dataNotification: DataNotification, nowDate?: Date): boolean {
		if(!MqttSettings.enabled || !this.mqttClient) {
			return false;
		}

		if(!nowDate) {
			nowDate = new Date();
		}

		if(!this.checkWhetherToPublish(nowDate)) {
			return false;
		}

		const jsonValues: SingleObisJsonValue[] = [];
		let datetimeValue: SingleObisJsonValue | undefined;

		for(const obisValue of dataNotification.notificationBody.obisValues) {
			let value: string;
			if(obisValue.obisCode == '0-0:1.0.0*255') {
				let dateValue: string;
				if(obisValue.numberValue) {
					if(MqttSettings.valueDateTimeFormat === 'epoch') {
						dateValue = obisValue.numberValue.toString();
					} else if(MqttSettings.valueDateTimeFormat === 'iso') {
						dateValue = new Date(obisValue.numberValue).toISOString();
					} else if(MqttSettings.valueDateTimeFormat === 'iso-local') {
						dateValue = obisValue.stringValue;
					} else if (MqttSettings.valueDateTimeFormat === 'js'){
						dateValue = new Date(obisValue.numberValue).toString();
					} else {
						dateValue = obisValue.stringValue;
					}
				} else {
					dateValue = obisValue.stringValue;
				}

				datetimeValue = {
					code: obisValue.obisCode,
					name: obisValue.obisName,
					value: dateValue
				};
				continue;
			}

			if(obisValue.numberValue !== undefined && !MqttSettings.includeUnitInIndividualValues) {
				value = obisValue.numberValue.toString();
			} else {
				value = obisValue.stringValue;
			}

			jsonValues.push({
				code: obisValue.obisCode,
				name: obisValue.obisName,
				value,
				unit: obisValue.unit
			});
		}
		if(datetimeValue) {
			jsonValues.push(datetimeValue);
		}

		if(MqttSettings.publishIndividualValues) {
			for(const jsonValue of jsonValues) {
				this.mqttClient.publish(this.getTopic(jsonValue), jsonValue.value);
			}
		}

		if(MqttSettings.publishSingleJson) {
			jsonValues.push({
				name: 'InvokeId',
				value: dataNotification.longInvokeIdAndPriority.dec.toString()
			});

			this.mqttClient.publish('json', JSON.stringify(jsonValues));
		}

		return true;
	}

	private getTopic(jsonValue: SingleObisJsonValue) {
		let name = jsonValue.name;
		if(MqttSettings.topicIdentifierReplaceUmlauts) {
			name = name
				.replace('Ä', 'Ae')
				.replace('Ö', 'Oe')
				.replace('Ü', 'Ue')
				.replace('ä', 'ae')
				.replace('ö', 'oe')
				.replace('ü', 'ue')
				.replace('ß', 'ss');
		}
		if(MqttSettings.topicIdentifierInvalidCharsRegex) {
			const regexp = new RegExp(MqttSettings.topicIdentifierInvalidCharsRegex, 'g');
			name = name.replace(regexp, MqttSettings.topicIdentifierInvalidCharsReplacement);
		}
		return name;
	}

	private checkWhetherToPublish(nowDate: Date): boolean {
		const nowEpoch = nowDate.getTime();
		const diffEpoch = nowEpoch - this.lastPublishEpoch;
		if(MqttSettings.minSecondsBetweenMessages > 0) {
			if(diffEpoch < MqttSettings.minSecondsBetweenMessages * 1000) {
				return false;
			}
		}

		const publishSecondsInterval = this.checkWhetherToPublishSecondsInterval(nowDate, nowEpoch, diffEpoch);
		if(!publishSecondsInterval) return false;

		const publishMinutesInterval = this.checkWhetherToPublishMinutesInterval(nowDate, nowEpoch, diffEpoch);
		if(!publishMinutesInterval) return false;

		this.lastPublishEpoch = nowEpoch;
		return true;
	}

	private checkWhetherToPublishSecondsInterval(nowDate: Date, nowEpoch: number, diffEpoch: number): boolean {
		if(MqttSettings.publishIntervalSeconds.length <= 0) return true;
		const currentSecond = nowDate.getSeconds();
		if(MqttSettings.publishIntervalSeconds.length === 1) {
			return this.checkWhetherToPublishSecondsIntervalSingle(nowDate, nowEpoch, currentSecond);
		}
		const indexes = this.findIntervalIndexes(MqttSettings.publishIntervalSeconds, currentSecond);
		if(indexes.currentIndex == this.currentSecondsIntervalIndex) {
			// if the last publish was a minute or more ago we can send anyway
			// if not and we are still at the same interval as last time then do not publish
			return diffEpoch >= 59500;
		}
		this.currentSecondsIntervalIndex = indexes.currentIndex;
		return true;
	}

	private checkWhetherToPublishSecondsIntervalSingle(nowDate: Date, nowEpoch: number, currentSecond: number): boolean {
		if(nowEpoch < this.nextSecondIntervalEpoch) return false;
		const intervalSecond = MqttSettings.publishIntervalSeconds[0];
		const date = new Date(nowDate);
		date.setSeconds(intervalSecond);
		this.nextSecondIntervalEpoch = date.getTime();
		if(currentSecond >= intervalSecond) {
			this.nextSecondIntervalEpoch += 60000;
		}
		return true;
	}

	private checkWhetherToPublishMinutesInterval(nowDate: Date, nowEpoch: number, diffEpoch: number): boolean {
		if(MqttSettings.publishIntervalMinutes.length <= 0) return true;
		const currentMinute = nowDate.getMinutes();
		if(MqttSettings.publishIntervalMinutes.length === 1) {
			return this.checkWhetherToPublishMinutesIntervalSingle(nowDate, nowEpoch, currentMinute);
		}
		const indexes = this.findIntervalIndexes(MqttSettings.publishIntervalMinutes, currentMinute);
		if(indexes.currentIndex == this.currentMinutesIntervalIndex) {
			// if the last publish was an hour or more ago we can send anyway
			// if not and we are still at the same interval as last time then do not publish
			return diffEpoch >= 60 * 60000 - 500;
		}
		this.currentMinutesIntervalIndex = indexes.currentIndex;
		return true;
	}

	private checkWhetherToPublishMinutesIntervalSingle(nowDate: Date, nowEpoch: number, currentMinute: number): boolean {
		if(nowEpoch < this.nextMinuteIntervalEpoch) return false;
		const intervalMinute = MqttSettings.publishIntervalMinutes[0];
		const date = new Date(nowDate);
		date.setMinutes(intervalMinute);
		date.setSeconds(0);
		this.nextMinuteIntervalEpoch = date.getTime();
		if(currentMinute >= intervalMinute) {
			this.nextMinuteIntervalEpoch += 3600000;        // one hour in ms
		}
		return true;
	}

	private findIntervalIndexes(intervals: number[], current: number): {currentIndex: number; nextIndex: number; } {
		if(intervals.length == 0) return { currentIndex: 0, nextIndex: 0 };
		const lastIndex = intervals.length - 1;
		if(current < intervals[0]) return { currentIndex: lastIndex, nextIndex: 0 };
		if(current >= intervals[lastIndex]) return { currentIndex: lastIndex, nextIndex: 0 };

		let index = 0;
		while(current >= intervals[index + 1]) {
			index++;
		}
		return { currentIndex: index, nextIndex: index + 1 };
	}

}

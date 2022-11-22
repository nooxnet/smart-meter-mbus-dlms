import { DebugSettings } from "./settings/setting-classes";
import { Telegram } from "./telegram";
import { ApplicationProtocolDataUnit } from "./application-protocol-data-unit";
import { Result } from "./cosem/cosem-lib/asn-1-data-types";
import { SimpleXmlProcessor } from "./simple-xml-processor";
import { DataNotification } from "./result-interfaces";

export class DebugLogger {


	private logSerialPortBuffers: Buffer[] = [];
	private logSerialPortByteCount = 0;

	public logSerialPortData(serialPortData: Buffer): void {
		if(DebugSettings.logSerialPortMinBytes <= 1) {
			console.log(serialPortData.toString('hex'));
			return;
		}
		if(this.logSerialPortByteCount == 0 && serialPortData.length >= DebugSettings.logSerialPortMinBytes) {
			console.log(serialPortData.toString('hex'));
			return;
		}
		this.logSerialPortBuffers.push(serialPortData);
		this.logSerialPortByteCount += serialPortData.length;
		if(this.logSerialPortByteCount < DebugSettings.logSerialPortMinBytes) {
			return;
		}
		console.log(Buffer.concat(this.logSerialPortBuffers).toString('hex'));
		this.logSerialPortBuffers = [];
		this.logSerialPortByteCount = 0;
	}

	public logSerialPortDataEnd() {
		if(DebugSettings.logSerialPort && DebugSettings.logSerialPortMinBytes > 1 && this.logSerialPortByteCount > 0) {
			console.log(Buffer.concat(this.logSerialPortBuffers).toString('hex'));
		}
	}

	public logTelegrams(telegrams: Telegram[]): void {
		if(DebugSettings.logTelegramRaw){
			telegrams.forEach((t) => console.log('Telegram: ', t.telegramRaw?.toString('hex')));
		}
		if(DebugSettings.logTelegramJson) {
			telegrams.forEach((t) => console.log('Telegram: ', t));
		}
	}

	public logApplicationDataUnits(applicationDataUnits: ApplicationProtocolDataUnit[]): void {
		if(DebugSettings.logApduRaw){
			applicationDataUnits.forEach((apdu) => console.log('APDU: ', apdu.apduRaw.toString('hex')));
		}
		if(DebugSettings.logApduJson) {
			applicationDataUnits.forEach((apdu) => {
				console.log('APDU:');
				console.dir(apdu, { depth: 5 });
			});
		}
		if(DebugSettings.logApduEncryptedRaw) {
			applicationDataUnits.forEach((apdu) => console.log('APDU payload encrypted: ', apdu.encryptedPayload.toString('hex')));
		}
		if(DebugSettings.logApduDecryptedRaw) {
			applicationDataUnits.forEach((apdu) => console.log('APDU payload decrypted: ', apdu.decryptedPayload.toString('hex')));
		}
	}

	public logCosemData(cosemResult: Result): void {
		if(DebugSettings.logApduCosemJson) {
			console.log('APDU COSEM Data:')
			console.dir(cosemResult, { depth: null })
		}

		if(DebugSettings.logApduCosemXml) {
			const simpleXmlProcessor = new SimpleXmlProcessor();
			const xml = simpleXmlProcessor.transform(cosemResult);
			console.log('APDU COSEM XML: ', xml);
		}
	}

	public logObisData(dataNotification: DataNotification) {
		if(DebugSettings.logObisValuesJson) {
			//console.log('Data Notification Obis Data: ', dataNotification);
			console.log('Custom Data Notification Obis Data (JSON):');
			console.dir( dataNotification, { depth: 10 });
		}

		if(DebugSettings.logObisValuesPlain) {
			console.log('Custom Data Notification Obis Data (plain text):');
			console.log('Invoke Id:', dataNotification?.longInvokeIdAndPriority?.dec);
			console.log('Datetime:', dataNotification?.dateTime?.asString);
			for(const obisValue of dataNotification?.notificationBody?.obisValues) {
				console.log(obisValue.obisCode, obisValue.obisName, obisValue.stringValue);
			}
		}
	}


}

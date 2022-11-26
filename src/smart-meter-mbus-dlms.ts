import { SerialPort } from 'serialport';

import { TelegramReader } from './lib/telegram-reader';
import { ApplicationDataState, TelegramState } from './lib/enums';
import { MultiTelegramReader } from './lib/multi-telegram-reader';
import { DebugSettings, SerialPortSettings, Settings } from './lib/settings/setting-classes';
import { CosemDataReader } from './lib/cosem-data-reader';
import { cosemTypeDefinitionMap } from './lib/cosem/generated/asn1-structure';
import { CosemObisDataProcessor } from './lib/cosem-obis-data-processor';
import { DebugLogger } from './lib/debug-logger.ts';
import { MqttPublisher } from './lib/mqtt-publisher';

let serialPortByteCount = 0;
let telegramCount = 0;
let applicationDataUnitCount = 0;
let prematureStops = false;
let port: SerialPort;
const debugLogger = new DebugLogger();

function main(): void {
	Settings.read();
	init();

	port = new SerialPort({
		path: SerialPortSettings.port,
		baudRate: SerialPortSettings.baudRate,
		dataBits: SerialPortSettings.dataBits,
		parity: SerialPortSettings.parity,
		stopBits: SerialPortSettings.stopBits
	});

	const telegramReader = new TelegramReader();
	const multiTelegramReader = new MultiTelegramReader(telegramReader);
	const cosemDataReader = new CosemDataReader(cosemTypeDefinitionMap, 'XDLMS-APDU');
	const cosemObisDataProcessor = new CosemObisDataProcessor();
	const mqttPublisher = new MqttPublisher();

	port.on('data', function (serialPortData: Buffer) {
		if(DebugSettings.logSerialPort) {
			debugLogger.logSerialPortData(serialPortData);
		}

		serialPortByteCount += serialPortData.length;

		// read single MBus telegrams
		const telegramResultState = telegramReader.addRawData(serialPortData);
		if(telegramResultState === TelegramState.available) {
			const telegrams = telegramReader.getTelegrams();
			telegramCount += telegrams.length;
			debugLogger.logTelegrams(telegrams);

			// combine telegrams and decrypt
			const applicationDataUnitState = multiTelegramReader.addTelegrams(telegrams);
			if(applicationDataUnitState === ApplicationDataState.available) {
				const applicationDataUnits = multiTelegramReader.getApplicationDataUnits();
				applicationDataUnitCount += applicationDataUnits.length;
				debugLogger.logApplicationDataUnits(applicationDataUnits);

				// analyze COSEM data
				for(const applicationDataUnit of applicationDataUnits) {
					const result = cosemDataReader.read(applicationDataUnit.decryptedPayload);
					if(!result) continue;
					debugLogger.logCosemData(result);

					// extract OBIS values
					const dataNotification = cosemObisDataProcessor.transform(result);
					if(!dataNotification) continue;
					debugLogger.logObisData(dataNotification);

					// publish to MQTT broker
					mqttPublisher.publish(dataNotification);
				}
			}
		}

		if(prematureStops) checkForDebugStops();
	});

	port.on('error', function(err: any) {
		console.error('Serial port error: ', err.message);
	});
}

function init(): void {
	prematureStops = DebugSettings.maxBytes > 0 || DebugSettings.maxTelegrams > 0 || DebugSettings.maxApplicationDataUnits > 0;
}

function checkForDebugStops() {
	if( (DebugSettings.maxBytes === 0 || serialPortByteCount < DebugSettings.maxBytes) &&
		(DebugSettings.maxTelegrams === 0 || telegramCount < DebugSettings.maxTelegrams) &&
		(DebugSettings.maxApplicationDataUnits === 0 || applicationDataUnitCount < DebugSettings.maxApplicationDataUnits)) {
		return;
	}

	debugLogger.logSerialPortDataEnd();

	port.close((error) => {
		if(error) console.error(error);
		process.exit(1);
	});

	console.log(`Stopping because of Debug config: maxBytes (${DebugSettings.maxBytes}), maxTelegrams (${DebugSettings.maxTelegrams}) or maxApplicationDataUnits (${DebugSettings.maxApplicationDataUnits}) > 0 ...`);
}

main();




import { SerialPort } from 'serialport';

import { TelegramReader } from "./lib/telegram-reader";
import { ApplicationDataState, TelegramState } from "./lib/enums";
import { MultiTelegramReader } from "./lib/multi-telegram-reader";
import { DebugSettings, SerialPortSettings, Settings } from "./lib/settings/setting-classes";
import { Telegram } from "./lib/telegram";
import { ApplicationProtocolDataUnit } from "./lib/application-protocol-data-unit";


let logSerialPortBuffers: Buffer[] = [];
let logSerialPortByteCount = 0;
let serialPortByteCount = 0;
let telegramCount = 0;
let applicationDataUnitCount = 0;
let prematureStops = false;
let port: SerialPort;

function main() {
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

	// Switches the port into "flowing mode"
	port.on('data', function (serialPortData: Buffer) {

		serialPortByteCount += serialPortData.length;

		if(DebugSettings.logSerialPort) {
			logSerialPortData(serialPortData);
		}


		const telegramResultState = telegramReader.addRawData(serialPortData);
		if(telegramResultState == TelegramState.available) {
			const telegrams = telegramReader.getTelegrams();
			telegramCount += telegrams.length;
			logTelegrams(telegrams);

			const applicationDataUnitState = multiTelegramReader.addTelegrams(telegrams);
			if(applicationDataUnitState == ApplicationDataState.available) {
				const applicationDataUnits = multiTelegramReader.getApplicationDataUnits();
				applicationDataUnitCount += applicationDataUnits.length
				logApplicationDataUnits(applicationDataUnits);
			}
		}

		if(prematureStops) checkForDebugStops();
	})

	port.on('error', function(err) {
		console.error('Serial port error: ', err.message)
	})
}

function init() {
	prematureStops = DebugSettings.maxBytes > 0 || DebugSettings.maxTelegrams > 0 || DebugSettings.maxApplicationDataUnits > 0;
}

function logSerialPortData(serialPortData: Buffer): void {
	if(DebugSettings.logSerialPortMinBytes <= 1) {
		console.log(serialPortData.toString('hex'));
		return;
	}
	if(logSerialPortByteCount == 0 && serialPortData.length >= DebugSettings.logSerialPortMinBytes) {
		console.log(serialPortData.toString('hex'));
		return;
	}
	logSerialPortBuffers.push(serialPortData);
	logSerialPortByteCount += serialPortData.length;
	if(logSerialPortByteCount < DebugSettings.logSerialPortMinBytes) {
		return;
	}
	console.log(Buffer.concat(logSerialPortBuffers).toString('hex'));
	logSerialPortBuffers = [];
	logSerialPortByteCount = 0;
}

function logTelegrams(telegrams: Telegram[]): void {
	if(DebugSettings.logTelegramRaw){
		telegrams.forEach((t) => console.log('Telegram: ', t.telegramRaw.toString('hex')));
	}
	if(DebugSettings.logTelegramJson) {
		telegrams.forEach((t) => console.log('Telegram: ', t));
	}
}

function logApplicationDataUnits(applicationDataUnits: ApplicationProtocolDataUnit[]): void {
	if(DebugSettings.logApduRaw){
		applicationDataUnits.forEach((apdu) => console.log('APDU: ', apdu.apduRaw.toString('hex')));
	}
	if(DebugSettings.logApduJson) {
		applicationDataUnits.forEach((apdu) => console.log('APDU: ', apdu));
	}
	if(DebugSettings.logApduDecryptedRaw) {
		applicationDataUnits.forEach((apdu) => console.log('APDU payload decrypted: ', apdu.decryptedPayload.toString('hex')));
	}
}

function checkForDebugStops() {
	if( (DebugSettings.maxBytes == 0 || serialPortByteCount < DebugSettings.maxBytes) &&
		(DebugSettings.maxTelegrams == 0 || telegramCount < DebugSettings.maxTelegrams) &&
		(DebugSettings.maxApplicationDataUnits == 0 || applicationDataUnitCount < DebugSettings.maxApplicationDataUnits)) {
		return;
	}

	if(DebugSettings.logSerialPort && DebugSettings.logSerialPortMinBytes > 1 && logSerialPortByteCount > 0) {
		console.log(Buffer.concat(logSerialPortBuffers).toString('hex'));
	}

	port.close((error) => {
		if(error) console.error(error);
		process.exit(1);
	});

	console.log(`Stopping because of Debug config: maxBytes (${DebugSettings.maxBytes}), maxTelegrams (${DebugSettings.maxTelegrams}) or maxApplicationDataUnits (${DebugSettings.maxApplicationDataUnits}) > 0 ...`);
}

main();





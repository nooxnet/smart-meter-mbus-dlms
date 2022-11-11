import { SerialPort } from 'serialport';
//import * as crypto from "crypto";

import { Settings } from './utils/interfaces';
import { TelegramReader } from "./lib/telegram-reader";
import { ApplicationDataState, TelegramState } from "./lib/enums";
import { MultiTelegramReader } from "./lib/multi-telegram-reader";

const settings: Settings = {
	// serial port settings
	//port: '/dev/ttyUSB0'
	port: '/dev/serial/by-id/usb-Prolific_Technology_Inc._USB-Serial_Controller_DIDSt114J20-if00-port0',
	baudRate: 2400,
	dataBits: 8,
	parity: 'none',
	stopBits: 1
}

function main() {
	const port = new SerialPort({
		path: settings.port,
		baudRate: settings.baudRate,
		dataBits: settings.dataBits,
		parity: settings.parity,
		stopBits: settings.stopBits
	});

	const telegramReader = new TelegramReader();
	const multiTelegramReader = new MultiTelegramReader(telegramReader);

	// Read data that is available but keep the stream in "paused mode"
	// port.on('readable', function () {
	// 	console.log('Data:', port.read())
	// })

	// Switches the port into "flowing mode"
	port.on('data', function (serialPortData: Buffer) {
		//console.log('Data:', serialPortData)
		//console.log('real:', JSON.stringify(serialPortData));

		// let output = '';
		// for (let property in serialPortData) {
		// 	// @ts-ignore
		// 	output += property + ': ' + serialPortData[property] + '; ';
		// }
		// console.log(output);
		console.log([...serialPortData])
		const telegramResultState = telegramReader.addRawData([...serialPortData])
		if(telegramResultState == TelegramState.available) {
			const telegrams = telegramReader.getTelegrams();
			console.log(JSON.stringify(telegrams))

			const applicationDataUnitState = multiTelegramReader.addTelegrams(telegrams);
			if(applicationDataUnitState == ApplicationDataState.available) {
				const applicationDataUnits = multiTelegramReader.getApplicationDataUnits();
				console.log(JSON.stringify(applicationDataUnits))
			}
		}
	})


	// port.on('open', function() {
	// 	// open logic
	// })

	port.on('error', function(err) {
		console.error('Error: ', err.message)
	})
}

//console.log(crypto.getCiphers())

main();



//Benchmark.bufferArrayBenchmark();





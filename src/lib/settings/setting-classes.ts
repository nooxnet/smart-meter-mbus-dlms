//import { config }  from 'config'
import * as config from 'config';

export class SerialPortSettings {
	public static port: string = '';
	public static baudRate: number = 2400;
	public static dataBits: 5 | 6 | 7 | 8  = 8;
	public static parity: 'none' | 'even' | 'odd' = 'none';
	public static stopBits: 1 | 1.5 | 2 = 1;

	public static read() {
		SerialPortSettings.port = config.get('serialPort.port');
		SerialPortSettings.baudRate = config.get('serialPort.baudRate');
		SerialPortSettings.dataBits = config.get('serialPort.dataBits');
		SerialPortSettings.parity = config.get('serialPort.parity');
		SerialPortSettings.stopBits = config.get('serialPort.stopBits');
	}
}

export class DecryptionSettings {
	public static key: string = '';

	public static read() {
		DecryptionSettings.key = config.get('decryption.key');
	}
}

export class DecodingSettings {
	public static language: 'de' | 'en' = 'en';

	public static read() {
		DecodingSettings.language = config.get('decoding.language');
	}
}

export class DebugSettings {
	// stop after this many if > 0
	public static maxBytes = 0;             // raw bytes from serial port
	public static maxTelegrams = 0;
	public static maxApplicationDataUnits = 0;

	public static logSerialPort: false;
	public static logSerialPortMinBytes: 0  // log only after this number of bytes in queue
	public static logTelegramRaw: false;
	public static logTelegramJson: false;

	public static logApduRaw: false;
	public static logApduJson: false;

	public static logApduDecryptedRaw: false;
	public static logApduDecryptedJson: false;             // base ond ASN.1 format, deeply nested
	public static logApduDecryptedXml: false;              // simple XML similar to other PDU->XML translators
	public static logApduDecryptedValuesJson: false;       // custom format with decoded and readable values

	public static read() {
		DebugSettings.maxBytes = config.get('debug.maxBytes');
		DebugSettings.maxTelegrams = config.get('debug.maxTelegrams');
		DebugSettings.maxApplicationDataUnits = config.get('debug.maxApplicationDataUnits');

		DebugSettings.logSerialPort = config.get('debug.logSerialPort');
		DebugSettings.logSerialPortMinBytes = config.get('Debug.logSerialPortMinBytes');
		DebugSettings.logTelegramRaw = config.get('debug.logTelegramRaw');
		DebugSettings.logTelegramJson = config.get('debug.logTelegramJson');

		DebugSettings.logApduRaw = config.get('debug.logApduRaw');
		DebugSettings.logApduJson = config.get('debug.logApduJson');

		DebugSettings.logApduDecryptedRaw = config.get('debug.logApduDecryptedRaw');
		DebugSettings.logApduDecryptedJson = config.get('debug.logApduDecryptedJson');
		DebugSettings.logApduDecryptedXml = config.get('debug.logApduDecryptedXml');
		DebugSettings.logApduDecryptedValuesJson = config.get('debug.logApduDecryptedValuesJson');
	}
}

export class Settings {
	public static serialPort = SerialPortSettings;
	public static decryption = DecryptionSettings;
	public static decoding = DecodingSettings;
	public static debug = DebugSettings;

	public static read() {
		SerialPortSettings.read();
		DecryptionSettings.read();
		DecodingSettings.read();
		DebugSettings.read();
	}
}



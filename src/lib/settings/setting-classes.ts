import config  from 'config';
//import * as config from 'config';

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
		DecodingSettings.language = config.get('decoding.obisLanguage');
	}
}

export class DebugSettings {
	// stop after this many if > 0
	public static maxBytes = 0;             // raw bytes from serial port
	public static maxTelegrams = 0;
	public static maxApplicationDataUnits = 0;

	public static logSerialPort: false;
	public static logSerialPortMinBytes: 0;          // log only after this number of bytes in queue
	public static logTelegramRaw: false;
	public static logTelegramJson: false;

	public static logApduRaw: false;
	public static logApduJson: false;

	public static logApduEncryptedRaw: false;
	public static logApduDecryptedRaw: false;

	public static logApduCosemJson: false;              // base ond ASN.1 format, deeply nested
	public static logApduCosemXml: false;               // simple XML similar to other PDU->XML translators

	public static logObisValuesJson: false;             // custom format with decoded and readable values
	public static logObisValuesPlain: false;            // plain obis values

	public static read() {
		DebugSettings.maxBytes = config.get('debug.maxBytes');
		DebugSettings.maxTelegrams = config.get('debug.maxTelegrams');
		DebugSettings.maxApplicationDataUnits = config.get('debug.maxApplicationDataUnits');

		DebugSettings.logSerialPort = config.get('debug.logSerialPort');
		DebugSettings.logSerialPortMinBytes = config.get('debug.logSerialPortMinBytes');
		DebugSettings.logTelegramRaw = config.get('debug.logTelegramRaw');
		DebugSettings.logTelegramJson = config.get('debug.logTelegramJson');

		DebugSettings.logApduRaw = config.get('debug.logApduRaw');
		DebugSettings.logApduJson = config.get('debug.logApduJson');

		DebugSettings.logApduEncryptedRaw = config.get('debug.logApduEncryptedRaw');
		DebugSettings.logApduDecryptedRaw = config.get('debug.logApduDecryptedRaw');


		DebugSettings.logApduCosemJson = config.get('debug.logApduCosemJson');
		DebugSettings.logApduCosemXml = config.get('debug.logApduCosemXml');

		DebugSettings.logObisValuesJson = config.get('debug.logObisValuesJson');
		DebugSettings.logObisValuesPlain = config.get('debug.logObisValuesPlain');
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



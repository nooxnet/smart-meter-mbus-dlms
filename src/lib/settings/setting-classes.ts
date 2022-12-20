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
	public static obisNameFormat: string = '[measurement]';
	public static obisNameDelimiterCharacters: string = ''; // ',-. ';

	public static read() {
		DecodingSettings.language = config.get('decoding.obisLanguage');
		DecodingSettings.obisNameFormat = config.get('decoding.obisNameFormat');
		DecodingSettings.obisNameDelimiterCharacters = config.get('decoding.obisNameDelimiterCharacters');

	}
}

export class MqttSettings {
	public static enabled: boolean = false;
	public static testMode: boolean = false;
	public static testModeNoLogging: boolean = false;  // only internally when running tests

	public static host: string = '';
	public static port: number = 1883;
	public static clientId: string = '';
	public static username: string = '';
	public static password: string = '';

	public static topicBase: string = 'SmartMeter/Electricity/';
	public static topicObisIdentifier: string = 'name';

	public static topicIdentifierInvalidCharsRegex: string = '';
	public static topicIdentifierInvalidCharsReplacement: string = '';
	public static topicIdentifierReplaceUmlauts: boolean = true;

	public static publishSingleJson: boolean = false;
	public static publishIndividualValues: boolean = false;
	public static includeUnitInIndividualValues: boolean = false;
	public static valueDateTimeFormat: 'epoch' | 'iso' | 'js' | 'iso-local' = 'epoch';

	public static minSecondsBetweenMessages: number = 0;
	public static publishIntervalSeconds: number[] = [];
	public static publishIntervalMinutes: number[] = [];

	public static read() {
		MqttSettings.enabled = config.get('mqtt.enabled');
		MqttSettings.testMode = config.get('mqtt.testMode');

		MqttSettings.host = config.get('mqtt.host');
		MqttSettings.port = config.get('mqtt.port');
		MqttSettings.clientId = config.get('mqtt.clientId');
		MqttSettings.username = config.get('mqtt.username');
		MqttSettings.password = config.get('mqtt.password');

		MqttSettings.topicBase = config.get('mqtt.topicBase');
		if(!MqttSettings.topicBase.endsWith('/')) {
			MqttSettings.topicBase = '/';
		}
		MqttSettings.topicObisIdentifier = config.get('mqtt.topicObisIdentifier');

		MqttSettings.topicIdentifierInvalidCharsRegex = config.get('mqtt.topicIdentifierInvalidCharsRegex');
		MqttSettings.topicIdentifierInvalidCharsReplacement = config.get('mqtt.topicIdentifierInvalidCharsReplacement');
		MqttSettings.topicIdentifierReplaceUmlauts = config.get('mqtt.topicIdentifierReplaceUmlauts');

		MqttSettings.publishSingleJson = config.get('mqtt.publishSingleJson');
		MqttSettings.publishIndividualValues = config.get('mqtt.publishIndividualValues');
		MqttSettings.includeUnitInIndividualValues = config.get('mqtt.includeUnitInIndividualValues');
		MqttSettings.valueDateTimeFormat = config.get('mqtt.valueDateTimeFormat');

		MqttSettings.minSecondsBetweenMessages = config.get('mqtt.minSecondsBetweenMessages');
		MqttSettings.publishIntervalSeconds = MqttSettings.stringToNumberArray(config.get('mqtt.publishIntervalSeconds'), 'mqtt.publishIntervalSeconds');
		MqttSettings.publishIntervalMinutes = MqttSettings.stringToNumberArray(config.get('mqtt.publishIntervalMinutes'), 'mqtt.publishIntervalMinutes');

	}

	private static stringToNumberArray(numberString: string, source: string): number[] {
		if(!numberString) return [];
		const numberStringNoWs = numberString.replace(/\s/g, '');
		if(!numberStringNoWs) return [];
		const arr = numberStringNoWs.split(',')?.map((n) => +n) ?? [];
		if(arr.join(',') != numberStringNoWs) {
			console.error(`Invalid value for setting "${source}". Must be comma separated string. Value: "${numberString}". Interpreted as: "${arr.join(', ')}". Ignored!`);
			return [];
		}
		return arr;
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

	public static logTimes: false;

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

		DebugSettings.logTimes = config.get('debug.logTimes');
	}
}

export class Settings {
	public static serialPort = SerialPortSettings;
	public static decryption = DecryptionSettings;
	public static decoding = DecodingSettings;
	public static mqtt = MqttSettings;
	public static debug = DebugSettings;

	public static read() {
		SerialPortSettings.read();
		DecryptionSettings.read();
		DecodingSettings.read();
		MqttSettings.read();
		DebugSettings.read();
	}
}



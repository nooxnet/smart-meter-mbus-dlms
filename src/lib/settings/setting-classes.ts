//import { config }  from 'config'
import * as config from 'config';

export class SerialPortSettings {
	public static port: string = '';
	public static baudRate: number = 2400;
	public static dataBits: 5 | 6 | 7 | 8  = 8;
	public static parity: 'none' | 'even' | 'odd' = 'none';
	public static stopBits: 1 | 1.5 | 2 = 1;

	public static read() {
		SerialPortSettings.port = config.get('SerialPort.port');
		SerialPortSettings.baudRate = config.get('SerialPort.baudRate');
		SerialPortSettings.dataBits = config.get('SerialPort.dataBits');
		SerialPortSettings.parity = config.get('SerialPort.parity');
		SerialPortSettings.stopBits = config.get('SerialPort.stopBits');
	}
}

export class DecryptionSettings {
	public static key: string = '';

	public static read() {
		DecryptionSettings.key = config.get('Decryption.key');
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

	public static read() {
		DebugSettings.maxBytes = config.get('Debug.maxBytes');
		DebugSettings.maxTelegrams = config.get('Debug.maxTelegrams');
		DebugSettings.maxApplicationDataUnits = config.get('Debug.maxApplicationDataUnits');

		DebugSettings.logSerialPort = config.get('Debug.logSerialPort');
		DebugSettings.logSerialPortMinBytes = config.get('Debug.logSerialPortMinBytes');
		DebugSettings.logTelegramRaw = config.get('Debug.logTelegramRaw');
		DebugSettings.logTelegramJson = config.get('Debug.logTelegramJson');

		DebugSettings.logApduRaw = config.get('Debug.logApduRaw');
		DebugSettings.logApduJson = config.get('Debug.logApduJson');
		DebugSettings.logApduDecryptedRaw = config.get('Debug.logApduDecryptedRaw');
	}
}

export class Settings {
	public static serialPort = SerialPortSettings;
	public static decryption = DecryptionSettings;
	public static debug = DebugSettings;

	public static read() {
		SerialPortSettings.read();
		DecryptionSettings.read();
		DebugSettings.read();
	}
}



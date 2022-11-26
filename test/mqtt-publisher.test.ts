import { MqttSettings } from '../src/lib/settings/setting-classes';
import { CosemDataReader } from '../src/lib/cosem-data-reader';
import { CosemObisDataProcessor } from '../src/lib/cosem-obis-data-processor';
import { cosemTypeDefinitionMap } from '../src/lib/cosem/generated/asn1-structure';
import { Result } from '../src/lib/cosem/cosem-lib/asn-1-data-types';
import { DataNotification } from '../src/lib/result-interfaces';
import { MqttPublisher } from '../src/lib/mqtt-publisher';

let dataNotification: DataNotification | undefined;
let mqttPublisher: MqttPublisher | undefined;
// MqttSettings.testMode is for the user to test. It does not publish but logs
// With this setting this logging can be disabled:
const testModeNoLogging = true;

describe('MqttPublisher simple 15 sec interval', () => {

	beforeAll(() => {
		MqttSettings.enabled = true;
		MqttSettings.minSecondsBetweenMessages = 15;
		MqttSettings.publishIntervalSeconds = [];
		MqttSettings.publishIntervalMinutes = [];
		MqttSettings.testMode = true;
		MqttSettings.testModeNoLogging = testModeNoLogging;
		MqttSettings.topicBase = 'SmartMeter/Electricity/Main/';
		MqttSettings.publishSingleJson = true;
		const cosemDataReader = new CosemDataReader(cosemTypeDefinitionMap, 'XDLMS-APDU');
		const cosemObisDataProcessor = new CosemObisDataProcessor();
		const buffer = Buffer.from('0f0017fa980c07e60b0c0610360000ffc400021009060000010000ff090c07e60b0c0610360000ffc400020209060000600100ff090e314b464d303230303233343830340202090600002a0000ff09104b464d31323030323030323334383034020309060100200700ff1208f402020fff1623020309060100340700ff12090c02020fff1623020309060100480700ff12090a02020fff16230203090601001f0700ff1200a502020ffe1621020309060100330700ff1200ad02020ffe1621020309060100470700ff12002502020ffe1621020309060100010700ff06000002ca02020f00161b020309060100020700ff060000000002020f00161b020309060100010800ff060014416002020f00161e020309060100020800ff060000000002020f00161e020309060100030800ff06000012d202020f001620020309060100040800ff060005be6002020f001620', 'hex');
		const cosemAsn1Result = cosemDataReader.read(buffer) ?? new Result({});
		dataNotification = cosemObisDataProcessor.transform(cosemAsn1Result);
		if(!dataNotification) {
			console.error('dataNotification is not defined');
			process.exit(0);
		}
	});

	test('initialize', () => {
		mqttPublisher = new MqttPublisher();
		expect(mqttPublisher).toBeDefined();
	});

	test('test 2022-01-01 00:00:00 true', () => {
		if(!dataNotification) return;
		const result = mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:00:00'));
		expect(result).toBeTruthy();
	});
	test('test 2022-01-01 00:00:01 false', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:00:01'))).toBeFalsy();
	});
	test('test 2022-01-01 00:00:15 true', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:00:15'))).toBeTruthy();
	});
	test('test 2022-01-01 00:00:29 false', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:00:29'))).toBeFalsy();
	});
	test('test 2022-01-01 00:00:30 true', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:00:30'))).toBeTruthy();
	});
	test('test 2022-01-01 00:00:50 true', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:00:50'))).toBeTruthy();
	});
	test('test 2022-01-01 00:01:00 false', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:01:00'))).toBeFalsy();
	});
	test('test 2022-01-01 00:01:05 true', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:01:05'))).toBeTruthy();
	});
});

describe('MqttPublisher seconds interval "0, 15, 30, 45"', () => {

	beforeAll(() => {
		MqttSettings.enabled = true;
		MqttSettings.minSecondsBetweenMessages = 0;
		MqttSettings.publishIntervalSeconds = [0, 15, 30, 45];
		MqttSettings.publishIntervalMinutes = [];
		MqttSettings.testMode = true;
		MqttSettings.testModeNoLogging = testModeNoLogging;
		MqttSettings.topicBase = 'SmartMeter/Electricity/Main/';
		MqttSettings.publishSingleJson = true;
		const cosemDataReader = new CosemDataReader(cosemTypeDefinitionMap, 'XDLMS-APDU');
		const cosemObisDataProcessor = new CosemObisDataProcessor();
		const buffer = Buffer.from('0f0017fa980c07e60b0c0610360000ffc400021009060000010000ff090c07e60b0c0610360000ffc400020209060000600100ff090e314b464d303230303233343830340202090600002a0000ff09104b464d31323030323030323334383034020309060100200700ff1208f402020fff1623020309060100340700ff12090c02020fff1623020309060100480700ff12090a02020fff16230203090601001f0700ff1200a502020ffe1621020309060100330700ff1200ad02020ffe1621020309060100470700ff12002502020ffe1621020309060100010700ff06000002ca02020f00161b020309060100020700ff060000000002020f00161b020309060100010800ff060014416002020f00161e020309060100020800ff060000000002020f00161e020309060100030800ff06000012d202020f001620020309060100040800ff060005be6002020f001620', 'hex');
		const cosemAsn1Result = cosemDataReader.read(buffer) ?? new Result({});
		dataNotification = cosemObisDataProcessor.transform(cosemAsn1Result);
		if(!dataNotification) {
			console.error('dataNotification is not defined');
			process.exit(0);
		}
	});

	test('initialize', () => {
		mqttPublisher = new MqttPublisher();
		expect(mqttPublisher).toBeDefined();
	});

	test('test 2022-01-01 00:00:00 true', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:00:00'))).toBeTruthy();
	});
	test('test 2022-01-01 00:00:01 false', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:00:01'))).toBeFalsy();
	});
	test('test 2022-01-01 00:00:05 false', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:00:05'))).toBeFalsy();
	});
	test('test 2022-01-01 00:00:10 false', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:00:10'))).toBeFalsy();
	});
	test('test 2022-01-01 00:00:15 true', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:00:15'))).toBeTruthy();
	});
	test('test 2022-01-01 00:00:20 false', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:00:20'))).toBeFalsy();
	});
	test('test 2022-01-01 00:00:25 false', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:00:25'))).toBeFalsy();
	});
	test('test 2022-01-01 00:00:30 true', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:00:30'))).toBeTruthy();
	});
	test('test 2022-01-01 00:00:35 false', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:00:35'))).toBeFalsy();
	});
	test('test 2022-01-01 00:00:40 false', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:00:40'))).toBeFalsy();
	});
	test('test 2022-01-01 00:00:46 true', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:00:46'))).toBeTruthy();
	});
	test('test 2022-01-01 00:00:51 false', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:00:51'))).toBeFalsy();
	});
	test('test 2022-01-01 00:00:54 false', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:00:54'))).toBeFalsy();
	});
	test('test 2022-01-01 00:01:00 true', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:01:00'))).toBeTruthy();
	});
	test('test 2022-01-01 00:01:05 false', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:00:05'))).toBeFalsy();
	});
	test('test 2022-01-01 00:01:12 false', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:00:12'))).toBeFalsy();
	});
	test('test 2022-01-01 00:01:15 true', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:01:15'))).toBeTruthy();
	});
});


describe('MqttPublisher seconds interval "0"', () => {

	beforeAll(() => {
		MqttSettings.enabled = true;
		MqttSettings.minSecondsBetweenMessages = 0;
		MqttSettings.publishIntervalSeconds = [0];
		MqttSettings.publishIntervalMinutes = [];
		MqttSettings.testMode = true;
		MqttSettings.testModeNoLogging = testModeNoLogging;
		MqttSettings.topicBase = 'SmartMeter/Electricity/Main/';
		MqttSettings.publishSingleJson = true;
		const cosemDataReader = new CosemDataReader(cosemTypeDefinitionMap, 'XDLMS-APDU');
		const cosemObisDataProcessor = new CosemObisDataProcessor();
		const buffer = Buffer.from('0f0017fa980c07e60b0c0610360000ffc400021009060000010000ff090c07e60b0c0610360000ffc400020209060000600100ff090e314b464d303230303233343830340202090600002a0000ff09104b464d31323030323030323334383034020309060100200700ff1208f402020fff1623020309060100340700ff12090c02020fff1623020309060100480700ff12090a02020fff16230203090601001f0700ff1200a502020ffe1621020309060100330700ff1200ad02020ffe1621020309060100470700ff12002502020ffe1621020309060100010700ff06000002ca02020f00161b020309060100020700ff060000000002020f00161b020309060100010800ff060014416002020f00161e020309060100020800ff060000000002020f00161e020309060100030800ff06000012d202020f001620020309060100040800ff060005be6002020f001620', 'hex');
		const cosemAsn1Result = cosemDataReader.read(buffer) ?? new Result({});
		dataNotification = cosemObisDataProcessor.transform(cosemAsn1Result);
		if(!dataNotification) {
			console.error('dataNotification is not defined');
			process.exit(0);
		}
	});

	test('initialize', () => {
		mqttPublisher = new MqttPublisher();
		expect(mqttPublisher).toBeDefined();
	});

	test('test 2022-01-01 00:00:00 true', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:00:00'))).toBeTruthy();
	});
	test('test 2022-01-01 00:00:01 false', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:00:01'))).toBeFalsy();
	});
	test('test 2022-01-01 00:00:05 false', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:00:05'))).toBeFalsy();
	});
	test('test 2022-01-01 00:00:59 false', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:00:59'))).toBeFalsy();
	});
	test('test 2022-01-01 00:01:00 true', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:01:00'))).toBeTruthy();
	});
	test('test 2022-01-01 00:01:10 false', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:01:10'))).toBeFalsy();
	});
	test('test 2022-01-01 00:01:15 false', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:01:15'))).toBeFalsy();
	});
	test('test 2022-01-01 00:02:35 true', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:02:35'))).toBeTruthy();
	});
	test('test 2022-01-01 00:02:36 false', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:02:36'))).toBeFalsy();
	});
	test('test 2022-01-01 00:02:45 false', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:02:45'))).toBeFalsy();
	});
	test('test 2022-01-01 00:03:00 true', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:03:00'))).toBeTruthy();
	});
	test('test 2022-01-01 00:03:35 false', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:03:35'))).toBeFalsy();
	});
	test('test 2022-01-01 00:03:59 false', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:03:59'))).toBeFalsy();
	});
	test('test 2022-01-01 00:04:59 true', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:04:59'))).toBeTruthy();
	});
	test('test 2022-01-01 00:05:00 true', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:05:00'))).toBeTruthy();
	});
	test('test 2022-01-01 00:05:01 false', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:05:01'))).toBeFalsy();
	});
	test('test 2022-01-01 00:05:10 false', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:05:10'))).toBeFalsy();
	});
	test('test 2022-01-01 00:06:00 true', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:06:00'))).toBeTruthy();
	});
});

describe('MqttPublisher seconds interval "30"', () => {

	beforeAll(() => {
		MqttSettings.enabled = true;
		MqttSettings.minSecondsBetweenMessages = 0;
		MqttSettings.publishIntervalSeconds = [30];
		MqttSettings.publishIntervalMinutes = [];
		MqttSettings.testMode = true;
		MqttSettings.testModeNoLogging = testModeNoLogging;
		MqttSettings.topicBase = 'SmartMeter/Electricity/Main/';
		MqttSettings.publishSingleJson = true;
		const cosemDataReader = new CosemDataReader(cosemTypeDefinitionMap, 'XDLMS-APDU');
		const cosemObisDataProcessor = new CosemObisDataProcessor();
		const buffer = Buffer.from('0f0017fa980c07e60b0c0610360000ffc400021009060000010000ff090c07e60b0c0610360000ffc400020209060000600100ff090e314b464d303230303233343830340202090600002a0000ff09104b464d31323030323030323334383034020309060100200700ff1208f402020fff1623020309060100340700ff12090c02020fff1623020309060100480700ff12090a02020fff16230203090601001f0700ff1200a502020ffe1621020309060100330700ff1200ad02020ffe1621020309060100470700ff12002502020ffe1621020309060100010700ff06000002ca02020f00161b020309060100020700ff060000000002020f00161b020309060100010800ff060014416002020f00161e020309060100020800ff060000000002020f00161e020309060100030800ff06000012d202020f001620020309060100040800ff060005be6002020f001620', 'hex');
		const cosemAsn1Result = cosemDataReader.read(buffer) ?? new Result({});
		dataNotification = cosemObisDataProcessor.transform(cosemAsn1Result);
		if(!dataNotification) {
			console.error('dataNotification is not defined');
			process.exit(0);
		}
	});

	test('initialize', () => {
		mqttPublisher = new MqttPublisher();
		expect(mqttPublisher).toBeDefined();
	});

	test('test 2022-01-01 00:00:00 true', () => {
		if(!dataNotification) return;
		const result = mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:00:00'));
		expect(result).toBeTruthy();
	});
	test('test 2022-01-01 00:00:01 false', () => {
		if(!dataNotification) return;
		const result = mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:00:01'));
		expect(result).toBeFalsy();
	});
	test('test 2022-01-01 00:00:05 false', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:00:05'))).toBeFalsy();
	});
	test('test 2022-01-01 00:00:30 true', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:00:30'))).toBeTruthy();
	});
	test('test 2022-01-01 00:00:35 false', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:00:35'))).toBeFalsy();
	});
	test('test 2022-01-01 00:01:15 false', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:01:15'))).toBeFalsy();
	});
	test('test 2022-01-01 00:01:31 true', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:01:31'))).toBeTruthy();
	});
	test('test 2022-01-01 00:01:36 false', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:01:36'))).toBeFalsy();
	});
	test('test 2022-01-01 00:02:29 false', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:02:29'))).toBeFalsy();
	});
	test('test 2022-01-01 00:02:30 true', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:02:30'))).toBeTruthy();
	});
	test('test 2022-01-01 00:02:59false', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:02:59'))).toBeFalsy();
	});
	test('test 2022-01-01 00:03:25 false', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:02:25'))).toBeFalsy();
	});
	test('test 2022-01-01 00:04:15 true', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:04:15'))).toBeTruthy();
	});
	test('test 2022-01-01 00:04:30 true', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:04:30'))).toBeTruthy();
	});
	test('test 2022-01-01 00:04:45 false', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:04:45'))).toBeFalsy();
	});
	test('test 2022-01-01 00:05:10 false', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:05:10'))).toBeFalsy();
	});
	test('test 2022-01-01 00:05:30 true', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:05:30'))).toBeTruthy();
	});
});


describe('MqttPublisher minutes interval "0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55"', () => {

	beforeAll(() => {
		MqttSettings.enabled = true;
		MqttSettings.minSecondsBetweenMessages = 0;
		MqttSettings.publishIntervalSeconds = [];
		MqttSettings.publishIntervalMinutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
		MqttSettings.testMode = true;
		MqttSettings.testModeNoLogging = testModeNoLogging;
		MqttSettings.topicBase = 'SmartMeter/Electricity/Main/';
		MqttSettings.publishSingleJson = true;
		const cosemDataReader = new CosemDataReader(cosemTypeDefinitionMap, 'XDLMS-APDU');
		const cosemObisDataProcessor = new CosemObisDataProcessor();
		const buffer = Buffer.from('0f0017fa980c07e60b0c0610360000ffc400021009060000010000ff090c07e60b0c0610360000ffc400020209060000600100ff090e314b464d303230303233343830340202090600002a0000ff09104b464d31323030323030323334383034020309060100200700ff1208f402020fff1623020309060100340700ff12090c02020fff1623020309060100480700ff12090a02020fff16230203090601001f0700ff1200a502020ffe1621020309060100330700ff1200ad02020ffe1621020309060100470700ff12002502020ffe1621020309060100010700ff06000002ca02020f00161b020309060100020700ff060000000002020f00161b020309060100010800ff060014416002020f00161e020309060100020800ff060000000002020f00161e020309060100030800ff06000012d202020f001620020309060100040800ff060005be6002020f001620', 'hex');
		const cosemAsn1Result = cosemDataReader.read(buffer) ?? new Result({});
		dataNotification = cosemObisDataProcessor.transform(cosemAsn1Result);
		if(!dataNotification) {
			console.error('dataNotification is not defined');
			process.exit(0);
		}
	});

	test('initialize', () => {
		mqttPublisher = new MqttPublisher();
		expect(mqttPublisher).toBeDefined();
	});

	test('test 2022-01-01 00:00:00 true', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:00:00'))).toBeTruthy();
	});
	test('test 2022-01-01 00:00:01 false', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:00:01'))).toBeFalsy();
	});
	test('test 2022-01-01 00:04:00 false', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:04:00'))).toBeFalsy();
	});
	test('test 2022-01-01 00:04:55 false', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:04:55'))).toBeFalsy();
	});
	test('test 2022-01-01 00:05:05 true', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:05:05'))).toBeTruthy();
	});
	test('test 2022-01-01 00:05:20 false', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:05:20'))).toBeFalsy();
	});
	test('test 2022-01-01 00:09:25 false', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:09:25'))).toBeFalsy();
	});
	test('test 2022-01-01 00:10:00 true', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:10:00'))).toBeTruthy();
	});
	test('test 2022-01-01 00:10:35 false', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:10:35'))).toBeFalsy();
	});
	test('test 2022-01-01 00:12:40 false', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:12:40'))).toBeFalsy();
	});
	test('test 2022-01-01 01:00:00 true', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 01:00:00'))).toBeTruthy();
	});
	test('test 2022-01-01 01:04:51 false', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 01:04:51'))).toBeFalsy();
	});
	test('test 2022-01-01 01:46:10 true', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 01:46:10'))).toBeTruthy();
	});
	test('test 2022-01-01 01:46:05 false', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 01:46:05'))).toBeFalsy();
	});
	test('test 2022-01-01 01:47:12 false', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 01:47:12'))).toBeFalsy();
	});
	test('test 2022-01-01 01:50:00 true', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 01:50:00'))).toBeTruthy();
	});
});


describe('MqttPublisher minutes interval "0"', () => {

	beforeAll(() => {
		MqttSettings.enabled = true;
		MqttSettings.minSecondsBetweenMessages = 0;
		MqttSettings.publishIntervalSeconds = [];
		MqttSettings.publishIntervalMinutes = [0];
		MqttSettings.testMode = true;
		MqttSettings.testModeNoLogging = testModeNoLogging;
		MqttSettings.topicBase = 'SmartMeter/Electricity/Main/';
		MqttSettings.publishSingleJson = true;
		const cosemDataReader = new CosemDataReader(cosemTypeDefinitionMap, 'XDLMS-APDU');
		const cosemObisDataProcessor = new CosemObisDataProcessor();
		const buffer = Buffer.from('0f0017fa980c07e60b0c0610360000ffc400021009060000010000ff090c07e60b0c0610360000ffc400020209060000600100ff090e314b464d303230303233343830340202090600002a0000ff09104b464d31323030323030323334383034020309060100200700ff1208f402020fff1623020309060100340700ff12090c02020fff1623020309060100480700ff12090a02020fff16230203090601001f0700ff1200a502020ffe1621020309060100330700ff1200ad02020ffe1621020309060100470700ff12002502020ffe1621020309060100010700ff06000002ca02020f00161b020309060100020700ff060000000002020f00161b020309060100010800ff060014416002020f00161e020309060100020800ff060000000002020f00161e020309060100030800ff06000012d202020f001620020309060100040800ff060005be6002020f001620', 'hex');
		const cosemAsn1Result = cosemDataReader.read(buffer) ?? new Result({});
		dataNotification = cosemObisDataProcessor.transform(cosemAsn1Result);
		if(!dataNotification) {
			console.error('dataNotification is not defined');
			process.exit(0);
		}
	});

	test('initialize', () => {
		mqttPublisher = new MqttPublisher();
		expect(mqttPublisher).toBeDefined();
	});

	test('test 2022-01-01 00:00:00 true', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:00:00'))).toBeTruthy();
	});
	test('test 2022-01-01 00:01:01 false', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:01:01'))).toBeFalsy();
	});
	test('test 2022-01-01 00:50:59 false', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:59:59'))).toBeFalsy();
	});
	test('test 2022-01-01 00:59:59 false', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 00:59:59'))).toBeFalsy();
	});
	test('test 2022-01-01 01:00:00 true', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 01:00:00'))).toBeTruthy();
	});
	test('test 2022-01-01 01:01:10 false', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 01:01:10'))).toBeFalsy();
	});
	test('test 2022-01-01 01:30:15 false', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 01:30:15'))).toBeFalsy();
	});
	test('test 2022-01-01 02:30:35 true', () => {
		if(!dataNotification) return;
		const result = mqttPublisher?.publish(dataNotification, new Date('2022-01-01 02:30:35'));
		expect(result).toBeTruthy();
	});
	test('test 2022-01-01 02:45:36 false', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 02:45:36'))).toBeFalsy();
	});
	test('test 2022-01-01 02:55:45 false', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 02:55:45'))).toBeFalsy();
	});
	test('test 2022-01-01 03:00:00 true', () => {
		if(!dataNotification) return;
		const result = mqttPublisher?.publish(dataNotification, new Date('2022-01-01 03:00:00'));
		expect(result).toBeTruthy();
	});
	test('test 2022-01-01 03:03:35 false', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 03:03:35'))).toBeFalsy();
	});
	test('test 2022-01-01 03:59:59 false', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 03:59:59'))).toBeFalsy();
	});
	test('test 2022-01-01 04:55:00 true', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 04:55:00'))).toBeTruthy();
	});
	test('test 2022-01-01 05:00:00 true', () => {
		if(!dataNotification) return;
		expect(mqttPublisher?.publish(dataNotification, new Date('2022-01-01 05:00:00'))).toBeTruthy();
	});
});

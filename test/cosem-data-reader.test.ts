import { CosemDataReader } from "../src/lib/cosem-data-reader";
import { cosemTypeDefinitionMap } from "../src/lib/cosem/generated/asn1-structure";


let cosemDataReader: CosemDataReader;

describe('CosemDataReader', () => {

	beforeEach(() => {
		cosemDataReader = new CosemDataReader(cosemTypeDefinitionMap, 'XDLMS-APDU');
	});


	test('Test APDU from my Salzburg Netz smart meter', () => {
		const result = cosemDataReader.read(
			Buffer.from('0f0017fa980c07e60b0c0610360000ffc400021009060000010000ff090c07e60b0c0610360000ffc400020209060000600100ff090e314b464d303230303233343830340202090600002a0000ff09104b464d31323030323030323334383034020309060100200700ff1208f402020fff1623020309060100340700ff12090c02020fff1623020309060100480700ff12090a02020fff16230203090601001f0700ff1200a502020ffe1621020309060100330700ff1200ad02020ffe1621020309060100470700ff12002502020ffe1621020309060100010700ff06000002ca02020f00161b020309060100020700ff060000000002020f00161b020309060100010800ff060014416002020f00161e020309060100020800ff060000000002020f00161e020309060100030800ff06000012d202020f001620020309060100040800ff060005be6002020f001620', 'hex')
		);
		expect(result).toBeDefined();
		expect(result?.typeName).toBe( 'XDLMS-APDU');
		expect(result?.results?.[0].propertyName).toBe( 'data-notification');
		expect(result?.results?.[0].results?.[0]?.propertyName).toBe( 'long-invoke-id-and-priority');
		expect(result?.results?.[0].results?.[0]?.results?.[0]?.results?.[0].numberValue).toBe( 1571480);
		expect(result?.results?.[0].results?.[1]?.propertyName).toBe( 'date-time');
		expect(result?.results?.[0].results?.[1]?.dateTimeValue?.epoch).toBe( 1668268440000);
		expect(result?.results?.[0].results?.[1]?.dateTimeValue?.asString).toBe( '2022-11-12 16:54:00');
		expect(result?.results?.[0].results?.[2]?.propertyName).toBe( 'notification-body');
	});

	test('Test APDU from Salzburg Netz Documentation', () => {
		const result = cosemDataReader.read(
			Buffer.from('0F000055390C07E0090804130D1900FFC4800207090C07E0090804130D190000008009060100010800FF060000000002020F00161E09060100030800FF060000000002020F001620', 'hex')
		);
		expect(result).toBeDefined();
		expect(result?.typeName).toBe( 'XDLMS-APDU');
		expect(result?.results?.[0].propertyName).toBe( 'data-notification');
		expect(result?.results?.[0].results?.[0]?.propertyName).toBe( 'long-invoke-id-and-priority');
		expect(result?.results?.[0].results?.[0]?.results?.[0]?.results?.[0].numberValue).toBe( 21817);
		expect(result?.results?.[0].results?.[1]?.propertyName).toBe( 'date-time');
		expect(result?.results?.[0].results?.[1]?.dateTimeValue?.epoch).toBe( 1473354805000);
		expect(result?.results?.[0].results?.[1]?.dateTimeValue?.asString).toBe( '2016-09-08 19:13:25');
		expect(result?.results?.[0].results?.[2]?.propertyName).toBe( 'notification-body');
	});

	test('Test APDU from NÖ Netz EVN Documentation (from decryption)', () => {
		const result = cosemDataReader.read(
			Buffer.from('0f8006870e0c07e5091b01092f0f00ff88800223090c07e5091b01092f0f00ff888009060100010800ff060000328902020f00161e09060100020800ff060000000002020f00161e09060100010700ff060000000002020f00161b09060100020700ff060000000002020f00161b09060100200700ff12092102020fff162309060100340700ff12000002020fff162309060100480700ff12000002020fff1623090601001f0700ff12000002020ffe162109060100330700ff12000002020ffe162109060100470700ff12000002020ffe1621090601000d0700ff1203e802020ffd16ff090c313831323230303030303039', 'hex')
		);
		expect(result).toBeDefined();
		expect(result?.typeName).toBe( 'XDLMS-APDU');
		expect(result?.results?.[0].propertyName).toBe( 'data-notification');
		expect(result?.results?.[0].results?.[0]?.propertyName).toBe( 'long-invoke-id-and-priority');
		expect(result?.results?.[0].results?.[0]?.results?.[0]?.results?.[0].numberValue).toBe( 2147911438);
		expect(result?.results?.[0].results?.[1]?.propertyName).toBe( 'date-time');
		expect(result?.results?.[0].results?.[1]?.dateTimeValue?.epoch).toBe( 1632728835000);
		expect(result?.results?.[0].results?.[1]?.dateTimeValue?.asString).toBe( '2021-09-27 09:47:15');
		expect(result?.results?.[0].results?.[2]?.propertyName).toBe( 'notification-body');
	});


});

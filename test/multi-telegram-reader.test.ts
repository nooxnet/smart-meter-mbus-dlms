import {TelegramReader} from '../src/lib/telegram-reader'
import { ApplicationDataState, TelegramState } from "../src/lib/enums";
import { Tools } from "../src/lib/tools";
import { MultiTelegramReader } from "../src/lib/multi-telegram-reader";

let telegramReader: TelegramReader;
let multiTelegramReader: MultiTelegramReader;


describe('Telegram reader other example data', () => {

	beforeEach(() => {
		telegramReader = new TelegramReader();
		multiTelegramReader = new MultiTelegramReader(telegramReader);
	});


	test('Other KAIFA MA309M https://www.gurux.fi/node/18232 1st', () => {
		const data = Tools.getByteArrayFromHexString('68 FA FA 68 53 FF 00 01 67 DB 08 4B 46 4D 10 20 00 78 40 82 01 55 21 00 00 E5 54 7F E6 80 4B EE FE 35 29 9E 6E BD 48 A8 BF A9 A5 A0 D1 D8 00 E1 69 D7 3A 06 F0 E9 7C F3 ED 24 B2 1E 94 9F 7E 76 DD 22 55 FF 2D 7D 05 52 48 F5 68 98 76 86 3E 1F C0 B0 D4 F0 F3 75 1E A2 19 87 79 97 89 94 FA A1 B6 3A 30 19 86 38 E2 44 ED 65 44 49 8D 7C 7F 8B 4F 2F 61 83 E0 86 CD A4 A8 3D 45 85 DD C4 E4 F9 3F E4 B9 95 DE B5 88 27 23 99 68 EB BC B8 83 37 09 14 6C 4E E3 14 7E 40 18 DC 9E 42 39 55 CE BF 2D BF 73 EF 4F 61 90 EE D1 9F FC 53 A6 67 F8 13 85 22 AE 44 0C 57 B6 C4 E5 FD 43 4B DF F2 F6 E9 33 5E 12 20 63 07 97 9F FC 35 DE EB 9A 3A 6E 05 5E 1E EF D1 B7 DC 55 6A D6 97 AF 4D 06 F5 B0 14 85 71 23 EA 88 A3 8C D2 88 08 4D 6D 0C 87 0F 5A 7E 42 8A 31 14 9D E4 BD C0 EC BF AA A0 94 88 16 68 72 72 68 53 FF 11 01 67 75 D9 10 4A 5C 1E 37 43 71 08 B3 E0 F5 DF DE 22 6D BF 09 73 F8 22 04 5F 15 3E 53 83 D4 8D 87 6B 81 CF 12 73 CD 59 EC 0E F4 80 20 A1 88 B5 05 F3 D8 78 EF 28 43 D7 B1 84 1F 95 DF 8B 2F 42 01 4C 25 D7 13 97 E3 A6 B6 05 53 2E 91 EC CA 11 BB D3 FD A2 4A 77 D0 54 7B DF B4 70 A3 51 46 0A FB 96 00 2E DB 59 C0 1D 25 FB D5 9A 15 EE 42 14 16');
		const buffer = Buffer.from(data);
		expect(multiTelegramReader.addRawData(buffer)).toBe(ApplicationDataState.available);
		expect(multiTelegramReader["applicationDataUnits"].length).toBe(1);
		expect(multiTelegramReader["applicationDataUnits"][0].lengthFieldLength).toBe(3);
		expect(multiTelegramReader["applicationDataUnits"][0].lengthField).toBe(Tools.getNumberFromByteArray([0x01, 0x55]));
		expect(multiTelegramReader["applicationDataUnits"][0].encryptedPayload.length).toBe(multiTelegramReader["applicationDataUnits"][0].lengthEncryptedPayload);
	});

	// test('Sample from SalzburgNetz documentation', () => {
	// 	const data = Tools.getByteArrayFromHexString('685D5D6853FF100167DB08454C5365700000014D200000541FE2A330AD29E0D68C09365BA286DBF3A7DF14B7790E14D1556AB974B27EC5847D11936DB5191DD0F489BA768C2DBB68F6B001E304C21FEA147E0B2E2CA1B91D574DF4F7F582CEBE928316');
	// 	const buffer = Buffer.from(data);
	// 	expect(multiTelegramReader.addRawData(buffer)).toBe(TelegramState.available);
	// 	expect(multiTelegramReader["applicationDataUnits"].length).toBe(1);
	// 	expect(multiTelegramReader["applicationDataUnits"][0].lengthFieldLength).toBe(1);
	// 	expect(multiTelegramReader["applicationDataUnits"][0].lengthField).toBe(0x4D);
	// 	expect(multiTelegramReader["applicationDataUnits"][0].encryptedPayload.length).toBe(multiTelegramReader["applicationDataUnits"][0].lengthEncryptedPayload);
	// });
});
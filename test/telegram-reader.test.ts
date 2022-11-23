import {TelegramReader} from '../src/lib/telegram-reader';
import { TelegramState } from "../src/lib/enums";
import { Tools } from "../src/lib/tools";

let telegramReader: TelegramReader;

describe('TelegramReader basic', () => {

	beforeEach(() => {
		telegramReader = new TelegramReader();
	});

	test('single random byte', () => {
		expect(telegramReader.addRawData(Buffer.from([123]))).toBe(TelegramState.pending);
		expect(telegramReader["receiveBuffer"].asNumberArray()).toStrictEqual([]);
		expect((telegramReader["receiveBuffer"]).length).toBe(0);
		expect(telegramReader["possibleStartFound"]).toBeFalsy();
	});

	test('single start byte', () => {
		const arr = [0x68];
		const buffer = Buffer.from(arr);

		expect(telegramReader.addRawData(buffer)).toBe(TelegramState.pending);
		expect(telegramReader["receiveBuffer"].asNumberArray()).toStrictEqual(arr);
		expect((telegramReader["receiveBuffer"]).length).toBe(1);
		expect(telegramReader["possibleStartFound"]).toBeTruthy();
	});

	test('four start bytes', () => {
		const len = 0x10;
		const arr = [0x68, len, len, 0x68];
		const buffer = Buffer.from(arr);
		expect(telegramReader.addRawData(buffer)).toBe(TelegramState.pending);
		expect(telegramReader["receiveBuffer"].asNumberArray()).toStrictEqual(arr);
		expect((telegramReader["receiveBuffer"]).length).toBe(4);
		expect(telegramReader["possibleStartFound"]).toBeTruthy();
		expect(telegramReader["currentTelegram"].lengthData).toBe(len);
	});

	test('four start bytes with extra', () => {
		const len = 0x10;
		const arr = [0x68, len, len, 0x68];
		const buffer = Buffer.from([123, 456, ...arr]);
		expect(telegramReader.addRawData(buffer)).toBe(TelegramState.pending);
		expect(telegramReader["receiveBuffer"].asNumberArray()).toStrictEqual(arr);
		expect((telegramReader["receiveBuffer"]).length).toBe(4);
		expect(telegramReader["possibleStartFound"]).toBeTruthy();
		expect(telegramReader["currentTelegram"].lengthData).toBe(len);
	});

});

describe('Telegram reader other example data', () => {

	beforeEach(() => {
		telegramReader = new TelegramReader();
	});


	test('Other KAIFA MA309M https://www.gurux.fi/node/18232 1st', () => {
		const data = Tools.getByteArrayFromHexString('68 FA FA 68 53 FF 00 01 67 DB 08 4B 46 4D 10 20 00 78 40 82 01 55 21 00 00 E5 54 7F E6 80 4B EE FE 35 29 9E 6E BD 48 A8 BF A9 A5 A0 D1 D8 00 E1 69 D7 3A 06 F0 E9 7C F3 ED 24 B2 1E 94 9F 7E 76 DD 22 55 FF 2D 7D 05 52 48 F5 68 98 76 86 3E 1F C0 B0 D4 F0 F3 75 1E A2 19 87 79 97 89 94 FA A1 B6 3A 30 19 86 38 E2 44 ED 65 44 49 8D 7C 7F 8B 4F 2F 61 83 E0 86 CD A4 A8 3D 45 85 DD C4 E4 F9 3F E4 B9 95 DE B5 88 27 23 99 68 EB BC B8 83 37 09 14 6C 4E E3 14 7E 40 18 DC 9E 42 39 55 CE BF 2D BF 73 EF 4F 61 90 EE D1 9F FC 53 A6 67 F8 13 85 22 AE 44 0C 57 B6 C4 E5 FD 43 4B DF F2 F6 E9 33 5E 12 20 63 07 97 9F FC 35 DE EB 9A 3A 6E 05 5E 1E EF D1 B7 DC 55 6A D6 97 AF 4D 06 F5 B0 14 85 71 23 EA 88 A3 8C D2 88 08 4D 6D 0C 87 0F 5A 7E 42 8A 31 14 9D E4 BD C0 EC BF AA A0 94 88 16');
		const buffer = Buffer.from(data);
		expect(telegramReader.addRawData(buffer)).toBe(TelegramState.available);
		expect(telegramReader["telegrams"].length).toBe(1);
		expect(telegramReader["telegrams"][0].lengthData).toBe(0xFA);
		expect(telegramReader["telegrams"][0].controlField).toBe(0x53);  // 83
		expect(telegramReader["telegrams"][0].addressField).toBe(255);  // Broadcast
		expect(telegramReader["telegrams"][0].controlInformationField).toBe(0x00);
		expect(telegramReader["telegrams"][0].sequenceNumber).toBe(0);
		expect(telegramReader["telegrams"][0].isLastSegment).toBeFalsy();
		expect(telegramReader["telegrams"][0].lengthApplicationData).toBe(telegramReader["telegrams"][0].applicationData?.length);
		expect(telegramReader["receiveBuffer"].asNumberArray()).toStrictEqual([]);
		expect(telegramReader["receiveBuffer"].length).toBe(0);
		expect(telegramReader["possibleStartFound"]).toBeFalsy();
	});

	test('Other KAIFA MA309M https://www.gurux.fi/node/18232 21st', () => {
		const data = Tools.getByteArrayFromHexString('68 72 72 68 53 FF 11 01 67 75 D9 10 4A 5C 1E 37 43 71 08 B3 E0 F5 DF DE 22 6D BF 09 73 F8 22 04 5F 15 3E 53 83 D4 8D 87 6B 81 CF 12 73 CD 59 EC 0E F4 80 20 A1 88 B5 05 F3 D8 78 EF 28 43 D7 B1 84 1F 95 DF 8B 2F 42 01 4C 25 D7 13 97 E3 A6 B6 05 53 2E 91 EC CA 11 BB D3 FD A2 4A 77 D0 54 7B DF B4 70 A3 51 46 0A FB 96 00 2E DB 59 C0 1D 25 FB D5 9A 15 EE 42 14 16');
		const buffer = Buffer.from(data);
		expect(telegramReader.addRawData(buffer)).toBe(TelegramState.available);
		expect(telegramReader["telegrams"].length).toBe(1);
		expect(telegramReader["telegrams"][0].lengthData).toBe(0x72);
		expect(telegramReader["telegrams"][0].controlField).toBe(0x53);  // 83
		expect(telegramReader["telegrams"][0].addressField).toBe(255);  // Broadcast
		expect(telegramReader["telegrams"][0].controlInformationField).toBe(0x11);
		expect(telegramReader["telegrams"][0].sequenceNumber).toBe(1);
		expect(telegramReader["telegrams"][0].isLastSegment).toBeTruthy();
		expect(telegramReader["telegrams"][0].lengthApplicationData).toBe(telegramReader["telegrams"][0].applicationData?.length);
		expect(telegramReader["receiveBuffer"].asNumberArray()).toStrictEqual([]);
		expect((telegramReader["receiveBuffer"]).length).toBe(0);
		expect(telegramReader["possibleStartFound"]).toBeFalsy();
	});

	test('Sample from SalzburgNetz documentation', () => {
		const data = Tools.getByteArrayFromHexString('685D5D6853FF100167DB08454C5365700000014D200000541FE2A330AD29E0D68C09365BA286DBF3A7DF14B7790E14D1556AB974B27EC5847D11936DB5191DD0F489BA768C2DBB68F6B001E304C21FEA147E0B2E2CA1B91D574DF4F7F582CEBE928316');
		const buffer = Buffer.from(data);
		expect(telegramReader.addRawData(buffer)).toBe(TelegramState.available);
		expect(telegramReader["telegrams"].length).toBe(1);
		expect(telegramReader["telegrams"][0].lengthData).toBe(0x5D);
		expect(telegramReader["telegrams"][0].controlField).toBe(0x53);  // 83
		expect(telegramReader["telegrams"][0].addressField).toBe(0xFF);  // Broadcast
		expect(telegramReader["telegrams"][0].controlInformationField).toBe(0x10);
		expect(telegramReader["telegrams"][0].sequenceNumber).toBe(0);
		expect(telegramReader["telegrams"][0].isLastSegment).toBeTruthy();
		expect(telegramReader["telegrams"][0].lengthApplicationData).toBe(telegramReader["telegrams"][0].applicationData?.length);
		expect(telegramReader["receiveBuffer"].asNumberArray()).toStrictEqual([]);
		expect((telegramReader["receiveBuffer"]).length).toBe(0);
		expect(telegramReader["possibleStartFound"]).toBeFalsy();
	});
});


// commented out because of many test cases if delivered byte by byte
// describe('TelegramReader complete data package (many small)', () => {
//
// 	const data = [[104], [114], [114], [104], [83], [255], [17], [1], [103], [128], [109], [145], [69], [71], [171], [77], [246], [43], [53], [178], [30], [186], [242], [132], [155], [215], [32], [115], [159], [153], [109], [106], [221], [57], [47], [93], [13], [106], [74], [227], [198], [158], [232], [141], [137], [166], [132], [188], [127], [160], [198], [123], [158], [48], [113], [148], [38], [161], [232], [196], [65], [248], [177], [223], [13], [189], [223], [218], [74], [48], [150], [131], [92], [151], [9], [8], [9], [236], [83], [237], [149], [106], [76], [142], [70], [86], [90], [162], [62], [78], [5], [237], [253], [176], [190], [182], [168], [151], [136], [224], [111], [138], [15], [2], [156], [248], [19], [105], [42], [246], [68], [90], [165], [163], [177], [171], [95], [144], [165]];
// 	const last = [22];
// 	const telegramReader = new TelegramReader();
//
// 	for(let i = 0; i < data.length; i++) {
// 		test(`single byte data[${i}] = [${data[i][0]}]`, () => {
// 			expect(telegramReader.addRawData(data[i])).toBe(TelegramStatus.pending);
// 			expect(telegramReader["telegrams"]).toStrictEqual([]);
// 		});
// 	}
// 	test('last byte', () => {
// 		expect(telegramReader.addRawData(last)).toBe(TelegramStatus.available);
// 		expect(telegramReader["telegrams"].length).toBe(1);
// 		expect(telegramReader["telegrams"][0].dataLen).toBe(114);
// 		expect(telegramReader["telegrams"][0].controlField).toBe(0x53);  // 83
// 		expect(telegramReader["telegrams"][0].addressField).toBe(255);  // Broadcast
// 		expect(telegramReader["telegrams"][0].controlInformationField).toBe(0x11);
// 		expect(telegramReader["telegrams"][0].sequenceNumber).toBe(1);
// 		expect(telegramReader["telegrams"][0].isLastSegment).toBeTruthy();
// 		expect(telegramReader["data"]).toStrictEqual([]);
// 		expect((telegramReader["data"]).length).toBe(0);
// 		expect(telegramReader["possibleStartFound"]).toBeFalsy();
// 	});
// });
//
// describe('TelegramReader complete data package with prefix data (many small)', () => {
//
// 	const data = [[68, 37], [210, 42, 96, 16], [220], [101], [108], [6], [71], [68], [91], [112], [200], [47], [219], [144], [214], [156], [210], [20], [61], [54], [32], [247], [216], [221], [141], [98], [203], [86], [181], [49], [215], [205], [35], [120], [14], [12], [200], [154], [231], [196], [97], [201], [106], [206], [41], [121], [69], [171], [125], [114], [185], [43], [29], [209], [252], [228], [148], [174], [6], [71], [247], [133], [220], [221], [215], [7], [133], [205], [234], [205], [205], [192], [77], [58], [52], [146], [53], [134], [233], [50], [227], [225], [63], [22], [104], [114], [114], [104], [83], [255], [17], [1], [103], [128], [109], [145], [69], [71], [171], [77], [246], [43], [53], [178], [30], [186], [242], [132], [155], [215], [32], [115], [159], [153], [109], [106], [221], [57], [47], [93], [13], [106], [74], [227], [198], [158], [232], [141], [137], [166], [132], [188], [127], [160], [198], [123], [158], [48], [113], [148], [38], [161], [232], [196], [65], [248], [177], [223], [13], [189], [223], [218], [74], [48], [150], [131], [92], [151], [9], [8], [9], [236], [83], [237], [149], [106], [76], [142], [70], [86], [90], [162], [62], [78], [5], [237], [253], [176], [190], [182], [168], [151], [136], [224], [111], [138], [15], [2], [156], [248], [19], [105], [42], [246], [68], [90], [165], [163], [177], [171], [95], [144], [165]];
// 	const last = [22];
// 	const telegramReader = new TelegramReader();
//
// 	for(let i = 0; i < data.length; i++) {
// 		test(`single byte data[${i}] = [${data[i][0]}]`, () => {
// 			expect(telegramReader.addRawData(data[i])).toBe(TelegramStatus.pending);
// 			expect(telegramReader["telegrams"]).toStrictEqual([]);
// 		});
// 	}
// 	test('last byte', () => {
// 		expect(telegramReader.addRawData(last)).toBe(TelegramStatus.available);
// 		expect(telegramReader["telegrams"].length).toBe(1);
// 		expect(telegramReader["telegrams"][0].dataLen).toBe(114);
// 		expect(telegramReader["data"]).toStrictEqual([]);
// 		expect((telegramReader["data"]).length).toBe(0);
// 		expect(telegramReader["possibleStartFound"]).toBeFalsy();
// 	});
//
// 	test('getTelegrams', () => {
// 		const telegrams = telegramReader.getTelegrams();
// 		expect(telegrams.length).toBe(1);
// 	});
//
// });

describe('TelegramReader complete data package', () => {

	const data = [
		[104], [114, 114], [104, 83, 255, 17],
		[1, 103, 128, 109, 145, 69, 71, 171, 77, 246, 43, 53, 178, 30, 186, 242, 132, 155, 215, 32, 115, 159],
		[153, 109, 106, 221, 57, 47, 93, 13, 106, 74, 227, 198, 158, 232, 141, 137, 166, 132, 188, 127, 160, 198, 123, 158, 48, 113],
		[148, 38, 161, 232, 196, 65, 248, 177, 223, 13, 189, 223, 218, 74, 48, 150, 131, 92, 151, 9, 8, 9, 236, 83],
		[237, 149, 106, 76, 142, 70, 86, 90, 162, 62, 78, 5, 237, 253, 176, 190, 182, 168, 151, 136, 224, 111, 138, 15, 2],
		[156, 248, 19, 105, 42, 246, 68, 90, 165, 163, 177, 171, 95, 144],
		[165]
	];
	const last = [22];
	const telegramReader = new TelegramReader();

	for(let i = 0; i < data.length; i++) {
		test(`single byte data[${i}] = [${data[i][0]}]`, () => {
			const buffer = Buffer.from(data[i]);
			expect(telegramReader.addRawData(buffer)).toBe(TelegramState.pending);
			expect(telegramReader["telegrams"]).toStrictEqual([]);
		});
	}
	test('last byte', () => {
		const buffer = Buffer.from(last);
		expect(telegramReader.addRawData(buffer)).toBe(TelegramState.available);
		expect(telegramReader["telegrams"].length).toBe(1);
		expect(telegramReader["telegrams"][0].lengthData).toBe(114);
		expect(telegramReader["telegrams"][0].controlField).toBe(0x53);  // 83
		expect(telegramReader["telegrams"][0].addressField).toBe(255);  // Broadcast
		expect(telegramReader["telegrams"][0].controlInformationField).toBe(0x11);
		expect(telegramReader["telegrams"][0].sequenceNumber).toBe(1);
		expect(telegramReader["telegrams"][0].isLastSegment).toBeTruthy();
		expect(telegramReader["telegrams"][0].lengthApplicationData).toBe(telegramReader["telegrams"][0].applicationData?.length);
		expect(telegramReader["receiveBuffer"].asNumberArray()).toStrictEqual([]);
		expect((telegramReader["receiveBuffer"]).length).toBe(0);
		expect(telegramReader["possibleStartFound"]).toBeFalsy();
	});
});

describe('TelegramReader complete data package with prefix data', () => {

	const data = [
		[68, 37],
		[210, 42, 96, 16],
		[220, 101, 108, 6, 71, 68, 91, 112, 200, 47, 219, 144, 214, 156, 210, 20, 61, 54, 32, 247, 216, 221, 141, 98, 203, 86, 181, 49, 215, 205, 35],
		[120, 14, 12, 200, 154, 231, 196, 97, 201, 106, 206, 41, 121, 69, 171, 125, 114, 185, 43, 29, 209, 252, 228, 148, 174, 6, 71, 247, 133],
		[220, 221, 215, 7, 133, 205, 234, 205, 205, 192, 77, 58, 52, 146, 53, 134, 233, 50, 227, 225, 63, 22, 104, 114, 114, 104, 83, 255, 17],
		[1, 103, 128, 109, 145, 69, 71, 171, 77, 246, 43, 53, 178, 30, 186, 242, 132, 155, 215, 32, 115, 159],
		[153, 109, 106, 221, 57, 47, 93, 13, 106, 74, 227, 198, 158, 232, 141, 137, 166, 132, 188, 127, 160, 198, 123, 158, 48, 113],
		[148, 38, 161, 232, 196, 65, 248, 177, 223, 13, 189, 223, 218, 74, 48, 150, 131, 92, 151, 9, 8, 9, 236, 83],
		[237, 149, 106, 76, 142, 70, 86, 90, 162, 62, 78, 5, 237, 253, 176, 190, 182, 168, 151, 136, 224, 111, 138, 15, 2],
		[156, 248, 19, 105, 42, 246, 68, 90, 165, 163, 177, 171, 95, 144, 165]
	];
	const last = [22];
	const telegramReader = new TelegramReader();

	for(let i = 0; i < data.length; i++) {
		test(`single byte data[${i}] = [${data[i][0]}]`, () => {
			const buffer = Buffer.from(data[i]);
			expect(telegramReader.addRawData(buffer)).toBe(TelegramState.pending);
			expect(telegramReader["telegrams"]).toStrictEqual([]);
		});
	}
	test('last byte', () => {
		const buffer = Buffer.from(last);
		expect(telegramReader.addRawData(buffer)).toBe(TelegramState.available);
		expect(telegramReader["telegrams"].length).toBe(1);
		expect(telegramReader["telegrams"][0].lengthData).toBe(114);
		expect(telegramReader["receiveBuffer"].asNumberArray()).toStrictEqual([]);
		expect((telegramReader["receiveBuffer"]).length).toBe(0);
		expect(telegramReader["possibleStartFound"]).toBeFalsy();
	});

	test('getTelegrams', () => {
		const telegrams = telegramReader.getTelegrams();
		expect(telegrams.length).toBe(1);
		expect(telegrams[0].lengthApplicationData).toBe(telegrams[0].applicationData?.length);
	});

});

describe('TelegramReader complete data package second frame', () => {

	const data = [104, 114, 114, 104, 83, 255, 17, 1, 103, 197, 246, 18, 245, 230, 197, 81, 199, 120, 143, 221, 66, 120, 250, 143, 160, 214, 245, 213, 28, 185, 1, 143, 125, 131, 93, 171, 57, 92, 248, 49, 149, 57, 11, 73, 103, 5, 235, 91, 8, 234, 75, 42, 147, 156, 213, 20, 95, 213, 51, 197, 168, 73, 114, 107, 248, 70, 234, 235, 108, 28, 252, 77, 184, 13, 199, 215, 72, 201, 210, 41, 5, 112, 54, 168, 41, 17, 120, 72, 231, 121, 205, 158, 139, 87, 249, 241, 82, 213, 4, 45, 254, 207, 157, 30, 255, 77, 58, 82, 155, 33, 212, 250, 184, 136, 7, 68, 120, 92, 7, 22];
	const buffer = Buffer.from(data);
	const telegramReader = new TelegramReader();

	test('complete data', () => {
		expect(telegramReader.addRawData(buffer)).toBe(TelegramState.available);
		expect(telegramReader["telegrams"].length).toBe(1);
		expect(telegramReader["telegrams"][0].lengthData).toBe(114);

		expect(telegramReader["receiveBuffer"].asNumberArray()).toStrictEqual([]);
		expect((telegramReader["receiveBuffer"]).length).toBe(0);
		expect(telegramReader["possibleStartFound"]).toBeFalsy();
	});

	test('getTelegrams', () => {
		const telegrams = telegramReader.getTelegrams();
		expect(telegrams.length).toBe(1);
		expect(telegrams.length).toBe(1);
		expect(telegrams[0].lengthData).toBe(114);
		expect(telegrams[0].isLastSegment).toBeTruthy();
		expect(telegrams[0].sequenceNumber).toBe(1);
		expect(telegrams[0].lengthApplicationData).toBe(telegrams[0].applicationData?.length);
	});
});


// describe('TelegramReader Bugs', () => {
// 	//const stringData = '11406789abf2e11964d53937914ab2679d90fa1ed899e36fbf5d6f124bdea84151d03ecd55a4e150a7d6dd4e3a1e5ea7e583c680dfed8984510bf2b6346c3ec0c529d26c5488cffdce62e4c958aadbddc590647ced5d8a35feea8d4a3935f34a67ebdd343d8ce09645c0ccbb1859ea38422a8a5091a7add2';
// 	const stringData = '9f79dc3e421a66950e7ea3eb8394236fde4c115c56f98d0c51c6f4a779cb247bdda9eea9d95f9b6819dc436e';
// 	const buffer = Buffer.from(stringData, 'hex');
// 	const telegramReader = new TelegramReader();
//
// 	test('ERR_OUT_OF_RANGE Buffer.copy targetStart', () => {
// 		expect(telegramReader.addRawData(buffer)).toBe(TelegramState.pending);
// 		expect(telegramReader["telegrams"].length).toBe(0);
// 	});
// });


describe('TelegramReader Bug ERR_OUT_OF_RANGE Buffer.copy targetStart', () => {

	const data = [
		[0x9f, 0x79],
		[0xdc, 0x3e, 0x42],
		[0x1a],
		[0x66],
		[0x95],
		[0x0e],
		[0x7e],
		[0xa3],
		[0xeb],
		[0x83],
		[0x94],
		[0x23],
		[0x6f],
		[0xde],
		[0x4c],
		[0x11],
		[0x5c],
		[0x56],
		[0xf9],
		[0x8d],
		[0x0c],
		[0x51, 0xc6, 0xf4, 0xa7, 0x79, 0xcb, 0x24],
		[0x7b],
		[0xdd],
		[0xa9],
		[0xee],
		[0xa9],
		[0xd9],
		[0x5f],
		[0x9b],
		[0x68],
		[0x19],
		[0xdc],
		[0x43],
		[0x6e]
	];
	const telegramReader = new TelegramReader();

	for(let i = 0; i < data.length; i++) {
		test(`add data ([${i}]: len: ${data[i].length} first: ${data[i][0]})`, () => {
			const buffer = Buffer.from(data[i]);
			// console.log(i);
			// if(i >= 29) {
			// 	console.log('test', i);
			// 	console.log('test new buffer', buffer);
			// }
			expect(telegramReader.addRawData(buffer)).toBe(TelegramState.pending);
			expect(telegramReader["telegrams"]).toStrictEqual([]);
		});
	}
});

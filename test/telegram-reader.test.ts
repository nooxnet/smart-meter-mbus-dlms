import {TelegramReader} from '../src/lib/telegram-reader'
import { TelegramStatus } from "../src/lib/enums";

let telegramReader: TelegramReader;

describe('TelegramReader basic', () => {

	beforeEach(() => {
		telegramReader = new TelegramReader();
	});


	test('single random byte', () => {
		expect(telegramReader.addRawData([123])).toBe(TelegramStatus.pending);
		expect(telegramReader["data"]).toStrictEqual([]);
		expect((telegramReader["data"]).length).toBe(0);
		expect(telegramReader["possibleStartFound"]).toBeFalsy();
	});

	test('single start byte', () => {
		const arr = [0x68];
		expect(telegramReader.addRawData(arr)).toBe(TelegramStatus.pending);
		expect(telegramReader["data"]).toStrictEqual(arr);
		expect((telegramReader["data"]).length).toBe(1);
		expect(telegramReader["possibleStartFound"]).toBeTruthy();
	});

	test('four start bytes', () => {
		const len = 0x10;
		const arr = [0x68, len, len, 0x68];
		expect(telegramReader.addRawData(arr)).toBe(TelegramStatus.pending);
		expect(telegramReader["data"]).toStrictEqual(arr);
		expect((telegramReader["data"]).length).toBe(4);
		expect(telegramReader["possibleStartFound"]).toBeTruthy();
		expect(telegramReader["currentTelegram"].dataLen).toBe(len);
	});

	test('four start bytes with extra', () => {
		const len = 0x10;
		const arr = [0x68, len, len, 0x68];
		expect(telegramReader.addRawData([123, 456, ...arr])).toBe(TelegramStatus.pending);
		expect(telegramReader["data"]).toStrictEqual(arr);
		expect((telegramReader["data"]).length).toBe(4);
		expect(telegramReader["possibleStartFound"]).toBeTruthy();
		expect(telegramReader["currentTelegram"].dataLen).toBe(len);
	});



});

describe('TelegramReader complete data package', () => {

	const data = [[104], [114], [114], [104], [83], [255], [17], [1], [103], [128], [109], [145], [69], [71], [171], [77], [246], [43], [53], [178], [30], [186], [242], [132], [155], [215], [32], [115], [159], [153], [109], [106], [221], [57], [47], [93], [13], [106], [74], [227], [198], [158], [232], [141], [137], [166], [132], [188], [127], [160], [198], [123], [158], [48], [113], [148], [38], [161], [232], [196], [65], [248], [177], [223], [13], [189], [223], [218], [74], [48], [150], [131], [92], [151], [9], [8], [9], [236], [83], [237], [149], [106], [76], [142], [70], [86], [90], [162], [62], [78], [5], [237], [253], [176], [190], [182], [168], [151], [136], [224], [111], [138], [15], [2], [156], [248], [19], [105], [42], [246], [68], [90], [165], [163], [177], [171], [95], [144], [165]];
	const last = [22];
	const telegramReader = new TelegramReader();

	for(let i = 0; i < data.length; i++) {
		test(`single byte data[${i}] = [${data[i][0]}]`, () => {
			expect(telegramReader.addRawData(data[i])).toBe(TelegramStatus.pending);
			expect(telegramReader["telegrams"]).toStrictEqual([]);
		});
	}
	test('last byte', () => {
		expect(telegramReader.addRawData(last)).toBe(TelegramStatus.available);
		expect(telegramReader["telegrams"].length).toBe(1);
		expect(telegramReader["telegrams"][0].dataLen).toBe(114);
		expect(telegramReader["telegrams"][0].controlField).toBe(0x53);  // 83
		expect(telegramReader["telegrams"][0].addressField).toBe(255);  // Broadcast
		expect(telegramReader["telegrams"][0].controlInformationField).toBe(0x11);
		expect(telegramReader["telegrams"][0].sequenceNumber).toBe(1);
		expect(telegramReader["telegrams"][0].lastIsLastSegment).toBeTruthy();
		expect(telegramReader["data"]).toStrictEqual([]);
		expect((telegramReader["data"]).length).toBe(0);
		expect(telegramReader["possibleStartFound"]).toBeFalsy();
	});
});

describe('TelegramReader complete data package with prefix data', () => {

	const data = [[68, 37], [210, 42, 96, 16], [220], [101], [108], [6], [71], [68], [91], [112], [200], [47], [219], [144], [214], [156], [210], [20], [61], [54], [32], [247], [216], [221], [141], [98], [203], [86], [181], [49], [215], [205], [35], [120], [14], [12], [200], [154], [231], [196], [97], [201], [106], [206], [41], [121], [69], [171], [125], [114], [185], [43], [29], [209], [252], [228], [148], [174], [6], [71], [247], [133], [220], [221], [215], [7], [133], [205], [234], [205], [205], [192], [77], [58], [52], [146], [53], [134], [233], [50], [227], [225], [63], [22], [104], [114], [114], [104], [83], [255], [17], [1], [103], [128], [109], [145], [69], [71], [171], [77], [246], [43], [53], [178], [30], [186], [242], [132], [155], [215], [32], [115], [159], [153], [109], [106], [221], [57], [47], [93], [13], [106], [74], [227], [198], [158], [232], [141], [137], [166], [132], [188], [127], [160], [198], [123], [158], [48], [113], [148], [38], [161], [232], [196], [65], [248], [177], [223], [13], [189], [223], [218], [74], [48], [150], [131], [92], [151], [9], [8], [9], [236], [83], [237], [149], [106], [76], [142], [70], [86], [90], [162], [62], [78], [5], [237], [253], [176], [190], [182], [168], [151], [136], [224], [111], [138], [15], [2], [156], [248], [19], [105], [42], [246], [68], [90], [165], [163], [177], [171], [95], [144], [165]];
	const last = [22];
	const telegramReader = new TelegramReader();

	for(let i = 0; i < data.length; i++) {
		test(`single byte data[${i}] = [${data[i][0]}]`, () => {
			expect(telegramReader.addRawData(data[i])).toBe(TelegramStatus.pending);
			expect(telegramReader["telegrams"]).toStrictEqual([]);
		});
	}
	test('last byte', () => {
		expect(telegramReader.addRawData(last)).toBe(TelegramStatus.available);
		expect(telegramReader["telegrams"].length).toBe(1);
		expect(telegramReader["telegrams"][0].dataLen).toBe(114);
		expect(telegramReader["data"]).toStrictEqual([]);
		expect((telegramReader["data"]).length).toBe(0);
		expect(telegramReader["possibleStartFound"]).toBeFalsy();
	});

	test('getTelegrams', () => {
		const telegrams = telegramReader.getTelegrams();
		expect(telegrams.length).toBe(1);
	});

});

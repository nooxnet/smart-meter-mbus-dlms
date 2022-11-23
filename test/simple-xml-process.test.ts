import { CosemDataReader } from "../src/lib/cosem-data-reader";
import { cosemTypeDefinitionMap } from "../src/lib/cosem/generated/asn1-structure";
import { Result } from "../src/lib/cosem/cosem-lib/asn-1-data-types";
import { SimpleXmlProcessor } from "../src/lib/simple-xml-processor";


let cosemAsn1Result: Result;
let simpleXmlProcessor: SimpleXmlProcessor;
let cosemDataReader: CosemDataReader;

describe('CosemDataReader', () => {

	beforeEach(() => {
		cosemDataReader = new CosemDataReader(cosemTypeDefinitionMap, 'XDLMS-APDU');

	});

	test('test decrypted APDU payload', () => {
		const buffer = Buffer.from('0f0017fa980c07e60b0c0610360000ffc400021009060000010000ff090c07e60b0c0610360000ffc400020209060000600100ff090e314b464d303230303233343830340202090600002a0000ff09104b464d31323030323030323334383034020309060100200700ff1208f402020fff1623020309060100340700ff12090c02020fff1623020309060100480700ff12090a02020fff16230203090601001f0700ff1200a502020ffe1621020309060100330700ff1200ad02020ffe1621020309060100470700ff12002502020ffe1621020309060100010700ff06000002ca02020f00161b020309060100020700ff060000000002020f00161b020309060100010800ff060014416002020f00161e020309060100020800ff060000000002020f00161e020309060100030800ff06000012d202020f001620020309060100040800ff060005be6002020f001620', 'hex');
		cosemAsn1Result = cosemDataReader.read(buffer) ?? new Result({});
		simpleXmlProcessor = new SimpleXmlProcessor();
		const xmlString = simpleXmlProcessor.transform(cosemAsn1Result);
		expect(xmlString).toBeDefined();
	});

	test('test full APDU', () => {
		const buffer = Buffer.from('db084b464d102003953482015521001ae3abc32b4af62b85f5ccb12645116944b4015ddf079e77243f53c2790185adf0a10a923a71e0cda2ba2d6f9efc113fbb50193159757ee469943524193567f7403466951ac590e797785092a7ee0abc8e48f042af59896be3d136abbc85dd589a45cd0c6da6bf29bcc49986391eb904646a414228d345bd33b99c2efe205439c03182b47a371c6c7efc56c23bd0869145b5ac5e9dd77612de9fb6fcd37b0cf6ae49430616239ab45623507079bdb28f9431c9d78e9681af8543eeccddd001157531d58ff90235e8a73f4966603f85abf71df904990994c47fece829d04b1d47feede4cfb9de25a68378651228cd4d5fef660a27099c6d6340968af1d5444a4f584fa080dfe349aa9591ba3d1cc2f0413d6175c61a784a022490e9b00486bc0e4edc1378a7884fcd6b170d6f2dad84439f945c0eb4a6738df7984d1785fe50288a9cdbd45852ecbdb64c108e7b44ab799280a8', 'hex');
		cosemAsn1Result = cosemDataReader.read(buffer) ?? new Result({});
		simpleXmlProcessor = new SimpleXmlProcessor();
		const xmlString = simpleXmlProcessor.transform(cosemAsn1Result);
		expect(xmlString).toBeDefined();
		expect(xmlString).toContain('<GeneralGloCiphering>');
		expect(xmlString).toContain('<SystemTitle Value="4b464d1020039534"/>');
		expect(xmlString).toContain('<CipheredContent Value="015521001ae3a');
	});
});

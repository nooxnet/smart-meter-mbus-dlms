import { TelegramReader } from '../src/lib/telegram-reader';
import { ApplicationDataProvisioning, TelegramState } from "../src/lib/enums";
import { Tools } from "../src/lib/tools";
import { MultiTelegramReader } from "../src/lib/multi-telegram-reader";
import { DecryptionSettings } from '../src/lib/settings/setting-classes';

let telegramReader: TelegramReader;
let multiTelegramReader: MultiTelegramReader;


describe('Decryption', () => {

	beforeEach(() => {
		telegramReader = new TelegramReader();
		multiTelegramReader = new MultiTelegramReader(telegramReader, ApplicationDataProvisioning.all);
	});

	// test('Sample from Salbzburg Netz documentation with decryption key from NÖ Netz', () => {
	// 	const data = Tools.getByteArrayFromHexString('685D5D6853FF100167DB08454C5365700000014D200000541FE2A330AD29E0D68C09365BA286DBF3A7DF14B7790E14D1556AB974B27EC5847D11936DB5191DD0F489BA768C2DBB68F6B001E304C21FEA147E0B2E2CA1B91D574DF4F7F582CEBE928316');
	// 	const buffer = Buffer.from(data);
	// 	const tempDecryptionKey = DecryptionSettings.key;
	// 	DecryptionSettings.key = '36C66639E48A8CA4D6BC8B282A793BBB';
	// 	expect(multiTelegramReader.addRawData(buffer)).toBe(TelegramState.available);
	// 	expect(multiTelegramReader["applicationDataUnits"].length).toBe(1);
	// 	expect(multiTelegramReader["applicationDataUnits"][0].lengthFieldLength).toBe(1);
	// 	expect(multiTelegramReader["applicationDataUnits"][0].lengthField).toBe(0x4D);
	// 	expect(multiTelegramReader["applicationDataUnits"][0].encryptedPayload.length).toBe(multiTelegramReader["applicationDataUnits"][0].lengthEncryptedPayload);
	// 	expect(multiTelegramReader["applicationDataUnits"][0].decryptedPayload.length).toBe(multiTelegramReader["applicationDataUnits"][0].lengthEncryptedPayload);
	// 	console.log(multiTelegramReader["applicationDataUnits"][0].encryptedPayload.toString('hex'));
	// 	console.log(multiTelegramReader["applicationDataUnits"][0].decryptedPayload.toString('hex'));
	// 	DecryptionSettings.key = tempDecryptionKey;
	// });

	// noinspection SpellCheckingInspection
	test('Sample from NÖ Netz EVN documentation with decryption key', () => {
		const data = Tools.getByteArrayFromHexString('68FAFA6853FF000167DB084B464D675000000981F8200000002388D5AB4F97515AAFC6B88D2F85DAA7A0E3C0C40D004535C397C9D037AB7DBDA329107615444894A1A0DD7E85F02D496CECD3FF46AF5FB3C9229CFE8F3EE4606AB2E1F409F36AAD2E50900A4396FC6C2E083F373233A69616950758BFC7D63A9E9B6E99E21B2CBC2B934772CA51FD4D69830711CAB1F8CFF25F0A329337CBA51904F0CAED88D61968743C8454BA922EB00038182C22FE316D16F2A9F544D6F75D51A4E92A1C4EF8AB19A2B7FEAA32D0726C0ED80229AE6C0F7621A4209251ACE2B2BC66FF0327A653BB686C756BE033C7A281F1D2A7E1FA31C3983E15F8FD16CC5787E6F517166814146853FF110167419A3CFDA44BE438C96F0E38BF83D98316');
		const buffer = Buffer.from(data);
		const tempDecryptionKey = DecryptionSettings.key;
		DecryptionSettings.key = '36C66639E48A8CA4D6BC8B282A793BBB';
		expect(multiTelegramReader.addRawData(buffer)).toBe(TelegramState.available);
		expect(multiTelegramReader["applicationDataUnits"].length).toBe(1);
		expect(multiTelegramReader["applicationDataUnits"][0].lengthFieldLength).toBe(2);
		expect(multiTelegramReader["applicationDataUnits"][0].lengthField).toBe(0xF8);
		expect(multiTelegramReader["applicationDataUnits"][0].encryptedPayload.length).toBe(multiTelegramReader["applicationDataUnits"][0].lengthEncryptedPayload);
		expect(multiTelegramReader["applicationDataUnits"][0].decryptedPayload.length).toBe(multiTelegramReader["applicationDataUnits"][0].lengthEncryptedPayload);
		//console.log(multiTelegramReader["applicationDataUnits"][0].encryptedPayload.toString('hex'));
		//console.log(multiTelegramReader["applicationDataUnits"][0].decryptedPayload.toString('hex'));
		DecryptionSettings.key = tempDecryptionKey;
	});
});

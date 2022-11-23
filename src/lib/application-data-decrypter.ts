import * as crypto from "crypto";

import { ApplicationProtocolDataUnit } from "./application-protocol-data-unit";
import { DecryptionSettings } from "./settings/setting-classes";

export class ApplicationDataDecrypter {

	public static Decrypt(applicationDataUnit: ApplicationProtocolDataUnit): void {
		//console.log(applicationDataUnit);
		//console.log('applicationDataUnit.apduBuffer hex', applicationDataUnit.apduBuffer.toString('hex'))
		//console.log('applicationDataUnit.encryptedPayload hex', applicationDataUnit.encryptedPayload.toString('hex'))

		const key = Buffer.from(DecryptionSettings.key, 'hex');
		const iv = Buffer.concat([applicationDataUnit.systemTitle, applicationDataUnit.frameCounter]);

		// The documentation says that the smart meter uses 'aes-128-gcm'. But it seems to be without authTag.
		// Node crypto gets the encrypted data on "update" if a 12 byte authTag with all "00" is used,
		// but it fails on "final()".
		//let authTagLength = 12;
		//const authTag = Buffer.alloc(authTagLength);
		//authTag.fill(0);
		//let decipher = crypto.createDecipheriv('aes-128-gcm', key, iv, { authTagLength });
		//decipher.setAuthTag(authTag);

		// workaround: use 'aes-128-ctr' with additional 4 bytes of iv like so:
		const ctrIv = Buffer.concat([iv, Buffer.from("00000002", 'hex')]);
		const decipher = crypto.createDecipheriv('aes-128-ctr', key, ctrIv);

		const update = decipher.update(applicationDataUnit.encryptedPayload);
		//console.log('update', update.toString('hex'));

		const final = decipher.final();
		//console.log('final', final.toString('hex'));

		applicationDataUnit.decryptedPayload = Buffer.concat([update, final]);
		//console.log(`Decrypted: \t${applicationDataUnit.decryptedPayload.toString('hex')}`);
	}
}

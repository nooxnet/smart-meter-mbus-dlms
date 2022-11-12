import * as crypto from "crypto";

import { ApplicationProtocolDataUnit } from "./application-protocol-data-unit";

export class ApplicationDataDecrypter {

	public static Decrypt(applicationDataUnit: ApplicationProtocolDataUnit): void {
		console.log(applicationDataUnit);
		console.log('applicationDataUnit.apduBuffer hex', applicationDataUnit.apduBuffer.toString('hex'))
		//console.log('applicationDataUnit.encryptedPayload base64', applicationDataUnit.encryptedPayload.toString('base64'))
		console.log('applicationDataUnit.encryptedPayload hex', applicationDataUnit.encryptedPayload.toString('hex'))
		// const key = Buffer.from('***REMOVED***', 'hex');
		// const iv = Buffer.concat([Buffer.from('00000000', 'hex'), applicationDataUnit.systemTitle, applicationDataUnit.frameCounter]);
		// //const iv = Buffer.concat([applicationDataUnit.systemTitle, applicationDataUnit.frameCounter, Buffer.from('00000000', 'hex')]);
		// console.log(`iv: \t${iv.toString('hex')}`);
		//
		//
		// const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
		//
		// const update = decipher.update(applicationDataUnit.encryptedPayload);
		// console.log('update', update.toString('hex'));
		// console.log('update', update.toString('utf-8'));
		//
		// const final =  decipher.final();
		// console.log('final', final.toString('hex'));
		// console.log('final', final.toString('utf-8'));
		//
		// applicationDataUnit.decryptedPayload = Buffer.concat([update, final]);
		//
		// console.log(`Decrypted: \t${applicationDataUnit.decryptedPayload.toString('hex')}`);
		// console.log(`Decrypted: \t"${applicationDataUnit.decryptedPayload.toString('utf-8')}"`);
		// console.log(`Decrypted: \t"${applicationDataUnit.decryptedPayload.toString()}"`);

		const key = Buffer.from('blalbla', 'hex');
		const iv = Buffer.concat([applicationDataUnit.systemTitle, applicationDataUnit.frameCounter]);
		//const iv = Buffer.concat([Buffer.from('00000000', 'hex'), applicationDataUnit.systemTitle, applicationDataUnit.frameCounter]);
		let authTagLength = 12;

		let encryptedDataLen = applicationDataUnit.encryptedPayload.length
		//let authTag = applicationDataUnit.encryptedPayload.subarray(encryptedDataLen - authTagLength, encryptedDataLen);
		const authTag = Buffer.alloc(authTagLength);
		authTag.fill(0);
		//const cipher = crypto.createCipheriv('aes-128-gcm', key, iv);
		//const authTag = cipher.getAuthTag().toString("hex");  // <- new

		//let decipher = crypto.createDecipheriv('aes-128-gcm', key, iv, { authTagLength });
		//decipher.setAuthTag(authTag);
		const ctriv = Buffer.concat([iv, Buffer.from("00000002", 'hex')]);
		let decipher = crypto.createDecipheriv('aes-128-ctr', key, ctriv);

		//decipher.setAAD(authTag);
		//decipher.setAuthTag(Buffer.from(authTag, 'hex'));

		const update = decipher.update(applicationDataUnit.encryptedPayload);
		//console.log('update', update.toString());
		console.log('update', update.toString('hex'));
		//console.log('update', update.toString('utf-8'));

		const final = decipher.final();
		//console.log('final', final.toString());
		console.log('final', final.toString('hex'));
		// console.log('final', final.toString('utf-8'));
		applicationDataUnit.decryptedPayload = Buffer.concat([update, final]);

		console.log(`Decrypted: \t${applicationDataUnit.decryptedPayload.toString('hex')}`);
		console.log(`Decrypted: \t"${applicationDataUnit.decryptedPayload.toString('utf-8')}"`);
		console.log(`Decrypted: \t"${applicationDataUnit.decryptedPayload.toString()}"`);

	}
}

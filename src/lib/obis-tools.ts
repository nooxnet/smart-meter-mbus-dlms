import { ObisNames, ObisMeasurement } from 'smartmeter-obis';
import { DecodingSettings } from './settings/setting-classes';

export interface ObisCode {
	code: string;
	fullName: string;
	name: string;
	medium: string;
	channel?: string;
	measurement?: string;
	measurementType?: string;
	tariff?: string;
	previousMeasurement?: string;
}
export class ObisTools {
	public static getObisCode(rawObisCode: Buffer, language: string = 'de'): ObisCode {
		let code = "";
		// let mediumCode: number | undefined;
		let channelCode: number | undefined;
		let measurementCode: number | undefined;
		let measureTypeCode: number | undefined;
		let tariffCode: number | undefined;
		let previousMeasurementCode: number | undefined;

		const mediumCode = ObisTools.getSingleFromRaw(rawObisCode, 0);
		if(mediumCode != undefined) {
			code = mediumCode.toString();
			channelCode = ObisTools.getSingleFromRaw(rawObisCode, 1);
			if(channelCode != undefined) {
				code += `-${channelCode}`;
				measurementCode = ObisTools.getSingleFromRaw(rawObisCode, 2);
				if(measurementCode != undefined) {
					code += `:${measurementCode}`;
					measureTypeCode = ObisTools.getSingleFromRaw(rawObisCode, 3);
					if(measureTypeCode != undefined) {
						code += `.${measureTypeCode}`;
						tariffCode = ObisTools.getSingleFromRaw(rawObisCode, 4);
						if(tariffCode != undefined) {
							code += `.${tariffCode}`;
							previousMeasurementCode = ObisTools.getSingleFromRaw(rawObisCode, 5);
							if(previousMeasurementCode != undefined) {
								code += `*${previousMeasurementCode}`;
							}
						}
					}
				}
			}
		}


		let obisMeasurementNames = ObisTools.getCustomObisNames(code, language);
		if(!obisMeasurementNames) {
			// unable to initialize ObisMeasurement from typescript
			const obisMeasurement = new ObisMeasurement();
			obisMeasurement.medium = mediumCode ?? 0;
			obisMeasurement.channel = channelCode ?? 0;
			obisMeasurement.measurement = measurementCode ?? 0;
			obisMeasurement.measureType = measureTypeCode ?? 0;
			obisMeasurement.tariffRate = tariffCode ?? 0;
			obisMeasurement.previousMeasurement  = previousMeasurementCode ?? 0;

			obisMeasurementNames = ObisNames.resolveObisName(obisMeasurement, language == 'de' ? 'de' : 'en');
		}
		const fullName = `${obisMeasurementNames.mediumName} ${obisMeasurementNames.obisName}`;
		// let name = `${obisMeasurementNames.measurementName}, ${obisMeasurementNames.measurementTypeName}`;
		// if(tariffCode != 0) {
		// 	name += ` ${obisMeasurementNames.tariffRateName}`;
		// }
		// if(previousMeasurementCode != 0 && previousMeasurementCode != 255 && obisMeasurementNames.previousMeasurementName) {
		// 	name += ` ${obisMeasurementNames.previousMeasurementName}`;
		// }
		const name = this.getObisNameFromObisMeasurementNames(obisMeasurementNames);
		return {
			code,
			fullName,
			name,
			medium: obisMeasurementNames.mediumName,
			channel: obisMeasurementNames.channelName,
			measurement: obisMeasurementNames.measurementName,
			measurementType: obisMeasurementNames.measurementTypeName,
			tariff: obisMeasurementNames.tariffRateName,
			previousMeasurement: obisMeasurementNames.previousMeasurementName,
		};
	}

	private static getObisNameFromObisMeasurementNames(obisMeasurementNames: ObisNames.ObisMeasurementNames): string {
		let name = DecodingSettings.obisNameFormat;
		name = name.replace('[medium]', obisMeasurementNames.mediumName);
		name = name.replace('[channel]', obisMeasurementNames.channelName);
		name = name.replace('[measurement]', obisMeasurementNames.measurementName);
		name = name.replace('[measurementType]', obisMeasurementNames.measurementTypeName);
		name = name.replace('[tariff]', obisMeasurementNames.tariffRateName);
		name = name.replace('[previousMeasurement]', obisMeasurementNames.previousMeasurementName);
		const delimiters = DecodingSettings.obisNameDelimiterCharacters.split('');
		for(const delimiter of delimiters) {
			// no regex because of escaping
			name.replace(delimiter + delimiter + delimiter, delimiter);
			name.replace(delimiter + delimiter, delimiter);
		}
		// remove at the end:
		let i = name.length - 1;
		while(i >= 0 && DecodingSettings.obisNameDelimiterCharacters.indexOf(name[i]) >= 0) {
			name = name.substring(0, i);
			i--;
		}
		return name;
	}

	private static getSingleFromRaw(rawObisCode: Buffer, position: number): number | undefined {
		if(rawObisCode.length <= position) return undefined;
		return rawObisCode[position];
	}
	//
	// private static getCustomObisNames(code: string, language: string): ObisCode | undefined {
	// 	if(language == 'de') {
	// 		if(code == '0-0:1.0.0*255') return { code, fullName: 'Abstrakt Zeitpunkt', name: "Zeitpunkt", medium: 'Abstrakt'};
	// 		if(code == '0-0:96.1.0*255') return { code, fullName: 'Abstrakt Zählernummer', name: "Zählernummer", medium: 'Abstrakt'};
	// 		if(code == '0-0:42.0.0*255') return { code, fullName: 'Abstrakt logischer Gerätename', name: "COSEM logischer Gerätename", medium: 'Abstrakt'};
	// 	} else {
	// 		if(code == '0-0:1.0.0*255') return { code, fullName: 'Abstract Timestamp', name: "Timestamp", medium: "Abstract"};
	// 		if(code == '0-0:96.1.0*255') return { code, fullName: 'Abstract Smart meter number', name: "Smart meter number", medium: 'Abstract'};
	// 		if(code == '0-0:42.0.0*255') return { code, fullName: 'Abstract COSEM logical device name', name: "COSEM logical device name", medium: 'Abstract'};
	// 	}
	// }

	private static getCustomObisNames(code: string, language: string): ObisNames.ObisMeasurementNames | undefined {
		if(language == 'de') {
			if(code == '0-0:1.0.0*255') return this.getObisMeasurementNames('Abstrakt', 'Zeitpunkt');
			if(code == '0-0:96.1.0*255') return this.getObisMeasurementNames('Abstrakt', "Zählernummer");
			if(code == '0-0:42.0.0*255') return this.getObisMeasurementNames('Abstrakt', 'Cosem logischer Gerätename');
		} else {
			if(code == '0-0:1.0.0*255') return this.getObisMeasurementNames('Abstrakt', 'Timestamp');
			if(code == '0-0:96.1.0*255') return this.getObisMeasurementNames('Abstrakt', 'Smart meter number');
			if(code == '0-0:42.0.0*255') return this.getObisMeasurementNames('Abstrakt', 'Cosem logical device name');
		}
	}

	private static getObisMeasurementNames(mediumName: string, measurementName: string): ObisNames.ObisMeasurementNames {
		return {
			mediumName,
			channelName: '',
			measurementName,
			measurementTypeName: '',
			tariffRateName: '',
			previousMeasurementName: '',
			customName: '',
			obisName: ''
		};
	}

}

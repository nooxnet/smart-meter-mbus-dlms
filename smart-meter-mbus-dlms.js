/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 91:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ApplicationDataDecrypter = void 0;
const crypto = __importStar(__webpack_require__(113));
const setting_classes_1 = __webpack_require__(312);
class ApplicationDataDecrypter {
    static Decrypt(applicationDataUnit) {
        //console.log(applicationDataUnit);
        //console.log('applicationDataUnit.apduBuffer hex', applicationDataUnit.apduBuffer.toString('hex'))
        //console.log('applicationDataUnit.encryptedPayload hex', applicationDataUnit.encryptedPayload.toString('hex'))
        const key = Buffer.from(setting_classes_1.DecryptionSettings.key, 'hex');
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
        let decipher = crypto.createDecipheriv('aes-128-ctr', key, ctrIv);
        const update = decipher.update(applicationDataUnit.encryptedPayload);
        //console.log('update', update.toString('hex'));
        const final = decipher.final();
        //console.log('final', final.toString('hex'));
        applicationDataUnit.decryptedPayload = Buffer.concat([update, final]);
        //console.log(`Decrypted: \t${applicationDataUnit.decryptedPayload.toString('hex')}`);
    }
}
exports.ApplicationDataDecrypter = ApplicationDataDecrypter;


/***/ }),

/***/ 535:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ApplicationProtocolDataUnit = void 0;
const enums_1 = __webpack_require__(82);
const tools_1 = __webpack_require__(97);
class ApplicationProtocolDataUnit {
    constructor() {
        this.cypheringService = 0;
        this.systemTitleLength = 0;
        this._systemTitle = ApplicationProtocolDataUnit.emptyBuffer;
        this._systemTitleManufacturerId = '';
        this._systemTitleText = '';
        this._serialNumber = 0;
        this._lengthFieldLength = 0;
        this._lengthTotal = 0;
        this._lengthEncryptedPayload = 0;
        this._lengthField = 0;
        this._securityControl = 0;
        this._securitySuiteId = 0;
        this._securityAuthentication = false; // subfield "A"
        this._securityEncryption = false; // subfield "E"
        this._securityKeySet = enums_1.KeySet.broadcast; // subfield Key_Set
        this._securityCompression = false;
        this._frameCounter = ApplicationProtocolDataUnit.emptyBuffer;
        this._frameCounterNumber = 0;
        this.encryptedPayload = ApplicationProtocolDataUnit.emptyBuffer;
        this.decryptedPayload = ApplicationProtocolDataUnit.emptyBuffer;
        // raw APDU data
        this.apduRaw = ApplicationProtocolDataUnit.emptyBuffer;
    }
    setSystemTitle(rawData) {
        this._systemTitle = rawData;
        this._systemTitleManufacturerId = rawData.subarray(0, 3).toString();
        this._serialNumber = tools_1.Tools.getNumberFromBuffer(rawData, 5, 8);
        // system title text. at least for my KAIFA MA309M it seems to be:
        if (this._systemTitleManufacturerId == 'KFM') {
            let first = rawData[3].toString(16).padStart(2, '0');
            let second = rawData[4].toString(16).padStart(2, '0');
            let rest = tools_1.Tools.getNumberFromBuffer(rawData, 5, 8).toString().padStart(7, '0');
            this._systemTitleText = first[0] + this._systemTitleManufacturerId + first[1] + second + rest;
        }
        else {
            // just a guess ...
            // if first letters after manufacturer ids are alphanumeric, treat it as characters
            // treat second part as decimal number
            let i = 0;
            while (i < 5 && rawData[3 + i] >= 48 && rawData[3 + i] <= 122) {
                i++;
            }
            let first = '';
            let second = '';
            if (i > 0) {
                first = rawData.subarray(3, 3 + i).toString();
            }
            if (3 + i < 8) {
                let padLength = (256 ** (5 - i)).toString().length;
                second = tools_1.Tools.getNumberFromByteArray([...rawData.subarray(3 + i, 8)]).toString().padStart(padLength, '0');
            }
            this._systemTitleText = this._systemTitleManufacturerId + first + second;
        }
    }
    get systemTitle() {
        return this._systemTitle;
    }
    get systemTitleManufacturerId() {
        return this._systemTitleManufacturerId;
    }
    get systemTitleText() {
        return this._systemTitleText;
    }
    setLength(buffer, start = 0, end) {
        if (end == undefined)
            end = buffer.length;
        // length of length field is variable: 1 or 3 bytes long
        if (buffer[start] == 0x82) { // 130
            this._lengthField = tools_1.Tools.getNumberFromBuffer(buffer, start + 1, end);
            this._lengthFieldLength = 3;
        }
        else {
            this._lengthField = buffer[start];
            this._lengthFieldLength = 1;
        }
        this._lengthEncryptedPayload = this._lengthField - 5;
        this._lengthTotal = this._lengthField + this._lengthFieldLength + 10;
        return this._lengthFieldLength;
    }
    get lengthFieldLength() {
        return this._lengthFieldLength;
    }
    get lengthTotal() {
        return this._lengthTotal;
    }
    get lengthEncryptedPayload() {
        return this._lengthEncryptedPayload;
    }
    get lengthField() {
        return this._lengthField;
    }
    set securityControl(value) {
        this._securityControl = value;
        this._securitySuiteId = this._securityControl & 0b00001111;
        this._securityAuthentication = (this._securityControl & 0b00010000) == 0b00010000;
        this._securityEncryption = (this._securityControl & 0b00100000) == 0b00100000;
        this._securityKeySet = (this._securityControl & 0b01000000) == 0b01000000 ? enums_1.KeySet.broadcast : enums_1.KeySet.unicast;
        this._securityCompression = (this._securityControl & 0b10000000) == 0b10000000;
    }
    get securityControl() {
        return this._securityControl;
    }
    get securitySuiteId() {
        return this._securitySuiteId;
    }
    get securityAuthentication() {
        return this._securityAuthentication;
    }
    get securityEncryption() {
        return this._securityEncryption;
    }
    get securityKeySet() {
        return this._securityKeySet;
    }
    get securityCompression() {
        return this._securityCompression;
    }
    setFrameCounter(buffer, start = 0, end) {
        this._frameCounter = buffer.subarray(start, end);
        this._frameCounterNumber = tools_1.Tools.getNumberFromBuffer(this._frameCounter);
    }
    get frameCounter() {
        return this._frameCounter;
    }
    get frameCounterNumber() {
        return this._frameCounterNumber;
    }
}
exports.ApplicationProtocolDataUnit = ApplicationProtocolDataUnit;
ApplicationProtocolDataUnit.emptyBuffer = Buffer.from('');


/***/ }),

/***/ 323:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CosemDataReader = void 0;
const enums_1 = __webpack_require__(770);
const asn_1_data_types_1 = __webpack_require__(782);
const cosem_enum_units_1 = __webpack_require__(185);
class CosemDataReader {
    constructor(cosemTypeDefinitionMap, startTypeDefinitionName) {
        this.cosemTypeDefinitionMap = cosemTypeDefinitionMap;
        this.startTypeDefinitionName = startTypeDefinitionName;
        this.currentIndex = 0;
        this.rawData = Buffer.from('');
    }
    read(rawData) {
        this.rawData = rawData;
        this.currentIndex = 0;
        const result = this.readTypeDefinition(this.startTypeDefinitionName, undefined, enums_1.Occurrence.explicit, enums_1.Occurrence.explicit, undefined);
        //console.log(result);
        return result;
    }
    readProperty(definition, property, parentOccurrence, enrichData) {
        if (property.name == 'enum') {
            enrichData = (partialResult) => this.enrichDataWithCosemEnumUnits(partialResult);
        }
        const result = this.getTypeValue(definition, property, parentOccurrence, enrichData);
        //console.log('CosemDataReader.readProperty:', result);
        return result;
    }
    enrichDataWithCosemEnumUnits(partialResult) {
        // In some cases the property names provide hints to the meaning of the data
        // But the actual data is often defined in nested descendants (ASN.1 data types).
        // And when these classes read the data they don't know anything about the property
        // So I inject this method.
        if (partialResult.typeName != 'INTEGER')
            return;
        if (partialResult.numberValue == undefined)
            return;
        const cosemEnumUnit = cosem_enum_units_1.cosemEnumUnitMap.get(partialResult.numberValue);
        if (!cosemEnumUnit)
            return;
        partialResult.stringValue = cosemEnumUnit.unit;
    }
    readAsn1TypeValue(definition, property, asn1TypeName, subType, typeParameter, parentOccurrence, ancestorOccurrence, enrichData) {
        var _a, _b;
        const asn1Type = asn_1_data_types_1.asn1DataTypes.get(asn1TypeName);
        if (!asn1Type) {
            console.error(`CosemDataReader.readAsn1Type: definition ${definition.name}, property: ${property === null || property === void 0 ? void 0 : property.name}: Asn.1 Type not found: ${asn1TypeName}`);
            return undefined;
        }
        const propertyName = property === null || property === void 0 ? void 0 : property.name;
        const result = asn1Type.getLengthAndValue(propertyName, this.rawData, this.currentIndex, subType, typeParameter, parentOccurrence, ancestorOccurrence, enrichData);
        if (!result)
            return;
        this.currentIndex += result === null || result === void 0 ? void 0 : result.encodingLength;
        if ((result === null || result === void 0 ? void 0 : result.asn1ResultType) == asn_1_data_types_1.Asn1ResultType.subType) {
            for (let i = 0; i < ((_a = result === null || result === void 0 ? void 0 : result.count) !== null && _a !== void 0 ? _a : 0); i++) {
                const subResult = this.readTypeDefinition((_b = result.subType) !== null && _b !== void 0 ? _b : '', undefined, parentOccurrence, ancestorOccurrence, undefined);
                result.addSubResult(subResult);
            }
        }
        return result;
    }
    getTypeValue(definition, property, parentOccurrence, enrichData) {
        let customTypeName;
        let asn1TypeName;
        let occurrence;
        let subType;
        let typeParameter;
        let parentProperty;
        if (property) {
            customTypeName = property.customType;
            asn1TypeName = property.asn1Type;
            occurrence = property.occurrence;
            subType = property.subType;
            typeParameter = property.typeParameter;
            parentProperty = property;
        }
        else {
            customTypeName = definition.customType;
            asn1TypeName = definition.asn1Type;
            occurrence = definition.occurrence;
            //subType = definition.subType
            typeParameter = definition.typeParameter;
        }
        if (customTypeName) {
            return this.readTypeDefinition(customTypeName, parentProperty, occurrence, parentOccurrence, enrichData);
        }
        else if (asn1TypeName) {
            return this.readAsn1TypeValue(definition, property, asn1TypeName, subType, typeParameter, occurrence, parentOccurrence, enrichData);
        }
        console.error(`CosemDataReader.checkForType: definition ${definition.name}, property: ${property === null || property === void 0 ? void 0 : property.name}: Not implemented`, definition, property);
        return;
    }
    readTypeDefinition(definitionName, parentProperty, parentOccurrence, ancestorOccurrence, enrichData) {
        if (parentOccurrence == enums_1.Occurrence.none)
            parentOccurrence = ancestorOccurrence;
        const typeDefinition = this.cosemTypeDefinitionMap.get(definitionName);
        if (!typeDefinition) {
            console.error(`CosemDataReader.definitionReader: definition not found: ${definitionName}`);
            return;
        }
        let result = new asn_1_data_types_1.Result({
            propertyName: parentProperty === null || parentProperty === void 0 ? void 0 : parentProperty.name,
            typeName: typeDefinition.name,
            asn1ResultType: asn_1_data_types_1.Asn1ResultType.container
        });
        switch (typeDefinition.blockMode) {
            case enums_1.BlockMode.single:
                const getTypeValueResult = this.getTypeValue(typeDefinition, undefined, parentOccurrence, enrichData);
                result.addSubResult(getTypeValueResult);
                // if(!typeDefinition.asn1Type) {
                // 	result.addSubResult(getTypeValueResult);
                // } else {
                // 	result = getTypeValueResult;
                // }
                //console.log('CosemDataReader.definitionReader BlockMode.single:', result);
                return result;
            case enums_1.BlockMode.choice:
                const possibleTag = this.rawData.readUint8(this.currentIndex);
                const property = typeDefinition.taggedProperties[possibleTag];
                if (!property) {
                    console.error(`CosemDataReader.definitionReader BlockMode.choice: definition ${definitionName}: CHOICE: property with tag ${possibleTag} not found.`);
                    return;
                }
                this.currentIndex++;
                const propertyResult = this.readProperty(typeDefinition, property, parentOccurrence, enrichData);
                result.addSubResult(propertyResult);
                return result;
            case enums_1.BlockMode.sequence:
                if (enrichData) {
                    console.warn(`CosemDataReader.definitionReader enrichData function set. Should not occur if multiple child properties exists.`);
                }
                for (const property of typeDefinition.properties) {
                    result.addSubResult(this.readProperty(typeDefinition, property, parentOccurrence, undefined));
                }
                return result;
            default:
                console.error(`CosemDataReader.definitionReader: definition ${definitionName}: BlockMode not implemented: ${enums_1.BlockMode[typeDefinition.blockMode]}`);
                return;
        }
    }
}
exports.CosemDataReader = CosemDataReader;


/***/ }),

/***/ 629:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CosemObisDataProcessor = void 0;
const setting_classes_1 = __webpack_require__(312);
const obis_tools_1 = __webpack_require__(286);
class CosemObisDataProcessor {
    // The data-value part of the COSEM PDU ASN.1 specification is very flexible.
    // So this part is pretty much hard coded to extract the actual data from
    // the decoded result as delivered by the smart meter
    areResultNamesOk(result, propertyName, typeName) {
        if (propertyName && (result === null || result === void 0 ? void 0 : result.propertyName) != propertyName) {
            console.error(`Invalid COSEM/ASN.1 result. Property '${propertyName}' missing. Found: ${result === null || result === void 0 ? void 0 : result.propertyName}`);
            return false;
        }
        if (typeName && (result === null || result === void 0 ? void 0 : result.typeName) != typeName) {
            console.error(`Invalid COSEM/ASN.1 result. Type '${typeName}' missing. Found: ${result === null || result === void 0 ? void 0 : result.typeName}`);
            return false;
        }
        return true;
    }
    transform(cosemAsn1Result) {
        var _a;
        const dataNotificationResult = (_a = cosemAsn1Result === null || cosemAsn1Result === void 0 ? void 0 : cosemAsn1Result.results) === null || _a === void 0 ? void 0 : _a[0];
        if (!this.areResultNamesOk(dataNotificationResult, 'data-notification', 'Data-Notification'))
            return;
        const longInvokeIdAndPriority = this.getLongInvokeIdAndPriority(dataNotificationResult);
        if (!longInvokeIdAndPriority)
            return;
        const dateTime = this.getDataNotificationDateTime(dataNotificationResult);
        if (!dateTime)
            return;
        const notificationBody = this.getNotificationBody(dataNotificationResult);
        if (!notificationBody)
            return;
        const dataNotification = {
            longInvokeIdAndPriority,
            dateTime,
            notificationBody,
        };
        return dataNotification;
    }
    getLongInvokeIdAndPriority(dataNotificationResult) {
        var _a, _b, _c, _d;
        const longInvokeIdAndPriorityResult = (_a = dataNotificationResult === null || dataNotificationResult === void 0 ? void 0 : dataNotificationResult.results) === null || _a === void 0 ? void 0 : _a[0];
        if (!this.areResultNamesOk(longInvokeIdAndPriorityResult, 'long-invoke-id-and-priority', 'Long-Invoke-Id-And-Priority'))
            return;
        const unsigned32Result = (_b = longInvokeIdAndPriorityResult.results) === null || _b === void 0 ? void 0 : _b[0];
        if (!this.areResultNamesOk(unsigned32Result, undefined, 'Unsigned32'))
            return;
        const integerResult = (_c = unsigned32Result.results) === null || _c === void 0 ? void 0 : _c[0];
        if (!this.areResultNamesOk(integerResult, undefined, 'INTEGER'))
            return;
        return {
            hex: integerResult.hexString,
            dec: (_d = integerResult.numberValue) !== null && _d !== void 0 ? _d : 0
        };
    }
    getDataNotificationDateTime(dataNotificationResult) {
        var _a;
        const dateTimeResult = (_a = dataNotificationResult === null || dataNotificationResult === void 0 ? void 0 : dataNotificationResult.results) === null || _a === void 0 ? void 0 : _a[1];
        if (!this.areResultNamesOk(dateTimeResult, 'date-time', 'OCTET STRING'))
            return;
        return dateTimeResult === null || dateTimeResult === void 0 ? void 0 : dateTimeResult.dateTimeValue;
        // if(!dateTimeResult?.dateTimeValue) return;
        //
        // return this.getDateTime(dateTimeResult.rawValue);
    }
    getNotificationBody(dataNotificationResult) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2;
        const notificationBodyResult = (_a = dataNotificationResult === null || dataNotificationResult === void 0 ? void 0 : dataNotificationResult.results) === null || _a === void 0 ? void 0 : _a[2];
        if (!this.areResultNamesOk(notificationBodyResult, 'notification-body', 'Notification-Body'))
            return;
        const dataValueResult = (_b = notificationBodyResult.results) === null || _b === void 0 ? void 0 : _b[0];
        if (!this.areResultNamesOk(dataValueResult, 'data-value', 'Data'))
            return;
        const structureLevel1Result = (_c = dataValueResult.results) === null || _c === void 0 ? void 0 : _c[0];
        if (!this.areResultNamesOk(structureLevel1Result, 'structure', 'SEQUENCE OF'))
            return;
        // the first two children belong to one obis value: datetime/timestamp
        if (!structureLevel1Result.results || structureLevel1Result.results.length < 2) {
            console.error(`Invalid COSEM/ASN.1 result. DataNotification.NotificationBody.DataValue.Structure does not contain children.`);
            return;
        }
        const dataLevel2Result0 = structureLevel1Result.results[0];
        if (!this.areResultNamesOk(dataLevel2Result0, '', 'Data'))
            return;
        const obisCodeDateTime = dataLevel2Result0.results[0];
        if (!this.areResultNamesOk(obisCodeDateTime, 'octet-string', 'OCTET STRING'))
            return;
        const dataLevel2Result1 = structureLevel1Result.results[1];
        if (!this.areResultNamesOk(dataLevel2Result1, '', 'Data'))
            return;
        const obisValueDateTime = dataLevel2Result1.results[0];
        if (!this.areResultNamesOk(obisValueDateTime, 'octet-string', 'OCTET STRING'))
            return;
        const obisValues = [];
        let obisRawValue = {
            obisCodeRaw: obisCodeDateTime.rawValue,
            valueRaw: obisValueDateTime.rawValue
        };
        if (!obisCodeDateTime.rawValue)
            return;
        const obisCode = obis_tools_1.ObisTools.getObisCode(obisCodeDateTime.rawValue, setting_classes_1.DecodingSettings.language);
        const obisValue = {
            obisCode: obisCode.code,
            obisFullName: obisCode.fullName,
            obisName: obisCode.name,
            numberValue: (_d = obisValueDateTime.dateTimeValue) === null || _d === void 0 ? void 0 : _d.epoch,
            stringValue: (_f = (_e = obisValueDateTime.dateTimeValue) === null || _e === void 0 ? void 0 : _e.asString) !== null && _f !== void 0 ? _f : '',
            unit: '',
            obisRaw: obisRawValue,
        };
        obisValues.push(obisValue);
        for (let i = 2; i < structureLevel1Result.results.length; i++) {
            const dataLevel2Result = structureLevel1Result.results[i];
            if (!this.areResultNamesOk(dataLevel2Result, '', 'Data'))
                return;
            const structureLevel3Result = (_g = dataLevel2Result.results) === null || _g === void 0 ? void 0 : _g[0];
            if (!this.areResultNamesOk(structureLevel3Result, 'structure', 'SEQUENCE OF'))
                continue;
            // obis:
            const obisCodeDataResult = (_h = structureLevel3Result.results) === null || _h === void 0 ? void 0 : _h[0];
            if (!this.areResultNamesOk(obisCodeDataResult, '', 'Data'))
                return;
            const obisCodeResult = (_j = obisCodeDataResult.results) === null || _j === void 0 ? void 0 : _j[0];
            if (!this.areResultNamesOk(obisCodeResult, 'octet-string', 'OCTET STRING'))
                return;
            if (!obisCodeResult.rawValue)
                return;
            let obisCode = obis_tools_1.ObisTools.getObisCode(obisCodeResult.rawValue, setting_classes_1.DecodingSettings.language);
            if (obisCode.code.startsWith('0')) {
                if (structureLevel3Result.results.length != 2) {
                    console.error(`Invalid COSEM/ASN.1 result. Obis code ${obisCode.code} is "${obisCode.medium}" but parent element does not contain 2 children (obis code, obis value).`);
                    return;
                }
                // abstract & seems to be just single obis value
                const obisValueDataResult = (_k = structureLevel3Result.results) === null || _k === void 0 ? void 0 : _k[1];
                if (!this.areResultNamesOk(obisValueDataResult, '', 'Data'))
                    return;
                const obisValueResult = (_l = obisValueDataResult.results) === null || _l === void 0 ? void 0 : _l[0];
                if (!this.areResultNamesOk(obisValueResult, 'octet-string', 'OCTET STRING'))
                    return;
                if (!obisValueResult.rawValue)
                    return;
                const obisValue = {
                    obisCode: obisCode.code,
                    obisFullName: obisCode.fullName,
                    obisName: obisCode.name,
                    numberValue: obisValueResult.numberValue,
                    stringValue: (_m = obisValueResult.stringValue) !== null && _m !== void 0 ? _m : '',
                    unit: '',
                    obisRaw: {
                        obisCodeRaw: obisCodeResult.rawValue,
                        valueRaw: obisValueResult.rawValue
                    },
                };
                obisValues.push(obisValue);
            }
            else {
                if (structureLevel3Result.results.length != 3) {
                    console.error(`Invalid COSEM/ASN.1 result. Obis code ${obisCode.code} is "${obisCode.medium}" but parent element does not contain 3 children (obis code, obis raw value, obis value properties).`);
                    return;
                }
                // physical value
                const obisValueDataResult = (_o = structureLevel3Result.results) === null || _o === void 0 ? void 0 : _o[1];
                if (!this.areResultNamesOk(obisValueDataResult, '', 'Data'))
                    return;
                const obisValueLongUnsignedResult = (_p = obisValueDataResult.results) === null || _p === void 0 ? void 0 : _p[0];
                let obisValueResult;
                if (obisValueLongUnsignedResult.propertyName == 'long-unsigned') {
                    if (!this.areResultNamesOk(obisValueLongUnsignedResult, 'long-unsigned', 'Unsigned16'))
                        return;
                    obisValueResult = (_q = obisValueLongUnsignedResult.results) === null || _q === void 0 ? void 0 : _q[0];
                    if (!this.areResultNamesOk(obisValueResult, '', 'INTEGER'))
                        return;
                }
                else {
                    if (!this.areResultNamesOk(obisValueLongUnsignedResult, 'double-long-unsigned', 'Unsigned32'))
                        return;
                    obisValueResult = (_r = obisValueLongUnsignedResult.results) === null || _r === void 0 ? void 0 : _r[0];
                    if (!this.areResultNamesOk(obisValueResult, '', 'INTEGER'))
                        return;
                }
                if (!obisValueResult.rawValue)
                    return;
                // value properties
                const obisValuePropertiesDataResult = (_s = structureLevel3Result.results) === null || _s === void 0 ? void 0 : _s[2];
                if (!this.areResultNamesOk(obisValuePropertiesDataResult, '', 'Data'))
                    return;
                const obisValuePropertiesStructureResult = (_t = obisValuePropertiesDataResult.results) === null || _t === void 0 ? void 0 : _t[0];
                if (!this.areResultNamesOk(obisValuePropertiesStructureResult, 'structure', 'SEQUENCE OF'))
                    return;
                // scale (exponent)
                const obisValueScaleDataResult = (_u = obisValuePropertiesStructureResult.results) === null || _u === void 0 ? void 0 : _u[0];
                if (!this.areResultNamesOk(obisValueScaleDataResult, '', 'Data'))
                    return;
                const obisValueScaleIntegerResult = (_v = obisValueScaleDataResult.results) === null || _v === void 0 ? void 0 : _v[0];
                if (!this.areResultNamesOk(obisValueScaleIntegerResult, 'integer', 'Integer8'))
                    return;
                const obisValueScaleResult = (_w = obisValueScaleIntegerResult.results) === null || _w === void 0 ? void 0 : _w[0];
                if (!this.areResultNamesOk(obisValueScaleResult, '', 'INTEGER'))
                    return;
                if (!obisValueScaleResult.rawValue)
                    return;
                // unit
                const obisValueUnitDataResult = (_x = obisValuePropertiesStructureResult.results) === null || _x === void 0 ? void 0 : _x[1];
                if (!this.areResultNamesOk(obisValueUnitDataResult, '', 'Data'))
                    return;
                const obisValueUnitEnumResult = (_y = obisValueUnitDataResult.results) === null || _y === void 0 ? void 0 : _y[0];
                if (!this.areResultNamesOk(obisValueUnitEnumResult, 'enum', 'Unsigned8'))
                    return;
                const obisValueUnitResult = (_z = obisValueUnitEnumResult.results) === null || _z === void 0 ? void 0 : _z[0];
                if (!this.areResultNamesOk(obisValueUnitResult, '', 'INTEGER'))
                    return;
                if (!obisValueUnitResult.rawValue)
                    return;
                let numberValue = ((_0 = obisValueResult.numberValue) !== null && _0 !== void 0 ? _0 : 0);
                const scale = (_1 = obisValueScaleResult.numberValue) !== null && _1 !== void 0 ? _1 : 0;
                if (scale != 0) {
                    // numberValue *= (10**(obisValueScaleResult.numberValue ?? 0));
                    // let round = 0;
                    // if(scale < 0) {
                    //
                    // }
                    // less rounding issues:
                    let scaleTmp = scale;
                    while (scaleTmp > 0) {
                        numberValue *= 10;
                        scaleTmp--;
                    }
                    while (scaleTmp < 0) {
                        numberValue /= 10;
                        scaleTmp++;
                    }
                }
                const obisValue = {
                    obisCode: obisCode.code,
                    obisFullName: obisCode.fullName,
                    obisName: obisCode.name,
                    numberValue: numberValue,
                    stringValue: `${numberValue} ${obisValueUnitResult.stringValue}`,
                    unit: (_2 = obisValueUnitResult.stringValue) !== null && _2 !== void 0 ? _2 : '',
                    obisRaw: {
                        obisCodeRaw: obisCodeResult.rawValue,
                        valueRaw: obisValueResult.rawValue,
                        numberValue: obisValueResult.numberValue,
                        scaling: obisValueScaleResult.numberValue
                    },
                };
                obisValues.push(obisValue);
            }
        }
        return {
            obisValues
        };
    }
}
exports.CosemObisDataProcessor = CosemObisDataProcessor;


/***/ }),

/***/ 770:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Occurrence = exports.BlockMode = void 0;
var BlockMode;
(function (BlockMode) {
    BlockMode[BlockMode["none"] = 0] = "none";
    BlockMode[BlockMode["single"] = 1] = "single";
    BlockMode[BlockMode["choice"] = 2] = "choice";
    BlockMode[BlockMode["sequence"] = 3] = "sequence";
    BlockMode[BlockMode["enumerated"] = 4] = "enumerated";
    BlockMode[BlockMode["bitString"] = 5] = "bitString";
})(BlockMode = exports.BlockMode || (exports.BlockMode = {}));
// export interface DefinitionBlockModeNames {
// 	[key:string]: DefinitionBlockMode
// }
// export const definitionModeNames: DefinitionBlockModeNames = {
// 	'CHOICE': DefinitionBlockMode.choice,
// 	'SEQUENCE': DefinitionBlockMode.sequence
// }
var Occurrence;
(function (Occurrence) {
    Occurrence[Occurrence["none"] = 0] = "none";
    Occurrence[Occurrence["implicit"] = 1] = "implicit";
    Occurrence[Occurrence["explicit"] = 2] = "explicit";
})(Occurrence = exports.Occurrence || (exports.Occurrence = {}));


/***/ }),

/***/ 782:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.asn1DataTypes = exports.Asn1GeneralizedTime = exports.Asn1Null = exports.Asn1Utf8String = exports.Asn1BNumericString = exports.Asn1VisibleString = exports.Asn1Ia5String = exports.Asn1Choice = exports.Asn1SequenceOf = exports.Asn1Sequence = exports.Asn1ObjectIdentifier = exports.Asn1Enumerated = exports.Asn1Real = exports.Asn1DateTime = exports.Asn1TimeOfDay = exports.Asn1Date = exports.Asn1OctetString = exports.Asn1BitString = exports.Asn1Integer = exports.Asn1Boolean = exports.Asn1DataType = exports.Result = exports.CosemResultType = exports.Asn1ResultType = exports.Asn1LengthType = void 0;
const enums_1 = __webpack_require__(770);
var Asn1LengthType;
(function (Asn1LengthType) {
    Asn1LengthType[Asn1LengthType["fixed"] = 0] = "fixed";
    Asn1LengthType[Asn1LengthType["data"] = 1] = "data";
    Asn1LengthType[Asn1LengthType["parameter"] = 2] = "parameter";
})(Asn1LengthType = exports.Asn1LengthType || (exports.Asn1LengthType = {}));
var Asn1ResultType;
(function (Asn1ResultType) {
    Asn1ResultType[Asn1ResultType["typeNumber"] = 0] = "typeNumber";
    Asn1ResultType[Asn1ResultType["typeString"] = 1] = "typeString";
    Asn1ResultType[Asn1ResultType["properties"] = 2] = "properties";
    Asn1ResultType[Asn1ResultType["subType"] = 3] = "subType";
    Asn1ResultType[Asn1ResultType["container"] = 4] = "container";
})(Asn1ResultType = exports.Asn1ResultType || (exports.Asn1ResultType = {}));
var CosemResultType;
(function (CosemResultType) {
    CosemResultType[CosemResultType["typeNumber"] = 0] = "typeNumber";
    CosemResultType[CosemResultType["typeString"] = 1] = "typeString";
    CosemResultType[CosemResultType["typeDate"] = 2] = "typeDate";
    CosemResultType[CosemResultType["typeObisKey"] = 3] = "typeObisKey";
})(CosemResultType = exports.CosemResultType || (exports.CosemResultType = {}));
class Result {
    constructor(init) {
        this.propertyName = '';
        this.dataLength = 0;
        this.encodingLength = 0;
        this.count = undefined;
        this.hexString = '';
        //public typeParameter: string | undefined;
        this.results = [];
        if (init.propertyName != undefined)
            this.propertyName = init.propertyName;
        if (init.typeName != undefined)
            this.typeName = init.typeName;
        if (init.dataLength != undefined)
            this.dataLength = init.dataLength;
        if (init.encodingLength != undefined)
            this.encodingLength = init.encodingLength;
        if (init.count != undefined)
            this.count = init.count;
        if (init.rawValue != undefined)
            this.rawValue = init.rawValue;
        if (init.hexString != undefined)
            this.hexString = init.hexString;
        if (init.asn1ResultType != undefined)
            this.asn1ResultType = init.asn1ResultType;
        //if(init.cosemResultType != undefined) this.cosemResultType = init.cosemResultType
        if (init.numberValue != undefined)
            this.numberValue = init.numberValue;
        if (init.stringValue != undefined)
            this.stringValue = init.stringValue;
        if (init.dateTimeValue != undefined)
            this.dateTimeValue = init.dateTimeValue;
        if (init.subType != undefined)
            this.subType = init.subType;
        //if(init.typeParameter != undefined) this.typeParameter = init.typeParameter
        if (init.results != undefined)
            this.results = init.results;
    }
    addSubResult(subResult) {
        if (!subResult)
            return;
        // if(this.results == undefined) {
        // 	this.results = [subResult];
        // 	return;
        // }
        this.results.push(subResult);
        return;
    }
}
exports.Result = Result;
class Asn1DataType {
    constructor(typeName) {
        this.typeName = typeName;
    }
    getLengthType() {
        return Asn1LengthType.fixed;
    }
    hasSubType() {
        return false;
    }
    getLengthAndValue(propertyName, rawData, index, subType, typeParameter, parentOccurrence, ancestorOccurrence, enrichData) {
        console.error(`${this.constructor.name}.getLengthAndValueFromData() not implemented for ${name}`);
        return undefined;
    }
    static getOccurrence(parentOccurrence, ancestorOccurrence) {
        return parentOccurrence != enums_1.Occurrence.none ? parentOccurrence : ancestorOccurrence;
    }
    getDateTime(rawValue, validYearFrom, validYearTo, validYearDeviation) {
        // DLMS/COSEM/OBIS Blue Book 4.1.6.1 Date formats
        // not-specified handling not implemented
        if (rawValue.length != 12)
            return;
        if (validYearDeviation) {
            const thisYear = new Date().getFullYear();
            const min = thisYear - validYearDeviation;
            const max = thisYear + validYearDeviation;
            if (validYearFrom == undefined || validYearFrom > min) {
                validYearFrom = min;
            }
            if (validYearTo == undefined || validYearTo < max) {
                validYearTo = max;
            }
        }
        const year = rawValue.readUInt16BE(0);
        if (validYearFrom && year < validYearFrom)
            return;
        if (validYearTo && year > validYearTo)
            return;
        const month = rawValue.readUint8(2);
        if (month > 12)
            return;
        const day = rawValue.readUint8(3);
        if (day > 31)
            return;
        const dayOfWeek = rawValue.readUint8(4); // 1 .. 7 => Monday .. Sunday
        if (dayOfWeek > 7)
            return;
        const hour = rawValue.readUint8(5);
        if (hour > 23)
            return;
        const minute = rawValue.readUint8(6);
        if (minute > 59)
            return;
        const second = rawValue.readUint8(7);
        if (second > 60)
            return; // leap seconds?
        const hundredthsOfSecond = rawValue.readUint8(8);
        if (hundredthsOfSecond > 100)
            return;
        let deviation = rawValue.readInt16BE(9);
        const clockStatusRaw = rawValue.readUint8(11);
        const date = new Date(year, month - 1, day, hour, minute, second, hundredthsOfSecond * 10);
        const epoch = date.getTime();
        if (rawValue.readUInt16BE(9) == 0x800) {
            deviation = undefined;
        }
        let clockStatus;
        if (clockStatusRaw != 0xFF) {
            clockStatus = this.getClockStatus(clockStatusRaw);
        }
        return {
            date,
            epoch,
            asString: date.toLocaleString('sv'),
            deviation,
            clockStatus,
        };
    }
    getClockStatus(clockStatusRaw) {
        return {
            clockStatusRaw,
            invalid: (clockStatusRaw & 0b00000001) == 0b00000001,
            doubtful: (clockStatusRaw & 0b00000010) == 0b00000010,
            differentClockBase: (clockStatusRaw & 0b00000100) == 0b00000100,
            invalidClockStatus: (clockStatusRaw & 0b00001000) == 0b00001000,
            daylightSavingActive: (clockStatusRaw & 0b10000000) == 0b10000000,
        };
    }
}
exports.Asn1DataType = Asn1DataType;
class Asn1Boolean extends Asn1DataType {
    getLength() {
        return 1;
    }
}
exports.Asn1Boolean = Asn1Boolean;
class Asn1Integer extends Asn1DataType {
    getLengthType() {
        return Asn1LengthType.parameter;
    }
    getLengthAndValue(propertyName, rawData, index, subType, typeParameter, parentOccurrence, ancestorOccurrence, enrichData) {
        parentOccurrence = Asn1DataType.getOccurrence(parentOccurrence, ancestorOccurrence);
        if (parentOccurrence != enums_1.Occurrence.implicit) {
            console.error('Asn1Integer.getLengthAndValue: IMPLICIT only implemented.');
            return undefined;
        }
        //(0..4294967295)
        if (!typeParameter) {
            console.error('Asn1Integer.getLengthAndValue: typeParameter missing.');
            return undefined;
        }
        const matches = typeParameter.match(/^\((-?\d+)\.\.(-?\d+)\)/);
        if (!matches || matches.length != 3) {
            console.error(`Asn1Integer.getLengthAndValue: invalid parameter ${typeParameter}.`);
            return undefined;
        }
        const min = +matches[1];
        const max = +matches[2];
        const count = max - min;
        let length = 0;
        if (count <= 256) {
            length = 1;
        }
        else if (count <= 65536) {
            length = 2;
            // } else if(count <= 16777216) {
            // 	console.error(`Asn1Integer.getLengthAndValueFromParameter: 3 Byte Integer not implemented. ${parameter}. Unsure if exists`)
            // 	return undefined;
        }
        else if (count <= 4294967296) {
            length = 4;
        }
        else if (count <= 4294967296 * 4294967296) {
            //length = 8;
            console.error(`Asn1Integer.getLengthAndValue: 64 bit integer not implemented. ${typeParameter}.`);
            return undefined;
        }
        const rawValue = rawData.subarray(index, index + length);
        let numberValue = 0;
        if (min == 0) {
            switch (length) {
                case 1:
                    numberValue = rawValue.readUint8();
                    break;
                case 2:
                    numberValue = rawValue.readUint16BE();
                    break;
                case 4:
                    numberValue = rawValue.readUint32BE();
                    break;
                //case 8: bigNumberValue = rawValue.readBigUInt64BE(); break;
                default:
                    console.error(`Asn1Integer.getLengthAndValue: Invalid length for unsigned. ${typeParameter}.`);
                    return undefined;
            }
        }
        else if (-min == max + 1) {
            switch (length) {
                case 1:
                    numberValue = rawValue.readInt8();
                    break;
                case 2:
                    numberValue = rawValue.readInt16BE();
                    break;
                case 4:
                    numberValue = rawValue.readInt32BE();
                    break;
                //case 8: bigNumberValue = rawValue.readBigUInt64BE(); break;
                default:
                    console.error(`Asn1Integer.getLengthAndValue: Invalid length for signed. ${typeParameter}.`);
                    return undefined;
            }
        }
        const resultPartial = {
            propertyName,
            typeName: this.typeName,
            dataLength: length,
            encodingLength: length,
            rawValue,
            hexString: rawValue.toString('hex'),
            asn1ResultType: Asn1ResultType.typeNumber,
            numberValue,
        };
        if (enrichData) {
            enrichData(resultPartial);
        }
        return new Result(resultPartial);
    }
}
exports.Asn1Integer = Asn1Integer;
class Asn1BitString extends Asn1DataType {
    getLengthType() {
        return Asn1LengthType.parameter;
    }
}
exports.Asn1BitString = Asn1BitString;
class Asn1OctetString extends Asn1DataType {
    getLengthType() {
        return Asn1LengthType.data;
    }
    getLengthAndValue(propertyName, rawData, index, subType, typeParameter, parentOccurrence, ancestorOccurrence, enrichData) {
        parentOccurrence = Asn1DataType.getOccurrence(parentOccurrence, ancestorOccurrence);
        if (parentOccurrence != enums_1.Occurrence.implicit) {
            console.error('Asn1OctetString.getLengthAndValue: IMPLICIT only implemented.');
            return undefined;
        }
        let length = rawData.readInt8(index);
        if (length > 127) {
            console.error(`Asn1OctetString.getLengthAndValue: First byte > 127 (${length}). Maybe special encoding applies if first bit is set.`);
            return undefined;
        }
        const rawValue = rawData.subarray(index + 1, index + 1 + length);
        if (enrichData) {
            console.warn('Asn1OctetString.getLengthAndValue: enrichData not implemented');
        }
        return new Result({
            propertyName,
            typeName: this.typeName,
            dataLength: length,
            encodingLength: length + 1,
            rawValue,
            hexString: rawValue.toString('hex'),
            asn1ResultType: Asn1ResultType.typeString,
            stringValue: this.toString(rawValue),
            // The smart meter sends datetime values but one with a property name 'octet-string' instead of 'date-time'
            // Only the OBIS identifier hints to a datetime, but at this stage we cannot make this connection.
            // So we try to convert to datetime anyway:
            dateTimeValue: this.getDateTime(rawValue, undefined, undefined, 10),
        });
    }
    isPrintableString(rawValue) {
        for (const byte of rawValue) {
            if (byte < 32)
                return false;
            if (byte > 127)
                return false;
        }
        return true;
    }
    toString(rawValue) {
        if (this.isPrintableString(rawValue)) {
            return rawValue.toString();
        }
        // const numbersAsString = [];
        // for(const byte of rawValue) {
        // 	numbersAsString.push(byte)
        // }
        // return numbersAsString.join(' ');
        let numberString = '';
        const len = rawValue.length;
        if (len > 0) {
            numberString = rawValue[0].toString();
            for (let i = 1; i < len; i++) {
                numberString += ` ${rawValue[i]}`;
            }
        }
        return numberString;
    }
}
exports.Asn1OctetString = Asn1OctetString;
class Asn1Date extends Asn1DataType {
}
exports.Asn1Date = Asn1Date;
class Asn1TimeOfDay extends Asn1DataType {
}
exports.Asn1TimeOfDay = Asn1TimeOfDay;
class Asn1DateTime extends Asn1DataType {
}
exports.Asn1DateTime = Asn1DateTime;
class Asn1Real extends Asn1DataType {
}
exports.Asn1Real = Asn1Real;
class Asn1Enumerated extends Asn1DataType {
}
exports.Asn1Enumerated = Asn1Enumerated;
class Asn1ObjectIdentifier extends Asn1DataType {
}
exports.Asn1ObjectIdentifier = Asn1ObjectIdentifier;
class Asn1Sequence extends Asn1DataType {
}
exports.Asn1Sequence = Asn1Sequence;
class Asn1SequenceOf extends Asn1DataType {
    getLengthType() {
        return Asn1LengthType.data;
    }
    hasSubType() {
        return true;
    }
    getLengthAndValue(propertyName, rawData, index, subType, typeParameter, parentOccurrence, ancestorOccurrence, enrichData) {
        parentOccurrence = Asn1DataType.getOccurrence(parentOccurrence, ancestorOccurrence);
        if (parentOccurrence != enums_1.Occurrence.implicit) {
            console.error('Asn1SequenceOf.getLengthAndValue: IMPLICIT only implemented.');
            return undefined;
        }
        let count = rawData.readInt8(index);
        if (count > 127) {
            console.error(`Asn1SequenceOf.getLengthAndValue: First byte > 127 (${length}). Maybe special encoding applies if first bit is set.`);
            return undefined;
        }
        const rawValue = rawData.subarray(index, index + 1); // only length
        if (enrichData) {
            console.warn('Asn1OctetString.getLengthAndValue: enrichData not valid here');
        }
        return new Result({
            propertyName,
            typeName: this.typeName,
            dataLength: 0,
            encodingLength: 1,
            count,
            rawValue,
            hexString: rawValue.toString('hex'),
            asn1ResultType: Asn1ResultType.subType,
            subType
        });
    }
}
exports.Asn1SequenceOf = Asn1SequenceOf;
class Asn1Choice extends Asn1DataType {
}
exports.Asn1Choice = Asn1Choice;
class Asn1Ia5String extends Asn1DataType {
}
exports.Asn1Ia5String = Asn1Ia5String;
class Asn1VisibleString extends Asn1DataType {
}
exports.Asn1VisibleString = Asn1VisibleString;
class Asn1BNumericString extends Asn1DataType {
}
exports.Asn1BNumericString = Asn1BNumericString;
class Asn1Utf8String extends Asn1DataType {
}
exports.Asn1Utf8String = Asn1Utf8String;
class Asn1Null extends Asn1DataType {
}
exports.Asn1Null = Asn1Null;
class Asn1GeneralizedTime extends Asn1DataType {
}
exports.Asn1GeneralizedTime = Asn1GeneralizedTime;
exports.asn1DataTypes = new Map([
    ['BOOLEAN', new Asn1Boolean('BOOLEAN')],
    ['INTEGER', new Asn1Integer('INTEGER')],
    ['BIT STRING', new Asn1BitString('BIT STRING')],
    ['OCTET STRING', new Asn1OctetString('OCTET STRING')],
    ['DATE', new Asn1Date('DATE')],
    ['TIME-OF-DAY', new Asn1TimeOfDay('TIME-OF-DAY')],
    ['DATE-TIME', new Asn1DateTime('DATE-TIME')],
    ['REAL', new Asn1Real('REAL')],
    ['ENUMERATED', new Asn1Enumerated('ENUMERATED')],
    ['OBJECT IDENTIFIER', new Asn1ObjectIdentifier('OBJECT IDENTIFIER')],
    ['SEQUENCE', new Asn1Sequence('SEQUENCE')],
    ['SEQUENCE OF', new Asn1SequenceOf('SEQUENCE OF')],
    ['CHOICE', new Asn1Choice('CHOICE')],
    ['IA5String', new Asn1Ia5String('IA5String')],
    ['VisibleString', new Asn1VisibleString('VisibleString')],
    ['NumericString', new Asn1BNumericString('NumericString')],
    ['UTF8String', new Asn1Utf8String('UTF8String')],
    ['NULL', new Asn1Null('NULL')],
    ['GeneralizedTime', new Asn1GeneralizedTime('GeneralizedTime')]
]);


/***/ }),

/***/ 455:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BitString = void 0;
class BitString {
    constructor(name, bit) {
        this.name = name;
        this.bit = bit;
    }
}
exports.BitString = BitString;


/***/ }),

/***/ 185:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.cosemEnumUnitMap = void 0;
// Cosem Blue Book Edition 14 Chapter 4.3.2 Table 4
exports.cosemEnumUnitMap = new Map([
    [1, { enum: 1, unit: 'a', quantity: 'time', unitName: 'year ', siDefinition: '', comment: '' }],
    [2, { enum: 2, unit: 'mo', quantity: 'time', unitName: 'month ', siDefinition: '', comment: '' }],
    [3, { enum: 3, unit: 'wk', quantity: 'time', unitName: 'week', siDefinition: '7*24*60*60 s ', comment: '' }],
    [4, { enum: 4, unit: 'd', quantity: 'time', unitName: 'day', siDefinition: '24*60*60 s ', comment: '' }],
    [5, { enum: 5, unit: 'h', quantity: 'time', unitName: 'hour', siDefinition: '60*60 s ', comment: '' }],
    [6, { enum: 6, unit: 'min', quantity: 'time', unitName: 'minute', siDefinition: '60 s ', comment: '' }],
    [7, { enum: 7, unit: 's', quantity: 'time (t)', unitName: 'second', siDefinition: 's ', comment: '' }],
    [8, { enum: 8, unit: '°', quantity: '(phase) angle', unitName: 'degree', siDefinition: 'rad*180/π ', comment: '' }],
    [9, { enum: 9, unit: '°C', quantity: 'temperature (T)', unitName: 'degree-celsius', siDefinition: 'K-273.15 ', comment: '' }],
    [10, { enum: 10, unit: 'currency', quantity: '(local) currency ', unitName: '', siDefinition: '', comment: '' }],
    [11, { enum: 11, unit: 'm', quantity: 'length (l)', unitName: 'metre', siDefinition: 'm ', comment: '' }],
    [12, { enum: 12, unit: 'm/s', quantity: 'speed (v)', unitName: 'metre per second', siDefinition: 'ms-1 ', comment: '' }],
    [13, { enum: 13, unit: 'm3', quantity: 'volume (V) rV, meter constant or pulse value (volume) ', unitName: 'cubic metre', siDefinition: 'm3 ', comment: '' }],
    [14, { enum: 14, unit: 'm3', quantity: 'corrected volume a', unitName: 'cubic metre', siDefinition: 'm3 ', comment: '' }],
    [15, { enum: 15, unit: 'm3/h', quantity: 'volume flux', unitName: 'cubic metre per hour', siDefinition: 'm3s-1/(60*60) ', comment: '' }],
    [16, { enum: 16, unit: 'm3/h', quantity: 'corrected volume flux a', unitName: 'cubic metre per hour', siDefinition: 'm3s-1/(60*60) ', comment: '' }],
    [17, { enum: 17, unit: 'm3/d', quantity: 'volume flux', unitName: 'cubic metre per day', siDefinition: 'm3s-1/(24*60*60) ', comment: '' }],
    [18, { enum: 18, unit: 'm3/d', quantity: 'corrected volume flux a', unitName: 'cubic metre per day', siDefinition: 'm3s-1/(60*60) ', comment: '' }],
    [19, { enum: 19, unit: 'l', quantity: 'volume', unitName: 'litre', siDefinition: '10-3 m3 ', comment: '' }],
    [20, { enum: 20, unit: 'kg', quantity: 'mass (m)', unitName: 'kilogram ', siDefinition: '', comment: '' }],
    [21, { enum: 21, unit: 'N', quantity: 'force (F)', unitName: 'newton', siDefinition: 'N = kg.m.s-2 ', comment: '' }],
    [22, { enum: 22, unit: 'Nm', quantity: 'energy', unitName: 'newton meter', siDefinition: 'J = Nm = Ws ', comment: '' }],
    [23, { enum: 23, unit: 'Pa', quantity: 'pressure (p)', unitName: 'pascal', siDefinition: 'N/m2 ', comment: '' }],
    [24, { enum: 24, unit: 'bar', quantity: 'pressure (p)', unitName: 'bar', siDefinition: '105 Nm-2 ', comment: '' }],
    [25, { enum: 25, unit: 'J', quantity: 'energy', unitName: 'joule', siDefinition: 'J = Nm = Ws ', comment: '' }],
    [26, { enum: 26, unit: 'J/h', quantity: 'thermal power, rate of change', unitName: 'joule per hour', siDefinition: 'Js-1/(60*60) ', comment: '' }],
    [27, { enum: 27, unit: 'W', quantity: 'active power (P)', unitName: 'watt', siDefinition: 'W = Js-1 ', comment: '' }],
    [28, { enum: 28, unit: 'VA', quantity: 'apparent power (S)', unitName: 'volt-ampere ', siDefinition: '', comment: '' }],
    [29, { enum: 29, unit: 'var', quantity: 'reactive power (Q)', unitName: 'var ', siDefinition: '', comment: '' }],
    [30, { enum: 30, unit: 'Wh', quantity: 'active energy rW, active energy meter constant or pulse value', unitName: 'watt-hour', siDefinition: 'Ws*(60*60) ', comment: '' }],
    [31, { enum: 31, unit: 'VAh', quantity: 'apparent energy rS, apparent energy meter constant or pulse value', unitName: 'volt-ampere-hour', siDefinition: 'VAs*(60*60) ', comment: '' }],
    [32, { enum: 32, unit: 'varh', quantity: 'reactive energy rB, reactive energy meter constant or pulse value', unitName: 'var-hour', siDefinition: 'var s *(60*60s ', comment: '' }],
    [33, { enum: 33, unit: 'A', quantity: 'current (I)', unitName: 'ampere', siDefinition: 'A ', comment: '' }],
    [34, { enum: 34, unit: 'C', quantity: 'electrical charge (Q)', unitName: 'coulomb', siDefinition: 'C = As ', comment: '' }],
    [35, { enum: 35, unit: 'V', quantity: 'voltage (U)', unitName: 'volt', siDefinition: 'V ', comment: '' }],
    [36, { enum: 36, unit: 'V/m', quantity: 'electric field strength (E)', unitName: 'volt per metre', siDefinition: 'Vm-1 ', comment: '' }],
    [37, { enum: 37, unit: 'F', quantity: 'capacitance (C)', unitName: 'farad', siDefinition: 'CV-1 = AsV-1 ', comment: '' }],
    [38, { enum: 38, unit: 'Ω', quantity: 'resistance (R)', unitName: 'ohm', siDefinition: 'Ω = VA-1 ', comment: '' }],
    [39, { enum: 39, unit: 'Ωm2/m', quantity: 'resistivity (ρ)', unitName: 'm ', siDefinition: '', comment: '' }],
    [40, { enum: 40, unit: 'Wb', quantity: 'magnetic flux (Φ)', unitName: 'weber', siDefinition: 'Wb = Vs ', comment: '' }],
    [41, { enum: 41, unit: 'T', quantity: 'magnetic flux density (B)', unitName: 'tesla', siDefinition: 'Wbm-2 ', comment: '' }],
    [42, { enum: 42, unit: 'A/m', quantity: 'magnetic field strength (H)', unitName: 'ampere per metre', siDefinition: 'Am-1 ', comment: '' }],
    [43, { enum: 43, unit: 'H', quantity: 'inductance (L)', unitName: 'henry', siDefinition: 'H = WbA-1 ', comment: '' }],
    [44, { enum: 44, unit: 'Hz', quantity: 'frequency (f, ω)', unitName: 'hertz', siDefinition: 's-1 ', comment: '' }],
    [45, { enum: 45, unit: '1/(Wh)', quantity: 'RW, active energy meter constant or pulse value ', unitName: '', siDefinition: '', comment: '' }],
    [46, { enum: 46, unit: '1/(varh)', quantity: 'RB, reactive energy meter constant or pulse value ', unitName: '', siDefinition: '', comment: '' }],
    [47, { enum: 47, unit: '1/(VAh)', quantity: 'RS, apparent energy meter constant or pulse value ', unitName: '', siDefinition: '', comment: '' }],
    [48, { enum: 48, unit: 'V2h', quantity: 'volt-squared hour, rU2h, volt-squared hour meter constant or pulse value', unitName: 'volt-squared-hours', siDefinition: 'V2s-1 /(60*60) ', comment: '' }],
    [49, { enum: 49, unit: 'A2h', quantity: 'ampere-squared hour, rI2h, ampere-squared hour meter constant or pulse value ', unitName: 'ampere-squared hours', siDefinition: 'A2 s-1 /(60*60) ', comment: '' }],
    [50, { enum: 50, unit: 'kg/s', quantity: 'mass flux', unitName: 'kilogram per second', siDefinition: 'kg s-1 ', comment: '' }],
    [51, { enum: 51, unit: 'S, mho', quantity: 'conductance', unitName: 'siemens', siDefinition: 'Ω-1 ', comment: '' }],
    [52, { enum: 52, unit: 'K', quantity: 'temperature (T)', unitName: 'kelvin ', siDefinition: '', comment: '' }],
    [53, { enum: 53, unit: '1/(V2h)', quantity: 'RU2h, volt-squared hour meter constant or pulse value ', unitName: '', siDefinition: '', comment: '' }],
    [54, { enum: 54, unit: '1/(A2h)', quantity: 'RI2h, ampere-squared hour meter constant or pulse value ', unitName: '', siDefinition: '', comment: '' }],
    [55, { enum: 55, unit: '1/m3', quantity: 'RV, meter constant or pulse value (volume) ', unitName: '', siDefinition: '', comment: '' }],
    [56, { enum: 56, unit: 'percentage', quantity: '% ', unitName: '', siDefinition: '', comment: '' }],
    [57, { enum: 57, unit: 'Ah', quantity: 'ampere-hours', unitName: 'Ampere-hour ', siDefinition: '', comment: '' }],
    [60, { enum: 60, unit: 'Wh/m3', quantity: 'energy per volume', unitName: '3,6*103 J/m3 ', siDefinition: '', comment: '' }],
    [61, { enum: 61, unit: 'J/m3', quantity: 'calorific value, wobbe ', unitName: '', siDefinition: '', comment: '' }],
    [62, { enum: 62, unit: 'Mol %', quantity: 'molar fraction of gas composition', unitName: 'mole percent', siDefinition: '', comment: '' }],
    [63, { enum: 63, unit: 'g/m3', quantity: 'mass density, quantity of material', unitName: '', siDefinition: '', comment: '' }],
    [64, { enum: 64, unit: 'Pa s', quantity: 'dynamic viscosity', unitName: 'pascal second', siDefinition: '', comment: '' }],
    [65, { enum: 65, unit: 'J/kg ', quantity: 'specific energy NOTE The amount of energy per unit of mass of a substance ', unitName: 'Joule / kilogram', siDefinition: 'm2 . kg . s -2 / kg = m2 . s –2 ', comment: '' }],
    [66, { enum: 66, unit: 'g/cm²', quantity: 'pressure', unitName: 'gram per square centimeter', siDefinition: '98,066 5 Pa ', comment: '' }],
    [67, { enum: 67, unit: 'atm', quantity: 'pressure', unitName: 'atmosphere', siDefinition: '101,325*103 Pa ', comment: '' }],
    [70, { enum: 70, unit: 'dBm', quantity: 'signal strength, dB milliwatt (e.g. of GSM radio systems) ', unitName: '', siDefinition: '', comment: '' }],
    [71, { enum: 71, unit: 'dbµV', quantity: 'signal strength, dB microvolt ', unitName: '', siDefinition: '', comment: '' }],
    [72, { enum: 72, unit: 'dB', quantity: 'logarithmic unit that expresses the ratio between two values of a physical quantity ', unitName: '', siDefinition: '', comment: '' }],
    [128, { enum: 128, unit: 'in', quantity: 'length (l)', unitName: 'inch ', siDefinition: '', comment: '' }],
    [129, { enum: 129, unit: 'ft', quantity: 'length (l)', unitName: 'foot ', siDefinition: '', comment: '' }],
    [130, { enum: 130, unit: 'lb', quantity: 'mass (m)', unitName: 'pound ', siDefinition: '', comment: '' }],
    [131, { enum: 131, unit: '°F', quantity: 'temperature', unitName: 'degree Fahrenheit ', siDefinition: '', comment: '' }],
    [132, { enum: 132, unit: '°R', quantity: 'temperature', unitName: 'degree Rankine ', siDefinition: '', comment: '' }],
    [133, { enum: 133, unit: 'sq. in', quantity: 'area', unitName: 'square inch ', siDefinition: '', comment: '' }],
    [134, { enum: 134, unit: 'sq ft', quantity: 'area', unitName: 'square foot ', siDefinition: '', comment: '' }],
    [135, { enum: 135, unit: 'ac', quantity: 'area', unitName: 'acre ', siDefinition: '', comment: '' }],
    [136, { enum: 136, unit: 'cu in', quantity: 'volume', unitName: 'cubic inch ', siDefinition: '', comment: '' }],
    [137, { enum: 137, unit: 'cu ft', quantity: 'volume', unitName: 'cubic foot ', siDefinition: '', comment: '' }],
    [138, { enum: 138, unit: 'ac ft', quantity: 'volume', unitName: 'acre-foot ', siDefinition: '', comment: '' }],
    [139, { enum: 139, unit: 'gal (imp)', quantity: 'volume', unitName: 'gallon (imperial) ', siDefinition: '', comment: '' }],
    [140, { enum: 140, unit: 'gal (US)', quantity: 'volume', unitName: 'gallon (US) ', siDefinition: '', comment: '' }],
    [141, { enum: 141, unit: 'lbf', quantity: 'force', unitName: 'pound force ', siDefinition: '', comment: '' }],
    [142, { enum: 142, unit: 'psi', quantity: 'pressure (p)', unitName: 'Pound force per square inch ', siDefinition: '', comment: '' }],
    [143, { enum: 143, unit: 'lb/cu ft', quantity: 'density', unitName: 'pound per cubic foot ', siDefinition: '', comment: '' }],
    [144, { enum: 144, unit: 'lb/(ft .s)', quantity: 'dynamic viscosity', unitName: 'pound per (foot . second) ', siDefinition: '', comment: '' }],
    [145, { enum: 145, unit: 'sq ft/s', quantity: 'kinematic viscosity', unitName: 'square foot per second ', siDefinition: '', comment: '' }],
    [146, { enum: 146, unit: 'Btu', quantity: 'energy', unitName: 'British thermal unit ', siDefinition: '', comment: '' }],
    [147, { enum: 147, unit: 'thm(EC)', quantity: 'energy', unitName: 'Therm(EU) ', siDefinition: '', comment: '' }],
    [148, { enum: 148, unit: 'thm(US)', quantity: 'energy', unitName: 'Therm(US) ', siDefinition: '', comment: '' }],
    [149, { enum: 149, unit: 'Btu/lb', quantity: 'calorific value of mass, enthalpy', unitName: 'British thermal unit per pound ', siDefinition: '', comment: '' }],
    [150, { enum: 150, unit: 'Btu/cu ft', quantity: 'calorific value of volume, wobbe ', unitName: 'British thermal unit per cubic foot ', siDefinition: '', comment: '' }],
    [151, { enum: 151, unit: 'cu ft', quantity: 'volume (V) rv, meter constant or pulse value (volume)', unitName: 'cubic feet ', siDefinition: '', comment: '' }],
    [152, { enum: 152, unit: 'ft/s', quantity: 'speed (v)', unitName: 'foot per second ', siDefinition: '', comment: '' }],
    [153, { enum: 153, unit: 'cu ft/s', quantity: 'volume flux', unitName: 'cubic foot per second ', siDefinition: '', comment: '' }],
    [154, { enum: 154, unit: 'cu ft/min', quantity: 'volume flux', unitName: 'cubic foot per min ', siDefinition: '', comment: '' }],
    [155, { enum: 155, unit: 'cu ft/h', quantity: 'volume flux', unitName: 'cubic foot per hour ', siDefinition: '', comment: '' }],
    [156, { enum: 156, unit: 'cu ft/d', quantity: 'volume flux', unitName: 'cubic foot per day ', siDefinition: '', comment: '' }],
    [157, { enum: 157, unit: 'ac ft/s', quantity: 'volume flux', unitName: 'acre foot per second ', siDefinition: '', comment: '' }],
    [158, { enum: 158, unit: 'ac ft/min', quantity: 'volume flux', unitName: 'acre foot per min ', siDefinition: '', comment: '' }],
    [159, { enum: 159, unit: 'ac ft/h', quantity: 'volume flux', unitName: 'acre foot per hour ', siDefinition: '', comment: '' }],
    [160, { enum: 160, unit: 'ac ft/d', quantity: 'volume flux', unitName: 'acre foot per day ', siDefinition: '', comment: '' }],
    [161, { enum: 161, unit: 'gal (imp)', quantity: 'volume (V) rv, meter constant or pulse value (volume)', unitName: 'imperial gallon ', siDefinition: '', comment: '' }],
    [162, { enum: 162, unit: 'gal (imp) / s', quantity: 'volume flux', unitName: 'imperial gallon per second ', siDefinition: '', comment: '' }],
    [163, { enum: 163, unit: 'gal (imp) / min', quantity: 'volume flux', unitName: 'imperial gallon per min ', siDefinition: '', comment: '' }],
    [164, { enum: 164, unit: 'gal (imp) / h', quantity: 'volume flux', unitName: 'imperial gallon per hour ', siDefinition: '', comment: '' }],
    [165, { enum: 165, unit: 'gal (imp) / d', quantity: 'volume flux', unitName: 'imperial gallon per day ', siDefinition: '', comment: '' }],
    [166, { enum: 166, unit: 'gal (US)', quantity: 'volume (V) rv, meter constant or pulse value (volume)', unitName: 'US gallon ', siDefinition: '', comment: '' }],
    [167, { enum: 167, unit: 'gal (US) / s', quantity: 'volume flux', unitName: 'US gallon per second ', siDefinition: '', comment: '' }],
    [168, { enum: 168, unit: 'gal (US) / min', quantity: 'volume flux', unitName: 'US gallon per min ', siDefinition: '', comment: '' }],
    [169, { enum: 169, unit: 'gal (US) / h', quantity: 'volume flux', unitName: 'US gallon per hour ', siDefinition: '', comment: '' }],
    [170, { enum: 170, unit: 'gal (US) / d', quantity: 'volume flux', unitName: 'US gallon per day ', siDefinition: '', comment: '' }],
    [171, { enum: 171, unit: 'Btu/s', quantity: 'energy flow, heat, power, change rate', unitName: 'British thermal unit per second ', siDefinition: '', comment: '' }],
    [172, { enum: 172, unit: 'Btu/min', quantity: 'energy flow, heat, power, change rate', unitName: 'British thermal unit per minute ', siDefinition: '', comment: '' }],
    [173, { enum: 173, unit: 'Btu/h', quantity: 'energy flow, heat, power, change rate', unitName: 'British thermal unit per hour ', siDefinition: '', comment: '' }],
    [174, { enum: 174, unit: 'Btu/d', quantity: 'energy flow, heat, power, change rate', unitName: 'British thermal unit per day ', siDefinition: '', comment: '' }],
    [253, { enum: 253, unit: 'extended table of units ', quantity: '', unitName: '', siDefinition: '', comment: '' }],
    [254, { enum: 254, unit: 'other', quantity: 'other unit ', unitName: '', siDefinition: '', comment: '' }],
    [255, { enum: 255, unit: 'count', quantity: 'no unit, unitless, count ', unitName: '', siDefinition: '', comment: '' }],
]);


/***/ }),

/***/ 773:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Enumeration = void 0;
class Enumeration {
    constructor(name, value) {
        this.name = name;
        this.value = value;
    }
}
exports.Enumeration = Enumeration;


/***/ }),

/***/ 343:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Property = void 0;
const enums_1 = __webpack_require__(770);
class Property {
    constructor(init) {
        var _a, _b, _c, _d, _e, _f, _g;
        this.name = (_a = init.name) !== null && _a !== void 0 ? _a : '';
        this.tag = init.tag;
        this.occurrence = (_b = init.occurrence) !== null && _b !== void 0 ? _b : enums_1.Occurrence.none;
        this.customType = (_c = init.customType) !== null && _c !== void 0 ? _c : '';
        this.asn1Type = (_d = init.asn1Type) !== null && _d !== void 0 ? _d : '';
        this.subType = (_e = init.subType) !== null && _e !== void 0 ? _e : '';
        this.typeParameter = (_f = init.typeParameter) !== null && _f !== void 0 ? _f : '';
        this.isOptional = (_g = init.isOptional) !== null && _g !== void 0 ? _g : false;
    }
}
exports.Property = Property;


/***/ }),

/***/ 823:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TypeDefinition = void 0;
const enums_1 = __webpack_require__(770);
class TypeDefinition {
    constructor(init) {
        var _a, _b, _c, _d;
        this.taggedProperties = {};
        this.enumerations = {};
        this.bitStrings = {};
        this.name = (_a = init.name) !== null && _a !== void 0 ? _a : '';
        this.blockMode = (_b = init.blockMode) !== null && _b !== void 0 ? _b : enums_1.BlockMode.none;
        this.occurrence = (_c = init.occurrence) !== null && _c !== void 0 ? _c : enums_1.Occurrence.none;
        this.tag = init.tag;
        this.customTag = init.customTag;
        this.customType = init.customType;
        this.asn1Type = init.asn1Type;
        this.typeParameter = init.typeParameter;
        this.properties = (_d = init.properties) !== null && _d !== void 0 ? _d : [];
        for (let property of this.properties) {
            if (property.tag != undefined) {
                this.taggedProperties[property.tag] = property;
            }
        }
        if (init.enumerations) {
            for (let enumeration of init.enumerations) {
                this.enumerations[enumeration.value] = enumeration;
            }
        }
        if (init.bitStrings) {
            for (let bitString of init.bitStrings) {
                this.bitStrings[bitString.bit] = bitString;
            }
        }
    }
}
exports.TypeDefinition = TypeDefinition;


/***/ }),

/***/ 111:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.cosemTypeDefinitionMap = void 0;
const enums_1 = __webpack_require__(770);
const type_definition_1 = __webpack_require__(823);
const property_1 = __webpack_require__(343);
const enumeration_1 = __webpack_require__(773);
const bit_string_1 = __webpack_require__(455);
const XDLMS_APDU = new type_definition_1.TypeDefinition({
    name: 'XDLMS-APDU',
    blockMode: enums_1.BlockMode.choice,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'initiateRequest', tag: 1, occurrence: enums_1.Occurrence.implicit, customType: 'InitiateRequest', }),
        new property_1.Property({ name: 'readRequest', tag: 5, occurrence: enums_1.Occurrence.implicit, customType: 'ReadRequest', }),
        new property_1.Property({ name: 'writeRequest', tag: 6, occurrence: enums_1.Occurrence.implicit, customType: 'WriteRequest', }),
        new property_1.Property({ name: 'initiateResponse', tag: 8, occurrence: enums_1.Occurrence.implicit, customType: 'InitiateResponse', }),
        new property_1.Property({ name: 'readResponse', tag: 12, occurrence: enums_1.Occurrence.implicit, customType: 'ReadResponse', }),
        new property_1.Property({ name: 'writeResponse', tag: 13, occurrence: enums_1.Occurrence.implicit, customType: 'WriteResponse', }),
        new property_1.Property({ name: 'confirmedServiceError', tag: 14, occurrence: enums_1.Occurrence.none, customType: 'ConfirmedServiceError', }),
        new property_1.Property({ name: 'data-notification', tag: 15, occurrence: enums_1.Occurrence.implicit, customType: 'Data-Notification', }),
        new property_1.Property({ name: 'unconfirmedWriteRequest', tag: 22, occurrence: enums_1.Occurrence.implicit, customType: 'UnconfirmedWriteRequest', }),
        new property_1.Property({ name: 'informationReportRequest', tag: 24, occurrence: enums_1.Occurrence.implicit, customType: 'InformationReportRequest', }),
        new property_1.Property({ name: 'glo-initiateRequest', tag: 33, occurrence: enums_1.Occurrence.implicit, asn1Type: 'OCTET STRING', }),
        new property_1.Property({ name: 'glo-readRequest', tag: 37, occurrence: enums_1.Occurrence.implicit, asn1Type: 'OCTET STRING', }),
        new property_1.Property({ name: 'glo-writeRequest', tag: 38, occurrence: enums_1.Occurrence.implicit, asn1Type: 'OCTET STRING', }),
        new property_1.Property({ name: 'glo-initiateResponse', tag: 40, occurrence: enums_1.Occurrence.implicit, asn1Type: 'OCTET STRING', }),
        new property_1.Property({ name: 'glo-readResponse', tag: 44, occurrence: enums_1.Occurrence.implicit, asn1Type: 'OCTET STRING', }),
        new property_1.Property({ name: 'glo-writeResponse', tag: 45, occurrence: enums_1.Occurrence.implicit, asn1Type: 'OCTET STRING', }),
        new property_1.Property({ name: 'glo-confirmedServiceError', tag: 46, occurrence: enums_1.Occurrence.implicit, asn1Type: 'OCTET STRING', }),
        new property_1.Property({ name: 'glo-unconfirmedWriteRequest', tag: 54, occurrence: enums_1.Occurrence.implicit, asn1Type: 'OCTET STRING', }),
        new property_1.Property({ name: 'glo-informationReportRequest', tag: 56, occurrence: enums_1.Occurrence.implicit, asn1Type: 'OCTET STRING', }),
        new property_1.Property({ name: 'ded-initiateRequest', tag: 65, occurrence: enums_1.Occurrence.implicit, asn1Type: 'OCTET STRING', }),
        new property_1.Property({ name: 'ded-readRequest', tag: 69, occurrence: enums_1.Occurrence.implicit, asn1Type: 'OCTET STRING', }),
        new property_1.Property({ name: 'ded-writeRequest', tag: 70, occurrence: enums_1.Occurrence.implicit, asn1Type: 'OCTET STRING', }),
        new property_1.Property({ name: 'ded-initiateResponse', tag: 72, occurrence: enums_1.Occurrence.implicit, asn1Type: 'OCTET STRING', }),
        new property_1.Property({ name: 'ded-readResponse', tag: 76, occurrence: enums_1.Occurrence.implicit, asn1Type: 'OCTET STRING', }),
        new property_1.Property({ name: 'ded-writeResponse', tag: 77, occurrence: enums_1.Occurrence.implicit, asn1Type: 'OCTET STRING', }),
        new property_1.Property({ name: 'ded-confirmedServiceError', tag: 78, occurrence: enums_1.Occurrence.implicit, asn1Type: 'OCTET STRING', }),
        new property_1.Property({ name: 'ded-unconfirmedWriteRequest', tag: 86, occurrence: enums_1.Occurrence.implicit, asn1Type: 'OCTET STRING', }),
        new property_1.Property({ name: 'ded-informationReportRequest', tag: 88, occurrence: enums_1.Occurrence.implicit, asn1Type: 'OCTET STRING', }),
        new property_1.Property({ name: 'get-request', tag: 192, occurrence: enums_1.Occurrence.implicit, customType: 'Get-Request', }),
        new property_1.Property({ name: 'set-request', tag: 193, occurrence: enums_1.Occurrence.implicit, customType: 'Set-Request', }),
        new property_1.Property({ name: 'event-notification-request', tag: 194, occurrence: enums_1.Occurrence.implicit, customType: 'EventNotificationRequest', }),
        new property_1.Property({ name: 'action-request', tag: 195, occurrence: enums_1.Occurrence.implicit, customType: 'Action-Request', }),
        new property_1.Property({ name: 'get-response', tag: 196, occurrence: enums_1.Occurrence.implicit, customType: 'Get-Response', }),
        new property_1.Property({ name: 'set-response', tag: 197, occurrence: enums_1.Occurrence.implicit, customType: 'Set-Response', }),
        new property_1.Property({ name: 'action-response', tag: 199, occurrence: enums_1.Occurrence.implicit, customType: 'Action-Response', }),
        new property_1.Property({ name: 'glo-get-request', tag: 200, occurrence: enums_1.Occurrence.implicit, asn1Type: 'OCTET STRING', }),
        new property_1.Property({ name: 'glo-set-request', tag: 201, occurrence: enums_1.Occurrence.implicit, asn1Type: 'OCTET STRING', }),
        new property_1.Property({ name: 'glo-event-notification-request', tag: 202, occurrence: enums_1.Occurrence.implicit, asn1Type: 'OCTET STRING', }),
        new property_1.Property({ name: 'glo-action-request', tag: 203, occurrence: enums_1.Occurrence.implicit, asn1Type: 'OCTET STRING', }),
        new property_1.Property({ name: 'glo-get-response', tag: 204, occurrence: enums_1.Occurrence.implicit, asn1Type: 'OCTET STRING', }),
        new property_1.Property({ name: 'glo-set-response', tag: 205, occurrence: enums_1.Occurrence.implicit, asn1Type: 'OCTET STRING', }),
        new property_1.Property({ name: 'glo-action-response', tag: 207, occurrence: enums_1.Occurrence.implicit, asn1Type: 'OCTET STRING', }),
        new property_1.Property({ name: 'ded-get-request', tag: 208, occurrence: enums_1.Occurrence.implicit, asn1Type: 'OCTET STRING', }),
        new property_1.Property({ name: 'ded-set-request', tag: 209, occurrence: enums_1.Occurrence.implicit, asn1Type: 'OCTET STRING', }),
        new property_1.Property({ name: 'ded-event-notification-request', tag: 210, occurrence: enums_1.Occurrence.implicit, asn1Type: 'OCTET STRING', }),
        new property_1.Property({ name: 'ded-actionRequest', tag: 211, occurrence: enums_1.Occurrence.implicit, asn1Type: 'OCTET STRING', }),
        new property_1.Property({ name: 'ded-get-response', tag: 212, occurrence: enums_1.Occurrence.implicit, asn1Type: 'OCTET STRING', }),
        new property_1.Property({ name: 'ded-set-response', tag: 213, occurrence: enums_1.Occurrence.implicit, asn1Type: 'OCTET STRING', }),
        new property_1.Property({ name: 'ded-action-response', tag: 215, occurrence: enums_1.Occurrence.implicit, asn1Type: 'OCTET STRING', }),
        new property_1.Property({ name: 'exception-response', tag: 216, occurrence: enums_1.Occurrence.implicit, customType: 'ExceptionResponse', }),
        new property_1.Property({ name: 'access-request', tag: 217, occurrence: enums_1.Occurrence.implicit, customType: 'Access-Request', }),
        new property_1.Property({ name: 'access-response', tag: 218, occurrence: enums_1.Occurrence.implicit, customType: 'Access-Response', }),
        new property_1.Property({ name: 'general-glo-ciphering', tag: 219, occurrence: enums_1.Occurrence.implicit, customType: 'General-Glo-Ciphering', }),
        new property_1.Property({ name: 'general-ded-ciphering', tag: 220, occurrence: enums_1.Occurrence.implicit, customType: 'General-Ded-Ciphering', }),
        new property_1.Property({ name: 'general-ciphering', tag: 221, occurrence: enums_1.Occurrence.implicit, customType: 'General-Ciphering', }),
        new property_1.Property({ name: 'general-signing', tag: 223, occurrence: enums_1.Occurrence.implicit, customType: 'General-Signing', }),
        new property_1.Property({ name: 'general-block-transfer', tag: 224, occurrence: enums_1.Occurrence.implicit, customType: 'General-Block-Transfer', })
    ],
});
const InitiateRequest = new type_definition_1.TypeDefinition({
    name: 'InitiateRequest',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'dedicated-key', occurrence: enums_1.Occurrence.none, asn1Type: 'OCTET STRING', isOptional: true, }),
        new property_1.Property({ name: 'response-allowed', occurrence: enums_1.Occurrence.none, asn1Type: 'BOOLEAN', typeParameter: 'DEFAULT TRUE', }),
        new property_1.Property({ name: 'proposed-quality-of-service', tag: 0, occurrence: enums_1.Occurrence.implicit, customType: 'Integer8', isOptional: true, }),
        new property_1.Property({ name: 'proposed-dlms-version-number', occurrence: enums_1.Occurrence.none, customType: 'Unsigned8', }),
        new property_1.Property({ name: 'proposed-conformance', occurrence: enums_1.Occurrence.none, customType: 'Conformance', }),
        new property_1.Property({ name: 'client-max-receive-pdu-size', occurrence: enums_1.Occurrence.none, customType: 'Unsigned16', })
    ],
});
const ReadRequest = new type_definition_1.TypeDefinition({
    name: 'ReadRequest',
    blockMode: enums_1.BlockMode.single,
    occurrence: enums_1.Occurrence.none,
    asn1Type: 'SEQUENCE OF',
    typeParameter: 'Variable-Access-Specification',
});
const WriteRequest = new type_definition_1.TypeDefinition({
    name: 'WriteRequest',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'variable-access-specification', occurrence: enums_1.Occurrence.none, asn1Type: 'SEQUENCE OF', subType: 'Variable-Access-Specification', }),
        new property_1.Property({ name: 'list-of-data', occurrence: enums_1.Occurrence.none, asn1Type: 'SEQUENCE OF', subType: 'Data', })
    ],
});
const InitiateResponse = new type_definition_1.TypeDefinition({
    name: 'InitiateResponse',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'negotiated-quality-of-service', tag: 0, occurrence: enums_1.Occurrence.implicit, customType: 'Integer8', isOptional: true, }),
        new property_1.Property({ name: 'negotiated-dlms-version-number', occurrence: enums_1.Occurrence.none, customType: 'Unsigned8', }),
        new property_1.Property({ name: 'negotiated-conformance', occurrence: enums_1.Occurrence.none, customType: 'Conformance', }),
        new property_1.Property({ name: 'server-max-receive-pdu-size', occurrence: enums_1.Occurrence.none, customType: 'Unsigned16', }),
        new property_1.Property({ name: 'vaa-name', occurrence: enums_1.Occurrence.none, customType: 'ObjectName', })
    ],
});
const ReadResponse = new type_definition_1.TypeDefinition({
    name: 'ReadResponse',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'data', tag: 0, occurrence: enums_1.Occurrence.none, customType: 'Data', }),
        new property_1.Property({ name: 'data-access-error', tag: 1, occurrence: enums_1.Occurrence.implicit, customType: 'Data-Access-Result', }),
        new property_1.Property({ name: 'data-block-result', tag: 2, occurrence: enums_1.Occurrence.implicit, customType: 'Data-Block-Result', }),
        new property_1.Property({ name: 'block-number', tag: 3, occurrence: enums_1.Occurrence.implicit, customType: 'Unsigned16', })
    ],
});
const WriteResponse = new type_definition_1.TypeDefinition({
    name: 'WriteResponse',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'success', tag: 0, occurrence: enums_1.Occurrence.implicit, asn1Type: 'NULL', }),
        new property_1.Property({ name: 'data-access-error', tag: 1, occurrence: enums_1.Occurrence.implicit, customType: 'Data-Access-Result', }),
        new property_1.Property({ name: 'block-number', tag: 2, occurrence: enums_1.Occurrence.none, customType: 'Unsigned16', })
    ],
});
const ConfirmedServiceError = new type_definition_1.TypeDefinition({
    name: 'ConfirmedServiceError',
    blockMode: enums_1.BlockMode.choice,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'initiateError', tag: 1, occurrence: enums_1.Occurrence.none, customType: 'ServiceError', }),
        new property_1.Property({ name: 'getStatus', tag: 2, occurrence: enums_1.Occurrence.none, customType: 'ServiceError', }),
        new property_1.Property({ name: 'getNameList', tag: 3, occurrence: enums_1.Occurrence.none, customType: 'ServiceError', }),
        new property_1.Property({ name: 'getVariableAttribute', tag: 4, occurrence: enums_1.Occurrence.none, customType: 'ServiceError', }),
        new property_1.Property({ name: 'read', tag: 5, occurrence: enums_1.Occurrence.none, customType: 'ServiceError', }),
        new property_1.Property({ name: 'write', tag: 6, occurrence: enums_1.Occurrence.none, customType: 'ServiceError', }),
        new property_1.Property({ name: 'getDataSetAttribute', tag: 7, occurrence: enums_1.Occurrence.none, customType: 'ServiceError', }),
        new property_1.Property({ name: 'getTIAttribute', tag: 8, occurrence: enums_1.Occurrence.none, customType: 'ServiceError', }),
        new property_1.Property({ name: 'changeScope', tag: 9, occurrence: enums_1.Occurrence.none, customType: 'ServiceError', }),
        new property_1.Property({ name: 'start', tag: 10, occurrence: enums_1.Occurrence.none, customType: 'ServiceError', }),
        new property_1.Property({ name: 'stop', tag: 11, occurrence: enums_1.Occurrence.none, customType: 'ServiceError', }),
        new property_1.Property({ name: 'resume', tag: 12, occurrence: enums_1.Occurrence.none, customType: 'ServiceError', }),
        new property_1.Property({ name: 'makeUsable', tag: 13, occurrence: enums_1.Occurrence.none, customType: 'ServiceError', }),
        new property_1.Property({ name: 'initiateLoad', tag: 14, occurrence: enums_1.Occurrence.none, customType: 'ServiceError', }),
        new property_1.Property({ name: 'loadSegment', tag: 15, occurrence: enums_1.Occurrence.none, customType: 'ServiceError', }),
        new property_1.Property({ name: 'terminateLoad', tag: 16, occurrence: enums_1.Occurrence.none, customType: 'ServiceError', }),
        new property_1.Property({ name: 'initiateUpLoad', tag: 17, occurrence: enums_1.Occurrence.none, customType: 'ServiceError', }),
        new property_1.Property({ name: 'upLoadSegment', tag: 18, occurrence: enums_1.Occurrence.none, customType: 'ServiceError', }),
        new property_1.Property({ name: 'terminateUpLoad', tag: 19, occurrence: enums_1.Occurrence.none, customType: 'ServiceError', })
    ],
});
const Data_Notification = new type_definition_1.TypeDefinition({
    name: 'Data-Notification',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'long-invoke-id-and-priority', occurrence: enums_1.Occurrence.none, customType: 'Long-Invoke-Id-And-Priority', }),
        new property_1.Property({ name: 'date-time', occurrence: enums_1.Occurrence.none, asn1Type: 'OCTET STRING', }),
        new property_1.Property({ name: 'notification-body', occurrence: enums_1.Occurrence.none, customType: 'Notification-Body', })
    ],
});
const UnconfirmedWriteRequest = new type_definition_1.TypeDefinition({
    name: 'UnconfirmedWriteRequest',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'variable-access-specification', occurrence: enums_1.Occurrence.none, asn1Type: 'SEQUENCE OF', subType: 'Variable-Access-Specification', }),
        new property_1.Property({ name: 'list-of-data', occurrence: enums_1.Occurrence.none, asn1Type: 'SEQUENCE OF', subType: 'Data', })
    ],
});
const InformationReportRequest = new type_definition_1.TypeDefinition({
    name: 'InformationReportRequest',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'current-time', occurrence: enums_1.Occurrence.none, asn1Type: 'GeneralizedTime', isOptional: true, }),
        new property_1.Property({ name: 'variable-access-specification', occurrence: enums_1.Occurrence.none, asn1Type: 'SEQUENCE OF', subType: 'Variable-Access-Specification', }),
        new property_1.Property({ name: 'list-of-data', occurrence: enums_1.Occurrence.none, asn1Type: 'SEQUENCE OF', subType: 'Data', })
    ],
});
const Get_Request = new type_definition_1.TypeDefinition({
    name: 'Get-Request',
    blockMode: enums_1.BlockMode.choice,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'get-request-normal', tag: 1, occurrence: enums_1.Occurrence.implicit, customType: 'Get-Request-Normal', }),
        new property_1.Property({ name: 'get-request-next', tag: 2, occurrence: enums_1.Occurrence.implicit, customType: 'Get-Request-Next', }),
        new property_1.Property({ name: 'get-request-with-list', tag: 3, occurrence: enums_1.Occurrence.implicit, customType: 'Get-Request-With-List', })
    ],
});
const Set_Request = new type_definition_1.TypeDefinition({
    name: 'Set-Request',
    blockMode: enums_1.BlockMode.choice,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'set-request-normal', tag: 1, occurrence: enums_1.Occurrence.implicit, customType: 'Set-Request-Normal', }),
        new property_1.Property({ name: 'set-request-with-first-datablock', tag: 2, occurrence: enums_1.Occurrence.implicit, customType: 'Set-Request-With-First-Datablock', }),
        new property_1.Property({ name: 'set-request-with-datablock', tag: 3, occurrence: enums_1.Occurrence.implicit, customType: 'Set-Request-With-Datablock', }),
        new property_1.Property({ name: 'set-request-with-list', tag: 4, occurrence: enums_1.Occurrence.implicit, customType: 'Set-Request-With-List', }),
        new property_1.Property({ name: 'set-request-with-list-and-first-datablock', tag: 5, occurrence: enums_1.Occurrence.implicit, customType: 'Set-Request-With-List-And-First-Datablock', })
    ],
});
const EventNotificationRequest = new type_definition_1.TypeDefinition({
    name: 'EventNotificationRequest',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'time', occurrence: enums_1.Occurrence.none, asn1Type: 'OCTET STRING', isOptional: true, }),
        new property_1.Property({ name: 'cosem-attribute-descriptor', occurrence: enums_1.Occurrence.none, customType: 'Cosem-Attribute-Descriptor', }),
        new property_1.Property({ name: 'attribute-value', occurrence: enums_1.Occurrence.none, customType: 'Data', })
    ],
});
const Action_Request = new type_definition_1.TypeDefinition({
    name: 'Action-Request',
    blockMode: enums_1.BlockMode.choice,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'action-request-normal', tag: 1, occurrence: enums_1.Occurrence.implicit, customType: 'Action-Request-Normal', }),
        new property_1.Property({ name: 'action-request-next-pblock', tag: 2, occurrence: enums_1.Occurrence.implicit, customType: 'Action-Request-Next-Pblock', }),
        new property_1.Property({ name: 'action-request-with-list', tag: 3, occurrence: enums_1.Occurrence.implicit, customType: 'Action-Request-With-List', }),
        new property_1.Property({ name: 'action-request-with-first-pblock', tag: 4, occurrence: enums_1.Occurrence.implicit, customType: 'Action-Request-With-First-Pblock', }),
        new property_1.Property({ name: 'action-request-with-list-and-first-pblock', tag: 5, occurrence: enums_1.Occurrence.implicit, customType: 'Action-Request-With-List-And-First-Pblock', }),
        new property_1.Property({ name: 'action-request-with-pblock', tag: 6, occurrence: enums_1.Occurrence.implicit, customType: 'Action-Request-With-Pblock', })
    ],
});
const Get_Response = new type_definition_1.TypeDefinition({
    name: 'Get-Response',
    blockMode: enums_1.BlockMode.choice,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'get-response-normal', tag: 1, occurrence: enums_1.Occurrence.implicit, customType: 'Get-Response-Normal', }),
        new property_1.Property({ name: 'get-response-with-datablock', tag: 2, occurrence: enums_1.Occurrence.implicit, customType: 'Get-Response-With-Datablock', }),
        new property_1.Property({ name: 'get-response-with-list', tag: 3, occurrence: enums_1.Occurrence.implicit, customType: 'Get-Response-With-List', })
    ],
});
const Set_Response = new type_definition_1.TypeDefinition({
    name: 'Set-Response',
    blockMode: enums_1.BlockMode.choice,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'set-response-normal', tag: 1, occurrence: enums_1.Occurrence.implicit, customType: 'Set-Response-Normal', }),
        new property_1.Property({ name: 'set-response-datablock', tag: 2, occurrence: enums_1.Occurrence.implicit, customType: 'Set-Response-Datablock', }),
        new property_1.Property({ name: 'set-response-last-datablock', tag: 3, occurrence: enums_1.Occurrence.implicit, customType: 'Set-Response-Last-Datablock', }),
        new property_1.Property({ name: 'set-response-last-datablock-with-list', tag: 4, occurrence: enums_1.Occurrence.implicit, customType: 'Set-Response-Last-Datablock-With-List', }),
        new property_1.Property({ name: 'set-response-with-list', tag: 5, occurrence: enums_1.Occurrence.implicit, customType: 'Set-Response-With-List', })
    ],
});
const Action_Response = new type_definition_1.TypeDefinition({
    name: 'Action-Response',
    blockMode: enums_1.BlockMode.choice,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'action-response-normal', tag: 1, occurrence: enums_1.Occurrence.implicit, customType: 'Action-Response-Normal', }),
        new property_1.Property({ name: 'action-response-with-pblock', tag: 2, occurrence: enums_1.Occurrence.implicit, customType: 'Action-Response-With-Pblock', }),
        new property_1.Property({ name: 'action-response-with-list', tag: 3, occurrence: enums_1.Occurrence.implicit, customType: 'Action-Response-With-List', }),
        new property_1.Property({ name: 'action-response-next-pblock', tag: 4, occurrence: enums_1.Occurrence.implicit, customType: 'Action-Response-Next-Pblock', })
    ],
});
const ExceptionResponse = new type_definition_1.TypeDefinition({
    name: 'ExceptionResponse',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'state-error', tag: 0, occurrence: enums_1.Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ service-not-allowed (1)', }),
        new property_1.Property({ name: 'state-error', tag: 0, occurrence: enums_1.Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ service-not-allowed (1), service-unknown (2) }', }),
        new property_1.Property({ name: 'service-error', tag: 1, occurrence: enums_1.Occurrence.none, asn1Type: 'CHOICE', typeParameter: '{ operation-not-possible [1] IMPLICIT NULL', }),
        new property_1.Property({ name: 'service-error', tag: 1, occurrence: enums_1.Occurrence.none, asn1Type: 'CHOICE', typeParameter: '{ operation-not-possible [1] IMPLICIT NULL, service-not-supported [2] IMPLICIT NULL', }),
        new property_1.Property({ name: 'service-error', tag: 1, occurrence: enums_1.Occurrence.none, asn1Type: 'CHOICE', typeParameter: '{ operation-not-possible [1] IMPLICIT NULL, service-not-supported [2] IMPLICIT NULL, other-reason [3] IMPLICIT NULL', }),
        new property_1.Property({ name: 'service-error', tag: 1, occurrence: enums_1.Occurrence.none, asn1Type: 'CHOICE', typeParameter: '{ operation-not-possible [1] IMPLICIT NULL, service-not-supported [2] IMPLICIT NULL, other-reason [3] IMPLICIT NULL, pdu-too-long [4] IMPLICIT NULL', }),
        new property_1.Property({ name: 'service-error', tag: 1, occurrence: enums_1.Occurrence.none, asn1Type: 'CHOICE', typeParameter: '{ operation-not-possible [1] IMPLICIT NULL, service-not-supported [2] IMPLICIT NULL, other-reason [3] IMPLICIT NULL, pdu-too-long [4] IMPLICIT NULL, deciphering-error [5] IMPLICIT NULL', }),
        new property_1.Property({ name: 'service-error', tag: 1, occurrence: enums_1.Occurrence.none, asn1Type: 'CHOICE', typeParameter: '{ operation-not-possible [1] IMPLICIT NULL, service-not-supported [2] IMPLICIT NULL, other-reason [3] IMPLICIT NULL, pdu-too-long [4] IMPLICIT NULL, deciphering-error [5] IMPLICIT NULL, invocation-counter-error [6] IMPLICIT Unsigned32 }', })
    ],
});
const Access_Request = new type_definition_1.TypeDefinition({
    name: 'Access-Request',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'long-invoke-id-and-priority', occurrence: enums_1.Occurrence.none, customType: 'Long-Invoke-Id-And-Priority', }),
        new property_1.Property({ name: 'date-time', occurrence: enums_1.Occurrence.none, asn1Type: 'OCTET STRING', }),
        new property_1.Property({ name: 'access-request-body', occurrence: enums_1.Occurrence.none, customType: 'Access-Request-Body', })
    ],
});
const Access_Response = new type_definition_1.TypeDefinition({
    name: 'Access-Response',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'long-invoke-id-and-priority', occurrence: enums_1.Occurrence.none, customType: 'Long-Invoke-Id-And-Priority', }),
        new property_1.Property({ name: 'date-time', occurrence: enums_1.Occurrence.none, asn1Type: 'OCTET STRING', }),
        new property_1.Property({ name: 'access-response-body', occurrence: enums_1.Occurrence.none, customType: 'Access-Response-Body', })
    ],
});
const General_Glo_Ciphering = new type_definition_1.TypeDefinition({
    name: 'General-Glo-Ciphering',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'system-title', occurrence: enums_1.Occurrence.none, asn1Type: 'OCTET STRING', }),
        new property_1.Property({ name: 'ciphered-content', occurrence: enums_1.Occurrence.none, asn1Type: 'OCTET STRING', })
    ],
});
const General_Ded_Ciphering = new type_definition_1.TypeDefinition({
    name: 'General-Ded-Ciphering',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'system-title', occurrence: enums_1.Occurrence.none, asn1Type: 'OCTET STRING', }),
        new property_1.Property({ name: 'ciphered-content', occurrence: enums_1.Occurrence.none, asn1Type: 'OCTET STRING', })
    ],
});
const General_Ciphering = new type_definition_1.TypeDefinition({
    name: 'General-Ciphering',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'transaction-id', occurrence: enums_1.Occurrence.none, asn1Type: 'OCTET STRING', }),
        new property_1.Property({ name: 'originator-system-title', occurrence: enums_1.Occurrence.none, asn1Type: 'OCTET STRING', }),
        new property_1.Property({ name: 'recipient-system-title', occurrence: enums_1.Occurrence.none, asn1Type: 'OCTET STRING', }),
        new property_1.Property({ name: 'date-time', occurrence: enums_1.Occurrence.none, asn1Type: 'OCTET STRING', }),
        new property_1.Property({ name: 'other-information', occurrence: enums_1.Occurrence.none, asn1Type: 'OCTET STRING', }),
        new property_1.Property({ name: 'key-info', occurrence: enums_1.Occurrence.none, customType: 'Key-Info', isOptional: true, }),
        new property_1.Property({ name: 'ciphered-content', occurrence: enums_1.Occurrence.none, asn1Type: 'OCTET STRING', })
    ],
});
const General_Signing = new type_definition_1.TypeDefinition({
    name: 'General-Signing',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'transaction-id', occurrence: enums_1.Occurrence.none, asn1Type: 'OCTET STRING', }),
        new property_1.Property({ name: 'originator-system-title', occurrence: enums_1.Occurrence.none, asn1Type: 'OCTET STRING', }),
        new property_1.Property({ name: 'recipient-system-title', occurrence: enums_1.Occurrence.none, asn1Type: 'OCTET STRING', }),
        new property_1.Property({ name: 'date-time', occurrence: enums_1.Occurrence.none, asn1Type: 'OCTET STRING', }),
        new property_1.Property({ name: 'other-information', occurrence: enums_1.Occurrence.none, asn1Type: 'OCTET STRING', }),
        new property_1.Property({ name: 'content', occurrence: enums_1.Occurrence.none, asn1Type: 'OCTET STRING', }),
        new property_1.Property({ name: 'signature', occurrence: enums_1.Occurrence.none, asn1Type: 'OCTET STRING', })
    ],
});
const General_Block_Transfer = new type_definition_1.TypeDefinition({
    name: 'General-Block-Transfer',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'block-control', occurrence: enums_1.Occurrence.none, customType: 'Block-Control', }),
        new property_1.Property({ name: 'block-number', occurrence: enums_1.Occurrence.none, customType: 'Unsigned16', }),
        new property_1.Property({ name: 'block-number-ack', occurrence: enums_1.Occurrence.none, customType: 'Unsigned16', }),
        new property_1.Property({ name: 'block-data', occurrence: enums_1.Occurrence.none, asn1Type: 'OCTET STRING', })
    ],
});
const Integer8 = new type_definition_1.TypeDefinition({
    name: 'Integer8',
    blockMode: enums_1.BlockMode.single,
    occurrence: enums_1.Occurrence.none,
    asn1Type: 'INTEGER',
    typeParameter: '(-128..127)',
});
const Unsigned8 = new type_definition_1.TypeDefinition({
    name: 'Unsigned8',
    blockMode: enums_1.BlockMode.single,
    occurrence: enums_1.Occurrence.none,
    asn1Type: 'INTEGER',
    typeParameter: '(0..255)',
});
const Conformance = new type_definition_1.TypeDefinition({
    name: 'Conformance',
    blockMode: enums_1.BlockMode.bitString,
    occurrence: enums_1.Occurrence.implicit,
    tag: 31,
    customTag: 'APPLICATION',
    bitStrings: [
        new bit_string_1.BitString('reserved-zero', 0),
        new bit_string_1.BitString('general-protection', 1),
        new bit_string_1.BitString('general-block-transfer', 2),
        new bit_string_1.BitString('read', 3),
        new bit_string_1.BitString('write', 4),
        new bit_string_1.BitString('unconfirmed-write', 5),
        new bit_string_1.BitString('reserved-six', 6),
        new bit_string_1.BitString('reserved-seven', 7),
        new bit_string_1.BitString('attribute0-supported-with-set', 8),
        new bit_string_1.BitString('priority-mgmt-supported', 9),
        new bit_string_1.BitString('attribute0-supported-with-get', 10),
        new bit_string_1.BitString('block-transfer-with-get-or-read', 11),
        new bit_string_1.BitString('block-transfer-with-set-or-write', 12),
        new bit_string_1.BitString('block-transfer-with-action', 13),
        new bit_string_1.BitString('multiple-references', 14),
        new bit_string_1.BitString('information-report', 15),
        new bit_string_1.BitString('data-notification', 16),
        new bit_string_1.BitString('access', 17),
        new bit_string_1.BitString('parameterized-access', 18),
        new bit_string_1.BitString('get', 19),
        new bit_string_1.BitString('set', 20),
        new bit_string_1.BitString('selective-access', 21),
        new bit_string_1.BitString('event-notification', 22),
        new bit_string_1.BitString('action', 23)
    ],
});
const Unsigned16 = new type_definition_1.TypeDefinition({
    name: 'Unsigned16',
    blockMode: enums_1.BlockMode.single,
    occurrence: enums_1.Occurrence.none,
    asn1Type: 'INTEGER',
    typeParameter: '(0..65535)',
});
const Variable_Access_Specification = new type_definition_1.TypeDefinition({
    name: 'Variable-Access-Specification',
    blockMode: enums_1.BlockMode.choice,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'variable-name', tag: 2, occurrence: enums_1.Occurrence.implicit, customType: 'ObjectName', }),
        new property_1.Property({ name: 'parameterized-access', tag: 4, occurrence: enums_1.Occurrence.implicit, customType: 'Parameterized-Access', }),
        new property_1.Property({ name: 'block-number-access', tag: 5, occurrence: enums_1.Occurrence.implicit, customType: 'Block-Number-Access', }),
        new property_1.Property({ name: 'read-data-block-access', tag: 6, occurrence: enums_1.Occurrence.implicit, customType: 'Read-Data-Block-Access', }),
        new property_1.Property({ name: 'write-data-block-access', tag: 7, occurrence: enums_1.Occurrence.implicit, customType: 'Write-Data-Block-Access', })
    ],
});
const Data = new type_definition_1.TypeDefinition({
    name: 'Data',
    blockMode: enums_1.BlockMode.choice,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'null-data', tag: 0, occurrence: enums_1.Occurrence.implicit, asn1Type: 'NULL', }),
        new property_1.Property({ name: 'array', tag: 1, occurrence: enums_1.Occurrence.implicit, asn1Type: 'SEQUENCE OF', subType: 'Data', }),
        new property_1.Property({ name: 'structure', tag: 2, occurrence: enums_1.Occurrence.implicit, asn1Type: 'SEQUENCE OF', subType: 'Data', }),
        new property_1.Property({ name: 'boolean', tag: 3, occurrence: enums_1.Occurrence.implicit, asn1Type: 'BOOLEAN', }),
        new property_1.Property({ name: 'bit-string', tag: 4, occurrence: enums_1.Occurrence.implicit, asn1Type: 'BIT STRING', }),
        new property_1.Property({ name: 'double-long', tag: 5, occurrence: enums_1.Occurrence.implicit, customType: 'Integer32', }),
        new property_1.Property({ name: 'double-long-unsigned', tag: 6, occurrence: enums_1.Occurrence.implicit, customType: 'Unsigned32', }),
        new property_1.Property({ name: 'octet-string', tag: 9, occurrence: enums_1.Occurrence.implicit, asn1Type: 'OCTET STRING', }),
        new property_1.Property({ name: 'visible-string', tag: 10, occurrence: enums_1.Occurrence.implicit, asn1Type: 'VisibleString', }),
        new property_1.Property({ name: 'utf8-string', tag: 12, occurrence: enums_1.Occurrence.implicit, asn1Type: 'UTF8String', }),
        new property_1.Property({ name: 'bcd', tag: 13, occurrence: enums_1.Occurrence.implicit, customType: 'Integer8', }),
        new property_1.Property({ name: 'integer', tag: 15, occurrence: enums_1.Occurrence.implicit, customType: 'Integer8', }),
        new property_1.Property({ name: 'long', tag: 16, occurrence: enums_1.Occurrence.implicit, customType: 'Integer16', }),
        new property_1.Property({ name: 'unsigned', tag: 17, occurrence: enums_1.Occurrence.implicit, customType: 'Unsigned8', }),
        new property_1.Property({ name: 'long-unsigned', tag: 18, occurrence: enums_1.Occurrence.implicit, customType: 'Unsigned16', }),
        new property_1.Property({ name: 'compact-array', tag: 19, occurrence: enums_1.Occurrence.implicit, asn1Type: 'SEQUENCE', typeParameter: '{ contents-description [0] TypeDescription', }),
        new property_1.Property({ name: 'compact-array', tag: 19, occurrence: enums_1.Occurrence.implicit, asn1Type: 'SEQUENCE', typeParameter: '{ contents-description [0] TypeDescription, array-contents [1] IMPLICIT OCTET STRING }', }),
        new property_1.Property({ name: 'long64', tag: 20, occurrence: enums_1.Occurrence.implicit, customType: 'Integer64', }),
        new property_1.Property({ name: 'long64-unsigned', tag: 21, occurrence: enums_1.Occurrence.implicit, customType: 'Unsigned64', }),
        new property_1.Property({ name: 'enum', tag: 22, occurrence: enums_1.Occurrence.implicit, customType: 'Unsigned8', }),
        new property_1.Property({ name: 'float32', tag: 23, occurrence: enums_1.Occurrence.implicit, asn1Type: 'OCTET STRING', typeParameter: '(SIZE(4))', }),
        new property_1.Property({ name: 'float64', tag: 24, occurrence: enums_1.Occurrence.implicit, asn1Type: 'OCTET STRING', typeParameter: '(SIZE(8))', }),
        new property_1.Property({ name: 'date-time', tag: 25, occurrence: enums_1.Occurrence.implicit, asn1Type: 'OCTET STRING', typeParameter: '(SIZE(12))', }),
        new property_1.Property({ name: 'date', tag: 26, occurrence: enums_1.Occurrence.implicit, asn1Type: 'OCTET STRING', typeParameter: '(SIZE(5))', }),
        new property_1.Property({ name: 'time', tag: 27, occurrence: enums_1.Occurrence.implicit, asn1Type: 'OCTET STRING', typeParameter: '(SIZE(4))', }),
        new property_1.Property({ name: 'dont-care', tag: 255, occurrence: enums_1.Occurrence.implicit, asn1Type: 'NULL', })
    ],
});
const ObjectName = new type_definition_1.TypeDefinition({
    name: 'ObjectName',
    blockMode: enums_1.BlockMode.single,
    occurrence: enums_1.Occurrence.none,
    customType: 'Integer16',
});
const Data_Access_Result = new type_definition_1.TypeDefinition({
    name: 'Data-Access-Result',
    blockMode: enums_1.BlockMode.enumerated,
    occurrence: enums_1.Occurrence.none,
    enumerations: [
        new enumeration_1.Enumeration('success', 0),
        new enumeration_1.Enumeration('hardware-fault', 1),
        new enumeration_1.Enumeration('temporary-failure', 2),
        new enumeration_1.Enumeration('read-write-denied', 3),
        new enumeration_1.Enumeration('object-undefined', 4),
        new enumeration_1.Enumeration('object-class-inconsistent', 9),
        new enumeration_1.Enumeration('object-unavailable', 11),
        new enumeration_1.Enumeration('type-unmatched', 12),
        new enumeration_1.Enumeration('scope-of-access-violated', 13),
        new enumeration_1.Enumeration('data-block-unavailable', 14),
        new enumeration_1.Enumeration('long-get-aborted', 15),
        new enumeration_1.Enumeration('no-long-get-in-progress', 16),
        new enumeration_1.Enumeration('long-set-aborted', 17),
        new enumeration_1.Enumeration('no-long-set-in-progress', 18),
        new enumeration_1.Enumeration('data-block-number-invalid', 19),
        new enumeration_1.Enumeration('other-reason', 250)
    ],
});
const Data_Block_Result = new type_definition_1.TypeDefinition({
    name: 'Data-Block-Result',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'last-block', occurrence: enums_1.Occurrence.none, asn1Type: 'BOOLEAN', }),
        new property_1.Property({ name: 'block-number', occurrence: enums_1.Occurrence.none, customType: 'Unsigned16', }),
        new property_1.Property({ name: 'raw-data', occurrence: enums_1.Occurrence.none, asn1Type: 'OCTET STRING', })
    ],
});
const ServiceError = new type_definition_1.TypeDefinition({
    name: 'ServiceError',
    blockMode: enums_1.BlockMode.choice,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'application-reference', tag: 0, occurrence: enums_1.Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0)', }),
        new property_1.Property({ name: 'application-reference', tag: 0, occurrence: enums_1.Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), time-elapsed (1)', }),
        new property_1.Property({ name: 'application-reference', tag: 0, occurrence: enums_1.Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), time-elapsed (1), application-unreachable (2)', }),
        new property_1.Property({ name: 'application-reference', tag: 0, occurrence: enums_1.Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), time-elapsed (1), application-unreachable (2), application-reference-invalid (3)', }),
        new property_1.Property({ name: 'application-reference', tag: 0, occurrence: enums_1.Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), time-elapsed (1), application-unreachable (2), application-reference-invalid (3), application-context-unsupported (4)', }),
        new property_1.Property({ name: 'application-reference', tag: 0, occurrence: enums_1.Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), time-elapsed (1), application-unreachable (2), application-reference-invalid (3), application-context-unsupported (4), provider-communication-error (5)', }),
        new property_1.Property({ name: 'application-reference', tag: 0, occurrence: enums_1.Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), time-elapsed (1), application-unreachable (2), application-reference-invalid (3), application-context-unsupported (4), provider-communication-error (5), deciphering-error (6) }', }),
        new property_1.Property({ name: 'hardware-resource', tag: 1, occurrence: enums_1.Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0)', }),
        new property_1.Property({ name: 'hardware-resource', tag: 1, occurrence: enums_1.Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), memory-unavailable (1)', }),
        new property_1.Property({ name: 'hardware-resource', tag: 1, occurrence: enums_1.Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), memory-unavailable (1), processor-resource-unavailable (2)', }),
        new property_1.Property({ name: 'hardware-resource', tag: 1, occurrence: enums_1.Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), memory-unavailable (1), processor-resource-unavailable (2), mass-storage-unavailable (3)', }),
        new property_1.Property({ name: 'hardware-resource', tag: 1, occurrence: enums_1.Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), memory-unavailable (1), processor-resource-unavailable (2), mass-storage-unavailable (3), other-resource-unavailable (4) }', }),
        new property_1.Property({ name: 'vde-state-error', tag: 2, occurrence: enums_1.Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0)', }),
        new property_1.Property({ name: 'vde-state-error', tag: 2, occurrence: enums_1.Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), no-dlms-context (1)', }),
        new property_1.Property({ name: 'vde-state-error', tag: 2, occurrence: enums_1.Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), no-dlms-context (1), loading-data-set (2)', }),
        new property_1.Property({ name: 'vde-state-error', tag: 2, occurrence: enums_1.Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), no-dlms-context (1), loading-data-set (2), status-nochange (3)', }),
        new property_1.Property({ name: 'vde-state-error', tag: 2, occurrence: enums_1.Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), no-dlms-context (1), loading-data-set (2), status-nochange (3), status-inoperable (4) }', }),
        new property_1.Property({ name: 'service', tag: 3, occurrence: enums_1.Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0)', }),
        new property_1.Property({ name: 'service', tag: 3, occurrence: enums_1.Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), pdu-size (1)', }),
        new property_1.Property({ name: 'service', tag: 3, occurrence: enums_1.Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), pdu-size (1), service-unsupported (2) }', }),
        new property_1.Property({ name: 'definition', tag: 4, occurrence: enums_1.Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0)', }),
        new property_1.Property({ name: 'definition', tag: 4, occurrence: enums_1.Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), object-undefined (1)', }),
        new property_1.Property({ name: 'definition', tag: 4, occurrence: enums_1.Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), object-undefined (1), object-class-inconsistent (2)', }),
        new property_1.Property({ name: 'definition', tag: 4, occurrence: enums_1.Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), object-undefined (1), object-class-inconsistent (2), object-attribute-inconsistent (3) }', }),
        new property_1.Property({ name: 'access', tag: 5, occurrence: enums_1.Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0)', }),
        new property_1.Property({ name: 'access', tag: 5, occurrence: enums_1.Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), scope-of-access-violated (1)', }),
        new property_1.Property({ name: 'access', tag: 5, occurrence: enums_1.Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), scope-of-access-violated (1), object-access-violated (2)', }),
        new property_1.Property({ name: 'access', tag: 5, occurrence: enums_1.Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), scope-of-access-violated (1), object-access-violated (2), hardware-fault (3)', }),
        new property_1.Property({ name: 'access', tag: 5, occurrence: enums_1.Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), scope-of-access-violated (1), object-access-violated (2), hardware-fault (3), object-unavailable (4) }', }),
        new property_1.Property({ name: 'initiate', tag: 6, occurrence: enums_1.Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0)', }),
        new property_1.Property({ name: 'initiate', tag: 6, occurrence: enums_1.Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), dlms-version-too-low (1)', }),
        new property_1.Property({ name: 'initiate', tag: 6, occurrence: enums_1.Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), dlms-version-too-low (1), incompatible-conformance (2)', }),
        new property_1.Property({ name: 'initiate', tag: 6, occurrence: enums_1.Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), dlms-version-too-low (1), incompatible-conformance (2), pdu-size-too-short (3)', }),
        new property_1.Property({ name: 'initiate', tag: 6, occurrence: enums_1.Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), dlms-version-too-low (1), incompatible-conformance (2), pdu-size-too-short (3), refused-by-the-VDE-Handler (4) }', }),
        new property_1.Property({ name: 'load-data-set', tag: 7, occurrence: enums_1.Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0)', }),
        new property_1.Property({ name: 'load-data-set', tag: 7, occurrence: enums_1.Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), primitive-out-of-sequence (1)', }),
        new property_1.Property({ name: 'load-data-set', tag: 7, occurrence: enums_1.Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), primitive-out-of-sequence (1), not-loadable (2)', }),
        new property_1.Property({ name: 'load-data-set', tag: 7, occurrence: enums_1.Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), primitive-out-of-sequence (1), not-loadable (2), dataset-size-too-large (3)', }),
        new property_1.Property({ name: 'load-data-set', tag: 7, occurrence: enums_1.Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), primitive-out-of-sequence (1), not-loadable (2), dataset-size-too-large (3), not-awaited-segment (4)', }),
        new property_1.Property({ name: 'load-data-set', tag: 7, occurrence: enums_1.Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), primitive-out-of-sequence (1), not-loadable (2), dataset-size-too-large (3), not-awaited-segment (4), interpretation-failure (5)', }),
        new property_1.Property({ name: 'load-data-set', tag: 7, occurrence: enums_1.Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), primitive-out-of-sequence (1), not-loadable (2), dataset-size-too-large (3), not-awaited-segment (4), interpretation-failure (5), storage-failure (6)', }),
        new property_1.Property({ name: 'load-data-set', tag: 7, occurrence: enums_1.Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), primitive-out-of-sequence (1), not-loadable (2), dataset-size-too-large (3), not-awaited-segment (4), interpretation-failure (5), storage-failure (6), data-set-not-ready (7) }', }),
        new property_1.Property({ name: 'task', tag: 9, occurrence: enums_1.Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0)', }),
        new property_1.Property({ name: 'task', tag: 9, occurrence: enums_1.Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), no-remote-control (1)', }),
        new property_1.Property({ name: 'task', tag: 9, occurrence: enums_1.Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), no-remote-control (1), ti-stopped (2)', }),
        new property_1.Property({ name: 'task', tag: 9, occurrence: enums_1.Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), no-remote-control (1), ti-stopped (2), ti-running (3)', }),
        new property_1.Property({ name: 'task', tag: 9, occurrence: enums_1.Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), no-remote-control (1), ti-stopped (2), ti-running (3), ti-unusable (4) }', })
    ],
});
const Long_Invoke_Id_And_Priority = new type_definition_1.TypeDefinition({
    name: 'Long-Invoke-Id-And-Priority',
    blockMode: enums_1.BlockMode.single,
    occurrence: enums_1.Occurrence.none,
    customType: 'Unsigned32',
});
const Notification_Body = new type_definition_1.TypeDefinition({
    name: 'Notification-Body',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'data-value', occurrence: enums_1.Occurrence.none, customType: 'Data', })
    ],
});
const Get_Request_Normal = new type_definition_1.TypeDefinition({
    name: 'Get-Request-Normal',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'invoke-id-and-priority', occurrence: enums_1.Occurrence.none, customType: 'Invoke-Id-And-Priority', }),
        new property_1.Property({ name: 'cosem-attribute-descriptor', occurrence: enums_1.Occurrence.none, customType: 'Cosem-Attribute-Descriptor', }),
        new property_1.Property({ name: 'access-selection', occurrence: enums_1.Occurrence.none, customType: 'Selective-Access-Descriptor', isOptional: true, })
    ],
});
const Get_Request_Next = new type_definition_1.TypeDefinition({
    name: 'Get-Request-Next',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'invoke-id-and-priority', occurrence: enums_1.Occurrence.none, customType: 'Invoke-Id-And-Priority', }),
        new property_1.Property({ name: 'block-number', occurrence: enums_1.Occurrence.none, customType: 'Unsigned32', })
    ],
});
const Get_Request_With_List = new type_definition_1.TypeDefinition({
    name: 'Get-Request-With-List',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'invoke-id-and-priority', occurrence: enums_1.Occurrence.none, customType: 'Invoke-Id-And-Priority', }),
        new property_1.Property({ name: 'attribute-descriptor-list', occurrence: enums_1.Occurrence.none, asn1Type: 'SEQUENCE OF', subType: 'Cosem-Attribute-Descriptor-With-Selection', })
    ],
});
const Set_Request_Normal = new type_definition_1.TypeDefinition({
    name: 'Set-Request-Normal',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'invoke-id-and-priority', occurrence: enums_1.Occurrence.none, customType: 'Invoke-Id-And-Priority', }),
        new property_1.Property({ name: 'cosem-attribute-descriptor', occurrence: enums_1.Occurrence.none, customType: 'Cosem-Attribute-Descriptor', }),
        new property_1.Property({ name: 'access-selection', occurrence: enums_1.Occurrence.none, customType: 'Selective-Access-Descriptor', isOptional: true, }),
        new property_1.Property({ name: 'value', occurrence: enums_1.Occurrence.none, customType: 'Data', })
    ],
});
const Set_Request_With_First_Datablock = new type_definition_1.TypeDefinition({
    name: 'Set-Request-With-First-Datablock',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'invoke-id-and-priority', occurrence: enums_1.Occurrence.none, customType: 'Invoke-Id-And-Priority', }),
        new property_1.Property({ name: 'cosem-attribute-descriptor', occurrence: enums_1.Occurrence.none, customType: 'Cosem-Attribute-Descriptor', }),
        new property_1.Property({ name: 'access-selection', tag: 0, occurrence: enums_1.Occurrence.implicit, customType: 'Selective-Access-Descriptor', isOptional: true, }),
        new property_1.Property({ name: 'datablock', occurrence: enums_1.Occurrence.none, customType: 'DataBlock-SA', })
    ],
});
const Set_Request_With_Datablock = new type_definition_1.TypeDefinition({
    name: 'Set-Request-With-Datablock',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'invoke-id-and-priority', occurrence: enums_1.Occurrence.none, customType: 'Invoke-Id-And-Priority', }),
        new property_1.Property({ name: 'datablock', occurrence: enums_1.Occurrence.none, customType: 'DataBlock-SA', })
    ],
});
const Set_Request_With_List = new type_definition_1.TypeDefinition({
    name: 'Set-Request-With-List',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'invoke-id-and-priority', occurrence: enums_1.Occurrence.none, customType: 'Invoke-Id-And-Priority', }),
        new property_1.Property({ name: 'attribute-descriptor-list', occurrence: enums_1.Occurrence.none, asn1Type: 'SEQUENCE OF', subType: 'Cosem-Attribute-Descriptor-With-Selection', }),
        new property_1.Property({ name: 'value-list', occurrence: enums_1.Occurrence.none, asn1Type: 'SEQUENCE OF', subType: 'Data', })
    ],
});
const Set_Request_With_List_And_First_Datablock = new type_definition_1.TypeDefinition({
    name: 'Set-Request-With-List-And-First-Datablock',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'invoke-id-and-priority', occurrence: enums_1.Occurrence.none, customType: 'Invoke-Id-And-Priority', }),
        new property_1.Property({ name: 'attribute-descriptor-list', occurrence: enums_1.Occurrence.none, asn1Type: 'SEQUENCE OF', subType: 'Cosem-Attribute-Descriptor-With-Selection', }),
        new property_1.Property({ name: 'datablock', occurrence: enums_1.Occurrence.none, customType: 'DataBlock-SA', })
    ],
});
const Cosem_Attribute_Descriptor = new type_definition_1.TypeDefinition({
    name: 'Cosem-Attribute-Descriptor',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'class-id', occurrence: enums_1.Occurrence.none, customType: 'Cosem-Class-Id', }),
        new property_1.Property({ name: 'instance-id', occurrence: enums_1.Occurrence.none, customType: 'Cosem-Object-Instance-Id', }),
        new property_1.Property({ name: 'attribute-id', occurrence: enums_1.Occurrence.none, customType: 'Cosem-Object-Attribute-Id', })
    ],
});
const Action_Request_Normal = new type_definition_1.TypeDefinition({
    name: 'Action-Request-Normal',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'invoke-id-and-priority', occurrence: enums_1.Occurrence.none, customType: 'Invoke-Id-And-Priority', }),
        new property_1.Property({ name: 'cosem-method-descriptor', occurrence: enums_1.Occurrence.none, customType: 'Cosem-Method-Descriptor', }),
        new property_1.Property({ name: 'method-invocation-parameters', occurrence: enums_1.Occurrence.none, customType: 'Data', isOptional: true, })
    ],
});
const Action_Request_Next_Pblock = new type_definition_1.TypeDefinition({
    name: 'Action-Request-Next-Pblock',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'invoke-id-and-priority', occurrence: enums_1.Occurrence.none, customType: 'Invoke-Id-And-Priority', }),
        new property_1.Property({ name: 'block-number', occurrence: enums_1.Occurrence.none, customType: 'Unsigned32', })
    ],
});
const Action_Request_With_List = new type_definition_1.TypeDefinition({
    name: 'Action-Request-With-List',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'invoke-id-and-priority', occurrence: enums_1.Occurrence.none, customType: 'Invoke-Id-And-Priority', }),
        new property_1.Property({ name: 'cosem-method-descriptor-list', occurrence: enums_1.Occurrence.none, asn1Type: 'SEQUENCE OF', subType: 'Cosem-Method-Descriptor', }),
        new property_1.Property({ name: 'method-invocation-parameters', occurrence: enums_1.Occurrence.none, asn1Type: 'SEQUENCE OF', subType: 'Data', })
    ],
});
const Action_Request_With_First_Pblock = new type_definition_1.TypeDefinition({
    name: 'Action-Request-With-First-Pblock',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'invoke-id-and-priority', occurrence: enums_1.Occurrence.none, customType: 'Invoke-Id-And-Priority', }),
        new property_1.Property({ name: 'cosem-method-descriptor', occurrence: enums_1.Occurrence.none, customType: 'Cosem-Method-Descriptor', }),
        new property_1.Property({ name: 'pblock', occurrence: enums_1.Occurrence.none, customType: 'DataBlock-SA', })
    ],
});
const Action_Request_With_List_And_First_Pblock = new type_definition_1.TypeDefinition({
    name: 'Action-Request-With-List-And-First-Pblock',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'invoke-id-and-priority', occurrence: enums_1.Occurrence.none, customType: 'Invoke-Id-And-Priority', }),
        new property_1.Property({ name: 'cosem-method-descriptor-list', occurrence: enums_1.Occurrence.none, asn1Type: 'SEQUENCE OF', subType: 'Cosem-Method-Descriptor', }),
        new property_1.Property({ name: 'pblock', occurrence: enums_1.Occurrence.none, customType: 'DataBlock-SA', })
    ],
});
const Action_Request_With_Pblock = new type_definition_1.TypeDefinition({
    name: 'Action-Request-With-Pblock',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'invoke-id-and-priority', occurrence: enums_1.Occurrence.none, customType: 'Invoke-Id-And-Priority', }),
        new property_1.Property({ name: 'pblock', occurrence: enums_1.Occurrence.none, customType: 'DataBlock-SA', })
    ],
});
const Get_Response_Normal = new type_definition_1.TypeDefinition({
    name: 'Get-Response-Normal',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'invoke-id-and-priority', occurrence: enums_1.Occurrence.none, customType: 'Invoke-Id-And-Priority', }),
        new property_1.Property({ name: 'result', occurrence: enums_1.Occurrence.none, customType: 'Get-Data-Result', })
    ],
});
const Get_Response_With_Datablock = new type_definition_1.TypeDefinition({
    name: 'Get-Response-With-Datablock',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'invoke-id-and-priority', occurrence: enums_1.Occurrence.none, customType: 'Invoke-Id-And-Priority', }),
        new property_1.Property({ name: 'result', occurrence: enums_1.Occurrence.none, customType: 'DataBlock-G', })
    ],
});
const Get_Response_With_List = new type_definition_1.TypeDefinition({
    name: 'Get-Response-With-List',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'invoke-id-and-priority', occurrence: enums_1.Occurrence.none, customType: 'Invoke-Id-And-Priority', }),
        new property_1.Property({ name: 'result', occurrence: enums_1.Occurrence.none, asn1Type: 'SEQUENCE OF', subType: 'Get-Data-Result', })
    ],
});
const Set_Response_Normal = new type_definition_1.TypeDefinition({
    name: 'Set-Response-Normal',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'invoke-id-and-priority', occurrence: enums_1.Occurrence.none, customType: 'Invoke-Id-And-Priority', }),
        new property_1.Property({ name: 'result', occurrence: enums_1.Occurrence.none, customType: 'Data-Access-Result', })
    ],
});
const Set_Response_Datablock = new type_definition_1.TypeDefinition({
    name: 'Set-Response-Datablock',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'invoke-id-and-priority', occurrence: enums_1.Occurrence.none, customType: 'Invoke-Id-And-Priority', }),
        new property_1.Property({ name: 'block-number', occurrence: enums_1.Occurrence.none, customType: 'Unsigned32', })
    ],
});
const Set_Response_Last_Datablock = new type_definition_1.TypeDefinition({
    name: 'Set-Response-Last-Datablock',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'invoke-id-and-priority', occurrence: enums_1.Occurrence.none, customType: 'Invoke-Id-And-Priority', }),
        new property_1.Property({ name: 'result', occurrence: enums_1.Occurrence.none, customType: 'Data-Access-Result', }),
        new property_1.Property({ name: 'block-number', occurrence: enums_1.Occurrence.none, customType: 'Unsigned32', })
    ],
});
const Set_Response_Last_Datablock_With_List = new type_definition_1.TypeDefinition({
    name: 'Set-Response-Last-Datablock-With-List',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'invoke-id-and-priority', occurrence: enums_1.Occurrence.none, customType: 'Invoke-Id-And-Priority', }),
        new property_1.Property({ name: 'result', occurrence: enums_1.Occurrence.none, asn1Type: 'SEQUENCE OF', subType: 'Data-Access-Result', }),
        new property_1.Property({ name: 'block-number', occurrence: enums_1.Occurrence.none, customType: 'Unsigned32', })
    ],
});
const Set_Response_With_List = new type_definition_1.TypeDefinition({
    name: 'Set-Response-With-List',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'invoke-id-and-priority', occurrence: enums_1.Occurrence.none, customType: 'Invoke-Id-And-Priority', }),
        new property_1.Property({ name: 'result', occurrence: enums_1.Occurrence.none, asn1Type: 'SEQUENCE OF', subType: 'Data-Access-Result', })
    ],
});
const Action_Response_Normal = new type_definition_1.TypeDefinition({
    name: 'Action-Response-Normal',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'invoke-id-and-priority', occurrence: enums_1.Occurrence.none, customType: 'Invoke-Id-And-Priority', }),
        new property_1.Property({ name: 'single-response', occurrence: enums_1.Occurrence.none, customType: 'Action-Response-With-Optional-Data', })
    ],
});
const Action_Response_With_Pblock = new type_definition_1.TypeDefinition({
    name: 'Action-Response-With-Pblock',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'invoke-id-and-priority', occurrence: enums_1.Occurrence.none, customType: 'Invoke-Id-And-Priority', }),
        new property_1.Property({ name: 'pblock', occurrence: enums_1.Occurrence.none, customType: 'DataBlock-SA', })
    ],
});
const Action_Response_With_List = new type_definition_1.TypeDefinition({
    name: 'Action-Response-With-List',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'invoke-id-and-priority', occurrence: enums_1.Occurrence.none, customType: 'Invoke-Id-And-Priority', }),
        new property_1.Property({ name: 'list-of-responses', occurrence: enums_1.Occurrence.none, asn1Type: 'SEQUENCE OF', subType: 'Action-Response-With-Optional-Data', })
    ],
});
const Action_Response_Next_Pblock = new type_definition_1.TypeDefinition({
    name: 'Action-Response-Next-Pblock',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'invoke-id-and-priority', occurrence: enums_1.Occurrence.none, customType: 'Invoke-Id-And-Priority', }),
        new property_1.Property({ name: 'block-number', occurrence: enums_1.Occurrence.none, customType: 'Unsigned32', })
    ],
});
const Access_Request_Body = new type_definition_1.TypeDefinition({
    name: 'Access-Request-Body',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'access-request-specification', occurrence: enums_1.Occurrence.none, customType: 'List-Of-Access-Request-Specification', }),
        new property_1.Property({ name: 'access-request-list-of-data', occurrence: enums_1.Occurrence.none, customType: 'List-Of-Data', })
    ],
});
const Access_Response_Body = new type_definition_1.TypeDefinition({
    name: 'Access-Response-Body',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'access-request-specification', tag: 0, occurrence: enums_1.Occurrence.none, customType: 'List-Of-Access-Request-Specification', isOptional: true, }),
        new property_1.Property({ name: 'access-response-list-of-data', occurrence: enums_1.Occurrence.none, customType: 'List-Of-Data', }),
        new property_1.Property({ name: 'access-response-specification', occurrence: enums_1.Occurrence.none, customType: 'List-Of-Access-Response-Specification', })
    ],
});
const Key_Info = new type_definition_1.TypeDefinition({
    name: 'Key-Info',
    blockMode: enums_1.BlockMode.choice,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'identified-key', tag: 0, occurrence: enums_1.Occurrence.none, customType: 'Identified-Key', }),
        new property_1.Property({ name: 'wrapped-key', tag: 1, occurrence: enums_1.Occurrence.none, customType: 'Wrapped-Key', }),
        new property_1.Property({ name: 'agreed-key', tag: 2, occurrence: enums_1.Occurrence.none, customType: 'Agreed-Key', })
    ],
});
const Block_Control = new type_definition_1.TypeDefinition({
    name: 'Block-Control',
    blockMode: enums_1.BlockMode.single,
    occurrence: enums_1.Occurrence.none,
    customType: 'Unsigned8',
});
const Parameterized_Access = new type_definition_1.TypeDefinition({
    name: 'Parameterized-Access',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'variable-name', occurrence: enums_1.Occurrence.none, customType: 'ObjectName', }),
        new property_1.Property({ name: 'selector', occurrence: enums_1.Occurrence.none, customType: 'Unsigned8', }),
        new property_1.Property({ name: 'parameter', occurrence: enums_1.Occurrence.none, customType: 'Data', })
    ],
});
const Block_Number_Access = new type_definition_1.TypeDefinition({
    name: 'Block-Number-Access',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'block-number', occurrence: enums_1.Occurrence.none, customType: 'Unsigned16', })
    ],
});
const Read_Data_Block_Access = new type_definition_1.TypeDefinition({
    name: 'Read-Data-Block-Access',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'last-block', occurrence: enums_1.Occurrence.none, asn1Type: 'BOOLEAN', }),
        new property_1.Property({ name: 'block-number', occurrence: enums_1.Occurrence.none, customType: 'Unsigned16', }),
        new property_1.Property({ name: 'raw-data', occurrence: enums_1.Occurrence.none, asn1Type: 'OCTET STRING', })
    ],
});
const Write_Data_Block_Access = new type_definition_1.TypeDefinition({
    name: 'Write-Data-Block-Access',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'last-block', occurrence: enums_1.Occurrence.none, asn1Type: 'BOOLEAN', }),
        new property_1.Property({ name: 'block-number', occurrence: enums_1.Occurrence.none, customType: 'Unsigned16', })
    ],
});
const Integer32 = new type_definition_1.TypeDefinition({
    name: 'Integer32',
    blockMode: enums_1.BlockMode.single,
    occurrence: enums_1.Occurrence.none,
    asn1Type: 'INTEGER',
    typeParameter: '(-2147483648..2147483647)',
});
const Unsigned32 = new type_definition_1.TypeDefinition({
    name: 'Unsigned32',
    blockMode: enums_1.BlockMode.single,
    occurrence: enums_1.Occurrence.none,
    asn1Type: 'INTEGER',
    typeParameter: '(0..4294967295)',
});
const Integer16 = new type_definition_1.TypeDefinition({
    name: 'Integer16',
    blockMode: enums_1.BlockMode.single,
    occurrence: enums_1.Occurrence.none,
    asn1Type: 'INTEGER',
    typeParameter: '(-32768..32767)',
});
const Integer64 = new type_definition_1.TypeDefinition({
    name: 'Integer64',
    blockMode: enums_1.BlockMode.single,
    occurrence: enums_1.Occurrence.none,
    asn1Type: 'INTEGER',
    typeParameter: '(-9223372036854775808..9223372036854775807)',
});
const Unsigned64 = new type_definition_1.TypeDefinition({
    name: 'Unsigned64',
    blockMode: enums_1.BlockMode.single,
    occurrence: enums_1.Occurrence.none,
    asn1Type: 'INTEGER',
    typeParameter: '(0..18446744073709551615)',
});
const Invoke_Id_And_Priority = new type_definition_1.TypeDefinition({
    name: 'Invoke-Id-And-Priority',
    blockMode: enums_1.BlockMode.single,
    occurrence: enums_1.Occurrence.none,
    customType: 'Unsigned8',
});
const Selective_Access_Descriptor = new type_definition_1.TypeDefinition({
    name: 'Selective-Access-Descriptor',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'access-selector', occurrence: enums_1.Occurrence.none, customType: 'Unsigned8', }),
        new property_1.Property({ name: 'access-parameters', occurrence: enums_1.Occurrence.none, customType: 'Data', })
    ],
});
const Cosem_Attribute_Descriptor_With_Selection = new type_definition_1.TypeDefinition({
    name: 'Cosem-Attribute-Descriptor-With-Selection',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'cosem-attribute-descriptor', occurrence: enums_1.Occurrence.none, customType: 'Cosem-Attribute-Descriptor', }),
        new property_1.Property({ name: 'access-selection', occurrence: enums_1.Occurrence.none, customType: 'Selective-Access-Descriptor', isOptional: true, })
    ],
});
const DataBlock_SA = new type_definition_1.TypeDefinition({
    name: 'DataBlock-SA',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'last-block', occurrence: enums_1.Occurrence.none, asn1Type: 'BOOLEAN', }),
        new property_1.Property({ name: 'block-number', occurrence: enums_1.Occurrence.none, customType: 'Unsigned32', }),
        new property_1.Property({ name: 'raw-data', occurrence: enums_1.Occurrence.none, asn1Type: 'OCTET STRING', })
    ],
});
const Cosem_Class_Id = new type_definition_1.TypeDefinition({
    name: 'Cosem-Class-Id',
    blockMode: enums_1.BlockMode.single,
    occurrence: enums_1.Occurrence.none,
    customType: 'Unsigned16',
});
const Cosem_Object_Instance_Id = new type_definition_1.TypeDefinition({
    name: 'Cosem-Object-Instance-Id',
    blockMode: enums_1.BlockMode.single,
    occurrence: enums_1.Occurrence.none,
    asn1Type: 'OCTET STRING',
    typeParameter: '(SIZE(6))',
});
const Cosem_Object_Attribute_Id = new type_definition_1.TypeDefinition({
    name: 'Cosem-Object-Attribute-Id',
    blockMode: enums_1.BlockMode.single,
    occurrence: enums_1.Occurrence.none,
    customType: 'Integer8',
});
const Cosem_Method_Descriptor = new type_definition_1.TypeDefinition({
    name: 'Cosem-Method-Descriptor',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'class-id', occurrence: enums_1.Occurrence.none, customType: 'Cosem-Class-Id', }),
        new property_1.Property({ name: 'instance-id', occurrence: enums_1.Occurrence.none, customType: 'Cosem-Object-Instance-Id', }),
        new property_1.Property({ name: 'method-id', occurrence: enums_1.Occurrence.none, customType: 'Cosem-Object-Method-Id', })
    ],
});
const Get_Data_Result = new type_definition_1.TypeDefinition({
    name: 'Get-Data-Result',
    blockMode: enums_1.BlockMode.choice,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'data', tag: 0, occurrence: enums_1.Occurrence.none, customType: 'Data', }),
        new property_1.Property({ name: 'data-access-result', tag: 1, occurrence: enums_1.Occurrence.implicit, customType: 'Data-Access-Result', })
    ],
});
const DataBlock_G = new type_definition_1.TypeDefinition({
    name: 'DataBlock-G',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'last-block', occurrence: enums_1.Occurrence.none, asn1Type: 'BOOLEAN', }),
        new property_1.Property({ name: 'block-number', occurrence: enums_1.Occurrence.none, customType: 'Unsigned32', }),
        new property_1.Property({ name: 'result', occurrence: enums_1.Occurrence.none, asn1Type: 'CHOICE', typeParameter: '{ raw-data [0] IMPLICIT OCTET STRING', }),
        new property_1.Property({ name: 'result', occurrence: enums_1.Occurrence.none, asn1Type: 'CHOICE', typeParameter: '{ raw-data [0] IMPLICIT OCTET STRING, data-access-result [1] IMPLICIT Data-Access-Result }', })
    ],
});
const Action_Response_With_Optional_Data = new type_definition_1.TypeDefinition({
    name: 'Action-Response-With-Optional-Data',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'result', occurrence: enums_1.Occurrence.none, customType: 'Action-Result', }),
        new property_1.Property({ name: 'return-parameters', occurrence: enums_1.Occurrence.none, customType: 'Get-Data-Result', isOptional: true, })
    ],
});
const List_Of_Access_Request_Specification = new type_definition_1.TypeDefinition({
    name: 'List-Of-Access-Request-Specification',
    blockMode: enums_1.BlockMode.single,
    occurrence: enums_1.Occurrence.none,
    asn1Type: 'SEQUENCE OF',
    typeParameter: 'Access-Request-Specification',
});
const List_Of_Data = new type_definition_1.TypeDefinition({
    name: 'List-Of-Data',
    blockMode: enums_1.BlockMode.single,
    occurrence: enums_1.Occurrence.none,
    asn1Type: 'SEQUENCE OF',
    typeParameter: 'Data',
});
const List_Of_Access_Response_Specification = new type_definition_1.TypeDefinition({
    name: 'List-Of-Access-Response-Specification',
    blockMode: enums_1.BlockMode.single,
    occurrence: enums_1.Occurrence.none,
    asn1Type: 'SEQUENCE OF',
    typeParameter: 'Access-Response-Specification',
});
const Identified_Key = new type_definition_1.TypeDefinition({
    name: 'Identified-Key',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'key-id', occurrence: enums_1.Occurrence.none, customType: 'Key-Id', })
    ],
});
const Wrapped_Key = new type_definition_1.TypeDefinition({
    name: 'Wrapped-Key',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'kek-id', occurrence: enums_1.Occurrence.none, customType: 'Kek-Id', }),
        new property_1.Property({ name: 'key-ciphered-data', occurrence: enums_1.Occurrence.none, asn1Type: 'OCTET STRING', })
    ],
});
const Agreed_Key = new type_definition_1.TypeDefinition({
    name: 'Agreed-Key',
    blockMode: enums_1.BlockMode.sequence,
    occurrence: enums_1.Occurrence.none,
    properties: [
        new property_1.Property({ name: 'key-parameters', occurrence: enums_1.Occurrence.none, asn1Type: 'OCTET STRING', }),
        new property_1.Property({ name: 'key-ciphered-data', occurrence: enums_1.Occurrence.none, asn1Type: 'OCTET STRING', })
    ],
});
const Cosem_Object_Method_Id = new type_definition_1.TypeDefinition({
    name: 'Cosem-Object-Method-Id',
    blockMode: enums_1.BlockMode.single,
    occurrence: enums_1.Occurrence.none,
    customType: 'Integer8',
});
const Action_Result = new type_definition_1.TypeDefinition({
    name: 'Action-Result',
    blockMode: enums_1.BlockMode.enumerated,
    occurrence: enums_1.Occurrence.none,
    enumerations: [
        new enumeration_1.Enumeration('success', 0),
        new enumeration_1.Enumeration('hardware-fault', 1),
        new enumeration_1.Enumeration('temporary-failure', 2),
        new enumeration_1.Enumeration('read-write-denied', 3),
        new enumeration_1.Enumeration('object-undefined', 4),
        new enumeration_1.Enumeration('object-class-inconsistent', 9),
        new enumeration_1.Enumeration('object-unavailable', 11),
        new enumeration_1.Enumeration('type-unmatched', 12),
        new enumeration_1.Enumeration('scope-of-access-violated', 13),
        new enumeration_1.Enumeration('data-block-unavailable', 14),
        new enumeration_1.Enumeration('long-action-aborted', 15),
        new enumeration_1.Enumeration('no-long-action-in-progress', 16),
        new enumeration_1.Enumeration('other-reason', 250)
    ],
});
const Key_Id = new type_definition_1.TypeDefinition({
    name: 'Key-Id',
    blockMode: enums_1.BlockMode.enumerated,
    occurrence: enums_1.Occurrence.none,
    enumerations: [
        new enumeration_1.Enumeration('global-unicast-encryption-key', 0),
        new enumeration_1.Enumeration('global-broadcast-encryption-key', 1)
    ],
});
const Kek_Id = new type_definition_1.TypeDefinition({
    name: 'Kek-Id',
    blockMode: enums_1.BlockMode.enumerated,
    occurrence: enums_1.Occurrence.none,
    enumerations: [
        new enumeration_1.Enumeration('master-key', 0)
    ],
});
exports.cosemTypeDefinitionMap = new Map([
    ['XDLMS-APDU', XDLMS_APDU],
    ['InitiateRequest', InitiateRequest],
    ['ReadRequest', ReadRequest],
    ['WriteRequest', WriteRequest],
    ['InitiateResponse', InitiateResponse],
    ['ReadResponse', ReadResponse],
    ['WriteResponse', WriteResponse],
    ['ConfirmedServiceError', ConfirmedServiceError],
    ['Data-Notification', Data_Notification],
    ['UnconfirmedWriteRequest', UnconfirmedWriteRequest],
    ['InformationReportRequest', InformationReportRequest],
    ['Get-Request', Get_Request],
    ['Set-Request', Set_Request],
    ['EventNotificationRequest', EventNotificationRequest],
    ['Action-Request', Action_Request],
    ['Get-Response', Get_Response],
    ['Set-Response', Set_Response],
    ['Action-Response', Action_Response],
    ['ExceptionResponse', ExceptionResponse],
    ['Access-Request', Access_Request],
    ['Access-Response', Access_Response],
    ['General-Glo-Ciphering', General_Glo_Ciphering],
    ['General-Ded-Ciphering', General_Ded_Ciphering],
    ['General-Ciphering', General_Ciphering],
    ['General-Signing', General_Signing],
    ['General-Block-Transfer', General_Block_Transfer],
    ['Integer8', Integer8],
    ['Unsigned8', Unsigned8],
    ['Conformance', Conformance],
    ['Unsigned16', Unsigned16],
    ['Variable-Access-Specification', Variable_Access_Specification],
    ['Data', Data],
    ['ObjectName', ObjectName],
    ['Data-Access-Result', Data_Access_Result],
    ['Data-Block-Result', Data_Block_Result],
    ['ServiceError', ServiceError],
    ['Long-Invoke-Id-And-Priority', Long_Invoke_Id_And_Priority],
    ['Notification-Body', Notification_Body],
    ['Get-Request-Normal', Get_Request_Normal],
    ['Get-Request-Next', Get_Request_Next],
    ['Get-Request-With-List', Get_Request_With_List],
    ['Set-Request-Normal', Set_Request_Normal],
    ['Set-Request-With-First-Datablock', Set_Request_With_First_Datablock],
    ['Set-Request-With-Datablock', Set_Request_With_Datablock],
    ['Set-Request-With-List', Set_Request_With_List],
    ['Set-Request-With-List-And-First-Datablock', Set_Request_With_List_And_First_Datablock],
    ['Cosem-Attribute-Descriptor', Cosem_Attribute_Descriptor],
    ['Action-Request-Normal', Action_Request_Normal],
    ['Action-Request-Next-Pblock', Action_Request_Next_Pblock],
    ['Action-Request-With-List', Action_Request_With_List],
    ['Action-Request-With-First-Pblock', Action_Request_With_First_Pblock],
    ['Action-Request-With-List-And-First-Pblock', Action_Request_With_List_And_First_Pblock],
    ['Action-Request-With-Pblock', Action_Request_With_Pblock],
    ['Get-Response-Normal', Get_Response_Normal],
    ['Get-Response-With-Datablock', Get_Response_With_Datablock],
    ['Get-Response-With-List', Get_Response_With_List],
    ['Set-Response-Normal', Set_Response_Normal],
    ['Set-Response-Datablock', Set_Response_Datablock],
    ['Set-Response-Last-Datablock', Set_Response_Last_Datablock],
    ['Set-Response-Last-Datablock-With-List', Set_Response_Last_Datablock_With_List],
    ['Set-Response-With-List', Set_Response_With_List],
    ['Action-Response-Normal', Action_Response_Normal],
    ['Action-Response-With-Pblock', Action_Response_With_Pblock],
    ['Action-Response-With-List', Action_Response_With_List],
    ['Action-Response-Next-Pblock', Action_Response_Next_Pblock],
    ['Access-Request-Body', Access_Request_Body],
    ['Access-Response-Body', Access_Response_Body],
    ['Key-Info', Key_Info],
    ['Block-Control', Block_Control],
    ['Parameterized-Access', Parameterized_Access],
    ['Block-Number-Access', Block_Number_Access],
    ['Read-Data-Block-Access', Read_Data_Block_Access],
    ['Write-Data-Block-Access', Write_Data_Block_Access],
    ['Integer32', Integer32],
    ['Unsigned32', Unsigned32],
    ['Integer16', Integer16],
    ['Integer64', Integer64],
    ['Unsigned64', Unsigned64],
    ['Invoke-Id-And-Priority', Invoke_Id_And_Priority],
    ['Selective-Access-Descriptor', Selective_Access_Descriptor],
    ['Cosem-Attribute-Descriptor-With-Selection', Cosem_Attribute_Descriptor_With_Selection],
    ['DataBlock-SA', DataBlock_SA],
    ['Cosem-Class-Id', Cosem_Class_Id],
    ['Cosem-Object-Instance-Id', Cosem_Object_Instance_Id],
    ['Cosem-Object-Attribute-Id', Cosem_Object_Attribute_Id],
    ['Cosem-Method-Descriptor', Cosem_Method_Descriptor],
    ['Get-Data-Result', Get_Data_Result],
    ['DataBlock-G', DataBlock_G],
    ['Action-Response-With-Optional-Data', Action_Response_With_Optional_Data],
    ['List-Of-Access-Request-Specification', List_Of_Access_Request_Specification],
    ['List-Of-Data', List_Of_Data],
    ['List-Of-Access-Response-Specification', List_Of_Access_Response_Specification],
    ['Identified-Key', Identified_Key],
    ['Wrapped-Key', Wrapped_Key],
    ['Agreed-Key', Agreed_Key],
    ['Cosem-Object-Method-Id', Cosem_Object_Method_Id],
    ['Action-Result', Action_Result],
    ['Key-Id', Key_Id],
    ['Kek-Id', Kek_Id]
]);


/***/ }),

/***/ 958:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DebugLogger = void 0;
const setting_classes_1 = __webpack_require__(312);
const simple_xml_processor_1 = __webpack_require__(368);
class DebugLogger {
    constructor() {
        this.logSerialPortBuffers = [];
        this.logSerialPortByteCount = 0;
    }
    logSerialPortData(serialPortData) {
        if (setting_classes_1.DebugSettings.logSerialPortMinBytes <= 1) {
            console.log(serialPortData.toString('hex'));
            return;
        }
        if (this.logSerialPortByteCount == 0 && serialPortData.length >= setting_classes_1.DebugSettings.logSerialPortMinBytes) {
            console.log(serialPortData.toString('hex'));
            return;
        }
        this.logSerialPortBuffers.push(serialPortData);
        this.logSerialPortByteCount += serialPortData.length;
        if (this.logSerialPortByteCount < setting_classes_1.DebugSettings.logSerialPortMinBytes) {
            return;
        }
        console.log(Buffer.concat(this.logSerialPortBuffers).toString('hex'));
        this.logSerialPortBuffers = [];
        this.logSerialPortByteCount = 0;
    }
    logSerialPortDataEnd() {
        if (setting_classes_1.DebugSettings.logSerialPort && setting_classes_1.DebugSettings.logSerialPortMinBytes > 1 && this.logSerialPortByteCount > 0) {
            console.log(Buffer.concat(this.logSerialPortBuffers).toString('hex'));
        }
    }
    logTelegrams(telegrams) {
        if (setting_classes_1.DebugSettings.logTelegramRaw) {
            telegrams.forEach((t) => { var _a; return console.log('Telegram: ', (_a = t.telegramRaw) === null || _a === void 0 ? void 0 : _a.toString('hex')); });
        }
        if (setting_classes_1.DebugSettings.logTelegramJson) {
            telegrams.forEach((t) => console.log('Telegram: ', t));
        }
    }
    logApplicationDataUnits(applicationDataUnits) {
        if (setting_classes_1.DebugSettings.logApduRaw) {
            applicationDataUnits.forEach((apdu) => console.log('APDU: ', apdu.apduRaw.toString('hex')));
        }
        if (setting_classes_1.DebugSettings.logApduJson) {
            applicationDataUnits.forEach((apdu) => {
                console.log('APDU:');
                console.dir(apdu, { depth: 5 });
            });
        }
        if (setting_classes_1.DebugSettings.logApduEncryptedRaw) {
            applicationDataUnits.forEach((apdu) => console.log('APDU payload encrypted: ', apdu.encryptedPayload.toString('hex')));
        }
        if (setting_classes_1.DebugSettings.logApduDecryptedRaw) {
            applicationDataUnits.forEach((apdu) => console.log('APDU payload decrypted: ', apdu.decryptedPayload.toString('hex')));
        }
    }
    logCosemData(cosemResult) {
        if (setting_classes_1.DebugSettings.logApduCosemJson) {
            console.log('APDU COSEM Data:');
            console.dir(cosemResult, { depth: null });
        }
        if (setting_classes_1.DebugSettings.logApduCosemXml) {
            const simpleXmlProcessor = new simple_xml_processor_1.SimpleXmlProcessor();
            const xml = simpleXmlProcessor.transform(cosemResult);
            console.log('APDU COSEM XML: ', xml);
        }
    }
    logObisData(dataNotification) {
        var _a, _b, _c;
        if (setting_classes_1.DebugSettings.logObisValuesJson) {
            //console.log('Data Notification Obis Data: ', dataNotification);
            console.log('Custom Data Notification Obis Data (JSON):');
            console.dir(dataNotification, { depth: 10 });
        }
        if (setting_classes_1.DebugSettings.logObisValuesPlain) {
            console.log('Custom Data Notification Obis Data (plain text):');
            console.log('Invoke Id:', (_a = dataNotification === null || dataNotification === void 0 ? void 0 : dataNotification.longInvokeIdAndPriority) === null || _a === void 0 ? void 0 : _a.dec);
            console.log('Datetime:', (_b = dataNotification === null || dataNotification === void 0 ? void 0 : dataNotification.dateTime) === null || _b === void 0 ? void 0 : _b.asString);
            for (const obisValue of (_c = dataNotification === null || dataNotification === void 0 ? void 0 : dataNotification.notificationBody) === null || _c === void 0 ? void 0 : _c.obisValues) {
                console.log(obisValue.obisCode, obisValue.obisName, obisValue.stringValue);
            }
        }
    }
}
exports.DebugLogger = DebugLogger;


/***/ }),

/***/ 82:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KeySet = exports.ApplicationDataProvisioning = exports.ApplicationDataState = exports.TelegramState = void 0;
var TelegramState;
(function (TelegramState) {
    TelegramState[TelegramState["pending"] = 0] = "pending";
    TelegramState[TelegramState["available"] = 1] = "available";
})(TelegramState = exports.TelegramState || (exports.TelegramState = {}));
// APDU: application protocol data unit
var ApplicationDataState;
(function (ApplicationDataState) {
    ApplicationDataState[ApplicationDataState["pending"] = 0] = "pending";
    ApplicationDataState[ApplicationDataState["available"] = 1] = "available";
})(ApplicationDataState = exports.ApplicationDataState || (exports.ApplicationDataState = {}));
var ApplicationDataProvisioning;
(function (ApplicationDataProvisioning) {
    ApplicationDataProvisioning[ApplicationDataProvisioning["lastOnly"] = 0] = "lastOnly";
    ApplicationDataProvisioning[ApplicationDataProvisioning["all"] = 1] = "all";
})(ApplicationDataProvisioning = exports.ApplicationDataProvisioning || (exports.ApplicationDataProvisioning = {}));
var KeySet;
(function (KeySet) {
    KeySet[KeySet["unicast"] = 0] = "unicast";
    KeySet[KeySet["broadcast"] = 1] = "broadcast";
})(KeySet = exports.KeySet || (exports.KeySet = {}));


/***/ }),

/***/ 222:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MultiTelegramReader = void 0;
const enums_1 = __webpack_require__(82);
const application_protocol_data_unit_1 = __webpack_require__(535);
const application_data_decrypter_1 = __webpack_require__(91);
// transport layer - reads APDUs (application protocol data unit) from one or more TPDU (transport protocol data unit)
class MultiTelegramReader {
    // telegramReader would not be needed if addTelegram() is not used, but it has to be defined in the calling code anyway
    constructor(telegramReader, provisioning = enums_1.ApplicationDataProvisioning.all, decrypt = true) {
        this.telegramReader = telegramReader;
        this.provisioning = provisioning;
        this.decrypt = decrypt;
        this.applicationDataUnits = [];
        this.currentApplicationDataUnit = new application_protocol_data_unit_1.ApplicationProtocolDataUnit();
        this.currentApplicationDataUnits = [];
        this.currentSequenceNumber = 0;
    }
    areApplicationDataUnitsAvailable() {
        return this.applicationDataUnits.length > 0 ? enums_1.ApplicationDataState.available : enums_1.ApplicationDataState.pending;
    }
    addRawData(newData) {
        const telegramStatus = this.telegramReader.addRawData(newData);
        if (telegramStatus == enums_1.TelegramState.available) {
            const telegrams = this.telegramReader.getTelegrams();
            return this.addTelegrams(telegrams);
        }
        return this.areApplicationDataUnitsAvailable();
    }
    addTelegrams(newTelegrams) {
        for (let newTelegram of newTelegrams) {
            if (newTelegram.sequenceNumber != this.currentSequenceNumber) {
                console.log(`addTelegrams: Sequence number does not match. Start over. Expected: ${this.currentSequenceNumber}. Received: ${newTelegram.sequenceNumber}`);
                this.resetSearch();
                continue;
            }
            if (!newTelegram.applicationData) {
                console.warn(`addTelegrams: Application data not set.`);
                this.resetSearch();
                continue;
            }
            if (newTelegram.sequenceNumber === 0) {
                if (newTelegram.applicationData.length < 17) {
                    console.warn(`addTelegrams: Application data length of first telegram in sequence invalid. Start over. Expected: >= 17. Received: ${newTelegram.applicationData.length}`);
                    this.resetSearch();
                    continue;
                }
                this.currentApplicationDataUnit.cypheringService = newTelegram.applicationData[0];
                if (this.currentApplicationDataUnit.cypheringService != MultiTelegramReader.cypheringServiceGeneralGloCiphering) {
                    console.warn(`addTelegrams: Application data cyphering service invalid. Start over. Expected: ${MultiTelegramReader.cypheringServiceGeneralGloCiphering.toString(16)}. Received: ${this.currentApplicationDataUnit.cypheringService.toString(16)}`);
                    this.resetSearch();
                    continue;
                }
                this.currentApplicationDataUnit.setSystemTitle(newTelegram.applicationData.subarray(2, 10));
                // length field has either 1 byte (length <= 127) or 3 bytes
                const lengthFieldLength = this.currentApplicationDataUnit.setLength(newTelegram.applicationData, 10, 13);
                const offset = lengthFieldLength - 1;
                this.currentApplicationDataUnit.securityControl = newTelegram.applicationData[11 + offset];
                this.currentApplicationDataUnit.setFrameCounter(newTelegram.applicationData, 12 + offset, 16 + offset);
            }
            this.currentApplicationDataUnits.push(newTelegram.applicationData);
            if (!newTelegram.isLastSegment) {
                this.currentSequenceNumber++;
                continue;
            }
            // last segment:
            this.currentApplicationDataUnit.apduRaw = Buffer.concat(this.currentApplicationDataUnits);
            this.currentApplicationDataUnit.encryptedPayload = this.currentApplicationDataUnit.apduRaw.subarray(16 + this.currentApplicationDataUnit.lengthFieldLength - 1);
            // no decryption if testing
            if (this.decrypt) {
                application_data_decrypter_1.ApplicationDataDecrypter.Decrypt(this.currentApplicationDataUnit);
                if (this.currentApplicationDataUnit.lengthEncryptedPayload != this.currentApplicationDataUnit.encryptedPayload.length) {
                    console.warn(`addTelegrams: Application data length of combined segments invalid. Start over. Expected: ${this.currentApplicationDataUnit.lengthEncryptedPayload}. Received: ${this.currentApplicationDataUnit.encryptedPayload.length}`);
                    //console.log(JSON.stringify(this.currentApplicationDataUnit));
                    this.resetSearch();
                    continue;
                }
            }
            // everything seems to be fine:
            if (this.provisioning == enums_1.ApplicationDataProvisioning.all) {
                this.applicationDataUnits.push(this.currentApplicationDataUnit);
            }
            else {
                this.applicationDataUnits = [this.currentApplicationDataUnit];
            }
            this.resetSearch();
        }
        return this.areApplicationDataUnitsAvailable();
    }
    getApplicationDataUnits() {
        const ret = [...this.applicationDataUnits];
        this.applicationDataUnits = [];
        return ret;
    }
    resetSearch() {
        this.currentSequenceNumber = 0;
        this.currentApplicationDataUnit = new application_protocol_data_unit_1.ApplicationProtocolDataUnit();
        this.currentApplicationDataUnits = [];
    }
}
exports.MultiTelegramReader = MultiTelegramReader;
// either use addRawData() or addTelegrams() - not both
MultiTelegramReader.cypheringServiceGeneralGloCiphering = 0xDB;


/***/ }),

/***/ 286:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ObisTools = void 0;
const smartmeter_obis_1 = __webpack_require__(914);
class ObisTools {
    static getObisCode(rawObisCode, language = 'de') {
        let code = "";
        let mediumCode;
        let channelCode;
        let measurementCode;
        let measureTypeCode;
        let tariffCode;
        let previousMeasurementCode;
        mediumCode = ObisTools.getSingleFromRaw(rawObisCode, 0);
        if (mediumCode != undefined) {
            code = mediumCode.toString();
            channelCode = ObisTools.getSingleFromRaw(rawObisCode, 1);
            if (channelCode != undefined) {
                code += `-${channelCode}`;
                measurementCode = ObisTools.getSingleFromRaw(rawObisCode, 2);
                if (measurementCode != undefined) {
                    code += `:${measurementCode}`;
                    measureTypeCode = ObisTools.getSingleFromRaw(rawObisCode, 3);
                    if (measureTypeCode != undefined) {
                        code += `.${measureTypeCode}`;
                        tariffCode = ObisTools.getSingleFromRaw(rawObisCode, 4);
                        if (tariffCode != undefined) {
                            code += `.${tariffCode}`;
                            previousMeasurementCode = ObisTools.getSingleFromRaw(rawObisCode, 5);
                            if (previousMeasurementCode != undefined) {
                                code += `*${previousMeasurementCode}`;
                            }
                        }
                    }
                }
            }
        }
        let obisCode = ObisTools.getCustomObisNames(code, language);
        if (obisCode) {
            return obisCode;
        }
        // unable to initialize ObisMeasurement from typescript
        const obisMeasurement = new smartmeter_obis_1.ObisMeasurement();
        obisMeasurement.medium = mediumCode !== null && mediumCode !== void 0 ? mediumCode : 0;
        obisMeasurement.channel = channelCode !== null && channelCode !== void 0 ? channelCode : 0;
        obisMeasurement.measurement = measurementCode !== null && measurementCode !== void 0 ? measurementCode : 0;
        obisMeasurement.measureType = measureTypeCode !== null && measureTypeCode !== void 0 ? measureTypeCode : 0;
        obisMeasurement.tariffRate = tariffCode !== null && tariffCode !== void 0 ? tariffCode : 0;
        obisMeasurement.previousMeasurement = previousMeasurementCode !== null && previousMeasurementCode !== void 0 ? previousMeasurementCode : 0;
        const obisMeasurementNames = smartmeter_obis_1.ObisNames.resolveObisName(obisMeasurement, language == 'de' ? 'de' : 'en');
        const fullName = `${obisMeasurementNames.mediumName} ${obisMeasurementNames.obisName}`;
        let name = `${obisMeasurementNames.measurementName}, ${obisMeasurementNames.measurementTypeName}`;
        if (tariffCode != 0) {
            name += ` ${obisMeasurementNames.tariffRateName}`;
        }
        if (previousMeasurementCode != 0 && previousMeasurementCode != 255 && obisMeasurement.previousMeasurement) {
            name += ` ${obisMeasurementNames.previousMeasurementName}`;
        }
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
    static getSingleFromRaw(rawObisCode, position) {
        if (rawObisCode.length <= position)
            return undefined;
        return rawObisCode[position];
    }
    static getCustomObisNames(code, language) {
        if (language == 'de') {
            if (code == '0-0:1.0.0*255')
                return { code, fullName: 'Abstrakt Zeitpunkt', name: "Zeitpunkt", medium: 'Abstrakt' };
            if (code == '0-0:96.1.0*255')
                return { code, fullName: 'Abstrakt Zählernummer', name: "Zählernummer", medium: 'Abstrakt' };
            if (code == '0-0:42.0.0*255')
                return { code, fullName: 'Abstrakt logischer Gerätename', name: "COSEM logischer Gerätename", medium: 'Abstrakt' };
        }
        else {
            if (code == '0-0:1.0.0*255')
                return { code, fullName: 'Abstract Timestamp', name: "Timestamp", medium: "Abstract" };
            if (code == '0-0:96.1.0*255')
                return { code, fullName: 'Abstract Smart meter number', name: "Smart meter number", medium: 'Abstract' };
            if (code == '0-0:42.0.0*255')
                return { code, fullName: 'Abstract COSEM logical device name', name: "COSEM logical device name", medium: 'Abstract' };
        }
    }
}
exports.ObisTools = ObisTools;


/***/ }),

/***/ 794:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReceiveBuffer = void 0;
class ReceiveBuffer {
    get length() {
        return this._length;
    }
    constructor(initialSize, maxSize = 8192) {
        this.initialSize = initialSize;
        this.maxSize = maxSize;
        this._length = 0;
        this.buffer = Buffer.allocUnsafe(initialSize);
    }
    reset() {
        this._length = 0;
    }
    addBuffer(newBuffer, newBufferStart = 0) {
        const newLength = newBuffer.length - newBufferStart + this._length;
        if (newLength > this.buffer.length) {
            if (newLength > this.maxSize) {
                console.error(`ReceiveBuffer.addBuffer overflow. Buffer size: ${this.buffer.length}. Max size: ${this.maxSize}. Current length: ${this._length}. New data length: ${newBuffer.length - newBufferStart}`);
                return false;
            }
            if (this.buffer.length < this.maxSize) {
                console.warn(`ReceiveBuffer.addBuffer overflow. Buffer size: ${this.buffer.length}. Current length: ${this._length}. New data length: ${newBuffer.length - newBufferStart}. Size increased to ${this.maxSize}`);
                const maxSizeBuffer = Buffer.allocUnsafe(this.maxSize);
                if (this._length > 0) {
                    this.buffer.copy(maxSizeBuffer, 0, 0, this._length);
                }
                this.buffer = maxSizeBuffer;
            }
        }
        newBuffer.copy(this.buffer, this._length, newBufferStart);
        this._length = newLength;
        return true;
    }
    checkForNewStartIndex(startByte) {
        const firstPossibleIndex = 1;
        const newStartByteIndex = this.buffer.indexOf(startByte, firstPossibleIndex);
        if (newStartByteIndex < firstPossibleIndex) {
            this._length = 0;
            return false;
        }
        if (newStartByteIndex >= this._length) {
            this._length = 0;
            return false;
        }
        this.buffer.copy(this.buffer, 0, newStartByteIndex, this._length);
        this._length -= newStartByteIndex;
        return true;
    }
    asNumberArray() {
        //return [...this.buffer.subarray(0, this._length)];
        // stupid JS/Node: toJSON is 10 times faster.
        // code similar to toJson:
        const result = new Array(this._length);
        for (let i = 0; i < this._length; i++) {
            result[i] = this.buffer[i];
        }
        return result;
    }
}
exports.ReceiveBuffer = ReceiveBuffer;


/***/ }),

/***/ 312:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Settings = exports.DebugSettings = exports.DecodingSettings = exports.DecryptionSettings = exports.SerialPortSettings = void 0;
const config_1 = __importDefault(__webpack_require__(771));
//import * as config from 'config';
class SerialPortSettings {
    static read() {
        SerialPortSettings.port = config_1.default.get('serialPort.port');
        SerialPortSettings.baudRate = config_1.default.get('serialPort.baudRate');
        SerialPortSettings.dataBits = config_1.default.get('serialPort.dataBits');
        SerialPortSettings.parity = config_1.default.get('serialPort.parity');
        SerialPortSettings.stopBits = config_1.default.get('serialPort.stopBits');
    }
}
exports.SerialPortSettings = SerialPortSettings;
SerialPortSettings.port = '';
SerialPortSettings.baudRate = 2400;
SerialPortSettings.dataBits = 8;
SerialPortSettings.parity = 'none';
SerialPortSettings.stopBits = 1;
class DecryptionSettings {
    static read() {
        DecryptionSettings.key = config_1.default.get('decryption.key');
    }
}
exports.DecryptionSettings = DecryptionSettings;
DecryptionSettings.key = '';
class DecodingSettings {
    static read() {
        DecodingSettings.language = config_1.default.get('decoding.obisLanguage');
    }
}
exports.DecodingSettings = DecodingSettings;
DecodingSettings.language = 'en';
class DebugSettings {
    static read() {
        DebugSettings.maxBytes = config_1.default.get('debug.maxBytes');
        DebugSettings.maxTelegrams = config_1.default.get('debug.maxTelegrams');
        DebugSettings.maxApplicationDataUnits = config_1.default.get('debug.maxApplicationDataUnits');
        DebugSettings.logSerialPort = config_1.default.get('debug.logSerialPort');
        DebugSettings.logSerialPortMinBytes = config_1.default.get('debug.logSerialPortMinBytes');
        DebugSettings.logTelegramRaw = config_1.default.get('debug.logTelegramRaw');
        DebugSettings.logTelegramJson = config_1.default.get('debug.logTelegramJson');
        DebugSettings.logApduRaw = config_1.default.get('debug.logApduRaw');
        DebugSettings.logApduJson = config_1.default.get('debug.logApduJson');
        DebugSettings.logApduEncryptedRaw = config_1.default.get('debug.logApduEncryptedRaw');
        DebugSettings.logApduDecryptedRaw = config_1.default.get('debug.logApduDecryptedRaw');
        DebugSettings.logApduCosemJson = config_1.default.get('debug.logApduCosemJson');
        DebugSettings.logApduCosemXml = config_1.default.get('debug.logApduCosemXml');
        DebugSettings.logObisValuesJson = config_1.default.get('debug.logObisValuesJson');
        DebugSettings.logObisValuesPlain = config_1.default.get('debug.logObisValuesPlain');
    }
}
exports.DebugSettings = DebugSettings;
// stop after this many if > 0
DebugSettings.maxBytes = 0; // raw bytes from serial port
DebugSettings.maxTelegrams = 0;
DebugSettings.maxApplicationDataUnits = 0;
class Settings {
    static read() {
        SerialPortSettings.read();
        DecryptionSettings.read();
        DecodingSettings.read();
        DebugSettings.read();
    }
}
exports.Settings = Settings;
Settings.serialPort = SerialPortSettings;
Settings.decryption = DecryptionSettings;
Settings.decoding = DecodingSettings;
Settings.debug = DebugSettings;


/***/ }),

/***/ 368:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SimpleXmlProcessor = void 0;
class SimpleXmlNode {
    constructor(tagName, children, attributes = [], comment) {
        this.tagName = tagName;
        this.attributes = attributes;
        this.comment = comment;
        this.children = [];
        if (children) {
            this.children = children;
        }
    }
}
class SimpleXmlProcessor {
    // Seems like property names from ASN.1 define XML tags. Other elements are omitted.
    // Values from descendants are propagated to the first ancestor with a property name.
    transform(cosemAsn1Result) {
        const analysisResult = this.analyzeTypeDefinition(cosemAsn1Result);
        if (!analysisResult.xmlNode) {
            console.warn(`SimpleXmlProcessor.SimpleXmlProcessor No nodes found.`);
            return '';
        }
        const xmlString = this.buildXml(analysisResult.xmlNode);
        //console.log(xmlString)
        return xmlString;
    }
    buildXml(currentNode, level = 0) {
        var _a, _b;
        const indent = '\t'.repeat(level);
        let attributes = '';
        if (currentNode.attributes && currentNode.attributes.length > 0) {
            attributes = ' ' + currentNode.attributes.map(a => `${a.name}="${this.xmlAttributeEncoding(a.value)}"`).join(' ');
        }
        const comment = currentNode.comment ? ` <!-- ${currentNode.comment} -->` : '';
        const hasChildren = (_b = (_a = currentNode.children) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0 > 0;
        const closingDash = hasChildren ? '' : '/';
        const encodedTag = this.xmlTagNameEncoding(currentNode.tagName);
        let output = `${indent}<${encodedTag}${attributes}${closingDash}>${comment}\n`;
        if (!hasChildren)
            return output;
        for (const child of currentNode.children) {
            output += this.buildXml(child, level + 1);
        }
        output += `${indent}</${encodedTag}>\n`;
        return output;
    }
    xmlAttributeEncoding(attributeValue) {
        return attributeValue
            .replace('&', '&amp;')
            .replace('"', '&quot;')
            .replace('<', '&lt;');
    }
    xmlTagNameEncoding(tagName) {
        // must not start with a digit, but property names of asn.1 specification do not do that
        return tagName
            .replace(/[^a-zA-Z0-9\-_]/, '_')
            .split('-').map(w => w[0].toUpperCase() + w.slice(1))
            .join('');
    }
    analyzeTypeDefinition(result) {
        if (result.results.length == 0) {
            let comment;
            if (result.dateTimeValue) {
                comment = result.dateTimeValue.asString;
            }
            else if (result.numberValue != undefined) {
                comment = result.numberValue.toString();
                if (result.stringValue) {
                    comment += `, ${result.stringValue}`;
                }
            }
            else {
                comment = result.stringValue;
            }
            if (result.propertyName) {
                return {
                    xmlNode: new SimpleXmlNode(result.propertyName, undefined, [{ name: 'Value', value: result.hexString, }], comment)
                };
            }
            return {
                value: result.hexString,
                comment
            };
        }
        const children = [];
        if (result.results.length == 1) {
            const analysisReport = this.analyzeTypeDefinition(result.results[0]);
            if (!analysisReport.xmlNode) {
                const attributes = analysisReport.value == undefined ? undefined : [{ name: 'Value', value: analysisReport.value }];
                if (result.propertyName) {
                    return {
                        xmlNode: new SimpleXmlNode(result.propertyName, undefined, attributes, analysisReport.comment)
                    };
                }
                return analysisReport;
            }
            if (!result.propertyName) {
                return analysisReport;
            }
            children.push(analysisReport.xmlNode);
        }
        else { // if (result.results.length > 1)
            for (const propertyResult of result.results) {
                const analysisReport = this.analyzeTypeDefinition(propertyResult);
                if (!analysisReport.xmlNode) {
                    console.error(`SimpleXmlProcessor.analyzeTypeDefinition cosemAsn1Result ${result.propertyName} ${result.typeName} has multiple children but ${propertyResult.typeName} is probably missing a propertyName ${propertyResult.propertyName} so xmlTag missing.`);
                    continue;
                }
                children.push(analysisReport.xmlNode);
            }
        }
        const attributes = [];
        if (result.count != undefined) {
            attributes.push({ name: 'Qty', value: result.count.toString() });
        }
        if (result.propertyName) {
            return {
                xmlNode: new SimpleXmlNode(result.propertyName, children, attributes)
            };
        }
        // no property name && multiple children => something wrong:
        console.error(`SimpleXmlProcessor.analyzeTypeDefinition cosemAsn1Result ${result.propertyName} ${result.typeName} has multiple children but has no propertyName. No valid XML.`);
        return {
            xmlNode: new SimpleXmlNode('__MissingPropertyName__', children, attributes)
        };
    }
}
exports.SimpleXmlProcessor = SimpleXmlProcessor;


/***/ }),

/***/ 145:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TelegramReader = void 0;
const enums_1 = __webpack_require__(82);
const telegram_1 = __webpack_require__(745);
const receive_buffer_1 = __webpack_require__(794);
// data link layer
class TelegramReader {
    constructor() {
        this.currentTelegram = new telegram_1.Telegram();
        this.possibleStartFound = false;
        this.receiveBuffer = new receive_buffer_1.ReceiveBuffer(TelegramReader.receiveBufferInitialSize, TelegramReader.receiveBufferMaxSize);
        this.telegrams = [];
    }
    areTelegramsAvailable() {
        return this.telegrams.length > 0 ? enums_1.TelegramState.available : enums_1.TelegramState.pending;
    }
    addRawData(newData) {
        //console.log('TelegramReader.addRawData', JSON.stringify(newData));
        //console.log(this.receiveBuffer.length);
        //console.log('addRawData', this.possibleStartFound);
        //console.log('addRawData', this.receiveBuffer);
        let sourceStart = 0;
        if (!this.possibleStartFound) {
            sourceStart = newData.indexOf(TelegramReader.startByte);
            if (sourceStart < 0) {
                return this.areTelegramsAvailable();
            }
            this.possibleStartFound = true;
        }
        if (!this.receiveBuffer.addBuffer(newData, sourceStart)) {
            // buffer overflow (receiveBufferMaxSize), ignore data and carry on
            this.receiveBuffer.reset();
            this.resetSearch();
            return this.areTelegramsAvailable();
        }
        // console.log('TelegramReader.addRawData this.data', JSON.stringify(this.data), this.data.length);
        return this.checkTelegram();
    }
    // only fetch them once!
    getTelegrams() {
        const ret = [...this.telegrams];
        this.telegrams = [];
        return ret;
    }
    resetSearch() {
        this.possibleStartFound = false;
        this.currentTelegram = new telegram_1.Telegram();
    }
    checkTelegram() {
        //console.log('checkTelegram receiveBuffer', this.receiveBuffer)
        if (this.receiveBuffer.length < 4) {
            return this.areTelegramsAvailable();
        }
        //console.log('checkTelegram currentTelegram', this.currentTelegram)
        if (this.currentTelegram.lengthData <= 0) {
            // check for telegram start sequence
            if (this.receiveBuffer.buffer[3] != TelegramReader.startByte || this.receiveBuffer.buffer[1] != this.receiveBuffer.buffer[2]) {
                return this.checkForNewStartIndex();
            }
            this.currentTelegram.lengthData = this.receiveBuffer.buffer[1];
        }
        if (this.currentTelegram.lengthData <= 3) {
            // control frame -> ignore
            return this.checkForNewStartIndex();
        }
        // long frame
        if (this.receiveBuffer.length < this.currentTelegram.lengthTotal) {
            return this.areTelegramsAvailable();
        }
        if (this.receiveBuffer.buffer[this.currentTelegram.lengthTotal - 1] != TelegramReader.stopByte) {
            return this.checkForNewStartIndex();
        }
        const calculatedChecksum = this.checkChecksum();
        this.currentTelegram.checkSum = this.receiveBuffer.buffer[this.currentTelegram.lengthTotal - 2];
        if (calculatedChecksum != this.currentTelegram.checkSum) {
            console.warn('Invalid checksum', calculatedChecksum, this.currentTelegram.checkSum);
            return this.checkForNewStartIndex();
        }
        // seems like everything is fine - set telegram fields
        this.currentTelegram.telegramRaw = this.receiveBuffer.buffer.subarray(0, this.currentTelegram.lengthTotal);
        // rest of data link layer data:
        this.currentTelegram.controlField = this.receiveBuffer.buffer[4]; // should be 0x53 (83 dec)
        this.currentTelegram.addressField = this.receiveBuffer.buffer[5]; // should be 0xFF (255 dec) Broadcast without reply
        // transport layer data:
        this.currentTelegram.controlInformationField = this.receiveBuffer.buffer[6];
        this.currentTelegram.sourceAddress = this.receiveBuffer.buffer[7];
        this.currentTelegram.destinationAddress = this.receiveBuffer.buffer[8];
        // application layer data:
        this.currentTelegram.applicationData = this.receiveBuffer.buffer.subarray(9, this.currentTelegram.lengthTotal - 2);
        // reset for next telegram
        this.telegrams.push(this.currentTelegram);
        const len = this.currentTelegram.lengthTotal;
        this.resetSearch();
        if (this.receiveBuffer.length <= len) {
            this.receiveBuffer = new receive_buffer_1.ReceiveBuffer(TelegramReader.receiveBufferInitialSize, TelegramReader.receiveBufferMaxSize);
            return enums_1.TelegramState.available;
        }
        // more data in receiveBuffer:
        const oldReceiveBuffer = this.receiveBuffer;
        this.receiveBuffer = new receive_buffer_1.ReceiveBuffer(TelegramReader.receiveBufferInitialSize, TelegramReader.receiveBufferMaxSize);
        this.receiveBuffer.addBuffer(oldReceiveBuffer.buffer.subarray(0, oldReceiveBuffer.length), len);
        return this.checkTelegram();
    }
    checkForNewStartIndex() {
        this.resetSearch();
        if (!this.receiveBuffer.checkForNewStartIndex(TelegramReader.startByte)) {
            return this.areTelegramsAvailable();
        }
        this.possibleStartFound = true;
        // recursive - if multiple telegrams are within the raw data added at once
        return this.checkTelegram();
    }
    checkChecksum() {
        const start = 4;
        const end = this.currentTelegram.lengthTotal - 2;
        let sum = 0;
        for (let i = start; i < end; i++) {
            sum += this.receiveBuffer.buffer[i];
        }
        return sum & 0xFF;
    }
}
exports.TelegramReader = TelegramReader;
TelegramReader.startByte = 0x68;
TelegramReader.stopByte = 0x16;
TelegramReader.receiveBufferInitialSize = 512;
TelegramReader.receiveBufferMaxSize = 8192;


/***/ }),

/***/ 745:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Telegram = void 0;
// represents data link, transport and application layer of single telegram
class Telegram {
    constructor() {
        // data link layer:
        this._lengthData = 0;
        this._lengthTotal = 0;
        this._lengthTransportData = 0;
        this._lengthApplicationData = 0;
        this.checkSum = -1;
        this.controlField = 0; // C field
        this.addressField = 0; // A field
        // transport layer
        // TPDU (transport protocol data unit)
        this._controlInformationField = 0;
        this._sequenceNumber = 0;
        this._isLastSegment = true; // or application data is only in one single telegram
        this.sourceAddress = 0; // STSAP (source transport service access point)
        this.destinationAddress = 0; // DTSAP (destination transport service access point)
    }
    set lengthData(len) {
        this._lengthData = len;
        this._lengthTotal = len + 6; // 2x start, 2x len, checksum, stop
        this._lengthTransportData = len - 2; // len user-data + C, A, CI field. CI is part of transport layer
        this._lengthApplicationData = len - 5; // transport minus CI, STSAP, DTSAP
    }
    get lengthData() {
        return this._lengthData;
    }
    get lengthTotal() {
        return this._lengthTotal;
    }
    get lengthTransportData() {
        return this._lengthTransportData;
    }
    get lengthApplicationData() {
        return this._lengthApplicationData;
    }
    // CI field:
    set controlInformationField(ciField) {
        this._controlInformationField = ciField;
        this._sequenceNumber = this._controlInformationField & 0b00001111;
        this._isLastSegment = (this._controlInformationField & 0b00010000) == 0b00010000;
    }
    get controlInformationField() {
        return this._controlInformationField;
    }
    get sequenceNumber() {
        return this._sequenceNumber;
    }
    get isLastSegment() {
        return this._isLastSegment;
    }
}
exports.Telegram = Telegram;


/***/ }),

/***/ 97:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Tools = void 0;
class Tools {
    static getStringFromByteArray(bytes) {
        return String.fromCharCode(...bytes);
    }
    static getNumberFromByteArray(bytes) {
        let result = 0;
        for (let i = bytes.length - 1, multiplier = 1; i >= 0; i--) {
            result += bytes[i] * multiplier;
            multiplier *= 256;
        }
        return result;
    }
    static getByteArrayFromHexString(hexString) {
        // remove whitespaces
        hexString = hexString.replace(/\s+/g, '');
        let bytes = [];
        for (let c = 0; c < hexString.length; c += 2) {
            bytes.push(parseInt(hexString.substring(c, c + 2), 16));
        }
        return bytes;
    }
    static getHexStringFromByteArray(bytes, withSpaces = false) {
        let hexStrings = [];
        for (let i = 0; i < bytes.length; i++) {
            const current = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
            hexStrings.push((current >>> 4).toString(16));
            hexStrings.push((current & 0xF).toString(16));
        }
        return hexStrings.join(withSpaces ? ' ' : '');
    }
    static getNumberFromBuffer(buffer, start = 0, end) {
        if (end == undefined)
            end = buffer.length;
        let result = 0;
        for (let i = end - 1, multiplier = 1; i >= start; i--) {
            result += buffer[i] * multiplier;
            multiplier *= 256;
        }
        return result;
    }
}
exports.Tools = Tools;


/***/ }),

/***/ 771:
/***/ ((module) => {

module.exports = require("config");

/***/ }),

/***/ 605:
/***/ ((module) => {

module.exports = require("serialport");

/***/ }),

/***/ 914:
/***/ ((module) => {

module.exports = require("smartmeter-obis");

/***/ }),

/***/ 113:
/***/ ((module) => {

module.exports = require("crypto");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const serialport_1 = __webpack_require__(605);
const telegram_reader_1 = __webpack_require__(145);
const enums_1 = __webpack_require__(82);
const multi_telegram_reader_1 = __webpack_require__(222);
const setting_classes_1 = __webpack_require__(312);
const cosem_data_reader_1 = __webpack_require__(323);
const asn1_structure_1 = __webpack_require__(111);
const cosem_obis_data_processor_1 = __webpack_require__(629);
const debug_logger_ts_1 = __webpack_require__(958);
let serialPortByteCount = 0;
let telegramCount = 0;
let applicationDataUnitCount = 0;
let prematureStops = false;
let port;
const debugLogger = new debug_logger_ts_1.DebugLogger();
function main() {
    setting_classes_1.Settings.read();
    init();
    port = new serialport_1.SerialPort({
        path: setting_classes_1.SerialPortSettings.port,
        baudRate: setting_classes_1.SerialPortSettings.baudRate,
        dataBits: setting_classes_1.SerialPortSettings.dataBits,
        parity: setting_classes_1.SerialPortSettings.parity,
        stopBits: setting_classes_1.SerialPortSettings.stopBits
    });
    const telegramReader = new telegram_reader_1.TelegramReader();
    const multiTelegramReader = new multi_telegram_reader_1.MultiTelegramReader(telegramReader);
    const cosemDataReader = new cosem_data_reader_1.CosemDataReader(asn1_structure_1.cosemTypeDefinitionMap, 'XDLMS-APDU');
    const cosemObisDataProcessor = new cosem_obis_data_processor_1.CosemObisDataProcessor();
    port.on('data', function (serialPortData) {
        if (setting_classes_1.DebugSettings.logSerialPort) {
            debugLogger.logSerialPortData(serialPortData);
        }
        serialPortByteCount += serialPortData.length;
        // read single MBus telegrams
        const telegramResultState = telegramReader.addRawData(serialPortData);
        if (telegramResultState == enums_1.TelegramState.available) {
            const telegrams = telegramReader.getTelegrams();
            telegramCount += telegrams.length;
            debugLogger.logTelegrams(telegrams);
            // combine telegrams and decrypt
            const applicationDataUnitState = multiTelegramReader.addTelegrams(telegrams);
            if (applicationDataUnitState == enums_1.ApplicationDataState.available) {
                const applicationDataUnits = multiTelegramReader.getApplicationDataUnits();
                applicationDataUnitCount += applicationDataUnits.length;
                debugLogger.logApplicationDataUnits(applicationDataUnits);
                // analyze COSEM data
                for (const applicationDataUnit of applicationDataUnits) {
                    const result = cosemDataReader.read(applicationDataUnit.decryptedPayload);
                    if (!result)
                        continue;
                    debugLogger.logCosemData(result);
                    // extract obis values
                    const dataNotification = cosemObisDataProcessor.transform(result);
                    if (!dataNotification)
                        continue;
                    debugLogger.logObisData(dataNotification);
                }
            }
        }
        if (prematureStops)
            checkForDebugStops();
    });
    port.on('error', function (err) {
        console.error('Serial port error: ', err.message);
    });
}
function init() {
    prematureStops = setting_classes_1.DebugSettings.maxBytes > 0 || setting_classes_1.DebugSettings.maxTelegrams > 0 || setting_classes_1.DebugSettings.maxApplicationDataUnits > 0;
}
function checkForDebugStops() {
    if ((setting_classes_1.DebugSettings.maxBytes == 0 || serialPortByteCount < setting_classes_1.DebugSettings.maxBytes) &&
        (setting_classes_1.DebugSettings.maxTelegrams == 0 || telegramCount < setting_classes_1.DebugSettings.maxTelegrams) &&
        (setting_classes_1.DebugSettings.maxApplicationDataUnits == 0 || applicationDataUnitCount < setting_classes_1.DebugSettings.maxApplicationDataUnits)) {
        return;
    }
    debugLogger.logSerialPortDataEnd();
    port.close((error) => {
        if (error)
            console.error(error);
        process.exit(1);
    });
    console.log(`Stopping because of Debug config: maxBytes (${setting_classes_1.DebugSettings.maxBytes}), maxTelegrams (${setting_classes_1.DebugSettings.maxTelegrams}) or maxApplicationDataUnits (${setting_classes_1.DebugSettings.maxApplicationDataUnits}) > 0 ...`);
}
main();

})();

var __webpack_export_target__ = this;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=smart-meter-mbus-dlms.js.map
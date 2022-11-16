import { BlockMode, Occurrence } from "../cosem-asn2ts/cosem-asn2ts-lib/enums";
import { TypeDefinition } from "../cosem-lib/type-definition";
import { Property } from "../cosem-lib/property";
import { Enumeration } from "../cosem-lib/enumeration";
import { BitString } from "../cosem-lib/bit-string";

const XDLMS_APDU = new TypeDefinition({
	name: 'XDLMS-APDU', 
	blockMode: BlockMode.choice,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'initiateRequest', tag: 1, occurrence: Occurrence.implicit, customType: 'InitiateRequest', }),
		new Property({name: 'readRequest', tag: 5, occurrence: Occurrence.implicit, customType: 'ReadRequest', }),
		new Property({name: 'writeRequest', tag: 6, occurrence: Occurrence.implicit, customType: 'WriteRequest', }),
		new Property({name: 'initiateResponse', tag: 8, occurrence: Occurrence.implicit, customType: 'InitiateResponse', }),
		new Property({name: 'readResponse', tag: 12, occurrence: Occurrence.implicit, customType: 'ReadResponse', }),
		new Property({name: 'writeResponse', tag: 13, occurrence: Occurrence.implicit, customType: 'WriteResponse', }),
		new Property({name: 'confirmedServiceError', tag: 14, occurrence: Occurrence.none, customType: 'ConfirmedServiceError', }),
		new Property({name: 'data-notification', tag: 15, occurrence: Occurrence.implicit, customType: 'Data-Notification', }),
		new Property({name: 'unconfirmedWriteRequest', tag: 22, occurrence: Occurrence.implicit, customType: 'UnconfirmedWriteRequest', }),
		new Property({name: 'informationReportRequest', tag: 24, occurrence: Occurrence.implicit, customType: 'InformationReportRequest', }),
		new Property({name: 'glo-initiateRequest', tag: 33, occurrence: Occurrence.implicit, asn1Type: 'OCTET STRING', }),
		new Property({name: 'glo-readRequest', tag: 37, occurrence: Occurrence.implicit, asn1Type: 'OCTET STRING', }),
		new Property({name: 'glo-writeRequest', tag: 38, occurrence: Occurrence.implicit, asn1Type: 'OCTET STRING', }),
		new Property({name: 'glo-initiateResponse', tag: 40, occurrence: Occurrence.implicit, asn1Type: 'OCTET STRING', }),
		new Property({name: 'glo-readResponse', tag: 44, occurrence: Occurrence.implicit, asn1Type: 'OCTET STRING', }),
		new Property({name: 'glo-writeResponse', tag: 45, occurrence: Occurrence.implicit, asn1Type: 'OCTET STRING', }),
		new Property({name: 'glo-confirmedServiceError', tag: 46, occurrence: Occurrence.implicit, asn1Type: 'OCTET STRING', }),
		new Property({name: 'glo-unconfirmedWriteRequest', tag: 54, occurrence: Occurrence.implicit, asn1Type: 'OCTET STRING', }),
		new Property({name: 'glo-informationReportRequest', tag: 56, occurrence: Occurrence.implicit, asn1Type: 'OCTET STRING', }),
		new Property({name: 'ded-initiateRequest', tag: 65, occurrence: Occurrence.implicit, asn1Type: 'OCTET STRING', }),
		new Property({name: 'ded-readRequest', tag: 69, occurrence: Occurrence.implicit, asn1Type: 'OCTET STRING', }),
		new Property({name: 'ded-writeRequest', tag: 70, occurrence: Occurrence.implicit, asn1Type: 'OCTET STRING', }),
		new Property({name: 'ded-initiateResponse', tag: 72, occurrence: Occurrence.implicit, asn1Type: 'OCTET STRING', }),
		new Property({name: 'ded-readResponse', tag: 76, occurrence: Occurrence.implicit, asn1Type: 'OCTET STRING', }),
		new Property({name: 'ded-writeResponse', tag: 77, occurrence: Occurrence.implicit, asn1Type: 'OCTET STRING', }),
		new Property({name: 'ded-confirmedServiceError', tag: 78, occurrence: Occurrence.implicit, asn1Type: 'OCTET STRING', }),
		new Property({name: 'ded-unconfirmedWriteRequest', tag: 86, occurrence: Occurrence.implicit, asn1Type: 'OCTET STRING', }),
		new Property({name: 'ded-informationReportRequest', tag: 88, occurrence: Occurrence.implicit, asn1Type: 'OCTET STRING', }),
		new Property({name: 'get-request', tag: 192, occurrence: Occurrence.implicit, customType: 'Get-Request', }),
		new Property({name: 'set-request', tag: 193, occurrence: Occurrence.implicit, customType: 'Set-Request', }),
		new Property({name: 'event-notification-request', tag: 194, occurrence: Occurrence.implicit, customType: 'EventNotificationRequest', }),
		new Property({name: 'action-request', tag: 195, occurrence: Occurrence.implicit, customType: 'Action-Request', }),
		new Property({name: 'get-response', tag: 196, occurrence: Occurrence.implicit, customType: 'Get-Response', }),
		new Property({name: 'set-response', tag: 197, occurrence: Occurrence.implicit, customType: 'Set-Response', }),
		new Property({name: 'action-response', tag: 199, occurrence: Occurrence.implicit, customType: 'Action-Response', }),
		new Property({name: 'glo-get-request', tag: 200, occurrence: Occurrence.implicit, asn1Type: 'OCTET STRING', }),
		new Property({name: 'glo-set-request', tag: 201, occurrence: Occurrence.implicit, asn1Type: 'OCTET STRING', }),
		new Property({name: 'glo-event-notification-request', tag: 202, occurrence: Occurrence.implicit, asn1Type: 'OCTET STRING', }),
		new Property({name: 'glo-action-request', tag: 203, occurrence: Occurrence.implicit, asn1Type: 'OCTET STRING', }),
		new Property({name: 'glo-get-response', tag: 204, occurrence: Occurrence.implicit, asn1Type: 'OCTET STRING', }),
		new Property({name: 'glo-set-response', tag: 205, occurrence: Occurrence.implicit, asn1Type: 'OCTET STRING', }),
		new Property({name: 'glo-action-response', tag: 207, occurrence: Occurrence.implicit, asn1Type: 'OCTET STRING', }),
		new Property({name: 'ded-get-request', tag: 208, occurrence: Occurrence.implicit, asn1Type: 'OCTET STRING', }),
		new Property({name: 'ded-set-request', tag: 209, occurrence: Occurrence.implicit, asn1Type: 'OCTET STRING', }),
		new Property({name: 'ded-event-notification-request', tag: 210, occurrence: Occurrence.implicit, asn1Type: 'OCTET STRING', }),
		new Property({name: 'ded-actionRequest', tag: 211, occurrence: Occurrence.implicit, asn1Type: 'OCTET STRING', }),
		new Property({name: 'ded-get-response', tag: 212, occurrence: Occurrence.implicit, asn1Type: 'OCTET STRING', }),
		new Property({name: 'ded-set-response', tag: 213, occurrence: Occurrence.implicit, asn1Type: 'OCTET STRING', }),
		new Property({name: 'ded-action-response', tag: 215, occurrence: Occurrence.implicit, asn1Type: 'OCTET STRING', }),
		new Property({name: 'exception-response', tag: 216, occurrence: Occurrence.implicit, customType: 'ExceptionResponse', }),
		new Property({name: 'access-request', tag: 217, occurrence: Occurrence.implicit, customType: 'Access-Request', }),
		new Property({name: 'access-response', tag: 218, occurrence: Occurrence.implicit, customType: 'Access-Response', }),
		new Property({name: 'general-glo-ciphering', tag: 219, occurrence: Occurrence.implicit, customType: 'General-Glo-Ciphering', }),
		new Property({name: 'general-ded-ciphering', tag: 220, occurrence: Occurrence.implicit, customType: 'General-Ded-Ciphering', }),
		new Property({name: 'general-ciphering', tag: 221, occurrence: Occurrence.implicit, customType: 'General-Ciphering', }),
		new Property({name: 'general-signing', tag: 223, occurrence: Occurrence.implicit, customType: 'General-Signing', }),
		new Property({name: 'general-block-transfer', tag: 224, occurrence: Occurrence.implicit, customType: 'General-Block-Transfer', })
	],
});

const InitiateRequest = new TypeDefinition({
	name: 'InitiateRequest', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'dedicated-key', occurrence: Occurrence.none, asn1Type: 'OCTET STRING', isOptional: true, }),
		new Property({name: 'response-allowed', occurrence: Occurrence.none, asn1Type: 'BOOLEAN', typeParameter: 'DEFAULT TRUE', }),
		new Property({name: 'proposed-quality-of-service', tag: 0, occurrence: Occurrence.implicit, customType: 'Integer8', isOptional: true, }),
		new Property({name: 'proposed-dlms-version-number', occurrence: Occurrence.none, customType: 'Unsigned8', }),
		new Property({name: 'proposed-conformance', occurrence: Occurrence.none, customType: 'Conformance', }),
		new Property({name: 'client-max-receive-pdu-size', occurrence: Occurrence.none, customType: 'Unsigned16', })
	],
});

const ReadRequest = new TypeDefinition({
	name: 'ReadRequest', 
	blockMode: BlockMode.single,
	occurrence: Occurrence.none, 
	asn1Type: 'SEQUENCE OF',
	typeParameter: 'Variable-Access-Specification',
});

const WriteRequest = new TypeDefinition({
	name: 'WriteRequest', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'variable-access-specification', occurrence: Occurrence.none, asn1Type: 'SEQUENCE OF', subType: 'Variable-Access-Specification', }),
		new Property({name: 'list-of-data', occurrence: Occurrence.none, asn1Type: 'SEQUENCE OF', subType: 'Data', })
	],
});

const InitiateResponse = new TypeDefinition({
	name: 'InitiateResponse', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'negotiated-quality-of-service', tag: 0, occurrence: Occurrence.implicit, customType: 'Integer8', isOptional: true, }),
		new Property({name: 'negotiated-dlms-version-number', occurrence: Occurrence.none, customType: 'Unsigned8', }),
		new Property({name: 'negotiated-conformance', occurrence: Occurrence.none, customType: 'Conformance', }),
		new Property({name: 'server-max-receive-pdu-size', occurrence: Occurrence.none, customType: 'Unsigned16', }),
		new Property({name: 'vaa-name', occurrence: Occurrence.none, customType: 'ObjectName', })
	],
});

const ReadResponse = new TypeDefinition({
	name: 'ReadResponse', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'data', tag: 0, occurrence: Occurrence.none, customType: 'Data', }),
		new Property({name: 'data-access-error', tag: 1, occurrence: Occurrence.implicit, customType: 'Data-Access-Result', }),
		new Property({name: 'data-block-result', tag: 2, occurrence: Occurrence.implicit, customType: 'Data-Block-Result', }),
		new Property({name: 'block-number', tag: 3, occurrence: Occurrence.implicit, customType: 'Unsigned16', })
	],
});

const WriteResponse = new TypeDefinition({
	name: 'WriteResponse', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'success', tag: 0, occurrence: Occurrence.implicit, asn1Type: 'NULL', }),
		new Property({name: 'data-access-error', tag: 1, occurrence: Occurrence.implicit, customType: 'Data-Access-Result', }),
		new Property({name: 'block-number', tag: 2, occurrence: Occurrence.none, customType: 'Unsigned16', })
	],
});

const ConfirmedServiceError = new TypeDefinition({
	name: 'ConfirmedServiceError', 
	blockMode: BlockMode.choice,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'initiateError', tag: 1, occurrence: Occurrence.none, customType: 'ServiceError', }),
		new Property({name: 'getStatus', tag: 2, occurrence: Occurrence.none, customType: 'ServiceError', }),
		new Property({name: 'getNameList', tag: 3, occurrence: Occurrence.none, customType: 'ServiceError', }),
		new Property({name: 'getVariableAttribute', tag: 4, occurrence: Occurrence.none, customType: 'ServiceError', }),
		new Property({name: 'read', tag: 5, occurrence: Occurrence.none, customType: 'ServiceError', }),
		new Property({name: 'write', tag: 6, occurrence: Occurrence.none, customType: 'ServiceError', }),
		new Property({name: 'getDataSetAttribute', tag: 7, occurrence: Occurrence.none, customType: 'ServiceError', }),
		new Property({name: 'getTIAttribute', tag: 8, occurrence: Occurrence.none, customType: 'ServiceError', }),
		new Property({name: 'changeScope', tag: 9, occurrence: Occurrence.none, customType: 'ServiceError', }),
		new Property({name: 'start', tag: 10, occurrence: Occurrence.none, customType: 'ServiceError', }),
		new Property({name: 'stop', tag: 11, occurrence: Occurrence.none, customType: 'ServiceError', }),
		new Property({name: 'resume', tag: 12, occurrence: Occurrence.none, customType: 'ServiceError', }),
		new Property({name: 'makeUsable', tag: 13, occurrence: Occurrence.none, customType: 'ServiceError', }),
		new Property({name: 'initiateLoad', tag: 14, occurrence: Occurrence.none, customType: 'ServiceError', }),
		new Property({name: 'loadSegment', tag: 15, occurrence: Occurrence.none, customType: 'ServiceError', }),
		new Property({name: 'terminateLoad', tag: 16, occurrence: Occurrence.none, customType: 'ServiceError', }),
		new Property({name: 'initiateUpLoad', tag: 17, occurrence: Occurrence.none, customType: 'ServiceError', }),
		new Property({name: 'upLoadSegment', tag: 18, occurrence: Occurrence.none, customType: 'ServiceError', }),
		new Property({name: 'terminateUpLoad', tag: 19, occurrence: Occurrence.none, customType: 'ServiceError', })
	],
});

const Data_Notification = new TypeDefinition({
	name: 'Data-Notification', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'long-invoke-id-and-priority', occurrence: Occurrence.none, customType: 'Long-Invoke-Id-And-Priority', }),
		new Property({name: 'date-time', occurrence: Occurrence.none, asn1Type: 'OCTET STRING', }),
		new Property({name: 'notification-body', occurrence: Occurrence.none, customType: 'Notification-Body', })
	],
});

const UnconfirmedWriteRequest = new TypeDefinition({
	name: 'UnconfirmedWriteRequest', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'variable-access-specification', occurrence: Occurrence.none, asn1Type: 'SEQUENCE OF', subType: 'Variable-Access-Specification', }),
		new Property({name: 'list-of-data', occurrence: Occurrence.none, asn1Type: 'SEQUENCE OF', subType: 'Data', })
	],
});

const InformationReportRequest = new TypeDefinition({
	name: 'InformationReportRequest', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'current-time', occurrence: Occurrence.none, asn1Type: 'GeneralizedTime', isOptional: true, }),
		new Property({name: 'variable-access-specification', occurrence: Occurrence.none, asn1Type: 'SEQUENCE OF', subType: 'Variable-Access-Specification', }),
		new Property({name: 'list-of-data', occurrence: Occurrence.none, asn1Type: 'SEQUENCE OF', subType: 'Data', })
	],
});

const Get_Request = new TypeDefinition({
	name: 'Get-Request', 
	blockMode: BlockMode.choice,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'get-request-normal', tag: 1, occurrence: Occurrence.implicit, customType: 'Get-Request-Normal', }),
		new Property({name: 'get-request-next', tag: 2, occurrence: Occurrence.implicit, customType: 'Get-Request-Next', }),
		new Property({name: 'get-request-with-list', tag: 3, occurrence: Occurrence.implicit, customType: 'Get-Request-With-List', })
	],
});

const Set_Request = new TypeDefinition({
	name: 'Set-Request', 
	blockMode: BlockMode.choice,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'set-request-normal', tag: 1, occurrence: Occurrence.implicit, customType: 'Set-Request-Normal', }),
		new Property({name: 'set-request-with-first-datablock', tag: 2, occurrence: Occurrence.implicit, customType: 'Set-Request-With-First-Datablock', }),
		new Property({name: 'set-request-with-datablock', tag: 3, occurrence: Occurrence.implicit, customType: 'Set-Request-With-Datablock', }),
		new Property({name: 'set-request-with-list', tag: 4, occurrence: Occurrence.implicit, customType: 'Set-Request-With-List', }),
		new Property({name: 'set-request-with-list-and-first-datablock', tag: 5, occurrence: Occurrence.implicit, customType: 'Set-Request-With-List-And-First-Datablock', })
	],
});

const EventNotificationRequest = new TypeDefinition({
	name: 'EventNotificationRequest', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'time', occurrence: Occurrence.none, asn1Type: 'OCTET STRING', isOptional: true, }),
		new Property({name: 'cosem-attribute-descriptor', occurrence: Occurrence.none, customType: 'Cosem-Attribute-Descriptor', }),
		new Property({name: 'attribute-value', occurrence: Occurrence.none, customType: 'Data', })
	],
});

const Action_Request = new TypeDefinition({
	name: 'Action-Request', 
	blockMode: BlockMode.choice,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'action-request-normal', tag: 1, occurrence: Occurrence.implicit, customType: 'Action-Request-Normal', }),
		new Property({name: 'action-request-next-pblock', tag: 2, occurrence: Occurrence.implicit, customType: 'Action-Request-Next-Pblock', }),
		new Property({name: 'action-request-with-list', tag: 3, occurrence: Occurrence.implicit, customType: 'Action-Request-With-List', }),
		new Property({name: 'action-request-with-first-pblock', tag: 4, occurrence: Occurrence.implicit, customType: 'Action-Request-With-First-Pblock', }),
		new Property({name: 'action-request-with-list-and-first-pblock', tag: 5, occurrence: Occurrence.implicit, customType: 'Action-Request-With-List-And-First-Pblock', }),
		new Property({name: 'action-request-with-pblock', tag: 6, occurrence: Occurrence.implicit, customType: 'Action-Request-With-Pblock', })
	],
});

const Get_Response = new TypeDefinition({
	name: 'Get-Response', 
	blockMode: BlockMode.choice,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'get-response-normal', tag: 1, occurrence: Occurrence.implicit, customType: 'Get-Response-Normal', }),
		new Property({name: 'get-response-with-datablock', tag: 2, occurrence: Occurrence.implicit, customType: 'Get-Response-With-Datablock', }),
		new Property({name: 'get-response-with-list', tag: 3, occurrence: Occurrence.implicit, customType: 'Get-Response-With-List', })
	],
});

const Set_Response = new TypeDefinition({
	name: 'Set-Response', 
	blockMode: BlockMode.choice,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'set-response-normal', tag: 1, occurrence: Occurrence.implicit, customType: 'Set-Response-Normal', }),
		new Property({name: 'set-response-datablock', tag: 2, occurrence: Occurrence.implicit, customType: 'Set-Response-Datablock', }),
		new Property({name: 'set-response-last-datablock', tag: 3, occurrence: Occurrence.implicit, customType: 'Set-Response-Last-Datablock', }),
		new Property({name: 'set-response-last-datablock-with-list', tag: 4, occurrence: Occurrence.implicit, customType: 'Set-Response-Last-Datablock-With-List', }),
		new Property({name: 'set-response-with-list', tag: 5, occurrence: Occurrence.implicit, customType: 'Set-Response-With-List', })
	],
});

const Action_Response = new TypeDefinition({
	name: 'Action-Response', 
	blockMode: BlockMode.choice,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'action-response-normal', tag: 1, occurrence: Occurrence.implicit, customType: 'Action-Response-Normal', }),
		new Property({name: 'action-response-with-pblock', tag: 2, occurrence: Occurrence.implicit, customType: 'Action-Response-With-Pblock', }),
		new Property({name: 'action-response-with-list', tag: 3, occurrence: Occurrence.implicit, customType: 'Action-Response-With-List', }),
		new Property({name: 'action-response-next-pblock', tag: 4, occurrence: Occurrence.implicit, customType: 'Action-Response-Next-Pblock', })
	],
});

const ExceptionResponse = new TypeDefinition({
	name: 'ExceptionResponse', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'state-error', tag: 0, occurrence: Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ service-not-allowed (1)', }),
		new Property({name: 'state-error', tag: 0, occurrence: Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ service-not-allowed (1), service-unknown (2) }', }),
		new Property({name: 'service-error', tag: 1, occurrence: Occurrence.none, asn1Type: 'CHOICE', typeParameter: '{ operation-not-possible [1] IMPLICIT NULL', }),
		new Property({name: 'service-error', tag: 1, occurrence: Occurrence.none, asn1Type: 'CHOICE', typeParameter: '{ operation-not-possible [1] IMPLICIT NULL, service-not-supported [2] IMPLICIT NULL', }),
		new Property({name: 'service-error', tag: 1, occurrence: Occurrence.none, asn1Type: 'CHOICE', typeParameter: '{ operation-not-possible [1] IMPLICIT NULL, service-not-supported [2] IMPLICIT NULL, other-reason [3] IMPLICIT NULL', }),
		new Property({name: 'service-error', tag: 1, occurrence: Occurrence.none, asn1Type: 'CHOICE', typeParameter: '{ operation-not-possible [1] IMPLICIT NULL, service-not-supported [2] IMPLICIT NULL, other-reason [3] IMPLICIT NULL, pdu-too-long [4] IMPLICIT NULL', }),
		new Property({name: 'service-error', tag: 1, occurrence: Occurrence.none, asn1Type: 'CHOICE', typeParameter: '{ operation-not-possible [1] IMPLICIT NULL, service-not-supported [2] IMPLICIT NULL, other-reason [3] IMPLICIT NULL, pdu-too-long [4] IMPLICIT NULL, deciphering-error [5] IMPLICIT NULL', }),
		new Property({name: 'service-error', tag: 1, occurrence: Occurrence.none, asn1Type: 'CHOICE', typeParameter: '{ operation-not-possible [1] IMPLICIT NULL, service-not-supported [2] IMPLICIT NULL, other-reason [3] IMPLICIT NULL, pdu-too-long [4] IMPLICIT NULL, deciphering-error [5] IMPLICIT NULL, invocation-counter-error [6] IMPLICIT Unsigned32 }', })
	],
});

const Access_Request = new TypeDefinition({
	name: 'Access-Request', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'long-invoke-id-and-priority', occurrence: Occurrence.none, customType: 'Long-Invoke-Id-And-Priority', }),
		new Property({name: 'date-time', occurrence: Occurrence.none, asn1Type: 'OCTET STRING', }),
		new Property({name: 'access-request-body', occurrence: Occurrence.none, customType: 'Access-Request-Body', })
	],
});

const Access_Response = new TypeDefinition({
	name: 'Access-Response', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'long-invoke-id-and-priority', occurrence: Occurrence.none, customType: 'Long-Invoke-Id-And-Priority', }),
		new Property({name: 'date-time', occurrence: Occurrence.none, asn1Type: 'OCTET STRING', }),
		new Property({name: 'access-response-body', occurrence: Occurrence.none, customType: 'Access-Response-Body', })
	],
});

const General_Glo_Ciphering = new TypeDefinition({
	name: 'General-Glo-Ciphering', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'system-title', occurrence: Occurrence.none, asn1Type: 'OCTET STRING', }),
		new Property({name: 'ciphered-content', occurrence: Occurrence.none, asn1Type: 'OCTET STRING', })
	],
});

const General_Ded_Ciphering = new TypeDefinition({
	name: 'General-Ded-Ciphering', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'system-title', occurrence: Occurrence.none, asn1Type: 'OCTET STRING', }),
		new Property({name: 'ciphered-content', occurrence: Occurrence.none, asn1Type: 'OCTET STRING', })
	],
});

const General_Ciphering = new TypeDefinition({
	name: 'General-Ciphering', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'transaction-id', occurrence: Occurrence.none, asn1Type: 'OCTET STRING', }),
		new Property({name: 'originator-system-title', occurrence: Occurrence.none, asn1Type: 'OCTET STRING', }),
		new Property({name: 'recipient-system-title', occurrence: Occurrence.none, asn1Type: 'OCTET STRING', }),
		new Property({name: 'date-time', occurrence: Occurrence.none, asn1Type: 'OCTET STRING', }),
		new Property({name: 'other-information', occurrence: Occurrence.none, asn1Type: 'OCTET STRING', }),
		new Property({name: 'key-info', occurrence: Occurrence.none, customType: 'Key-Info', isOptional: true, }),
		new Property({name: 'ciphered-content', occurrence: Occurrence.none, asn1Type: 'OCTET STRING', })
	],
});

const General_Signing = new TypeDefinition({
	name: 'General-Signing', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'transaction-id', occurrence: Occurrence.none, asn1Type: 'OCTET STRING', }),
		new Property({name: 'originator-system-title', occurrence: Occurrence.none, asn1Type: 'OCTET STRING', }),
		new Property({name: 'recipient-system-title', occurrence: Occurrence.none, asn1Type: 'OCTET STRING', }),
		new Property({name: 'date-time', occurrence: Occurrence.none, asn1Type: 'OCTET STRING', }),
		new Property({name: 'other-information', occurrence: Occurrence.none, asn1Type: 'OCTET STRING', }),
		new Property({name: 'content', occurrence: Occurrence.none, asn1Type: 'OCTET STRING', }),
		new Property({name: 'signature', occurrence: Occurrence.none, asn1Type: 'OCTET STRING', })
	],
});

const General_Block_Transfer = new TypeDefinition({
	name: 'General-Block-Transfer', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'block-control', occurrence: Occurrence.none, customType: 'Block-Control', }),
		new Property({name: 'block-number', occurrence: Occurrence.none, customType: 'Unsigned16', }),
		new Property({name: 'block-number-ack', occurrence: Occurrence.none, customType: 'Unsigned16', }),
		new Property({name: 'block-data', occurrence: Occurrence.none, asn1Type: 'OCTET STRING', })
	],
});

const Integer8 = new TypeDefinition({
	name: 'Integer8', 
	blockMode: BlockMode.single,
	occurrence: Occurrence.none, 
	asn1Type: 'INTEGER',
	typeParameter: '(-128..127)',
});

const Unsigned8 = new TypeDefinition({
	name: 'Unsigned8', 
	blockMode: BlockMode.single,
	occurrence: Occurrence.none, 
	asn1Type: 'INTEGER',
	typeParameter: '(0..255)',
});

const Conformance = new TypeDefinition({
	name: 'Conformance', 
	blockMode: BlockMode.bitString,
	occurrence: Occurrence.implicit, 
	tag: 31,
	customTag: 'APPLICATION',
	bitStrings: [
		new BitString('reserved-zero', 0),
		new BitString('general-protection', 1),
		new BitString('general-block-transfer', 2),
		new BitString('read', 3),
		new BitString('write', 4),
		new BitString('unconfirmed-write', 5),
		new BitString('reserved-six', 6),
		new BitString('reserved-seven', 7),
		new BitString('attribute0-supported-with-set', 8),
		new BitString('priority-mgmt-supported', 9),
		new BitString('attribute0-supported-with-get', 10),
		new BitString('block-transfer-with-get-or-read', 11),
		new BitString('block-transfer-with-set-or-write', 12),
		new BitString('block-transfer-with-action', 13),
		new BitString('multiple-references', 14),
		new BitString('information-report', 15),
		new BitString('data-notification', 16),
		new BitString('access', 17),
		new BitString('parameterized-access', 18),
		new BitString('get', 19),
		new BitString('set', 20),
		new BitString('selective-access', 21),
		new BitString('event-notification', 22),
		new BitString('action', 23)
	],
});

const Unsigned16 = new TypeDefinition({
	name: 'Unsigned16', 
	blockMode: BlockMode.single,
	occurrence: Occurrence.none, 
	asn1Type: 'INTEGER',
	typeParameter: '(0..65535)',
});

const Variable_Access_Specification = new TypeDefinition({
	name: 'Variable-Access-Specification', 
	blockMode: BlockMode.choice,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'variable-name', tag: 2, occurrence: Occurrence.implicit, customType: 'ObjectName', }),
		new Property({name: 'parameterized-access', tag: 4, occurrence: Occurrence.implicit, customType: 'Parameterized-Access', }),
		new Property({name: 'block-number-access', tag: 5, occurrence: Occurrence.implicit, customType: 'Block-Number-Access', }),
		new Property({name: 'read-data-block-access', tag: 6, occurrence: Occurrence.implicit, customType: 'Read-Data-Block-Access', }),
		new Property({name: 'write-data-block-access', tag: 7, occurrence: Occurrence.implicit, customType: 'Write-Data-Block-Access', })
	],
});

const Data = new TypeDefinition({
	name: 'Data', 
	blockMode: BlockMode.choice,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'null-data', tag: 0, occurrence: Occurrence.implicit, asn1Type: 'NULL', }),
		new Property({name: 'array', tag: 1, occurrence: Occurrence.implicit, asn1Type: 'SEQUENCE OF', subType: 'Data', }),
		new Property({name: 'structure', tag: 2, occurrence: Occurrence.implicit, asn1Type: 'SEQUENCE OF', subType: 'Data', }),
		new Property({name: 'boolean', tag: 3, occurrence: Occurrence.implicit, asn1Type: 'BOOLEAN', }),
		new Property({name: 'bit-string', tag: 4, occurrence: Occurrence.implicit, asn1Type: 'BIT STRING', }),
		new Property({name: 'double-long', tag: 5, occurrence: Occurrence.implicit, customType: 'Integer32', }),
		new Property({name: 'double-long-unsigned', tag: 6, occurrence: Occurrence.implicit, customType: 'Unsigned32', }),
		new Property({name: 'octet-string', tag: 9, occurrence: Occurrence.implicit, asn1Type: 'OCTET STRING', }),
		new Property({name: 'visible-string', tag: 10, occurrence: Occurrence.implicit, asn1Type: 'VisibleString', }),
		new Property({name: 'utf8-string', tag: 12, occurrence: Occurrence.implicit, asn1Type: 'UTF8String', }),
		new Property({name: 'bcd', tag: 13, occurrence: Occurrence.implicit, customType: 'Integer8', }),
		new Property({name: 'integer', tag: 15, occurrence: Occurrence.implicit, customType: 'Integer8', }),
		new Property({name: 'long', tag: 16, occurrence: Occurrence.implicit, customType: 'Integer16', }),
		new Property({name: 'unsigned', tag: 17, occurrence: Occurrence.implicit, customType: 'Unsigned8', }),
		new Property({name: 'long-unsigned', tag: 18, occurrence: Occurrence.implicit, customType: 'Unsigned16', }),
		new Property({name: 'compact-array', tag: 19, occurrence: Occurrence.implicit, asn1Type: 'SEQUENCE', typeParameter: '{ contents-description [0] TypeDescription', }),
		new Property({name: 'compact-array', tag: 19, occurrence: Occurrence.implicit, asn1Type: 'SEQUENCE', typeParameter: '{ contents-description [0] TypeDescription, array-contents [1] IMPLICIT OCTET STRING }', }),
		new Property({name: 'long64', tag: 20, occurrence: Occurrence.implicit, customType: 'Integer64', }),
		new Property({name: 'long64-unsigned', tag: 21, occurrence: Occurrence.implicit, customType: 'Unsigned64', }),
		new Property({name: 'enum', tag: 22, occurrence: Occurrence.implicit, customType: 'Unsigned8', }),
		new Property({name: 'float32', tag: 23, occurrence: Occurrence.implicit, asn1Type: 'OCTET STRING', typeParameter: '(SIZE(4))', }),
		new Property({name: 'float64', tag: 24, occurrence: Occurrence.implicit, asn1Type: 'OCTET STRING', typeParameter: '(SIZE(8))', }),
		new Property({name: 'date-time', tag: 25, occurrence: Occurrence.implicit, asn1Type: 'OCTET STRING', typeParameter: '(SIZE(12))', }),
		new Property({name: 'date', tag: 26, occurrence: Occurrence.implicit, asn1Type: 'OCTET STRING', typeParameter: '(SIZE(5))', }),
		new Property({name: 'time', tag: 27, occurrence: Occurrence.implicit, asn1Type: 'OCTET STRING', typeParameter: '(SIZE(4))', }),
		new Property({name: 'dont-care', tag: 255, occurrence: Occurrence.implicit, asn1Type: 'NULL', })
	],
});

const ObjectName = new TypeDefinition({
	name: 'ObjectName', 
	blockMode: BlockMode.single,
	occurrence: Occurrence.none, 
	customType: 'Integer16',
});

const Data_Access_Result = new TypeDefinition({
	name: 'Data-Access-Result', 
	blockMode: BlockMode.enumerated,
	occurrence: Occurrence.none, 
	enumerations: [
		new Enumeration('success', 0),
		new Enumeration('hardware-fault', 1),
		new Enumeration('temporary-failure', 2),
		new Enumeration('read-write-denied', 3),
		new Enumeration('object-undefined', 4),
		new Enumeration('object-class-inconsistent', 9),
		new Enumeration('object-unavailable', 11),
		new Enumeration('type-unmatched', 12),
		new Enumeration('scope-of-access-violated', 13),
		new Enumeration('data-block-unavailable', 14),
		new Enumeration('long-get-aborted', 15),
		new Enumeration('no-long-get-in-progress', 16),
		new Enumeration('long-set-aborted', 17),
		new Enumeration('no-long-set-in-progress', 18),
		new Enumeration('data-block-number-invalid', 19),
		new Enumeration('other-reason', 250)
	],
});

const Data_Block_Result = new TypeDefinition({
	name: 'Data-Block-Result', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'last-block', occurrence: Occurrence.none, asn1Type: 'BOOLEAN', }),
		new Property({name: 'block-number', occurrence: Occurrence.none, customType: 'Unsigned16', }),
		new Property({name: 'raw-data', occurrence: Occurrence.none, asn1Type: 'OCTET STRING', })
	],
});

const ServiceError = new TypeDefinition({
	name: 'ServiceError', 
	blockMode: BlockMode.choice,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'application-reference', tag: 0, occurrence: Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0)', }),
		new Property({name: 'application-reference', tag: 0, occurrence: Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), time-elapsed (1)', }),
		new Property({name: 'application-reference', tag: 0, occurrence: Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), time-elapsed (1), application-unreachable (2)', }),
		new Property({name: 'application-reference', tag: 0, occurrence: Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), time-elapsed (1), application-unreachable (2), application-reference-invalid (3)', }),
		new Property({name: 'application-reference', tag: 0, occurrence: Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), time-elapsed (1), application-unreachable (2), application-reference-invalid (3), application-context-unsupported (4)', }),
		new Property({name: 'application-reference', tag: 0, occurrence: Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), time-elapsed (1), application-unreachable (2), application-reference-invalid (3), application-context-unsupported (4), provider-communication-error (5)', }),
		new Property({name: 'application-reference', tag: 0, occurrence: Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), time-elapsed (1), application-unreachable (2), application-reference-invalid (3), application-context-unsupported (4), provider-communication-error (5), deciphering-error (6) }', }),
		new Property({name: 'hardware-resource', tag: 1, occurrence: Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0)', }),
		new Property({name: 'hardware-resource', tag: 1, occurrence: Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), memory-unavailable (1)', }),
		new Property({name: 'hardware-resource', tag: 1, occurrence: Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), memory-unavailable (1), processor-resource-unavailable (2)', }),
		new Property({name: 'hardware-resource', tag: 1, occurrence: Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), memory-unavailable (1), processor-resource-unavailable (2), mass-storage-unavailable (3)', }),
		new Property({name: 'hardware-resource', tag: 1, occurrence: Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), memory-unavailable (1), processor-resource-unavailable (2), mass-storage-unavailable (3), other-resource-unavailable (4) }', }),
		new Property({name: 'vde-state-error', tag: 2, occurrence: Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0)', }),
		new Property({name: 'vde-state-error', tag: 2, occurrence: Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), no-dlms-context (1)', }),
		new Property({name: 'vde-state-error', tag: 2, occurrence: Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), no-dlms-context (1), loading-data-set (2)', }),
		new Property({name: 'vde-state-error', tag: 2, occurrence: Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), no-dlms-context (1), loading-data-set (2), status-nochange (3)', }),
		new Property({name: 'vde-state-error', tag: 2, occurrence: Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), no-dlms-context (1), loading-data-set (2), status-nochange (3), status-inoperable (4) }', }),
		new Property({name: 'service', tag: 3, occurrence: Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0)', }),
		new Property({name: 'service', tag: 3, occurrence: Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), pdu-size (1)', }),
		new Property({name: 'service', tag: 3, occurrence: Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), pdu-size (1), service-unsupported (2) }', }),
		new Property({name: 'definition', tag: 4, occurrence: Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0)', }),
		new Property({name: 'definition', tag: 4, occurrence: Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), object-undefined (1)', }),
		new Property({name: 'definition', tag: 4, occurrence: Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), object-undefined (1), object-class-inconsistent (2)', }),
		new Property({name: 'definition', tag: 4, occurrence: Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), object-undefined (1), object-class-inconsistent (2), object-attribute-inconsistent (3) }', }),
		new Property({name: 'access', tag: 5, occurrence: Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0)', }),
		new Property({name: 'access', tag: 5, occurrence: Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), scope-of-access-violated (1)', }),
		new Property({name: 'access', tag: 5, occurrence: Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), scope-of-access-violated (1), object-access-violated (2)', }),
		new Property({name: 'access', tag: 5, occurrence: Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), scope-of-access-violated (1), object-access-violated (2), hardware-fault (3)', }),
		new Property({name: 'access', tag: 5, occurrence: Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), scope-of-access-violated (1), object-access-violated (2), hardware-fault (3), object-unavailable (4) }', }),
		new Property({name: 'initiate', tag: 6, occurrence: Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0)', }),
		new Property({name: 'initiate', tag: 6, occurrence: Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), dlms-version-too-low (1)', }),
		new Property({name: 'initiate', tag: 6, occurrence: Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), dlms-version-too-low (1), incompatible-conformance (2)', }),
		new Property({name: 'initiate', tag: 6, occurrence: Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), dlms-version-too-low (1), incompatible-conformance (2), pdu-size-too-short (3)', }),
		new Property({name: 'initiate', tag: 6, occurrence: Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), dlms-version-too-low (1), incompatible-conformance (2), pdu-size-too-short (3), refused-by-the-VDE-Handler (4) }', }),
		new Property({name: 'load-data-set', tag: 7, occurrence: Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0)', }),
		new Property({name: 'load-data-set', tag: 7, occurrence: Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), primitive-out-of-sequence (1)', }),
		new Property({name: 'load-data-set', tag: 7, occurrence: Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), primitive-out-of-sequence (1), not-loadable (2)', }),
		new Property({name: 'load-data-set', tag: 7, occurrence: Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), primitive-out-of-sequence (1), not-loadable (2), dataset-size-too-large (3)', }),
		new Property({name: 'load-data-set', tag: 7, occurrence: Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), primitive-out-of-sequence (1), not-loadable (2), dataset-size-too-large (3), not-awaited-segment (4)', }),
		new Property({name: 'load-data-set', tag: 7, occurrence: Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), primitive-out-of-sequence (1), not-loadable (2), dataset-size-too-large (3), not-awaited-segment (4), interpretation-failure (5)', }),
		new Property({name: 'load-data-set', tag: 7, occurrence: Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), primitive-out-of-sequence (1), not-loadable (2), dataset-size-too-large (3), not-awaited-segment (4), interpretation-failure (5), storage-failure (6)', }),
		new Property({name: 'load-data-set', tag: 7, occurrence: Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), primitive-out-of-sequence (1), not-loadable (2), dataset-size-too-large (3), not-awaited-segment (4), interpretation-failure (5), storage-failure (6), data-set-not-ready (7) }', }),
		new Property({name: 'task', tag: 9, occurrence: Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0)', }),
		new Property({name: 'task', tag: 9, occurrence: Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), no-remote-control (1)', }),
		new Property({name: 'task', tag: 9, occurrence: Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), no-remote-control (1), ti-stopped (2)', }),
		new Property({name: 'task', tag: 9, occurrence: Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), no-remote-control (1), ti-stopped (2), ti-running (3)', }),
		new Property({name: 'task', tag: 9, occurrence: Occurrence.implicit, asn1Type: 'ENUMERATED', typeParameter: '{ other (0), no-remote-control (1), ti-stopped (2), ti-running (3), ti-unusable (4) }', })
	],
});

const Long_Invoke_Id_And_Priority = new TypeDefinition({
	name: 'Long-Invoke-Id-And-Priority', 
	blockMode: BlockMode.single,
	occurrence: Occurrence.none, 
	customType: 'Unsigned32',
});

const Notification_Body = new TypeDefinition({
	name: 'Notification-Body', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'data-value', occurrence: Occurrence.none, customType: 'Data', })
	],
});

const Get_Request_Normal = new TypeDefinition({
	name: 'Get-Request-Normal', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'invoke-id-and-priority', occurrence: Occurrence.none, customType: 'Invoke-Id-And-Priority', }),
		new Property({name: 'cosem-attribute-descriptor', occurrence: Occurrence.none, customType: 'Cosem-Attribute-Descriptor', }),
		new Property({name: 'access-selection', occurrence: Occurrence.none, customType: 'Selective-Access-Descriptor', isOptional: true, })
	],
});

const Get_Request_Next = new TypeDefinition({
	name: 'Get-Request-Next', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'invoke-id-and-priority', occurrence: Occurrence.none, customType: 'Invoke-Id-And-Priority', }),
		new Property({name: 'block-number', occurrence: Occurrence.none, customType: 'Unsigned32', })
	],
});

const Get_Request_With_List = new TypeDefinition({
	name: 'Get-Request-With-List', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'invoke-id-and-priority', occurrence: Occurrence.none, customType: 'Invoke-Id-And-Priority', }),
		new Property({name: 'attribute-descriptor-list', occurrence: Occurrence.none, asn1Type: 'SEQUENCE OF', subType: 'Cosem-Attribute-Descriptor-With-Selection', })
	],
});

const Set_Request_Normal = new TypeDefinition({
	name: 'Set-Request-Normal', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'invoke-id-and-priority', occurrence: Occurrence.none, customType: 'Invoke-Id-And-Priority', }),
		new Property({name: 'cosem-attribute-descriptor', occurrence: Occurrence.none, customType: 'Cosem-Attribute-Descriptor', }),
		new Property({name: 'access-selection', occurrence: Occurrence.none, customType: 'Selective-Access-Descriptor', isOptional: true, }),
		new Property({name: 'value', occurrence: Occurrence.none, customType: 'Data', })
	],
});

const Set_Request_With_First_Datablock = new TypeDefinition({
	name: 'Set-Request-With-First-Datablock', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'invoke-id-and-priority', occurrence: Occurrence.none, customType: 'Invoke-Id-And-Priority', }),
		new Property({name: 'cosem-attribute-descriptor', occurrence: Occurrence.none, customType: 'Cosem-Attribute-Descriptor', }),
		new Property({name: 'access-selection', tag: 0, occurrence: Occurrence.implicit, customType: 'Selective-Access-Descriptor', isOptional: true, }),
		new Property({name: 'datablock', occurrence: Occurrence.none, customType: 'DataBlock-SA', })
	],
});

const Set_Request_With_Datablock = new TypeDefinition({
	name: 'Set-Request-With-Datablock', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'invoke-id-and-priority', occurrence: Occurrence.none, customType: 'Invoke-Id-And-Priority', }),
		new Property({name: 'datablock', occurrence: Occurrence.none, customType: 'DataBlock-SA', })
	],
});

const Set_Request_With_List = new TypeDefinition({
	name: 'Set-Request-With-List', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'invoke-id-and-priority', occurrence: Occurrence.none, customType: 'Invoke-Id-And-Priority', }),
		new Property({name: 'attribute-descriptor-list', occurrence: Occurrence.none, asn1Type: 'SEQUENCE OF', subType: 'Cosem-Attribute-Descriptor-With-Selection', }),
		new Property({name: 'value-list', occurrence: Occurrence.none, asn1Type: 'SEQUENCE OF', subType: 'Data', })
	],
});

const Set_Request_With_List_And_First_Datablock = new TypeDefinition({
	name: 'Set-Request-With-List-And-First-Datablock', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'invoke-id-and-priority', occurrence: Occurrence.none, customType: 'Invoke-Id-And-Priority', }),
		new Property({name: 'attribute-descriptor-list', occurrence: Occurrence.none, asn1Type: 'SEQUENCE OF', subType: 'Cosem-Attribute-Descriptor-With-Selection', }),
		new Property({name: 'datablock', occurrence: Occurrence.none, customType: 'DataBlock-SA', })
	],
});

const Cosem_Attribute_Descriptor = new TypeDefinition({
	name: 'Cosem-Attribute-Descriptor', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'class-id', occurrence: Occurrence.none, customType: 'Cosem-Class-Id', }),
		new Property({name: 'instance-id', occurrence: Occurrence.none, customType: 'Cosem-Object-Instance-Id', }),
		new Property({name: 'attribute-id', occurrence: Occurrence.none, customType: 'Cosem-Object-Attribute-Id', })
	],
});

const Action_Request_Normal = new TypeDefinition({
	name: 'Action-Request-Normal', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'invoke-id-and-priority', occurrence: Occurrence.none, customType: 'Invoke-Id-And-Priority', }),
		new Property({name: 'cosem-method-descriptor', occurrence: Occurrence.none, customType: 'Cosem-Method-Descriptor', }),
		new Property({name: 'method-invocation-parameters', occurrence: Occurrence.none, customType: 'Data', isOptional: true, })
	],
});

const Action_Request_Next_Pblock = new TypeDefinition({
	name: 'Action-Request-Next-Pblock', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'invoke-id-and-priority', occurrence: Occurrence.none, customType: 'Invoke-Id-And-Priority', }),
		new Property({name: 'block-number', occurrence: Occurrence.none, customType: 'Unsigned32', })
	],
});

const Action_Request_With_List = new TypeDefinition({
	name: 'Action-Request-With-List', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'invoke-id-and-priority', occurrence: Occurrence.none, customType: 'Invoke-Id-And-Priority', }),
		new Property({name: 'cosem-method-descriptor-list', occurrence: Occurrence.none, asn1Type: 'SEQUENCE OF', subType: 'Cosem-Method-Descriptor', }),
		new Property({name: 'method-invocation-parameters', occurrence: Occurrence.none, asn1Type: 'SEQUENCE OF', subType: 'Data', })
	],
});

const Action_Request_With_First_Pblock = new TypeDefinition({
	name: 'Action-Request-With-First-Pblock', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'invoke-id-and-priority', occurrence: Occurrence.none, customType: 'Invoke-Id-And-Priority', }),
		new Property({name: 'cosem-method-descriptor', occurrence: Occurrence.none, customType: 'Cosem-Method-Descriptor', }),
		new Property({name: 'pblock', occurrence: Occurrence.none, customType: 'DataBlock-SA', })
	],
});

const Action_Request_With_List_And_First_Pblock = new TypeDefinition({
	name: 'Action-Request-With-List-And-First-Pblock', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'invoke-id-and-priority', occurrence: Occurrence.none, customType: 'Invoke-Id-And-Priority', }),
		new Property({name: 'cosem-method-descriptor-list', occurrence: Occurrence.none, asn1Type: 'SEQUENCE OF', subType: 'Cosem-Method-Descriptor', }),
		new Property({name: 'pblock', occurrence: Occurrence.none, customType: 'DataBlock-SA', })
	],
});

const Action_Request_With_Pblock = new TypeDefinition({
	name: 'Action-Request-With-Pblock', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'invoke-id-and-priority', occurrence: Occurrence.none, customType: 'Invoke-Id-And-Priority', }),
		new Property({name: 'pblock', occurrence: Occurrence.none, customType: 'DataBlock-SA', })
	],
});

const Get_Response_Normal = new TypeDefinition({
	name: 'Get-Response-Normal', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'invoke-id-and-priority', occurrence: Occurrence.none, customType: 'Invoke-Id-And-Priority', }),
		new Property({name: 'result', occurrence: Occurrence.none, customType: 'Get-Data-Result', })
	],
});

const Get_Response_With_Datablock = new TypeDefinition({
	name: 'Get-Response-With-Datablock', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'invoke-id-and-priority', occurrence: Occurrence.none, customType: 'Invoke-Id-And-Priority', }),
		new Property({name: 'result', occurrence: Occurrence.none, customType: 'DataBlock-G', })
	],
});

const Get_Response_With_List = new TypeDefinition({
	name: 'Get-Response-With-List', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'invoke-id-and-priority', occurrence: Occurrence.none, customType: 'Invoke-Id-And-Priority', }),
		new Property({name: 'result', occurrence: Occurrence.none, asn1Type: 'SEQUENCE OF', subType: 'Get-Data-Result', })
	],
});

const Set_Response_Normal = new TypeDefinition({
	name: 'Set-Response-Normal', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'invoke-id-and-priority', occurrence: Occurrence.none, customType: 'Invoke-Id-And-Priority', }),
		new Property({name: 'result', occurrence: Occurrence.none, customType: 'Data-Access-Result', })
	],
});

const Set_Response_Datablock = new TypeDefinition({
	name: 'Set-Response-Datablock', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'invoke-id-and-priority', occurrence: Occurrence.none, customType: 'Invoke-Id-And-Priority', }),
		new Property({name: 'block-number', occurrence: Occurrence.none, customType: 'Unsigned32', })
	],
});

const Set_Response_Last_Datablock = new TypeDefinition({
	name: 'Set-Response-Last-Datablock', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'invoke-id-and-priority', occurrence: Occurrence.none, customType: 'Invoke-Id-And-Priority', }),
		new Property({name: 'result', occurrence: Occurrence.none, customType: 'Data-Access-Result', }),
		new Property({name: 'block-number', occurrence: Occurrence.none, customType: 'Unsigned32', })
	],
});

const Set_Response_Last_Datablock_With_List = new TypeDefinition({
	name: 'Set-Response-Last-Datablock-With-List', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'invoke-id-and-priority', occurrence: Occurrence.none, customType: 'Invoke-Id-And-Priority', }),
		new Property({name: 'result', occurrence: Occurrence.none, asn1Type: 'SEQUENCE OF', subType: 'Data-Access-Result', }),
		new Property({name: 'block-number', occurrence: Occurrence.none, customType: 'Unsigned32', })
	],
});

const Set_Response_With_List = new TypeDefinition({
	name: 'Set-Response-With-List', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'invoke-id-and-priority', occurrence: Occurrence.none, customType: 'Invoke-Id-And-Priority', }),
		new Property({name: 'result', occurrence: Occurrence.none, asn1Type: 'SEQUENCE OF', subType: 'Data-Access-Result', })
	],
});

const Action_Response_Normal = new TypeDefinition({
	name: 'Action-Response-Normal', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'invoke-id-and-priority', occurrence: Occurrence.none, customType: 'Invoke-Id-And-Priority', }),
		new Property({name: 'single-response', occurrence: Occurrence.none, customType: 'Action-Response-With-Optional-Data', })
	],
});

const Action_Response_With_Pblock = new TypeDefinition({
	name: 'Action-Response-With-Pblock', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'invoke-id-and-priority', occurrence: Occurrence.none, customType: 'Invoke-Id-And-Priority', }),
		new Property({name: 'pblock', occurrence: Occurrence.none, customType: 'DataBlock-SA', })
	],
});

const Action_Response_With_List = new TypeDefinition({
	name: 'Action-Response-With-List', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'invoke-id-and-priority', occurrence: Occurrence.none, customType: 'Invoke-Id-And-Priority', }),
		new Property({name: 'list-of-responses', occurrence: Occurrence.none, asn1Type: 'SEQUENCE OF', subType: 'Action-Response-With-Optional-Data', })
	],
});

const Action_Response_Next_Pblock = new TypeDefinition({
	name: 'Action-Response-Next-Pblock', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'invoke-id-and-priority', occurrence: Occurrence.none, customType: 'Invoke-Id-And-Priority', }),
		new Property({name: 'block-number', occurrence: Occurrence.none, customType: 'Unsigned32', })
	],
});

const Access_Request_Body = new TypeDefinition({
	name: 'Access-Request-Body', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'access-request-specification', occurrence: Occurrence.none, customType: 'List-Of-Access-Request-Specification', }),
		new Property({name: 'access-request-list-of-data', occurrence: Occurrence.none, customType: 'List-Of-Data', })
	],
});

const Access_Response_Body = new TypeDefinition({
	name: 'Access-Response-Body', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'access-request-specification', tag: 0, occurrence: Occurrence.none, customType: 'List-Of-Access-Request-Specification', isOptional: true, }),
		new Property({name: 'access-response-list-of-data', occurrence: Occurrence.none, customType: 'List-Of-Data', }),
		new Property({name: 'access-response-specification', occurrence: Occurrence.none, customType: 'List-Of-Access-Response-Specification', })
	],
});

const Key_Info = new TypeDefinition({
	name: 'Key-Info', 
	blockMode: BlockMode.choice,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'identified-key', tag: 0, occurrence: Occurrence.none, customType: 'Identified-Key', }),
		new Property({name: 'wrapped-key', tag: 1, occurrence: Occurrence.none, customType: 'Wrapped-Key', }),
		new Property({name: 'agreed-key', tag: 2, occurrence: Occurrence.none, customType: 'Agreed-Key', })
	],
});

const Block_Control = new TypeDefinition({
	name: 'Block-Control', 
	blockMode: BlockMode.single,
	occurrence: Occurrence.none, 
	customType: 'Unsigned8',
});

const Parameterized_Access = new TypeDefinition({
	name: 'Parameterized-Access', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'variable-name', occurrence: Occurrence.none, customType: 'ObjectName', }),
		new Property({name: 'selector', occurrence: Occurrence.none, customType: 'Unsigned8', }),
		new Property({name: 'parameter', occurrence: Occurrence.none, customType: 'Data', })
	],
});

const Block_Number_Access = new TypeDefinition({
	name: 'Block-Number-Access', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'block-number', occurrence: Occurrence.none, customType: 'Unsigned16', })
	],
});

const Read_Data_Block_Access = new TypeDefinition({
	name: 'Read-Data-Block-Access', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'last-block', occurrence: Occurrence.none, asn1Type: 'BOOLEAN', }),
		new Property({name: 'block-number', occurrence: Occurrence.none, customType: 'Unsigned16', }),
		new Property({name: 'raw-data', occurrence: Occurrence.none, asn1Type: 'OCTET STRING', })
	],
});

const Write_Data_Block_Access = new TypeDefinition({
	name: 'Write-Data-Block-Access', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'last-block', occurrence: Occurrence.none, asn1Type: 'BOOLEAN', }),
		new Property({name: 'block-number', occurrence: Occurrence.none, customType: 'Unsigned16', })
	],
});

const Integer32 = new TypeDefinition({
	name: 'Integer32', 
	blockMode: BlockMode.single,
	occurrence: Occurrence.none, 
	asn1Type: 'INTEGER',
	typeParameter: '(-2147483648..2147483647)',
});

const Unsigned32 = new TypeDefinition({
	name: 'Unsigned32', 
	blockMode: BlockMode.single,
	occurrence: Occurrence.none, 
	asn1Type: 'INTEGER',
	typeParameter: '(0..4294967295)',
});

const Integer16 = new TypeDefinition({
	name: 'Integer16', 
	blockMode: BlockMode.single,
	occurrence: Occurrence.none, 
	asn1Type: 'INTEGER',
	typeParameter: '(-32768..32767)',
});

const Integer64 = new TypeDefinition({
	name: 'Integer64', 
	blockMode: BlockMode.single,
	occurrence: Occurrence.none, 
	asn1Type: 'INTEGER',
	typeParameter: '(-9223372036854775808..9223372036854775807)',
});

const Unsigned64 = new TypeDefinition({
	name: 'Unsigned64', 
	blockMode: BlockMode.single,
	occurrence: Occurrence.none, 
	asn1Type: 'INTEGER',
	typeParameter: '(0..18446744073709551615)',
});

const Invoke_Id_And_Priority = new TypeDefinition({
	name: 'Invoke-Id-And-Priority', 
	blockMode: BlockMode.single,
	occurrence: Occurrence.none, 
	customType: 'Unsigned8',
});

const Selective_Access_Descriptor = new TypeDefinition({
	name: 'Selective-Access-Descriptor', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'access-selector', occurrence: Occurrence.none, customType: 'Unsigned8', }),
		new Property({name: 'access-parameters', occurrence: Occurrence.none, customType: 'Data', })
	],
});

const Cosem_Attribute_Descriptor_With_Selection = new TypeDefinition({
	name: 'Cosem-Attribute-Descriptor-With-Selection', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'cosem-attribute-descriptor', occurrence: Occurrence.none, customType: 'Cosem-Attribute-Descriptor', }),
		new Property({name: 'access-selection', occurrence: Occurrence.none, customType: 'Selective-Access-Descriptor', isOptional: true, })
	],
});

const DataBlock_SA = new TypeDefinition({
	name: 'DataBlock-SA', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'last-block', occurrence: Occurrence.none, asn1Type: 'BOOLEAN', }),
		new Property({name: 'block-number', occurrence: Occurrence.none, customType: 'Unsigned32', }),
		new Property({name: 'raw-data', occurrence: Occurrence.none, asn1Type: 'OCTET STRING', })
	],
});

const Cosem_Class_Id = new TypeDefinition({
	name: 'Cosem-Class-Id', 
	blockMode: BlockMode.single,
	occurrence: Occurrence.none, 
	customType: 'Unsigned16',
});

const Cosem_Object_Instance_Id = new TypeDefinition({
	name: 'Cosem-Object-Instance-Id', 
	blockMode: BlockMode.single,
	occurrence: Occurrence.none, 
	asn1Type: 'OCTET STRING',
	typeParameter: '(SIZE(6))',
});

const Cosem_Object_Attribute_Id = new TypeDefinition({
	name: 'Cosem-Object-Attribute-Id', 
	blockMode: BlockMode.single,
	occurrence: Occurrence.none, 
	customType: 'Integer8',
});

const Cosem_Method_Descriptor = new TypeDefinition({
	name: 'Cosem-Method-Descriptor', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'class-id', occurrence: Occurrence.none, customType: 'Cosem-Class-Id', }),
		new Property({name: 'instance-id', occurrence: Occurrence.none, customType: 'Cosem-Object-Instance-Id', }),
		new Property({name: 'method-id', occurrence: Occurrence.none, customType: 'Cosem-Object-Method-Id', })
	],
});

const Get_Data_Result = new TypeDefinition({
	name: 'Get-Data-Result', 
	blockMode: BlockMode.choice,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'data', tag: 0, occurrence: Occurrence.none, customType: 'Data', }),
		new Property({name: 'data-access-result', tag: 1, occurrence: Occurrence.implicit, customType: 'Data-Access-Result', })
	],
});

const DataBlock_G = new TypeDefinition({
	name: 'DataBlock-G', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'last-block', occurrence: Occurrence.none, asn1Type: 'BOOLEAN', }),
		new Property({name: 'block-number', occurrence: Occurrence.none, customType: 'Unsigned32', }),
		new Property({name: 'result', occurrence: Occurrence.none, asn1Type: 'CHOICE', typeParameter: '{ raw-data [0] IMPLICIT OCTET STRING', }),
		new Property({name: 'result', occurrence: Occurrence.none, asn1Type: 'CHOICE', typeParameter: '{ raw-data [0] IMPLICIT OCTET STRING, data-access-result [1] IMPLICIT Data-Access-Result }', })
	],
});

const Action_Response_With_Optional_Data = new TypeDefinition({
	name: 'Action-Response-With-Optional-Data', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'result', occurrence: Occurrence.none, customType: 'Action-Result', }),
		new Property({name: 'return-parameters', occurrence: Occurrence.none, customType: 'Get-Data-Result', isOptional: true, })
	],
});

const List_Of_Access_Request_Specification = new TypeDefinition({
	name: 'List-Of-Access-Request-Specification', 
	blockMode: BlockMode.single,
	occurrence: Occurrence.none, 
	asn1Type: 'SEQUENCE OF',
	typeParameter: 'Access-Request-Specification',
});

const List_Of_Data = new TypeDefinition({
	name: 'List-Of-Data', 
	blockMode: BlockMode.single,
	occurrence: Occurrence.none, 
	asn1Type: 'SEQUENCE OF',
	typeParameter: 'Data',
});

const List_Of_Access_Response_Specification = new TypeDefinition({
	name: 'List-Of-Access-Response-Specification', 
	blockMode: BlockMode.single,
	occurrence: Occurrence.none, 
	asn1Type: 'SEQUENCE OF',
	typeParameter: 'Access-Response-Specification',
});

const Identified_Key = new TypeDefinition({
	name: 'Identified-Key', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'key-id', occurrence: Occurrence.none, customType: 'Key-Id', })
	],
});

const Wrapped_Key = new TypeDefinition({
	name: 'Wrapped-Key', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'kek-id', occurrence: Occurrence.none, customType: 'Kek-Id', }),
		new Property({name: 'key-ciphered-data', occurrence: Occurrence.none, asn1Type: 'OCTET STRING', })
	],
});

const Agreed_Key = new TypeDefinition({
	name: 'Agreed-Key', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({name: 'key-parameters', occurrence: Occurrence.none, asn1Type: 'OCTET STRING', }),
		new Property({name: 'key-ciphered-data', occurrence: Occurrence.none, asn1Type: 'OCTET STRING', })
	],
});

const Cosem_Object_Method_Id = new TypeDefinition({
	name: 'Cosem-Object-Method-Id', 
	blockMode: BlockMode.single,
	occurrence: Occurrence.none, 
	customType: 'Integer8',
});

const Action_Result = new TypeDefinition({
	name: 'Action-Result', 
	blockMode: BlockMode.enumerated,
	occurrence: Occurrence.none, 
	enumerations: [
		new Enumeration('success', 0),
		new Enumeration('hardware-fault', 1),
		new Enumeration('temporary-failure', 2),
		new Enumeration('read-write-denied', 3),
		new Enumeration('object-undefined', 4),
		new Enumeration('object-class-inconsistent', 9),
		new Enumeration('object-unavailable', 11),
		new Enumeration('type-unmatched', 12),
		new Enumeration('scope-of-access-violated', 13),
		new Enumeration('data-block-unavailable', 14),
		new Enumeration('long-action-aborted', 15),
		new Enumeration('no-long-action-in-progress', 16),
		new Enumeration('other-reason', 250)
	],
});

const Key_Id = new TypeDefinition({
	name: 'Key-Id', 
	blockMode: BlockMode.enumerated,
	occurrence: Occurrence.none, 
	enumerations: [
		new Enumeration('global-unicast-encryption-key', 0),
		new Enumeration('global-broadcast-encryption-key', 1)
	],
});

const Kek_Id = new TypeDefinition({
	name: 'Kek-Id', 
	blockMode: BlockMode.enumerated,
	occurrence: Occurrence.none, 
	enumerations: [
		new Enumeration('master-key', 0)
	],
});

export const cosemTypeDefinitionMap = new Map<string, TypeDefinition>([
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
import { BlockMode, Occurrence } from "../cosem-asn2ts/cosem-asn2ts-lib/enums";
import { Definition } from "../cosem-lib/definition";
import { Property } from "../cosem-lib/property";


const XDLMS_APDU = new Definition({
	name: 'XDLMS-APDU', 
	blockMode: BlockMode.choice,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({})
	],
});


const InitiateRequest = new Definition({
	name: 'InitiateRequest', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({})
	],
});


const ReadRequest = new Definition({
	name: 'ReadRequest', 
	blockMode: BlockMode.single,
	occurrence: Occurrence.none, 
});


const WriteRequest = new Definition({
	name: 'WriteRequest', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({})
	],
});


const InitiateResponse = new Definition({
	name: 'InitiateResponse', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({})
	],
});


const ReadResponse = new Definition({
	name: 'ReadResponse', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({})
	],
});


const WriteResponse = new Definition({
	name: 'WriteResponse', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({}),
		new Property({})
	],
});


const ConfirmedServiceError = new Definition({
	name: 'ConfirmedServiceError', 
	blockMode: BlockMode.choice,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({})
	],
});


const Data_Notification = new Definition({
	name: 'Data-Notification', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({}),
		new Property({})
	],
});


const UnconfirmedWriteRequest = new Definition({
	name: 'UnconfirmedWriteRequest', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({})
	],
});


const InformationReportRequest = new Definition({
	name: 'InformationReportRequest', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({}),
		new Property({})
	],
});


const Get_Request = new Definition({
	name: 'Get-Request', 
	blockMode: BlockMode.choice,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({}),
		new Property({})
	],
});


const Set_Request = new Definition({
	name: 'Set-Request', 
	blockMode: BlockMode.choice,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({})
	],
});


const EventNotificationRequest = new Definition({
	name: 'EventNotificationRequest', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({}),
		new Property({})
	],
});


const Action_Request = new Definition({
	name: 'Action-Request', 
	blockMode: BlockMode.choice,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({})
	],
});


const Get_Response = new Definition({
	name: 'Get-Response', 
	blockMode: BlockMode.choice,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({}),
		new Property({})
	],
});


const Set_Response = new Definition({
	name: 'Set-Response', 
	blockMode: BlockMode.choice,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({})
	],
});


const Action_Response = new Definition({
	name: 'Action-Response', 
	blockMode: BlockMode.choice,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({})
	],
});


const ExceptionResponse = new Definition({
	name: 'ExceptionResponse', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({})
	],
});


const Access_Request = new Definition({
	name: 'Access-Request', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({}),
		new Property({})
	],
});


const Access_Response = new Definition({
	name: 'Access-Response', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({}),
		new Property({})
	],
});


const General_Glo_Ciphering = new Definition({
	name: 'General-Glo-Ciphering', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({})
	],
});


const General_Ded_Ciphering = new Definition({
	name: 'General-Ded-Ciphering', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({})
	],
});


const General_Ciphering = new Definition({
	name: 'General-Ciphering', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({})
	],
});


const General_Signing = new Definition({
	name: 'General-Signing', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({})
	],
});


const General_Block_Transfer = new Definition({
	name: 'General-Block-Transfer', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({})
	],
});


const Integer8 = new Definition({
	name: 'Integer8', 
	blockMode: BlockMode.single,
	occurrence: Occurrence.none, 
});


const Unsigned8 = new Definition({
	name: 'Unsigned8', 
	blockMode: BlockMode.single,
	occurrence: Occurrence.none, 
});


const Conformance = new Definition({
	name: 'Conformance', 
	blockMode: BlockMode.bitString,
	occurrence: Occurrence.implicit, 
	tag: 31,
	customTag: 'APPLICATION',
});


const Unsigned16 = new Definition({
	name: 'Unsigned16', 
	blockMode: BlockMode.single,
	occurrence: Occurrence.none, 
});


const Variable_Access_Specification = new Definition({
	name: 'Variable-Access-Specification', 
	blockMode: BlockMode.choice,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({})
	],
});


const Data = new Definition({
	name: 'Data', 
	blockMode: BlockMode.choice,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({})
	],
});


const ObjectName = new Definition({
	name: 'ObjectName', 
	blockMode: BlockMode.single,
	occurrence: Occurrence.none, 
});


const Data_Access_Result = new Definition({
	name: 'Data-Access-Result', 
	blockMode: BlockMode.enumerated,
	occurrence: Occurrence.none, 
});


const Data_Block_Result = new Definition({
	name: 'Data-Block-Result', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({}),
		new Property({})
	],
});


const ServiceError = new Definition({
	name: 'ServiceError', 
	blockMode: BlockMode.choice,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({})
	],
});


const Long_Invoke_Id_And_Priority = new Definition({
	name: 'Long-Invoke-Id-And-Priority', 
	blockMode: BlockMode.single,
	occurrence: Occurrence.none, 
});


const Notification_Body = new Definition({
	name: 'Notification-Body', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({})
	],
});


const Get_Request_Normal = new Definition({
	name: 'Get-Request-Normal', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({}),
		new Property({})
	],
});


const Get_Request_Next = new Definition({
	name: 'Get-Request-Next', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({})
	],
});


const Get_Request_With_List = new Definition({
	name: 'Get-Request-With-List', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({})
	],
});


const Set_Request_Normal = new Definition({
	name: 'Set-Request-Normal', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({})
	],
});


const Set_Request_With_First_Datablock = new Definition({
	name: 'Set-Request-With-First-Datablock', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({})
	],
});


const Set_Request_With_Datablock = new Definition({
	name: 'Set-Request-With-Datablock', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({})
	],
});


const Set_Request_With_List = new Definition({
	name: 'Set-Request-With-List', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({}),
		new Property({})
	],
});


const Set_Request_With_List_And_First_Datablock = new Definition({
	name: 'Set-Request-With-List-And-First-Datablock', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({}),
		new Property({})
	],
});


const Cosem_Attribute_Descriptor = new Definition({
	name: 'Cosem-Attribute-Descriptor', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({}),
		new Property({})
	],
});


const Action_Request_Normal = new Definition({
	name: 'Action-Request-Normal', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({}),
		new Property({})
	],
});


const Action_Request_Next_Pblock = new Definition({
	name: 'Action-Request-Next-Pblock', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({})
	],
});


const Action_Request_With_List = new Definition({
	name: 'Action-Request-With-List', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({}),
		new Property({})
	],
});


const Action_Request_With_First_Pblock = new Definition({
	name: 'Action-Request-With-First-Pblock', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({}),
		new Property({})
	],
});


const Action_Request_With_List_And_First_Pblock = new Definition({
	name: 'Action-Request-With-List-And-First-Pblock', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({}),
		new Property({})
	],
});


const Action_Request_With_Pblock = new Definition({
	name: 'Action-Request-With-Pblock', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({})
	],
});


const Get_Response_Normal = new Definition({
	name: 'Get-Response-Normal', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({})
	],
});


const Get_Response_With_Datablock = new Definition({
	name: 'Get-Response-With-Datablock', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({})
	],
});


const Get_Response_With_List = new Definition({
	name: 'Get-Response-With-List', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({})
	],
});


const Set_Response_Normal = new Definition({
	name: 'Set-Response-Normal', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({})
	],
});


const Set_Response_Datablock = new Definition({
	name: 'Set-Response-Datablock', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({})
	],
});


const Set_Response_Last_Datablock = new Definition({
	name: 'Set-Response-Last-Datablock', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({}),
		new Property({})
	],
});


const Set_Response_Last_Datablock_With_List = new Definition({
	name: 'Set-Response-Last-Datablock-With-List', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({}),
		new Property({})
	],
});


const Set_Response_With_List = new Definition({
	name: 'Set-Response-With-List', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({})
	],
});


const Action_Response_Normal = new Definition({
	name: 'Action-Response-Normal', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({})
	],
});


const Action_Response_With_Pblock = new Definition({
	name: 'Action-Response-With-Pblock', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({})
	],
});


const Action_Response_With_List = new Definition({
	name: 'Action-Response-With-List', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({})
	],
});


const Action_Response_Next_Pblock = new Definition({
	name: 'Action-Response-Next-Pblock', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({})
	],
});


const Access_Request_Body = new Definition({
	name: 'Access-Request-Body', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({})
	],
});


const Access_Response_Body = new Definition({
	name: 'Access-Response-Body', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({}),
		new Property({})
	],
});


const Key_Info = new Definition({
	name: 'Key-Info', 
	blockMode: BlockMode.choice,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({}),
		new Property({})
	],
});


const Block_Control = new Definition({
	name: 'Block-Control', 
	blockMode: BlockMode.single,
	occurrence: Occurrence.none, 
});


const Parameterized_Access = new Definition({
	name: 'Parameterized-Access', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({}),
		new Property({})
	],
});


const Block_Number_Access = new Definition({
	name: 'Block-Number-Access', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({})
	],
});


const Read_Data_Block_Access = new Definition({
	name: 'Read-Data-Block-Access', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({}),
		new Property({})
	],
});


const Write_Data_Block_Access = new Definition({
	name: 'Write-Data-Block-Access', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({})
	],
});


const Integer32 = new Definition({
	name: 'Integer32', 
	blockMode: BlockMode.single,
	occurrence: Occurrence.none, 
});


const Unsigned32 = new Definition({
	name: 'Unsigned32', 
	blockMode: BlockMode.single,
	occurrence: Occurrence.none, 
});


const Integer16 = new Definition({
	name: 'Integer16', 
	blockMode: BlockMode.single,
	occurrence: Occurrence.none, 
});


const Integer64 = new Definition({
	name: 'Integer64', 
	blockMode: BlockMode.single,
	occurrence: Occurrence.none, 
});


const Unsigned64 = new Definition({
	name: 'Unsigned64', 
	blockMode: BlockMode.single,
	occurrence: Occurrence.none, 
});


const Invoke_Id_And_Priority = new Definition({
	name: 'Invoke-Id-And-Priority', 
	blockMode: BlockMode.single,
	occurrence: Occurrence.none, 
});


const Selective_Access_Descriptor = new Definition({
	name: 'Selective-Access-Descriptor', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({})
	],
});


const Cosem_Attribute_Descriptor_With_Selection = new Definition({
	name: 'Cosem-Attribute-Descriptor-With-Selection', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({})
	],
});


const DataBlock_SA = new Definition({
	name: 'DataBlock-SA', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({}),
		new Property({})
	],
});


const Cosem_Class_Id = new Definition({
	name: 'Cosem-Class-Id', 
	blockMode: BlockMode.single,
	occurrence: Occurrence.none, 
});


const Cosem_Object_Instance_Id = new Definition({
	name: 'Cosem-Object-Instance-Id', 
	blockMode: BlockMode.single,
	occurrence: Occurrence.none, 
});


const Cosem_Object_Attribute_Id = new Definition({
	name: 'Cosem-Object-Attribute-Id', 
	blockMode: BlockMode.single,
	occurrence: Occurrence.none, 
});


const Cosem_Method_Descriptor = new Definition({
	name: 'Cosem-Method-Descriptor', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({}),
		new Property({})
	],
});


const Get_Data_Result = new Definition({
	name: 'Get-Data-Result', 
	blockMode: BlockMode.choice,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({})
	],
});


const DataBlock_G = new Definition({
	name: 'DataBlock-G', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({}),
		new Property({}),
		new Property({})
	],
});


const Action_Response_With_Optional_Data = new Definition({
	name: 'Action-Response-With-Optional-Data', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({})
	],
});


const List_Of_Access_Request_Specification = new Definition({
	name: 'List-Of-Access-Request-Specification', 
	blockMode: BlockMode.single,
	occurrence: Occurrence.none, 
});


const List_Of_Data = new Definition({
	name: 'List-Of-Data', 
	blockMode: BlockMode.single,
	occurrence: Occurrence.none, 
});


const List_Of_Access_Response_Specification = new Definition({
	name: 'List-Of-Access-Response-Specification', 
	blockMode: BlockMode.single,
	occurrence: Occurrence.none, 
});


const Identified_Key = new Definition({
	name: 'Identified-Key', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({})
	],
});


const Wrapped_Key = new Definition({
	name: 'Wrapped-Key', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({})
	],
});


const Agreed_Key = new Definition({
	name: 'Agreed-Key', 
	blockMode: BlockMode.sequence,
	occurrence: Occurrence.none, 
	properties: [
		new Property({}),
		new Property({})
	],
});


const Cosem_Object_Method_Id = new Definition({
	name: 'Cosem-Object-Method-Id', 
	blockMode: BlockMode.single,
	occurrence: Occurrence.none, 
});


const Action_Result = new Definition({
	name: 'Action-Result', 
	blockMode: BlockMode.enumerated,
	occurrence: Occurrence.none, 
});


const Key_Id = new Definition({
	name: 'Key-Id', 
	blockMode: BlockMode.enumerated,
	occurrence: Occurrence.none, 
});


const Kek_Id = new Definition({
	name: 'Kek-Id', 
	blockMode: BlockMode.enumerated,
	occurrence: Occurrence.none, 
});
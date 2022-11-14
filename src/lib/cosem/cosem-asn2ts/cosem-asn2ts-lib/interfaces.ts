import { DefinitionProcessor } from "./definition-processor";
import { PropertyProcessor } from "./property-processor";
import { EnumerationProcessor } from "./enumeration-processor";
import { BitStringProcessor } from "./bit-string-processor";

export interface DefinitionProcessors {
	[key: string]: DefinitionProcessor;
}

export interface TaggedPropertyProcessors {
	[tag: number]: PropertyProcessor;
}

export interface EnumerationProcessors {
	[value: number]: EnumerationProcessor;
}

export interface BitStringProcessors {
	[bit: number]: BitStringProcessor;
}

import { Property } from "./property";
import { Enumeration } from "./enumeration";
import { BitString } from "./bit-string";

export interface TaggedProperties {
	[tag: number]: Property | undefined;
}

export interface Enumerations {
	[value: number]: Enumeration;
}

export interface BitStrings {
	[bit: number]: BitString;
}

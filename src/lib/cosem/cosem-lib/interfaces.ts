import { Definition } from "./definition";
import { Property } from "./property";
import { Enumeration } from "./enumeration";
import { BitString } from "./bit-string";

export interface Definitions {
	[key: string]: Definition;
}

export interface TaggedProperties {
	[tag: number]: Property;
}

export interface Enumerations {
	[value: number]: Enumeration;
}

export interface BitStrings {
	[bit: number]: BitString;
}

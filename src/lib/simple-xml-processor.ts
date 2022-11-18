import { Result } from "./cosem/cosem-lib/asn-1-data-types";

interface SimpleXmlAttribute {
	name: string,
	value: string;
}

class SimpleXmlNode {
	public children: SimpleXmlNode[] = [];

	constructor (
		public tagName: string,
		children: SimpleXmlNode[] | undefined,
		public attributes: SimpleXmlAttribute[] = [],
		public comment?: string) {
		if(children) {
			this.children = children
		}
	}
}

interface AnalysisResult {
	xmlNode?: SimpleXmlNode;
	value?: string;
	comment?: string;
}


export class SimpleXmlProcessor {
	// Seems like property names from ASN.1 define XML tags. Other elements are omitted.
	// Values from descendants are propagated to the first ancestor with a property name.

	public transform(cosemAsn1Result: Result): string {
		const analysisResult = this.analyzeTypeDefinition(cosemAsn1Result);
		if (!analysisResult.xmlNode) {
			console.warn(`SimpleXmlProcessor.SimpleXmlProcessor No nodes found.`)
			return '';
		}
		const xmlString = this.buildXml(analysisResult.xmlNode);
		console.log(xmlString)
		return xmlString
	}

	private buildXml(currentNode: SimpleXmlNode, level: number = 0): string {
		const indent = '\t'.repeat(level);
		let attributes = '';
		if(currentNode.attributes && currentNode.attributes.length > 0) {
			attributes = ' ' + currentNode.attributes.map(a => `${a.name}="${this.xmlAttributeEncoding(a.value)}"`).join(' ');
		}
		const comment = currentNode.comment ? ` <!-- ${currentNode.comment} -->` : '';
		const hasChildren = currentNode.children?.length ?? 0 > 0;
		const closingDash = hasChildren ? '' : '/'
		const encodedTag = this.xmlTagNameEncoding(currentNode.tagName)
		let output = `${indent}<${encodedTag}${attributes}${closingDash}>${comment}\n`
		if(!hasChildren) return output;

		for(const child of currentNode.children) {
			output += this.buildXml(child, level + 1);
		}
		output += `${indent}</${encodedTag}>\n`;
		return output;
	}

	private xmlAttributeEncoding(attributeValue: string): string {
		return attributeValue
			.replace('&', '&amp;')
			.replace('"', '&quot;')
			.replace('<', '&lt;')
	}

	private xmlTagNameEncoding(tagName: string): string {
		// must not start with a digit, but property names of asn.1 specification do not do that
		return tagName
			.replace(/[^a-zA-Z0-9\-_]/, '_')
			.split('-').map(w => w[0].toUpperCase() + w.slice(1))
			.join('');
	}

	private analyzeTypeDefinition(result: Result): AnalysisResult {
		if(result.results.length == 0) {
			let comment: string | undefined;
			if(result.dateTimeValue) {
				comment = result.dateTimeValue.asString;
			} else if(result.numberValue != undefined) {
				comment = result.numberValue.toString();
				if(result.stringValue) {
					comment += `, ${result.stringValue}`
				}
			} else {
				comment = result.stringValue;
			}
			if(result.propertyName) {
				return {
					xmlNode: new SimpleXmlNode(result.propertyName, undefined, [{name: 'Value', value: result.hexString, }], comment)
				};
			}
			return {
				value: result.hexString,
				comment
			}
		}

		const children: SimpleXmlNode[] = [];

		if(result.results.length == 1) {
			const analysisReport = this.analyzeTypeDefinition(result.results[0]);
			if(!analysisReport.xmlNode) {
				const attributes = analysisReport.value == undefined ? undefined : [{name: 'Value', value: analysisReport.value}];
				if(result.propertyName) {
					return {
						xmlNode: new SimpleXmlNode(result.propertyName, undefined, attributes, analysisReport.comment)
					};
				}
				return analysisReport;
			}
			if(!result.propertyName) {
				return analysisReport;
			}
			children.push(analysisReport.xmlNode);
		} else {  // if (result.results.length > 1)
			for(const propertyResult of result.results) {
				const analysisReport = this.analyzeTypeDefinition(propertyResult);
				if(!analysisReport.xmlNode) {
					console.error(`SimpleXmlProcessor.analyzeTypeDefinition cosemAsn1Result ${result.propertyName} ${result.typeName} has multiple children but ${propertyResult.typeName} is probably missing a propertyName ${propertyResult.propertyName} so xmlTag missing.`)
					continue;
				}
				children.push(analysisReport.xmlNode)
			}
		}
		const attributes: SimpleXmlAttribute[] = [];
		if(result.count != undefined) {
			attributes.push({name: 'Qty', value: result.count.toString()});
		}
		if(result.propertyName) {
			return  {
				xmlNode: new SimpleXmlNode(result.propertyName, children, attributes)
			};
		}

		// no property name && multiple children => something wrong:
		console.error(`SimpleXmlProcessor.analyzeTypeDefinition cosemAsn1Result ${result.propertyName} ${result.typeName} has multiple children but has no propertyName. No valid XML.`)
		return {
			xmlNode: new SimpleXmlNode('__MissingPropertyName__', children, attributes)
		};
	}
}

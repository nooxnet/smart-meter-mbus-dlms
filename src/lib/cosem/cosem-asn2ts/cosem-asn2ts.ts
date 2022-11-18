import { readFile, writeFile  } from 'node:fs/promises';
import { TypeDefinitionProcessor } from "./cosem-asn2ts-lib/type-definition-processor";
import { DefinitionProcessors } from "./cosem-asn2ts-lib/interfaces";

const cosemAsnFile = './COSEMpdu_GB83.asn';
const generatedCodeFile = '../generated/asn1-structure.ts';

const pduDefinitionsToAnalyze: string[] = [
	'XDLMS-APDU'
];

const allDefinitionProcessorsRaw: DefinitionProcessors = { };
const definitionProcessors: DefinitionProcessors = { };
const typesToProcess: string[] = [...pduDefinitionsToAnalyze];


async function main() {
	console.log('opening file', cosemAsnFile);
	let data = await readFile(cosemAsnFile, 'utf-8');

	console.log('removing comments ...')
	data = removeComments(data);

	console.log('splitting definitions ...')
	splitDefinitions(data);

	console.log('processing used definitions ...');
	processUsedDefinitions();

	console.log('writing file', generatedCodeFile);
	await generateTypeScriptCode();
}

(async () => {
	try {
		await main();
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
})();

function processUsedDefinitions() {
	while(typesToProcess.length > 0) {
		const typeToProcess = typesToProcess.shift();
		//console.log(`processUsedDefinitions: ${typeToProcess} ...`);
		const definitionToProcess = allDefinitionProcessorsRaw[typeToProcess!];
		if(definitionToProcess.isProcessed) {
			continue;
		}
		const childrenToProcess = definitionToProcess.process();
		for(let childToProcess of childrenToProcess) {
			if(!typesToProcess.includes(childToProcess)) {
				typesToProcess.push(childToProcess);
			}
		}
		definitionProcessors[definitionToProcess.name] = definitionToProcess;
	}
}

function splitDefinitions(data: string): void  {

	const beginPattern = /^\s*[\w-]*\s*DEFINITIONS[^:=)]*\s*::=\s*BEGIN\s*/;
	const match = beginPattern.exec(data);
	if(!match) {
		console.error('string "... DEFINITIONS ... s::= BEGIN" not found.');
		process.exit(0);
	}
	data = data.substring(match.index + match[0].length);

	const endIndex = data.lastIndexOf('END');
	if(endIndex < 0) {
		console.error('string "END" at the bottom not found.');
		process.exit(0);
	}
	data = data.substring(0, endIndex - 1);
	data = data.trim();

	const definitionStrings = data.split(/^\s*([a-zA-Z][a-zA-Z0-9-]*)\s*::=/gm);
	while(definitionStrings.length > 0 && !definitionStrings[0]) {
		definitionStrings.shift();
	}
	for(let i = 0; i < definitionStrings.length; i += 2) {
		const key = definitionStrings[i].trim();
		const rawText = definitionStrings[i + 1].trim();
		//console.log(`definitions ${key} ...`)
		allDefinitionProcessorsRaw[key] = new TypeDefinitionProcessor(key, rawText);
	}
}

async function generateTypeScriptCode(): Promise<void> {
	const parts: string[] = [];
	parts.push('import { BlockMode, Occurrence } from "../cosem-asn2ts/cosem-asn2ts-lib/enums";\n' +
		'import { TypeDefinition } from "../cosem-lib/type-definition";\n' +
		'import { Property } from "../cosem-lib/property";\n' +
		'import { Enumeration } from "../cosem-lib/enumeration";\n' +
		'import { BitString } from "../cosem-lib/bit-string";'
	);

	const assignments: string[] = []
	for(const key in definitionProcessors) {
		const definition = definitionProcessors[key];
		parts.push(definition.generateCode());
		const assignmentParts = definition.generateAssignmentParts();
		assignments.push(`['${assignmentParts[0]}', ${assignmentParts[1]}]`);
	}

	parts.push(`export const cosemTypeDefinitionMap = new Map<string, TypeDefinition>([\n\t${assignments.join(',\n\t')}\n]);`);

	await writeFile(generatedCodeFile, parts.join('\n\n'), 'utf-8');
}


function removeComments(data: string): string {
	const lines = data.split(/\n/);
	for(let i = 0; i < lines.length; i++) {
		lines[i] = lines[i].split('--', 1)[0];
	}
	return lines.join('\n');
}

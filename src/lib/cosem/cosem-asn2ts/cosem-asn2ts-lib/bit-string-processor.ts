import { DefinitionProcessor } from "./definition-processor";

export class BitStringProcessor  {
	public name: string = '';
	public bit: number = 0;

	constructor(public definition: DefinitionProcessor, public rawText: string) {
	}

	public process() {
		const text = this.rawText.trim();
		const parts = text.split(/\s+/);

		let minLength = 2;
		if(parts.length < minLength) {
			console.error(`BitString.process: rawText too short: ${text}`);
			process.exit(1);
		}

		this.name = parts[0];

		let currentIndex = 1;

		// check for value
		if(parts[currentIndex][0] == '(') {
			const matches = parts[currentIndex].match(/^\((\d{1,3})\)$/);
			if(!matches || matches.length != 2) {
				console.error(`BitString.process: identifier ${parts[currentIndex]} of bit string ${this.name} starts with "(" but does not seem to be a value. rawText: ${text}`);
				process.exit(1);
			}
			this.bit = +matches[1];
			currentIndex++;
			minLength++;
		}
	}
}



export interface Settings {
	port: string,
	baudRate: number,
	dataBits: 5 | 6 | 7 | 8,
	parity: 'none' | 'even' | 'odd'
	stopBits: 1 | 1.5 | 2
}

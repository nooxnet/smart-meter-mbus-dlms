class JestTest {
	private x = 0;

	public testFunc(): number {
		this.x++;
		return this.x;
	}
}

let jestTest: JestTest;

describe('Test Jest', () => {

	beforeAll(() => {
		jestTest = new JestTest();
	});

	// test('initialize', () => {
	// 	jestTest = new JestTest();
	// 	expect(jestTest).toBeDefined();
	// });

	test('testFunc', () => {
		const result = jestTest?.testFunc();
		expect(result).toEqual(1);
	});
});


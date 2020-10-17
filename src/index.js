const process = require('process');

// @flow
function kmp_search(pattern: string) {
	function preprocess() {
		const failureArray = pattern
			.split('')
			.reduce((prev, cur, index, pattern) => {
				if (cur === pattern[prev[index - 1]]) {
					prev.push(prev[index - 1] + 1);
				} else {
					prev.push(index != 0 && cur === pattern[0] ? 1 : 0);
				}
				return prev;
			}, []);

		const patternLength = pattern.length - 1;

		let patternIndex: number = 0;
		let beginIndex: number = 0;
		let index: number = 0;

		return (cur: string) => {
			let res = {
				matched: false,
				beginIndex: -1,
			};

			if (cur !== pattern[patternIndex]) {
				patternIndex = failureArray[patternIndex - 1] || 0;
			}

			if (patternIndex === 0) {
				beginIndex = index;
			}

			if (cur === pattern[patternIndex]) {
				if (patternIndex === patternLength) {
					patternIndex = 0;
					res = {
						matched: true,
						beginIndex,
					};
				} else {
					patternIndex++;
				}
			}

			index++;
			return res;
		};
	}

	const match = preprocess();

	return {
		search: (text: string): number[] => {
			return text.split('').reduce((prev, cur) => {
				const { matched, beginIndex } = match(cur);
				if (matched) {
					prev.push(beginIndex);
				}
				return prev;
			}, []);
		},
	};
}

function main() {
	const args = process.argv.slice(2);
	const [text, pattern] = args;
	const searcher = kmp_search(pattern);
	const result = searcher.search(text);
	console.log(result);
}

main();

const process = require('process');

// @flow
function kmp_search(pattern: string) {
	function preprocess() {
		const failureArray = pattern
			.split('')
			.reduce((resArr, cur, index, pattern) => {
				if (cur === pattern[resArr[index - 1]]) {
					resArr.push(resArr[index - 1] + 1);
				} else {
					resArr.push(index != 0 && cur === pattern[0] ? 1 : 0);
				}
				return resArr;
			}, []);

		const patternLength = pattern.length - 1;

		let patternIndex: number = 0;
		let beginIndex: number = 0;
		let index: number = 0;

		return (cur: string) => {
			let res = {
				fullyMatched: false,
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
						fullyMatched: true,
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
			return text.split('').reduce((indexes, cur) => {
				const { fullyMatched, beginIndex } = match(cur);
				if (fullyMatched) {
					indexes.push(beginIndex);
				}
				return indexes;
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

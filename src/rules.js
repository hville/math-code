//@ts-check
// combined assignments are not supported: >>>= <<= >>= **= += -= *= /= %= &= ^= |=
// TODO dissalow dot operator and brackets???

module.exports = [
	{ // spacing,
		test: /^[\s\u200C\u200D\uFEFF]+/,
		type: '$space'
	}, { // exclusions
		test: arrToRE(Object.getOwnPropertyNames(Object.getPrototypeOf({})), false),
		type: '$error'
	}, { // numeric, must be first after exclusions to catch allowed "."
		test: /^(?:(?:\d*\.\d+|\d+)(?:[E|e][+|-]?\d+)?)|^NaN|^Infinity/
	}, { // literal, must be before Number, Math and identifier
		test: arrToRE(['true', 'false', 'null'], false),
	}, { // Number', must be before Math (E vs EPSILON)
		test: arrToRE(Object.getOwnPropertyNames(Number), false),
		type: 'Number'
	}, { // Math, must be after Number (E vs EPSILON)
		test: arrToRE(Object.getOwnPropertyNames(Math), false),
		type: 'Math'
	}, { // operator
		test: listToRE('( ) [ ] ** * / % + - ,'), //TODO remove ", [ ] **"?
	}, { // bitwise, must be before logical
		test: listToRE('>>> << >> ~ & ^ |'), //TODO remove?
	}, { // logical, must be after bitwise
		test: listToRE('=== !== == != <= >= && || ! < > ? :')
	}, { // assignment, must be after logical
		test: /^=/,
		type: '$equal'
	}, { // identifier, //must be last
		test: /^[_$A-Za-z][_$A-Za-z0-9]*/,
		type: '$param'
	}
]

function arrToRE(arr, suffix) {
	return RegExp('^(?:' + arr.join('|') + (suffix ? ')' : ')(?![_$A-Za-z0-9])'))
}

function listToRE(str) {
	return arrToRE(str.split(' ').map(escapeRegExp), true)
}

function escapeRegExp(stringRegex) {
	return stringRegex.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
}

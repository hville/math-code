// combined assignments are not supported: >>>= <<= >>= **= += -= *= /= %= &= ^= |=
// TODO dissalow dot operator and brackets???

var rules = [
	{
		name: 'spacing',
		test: /^[\s\u200C\u200D\uFEFF]+/,
		type: '$space'
	}, {
		name: 'exclude',
		test: arrToRE(Object.getOwnPropertyNames(Object.getPrototypeOf({})), false),
		type: '$error'
	}, {
		name: 'numeric', // must be first after exclusions to catch allowed "."
		test: /^(?:(?:\d*\.\d+|\d+)(?:[E|e][+|-]?\d+)?)|^NaN|^Infinity/
	}, {
		name: 'literal', // must be before Number, Math and identifier
		test: arrToRE(['true', 'false', 'null'], false),
	}, {
		name: 'Number', //must be before Math (E vs EPSILON)
		test: arrToRE(Object.getOwnPropertyNames(Number), false),
		type: 'Number'
	}, {
		name: 'Math', //must be after Number (E vs EPSILON)
		test: arrToRE(Object.getOwnPropertyNames(Math), false),
		type: 'Math'
	}, {
		name: 'operator',
		test: listToRE('( ) [ ] ** * / % + - ,'), //TODO remove ", [ ] **"?
	}, {
		name: 'bitwise', // must be before logical
		test: listToRE('>>> << >> ~ & ^ |'), //TODO remove?
	}, {
		name: 'logical', // must be after bitwise
		test: listToRE('=== !== == != <= >= && || ! < > ? :')
	}, {
		name: 'assignment', // must be after logical
		test: /^\=/,
		type: '$equal'
	}, {
		name: 'identifier', //must be last
		test: /^[_\$A-Za-z][_\$A-Za-z0-9]*/,
		type: '$param'
	}
]

module.exports = tokenize

function arrToRE(arr, suffix) {
	return RegExp('^(?:' + arr.join('|') + (suffix ? ')' : ')(?![_$A-Za-z0-9])'))
}
function listToRE(str) {
	return arrToRE(str.split(' ').map(escapeRegExp), true)
}
function escapeRegExp(stringRegex) {
	return stringRegex.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
}

function tokenize(string) {
	var tokens = []
	tokens.Math = []
	tokens.Number = []
	tokens.$param = []
	tokens.$equal = []
	tokens.$error = []
	tokens.$space = []
	tokens.$name = []

	while(string) {
		var tkn = getNextToken(string)
		if (Array.isArray(tkn)) {
			string = string.slice(tkn[0].length)
			if (tkn[0] === '=') addAssignmentToken(tkn, tokens)
			else addSpecialToken(tkn, tokens)
		} else {
			string = string.slice(tkn.length)
			tokens.push(tkn)
		}
	}
	return tokens
}
function getNextToken(source){
	for (var i=0; i < rules.length; ++i) {
		//console.log(i, rules[i])
		var res = rules[i].test.exec(source)
		if (res) return createToken(res[0], rules[i].type)
	}
	return createToken(source, '$error')
}
function createToken(string, typ) {
	if (!typ) return string
	var tkn = [string]
	tkn.type = typ
	return tkn
}
function addSpecialToken(tkn, tokens) {
	tokens.push(tkn)
	tokens[tkn.type].push(tokens.length-1)
}
function addAssignmentToken(tkn, tokens) {
	if (tokens.$param.length === 1 && tokens.length === 1 + tokens.$space.length) {
		tokens.$name.push(tokens.$param.pop())
		tokens[tokens.$name[0]].type = '$name'
	}
	else tkn.type = '$error'
	addSpecialToken(tkn, tokens)
}

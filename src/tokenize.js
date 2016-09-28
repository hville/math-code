var re = require('./reg-exp')

module.exports = tokenize

function tokenize(stringExpression, argumentsName) {
	var source = stringExpression,
			target = [],
			token = '',
			prefix = argumentsName || '$argument',
			name = ''

	var tests = [
		extract(re.isNumeric),
		extract(re.isLiteral), // must be before functions and identifiers
		extract(re.isBitwise), // must be before logical
		extract(re.isLogical), // must be after bitwise
		extract(re.isOperatr), // must be after functions
		extract(re.isMathFcn, function(t) { return 'Math.' + t }),
		extract(re.isVarName, function(t) { return prefix + '.' + t }), //must be after functions and constants,
		function assignmentTest(src) {
			// only a single assignment is allowed in second place. Will be checked on exit
			if (target.length === 1 && src[0] === '=') {
				source = source.slice(1)
				return '='
			}
		}
	]

	function extract(regexp, xfo) {
		var reg = RegExp('^' + regexp.source)
		return function() {
			var res = reg.exec(source)
			if (!res) return ''
			source = source.slice(res[0].length)
			return xfo ? xfo(res[0]) : res[0]
		}
	}



	while (source.length) {
		source = source.trim()
		token = getNextToken(source, tests)
		if (!token) return Error('unknown token at ' + (stringExpression.length - source.length))
		if (re.isRemoved.test(token)) return Error('forbiden "'+re.isRemoved.exec(token)[0]+'" token at ' + (stringExpression.length - source.length))
		target.push(token)
	}
	// remove assignment if any and set name
	if (target[1] === '=') {
		for (var i=0; i<prefix.length; ++i) {
			if (target[0][i] !== prefix[i]) return Error('illegal assignment at ' + (target[0].length+1))
		}
		name = target.shift().slice(prefix.length+1)
		target.shift() //remove the remaining assignment
	}
	return {name: name, tokens: target}
}
//find the next token in the source
function getNextToken(source, tests) {
	for (var i=0; i<tests.length; ++i) {
		var token = tests[i](source)
		if (token) return token
	}
}

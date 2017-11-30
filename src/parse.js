//@ts-check
var	tokenize = require('../src/tokenize')

/**
 * @param {string} expression
 * @return {Object}
 */
module.exports = function parse(expression) {
	var exp = {
		source: expression,
		tokens: tokenize(expression),
		errors: 0,
		name: '',
		code: '',
		args: [],
	}
	for (var i=0; i< exp.tokens.length; ++i) {
		var tkn = exp.tokens[i]
		if (tkn.type === '$name') exp.name = tkn.text
		else if (tkn.type === '$param') exp.args.push(tkn.text)
		else if (tkn.type === '$error') ++exp.errors

		if (tkn.text === '=') exp.code = ''
		else exp.code += tkn.code
	}
	exp.exec = exp.errors ? null : Function('$param', 'return ' + exp.code)
	return exp
}

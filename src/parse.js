var	tkn = require('../src/tokenize')

// color format
var NORM = '\u001b[0m',
		RED = '\u001b[31m'

module.exports = function(str) {
	return new Parser(str)
}

function Parser(str) {
	var tokens = tkn(str),
			nameIdx = tokens.$name[0]
	this.tokens = tokens
	this.name = nameIdx === undefined ? '' : tokens[nameIdx][0]
	this.errors = tokens.$error.length
}
Parser.prototype = {
	constructor: Parser,
	print: print,
	get exec() { return compile(this.tokens) },
	get args() { return param(this.tokens) }
}
function print() {
	var tokens = this.tokens
	for (var i=0, str=''; i<tokens.length; ++i) {
		if (tokens[i].type === '$error') str += RED + tokens[i] + NORM
		else str += tokens[i]
	}
	return str
}
function compile(tokens) {
	var	body = 'return ',
			first = tokens.$equal.length ? tokens.$equal[0]+1 : 0
	if (this.errors) return null
	for (var i=first; i<tokens.length; ++i) {
		body += !tokens[i].type ? tokens[i]
			: tokens[i].type === '$space' ? ' '
			: tokens[i].type + '.' + tokens[i]
	}
	return Function('$param', body)
}
function param(tokens) {
	return tokens.$param.map(getTokenString, tokens)
}
function getTokenString(idx) {
	return this[idx][0]
}

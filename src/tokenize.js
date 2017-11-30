//@ts-check
var rules = require('./rules'),
		Token = require('./_token')

module.exports = tokenize

/**
 * @param {string} string
 * @return {Array<Token>}
 */
function tokenize(string) {
	var tokens = []

	while(string) {
		var tkn = getNextToken(string)
		tokens.push(tkn)
		string = string.slice(tkn.text.length)
		// if assignment, check previous tokens for a single variable name
		if (tkn.text === '=') setName(tokens)
	}

	return tokens
}

/**
 * @param {string} source
 * @return {Token}
 */
function getNextToken(source){
	for (var i=0; i < rules.length; ++i) {
		var res = rules[i].test.exec(source)
		if (res) return new Token(res[0], rules[i].type)
	}
	return new Token(source, '$error')
}

/**
 * @param {Array<Token>} tokens
 * @return {void}
 */
function setName(tokens) {
	var hasName = false
	for (var i=0; i<tokens.length-1; ++i) {
		if (tokens[i].type === '$param') {
			tokens[i].type = hasName ? '$error' : '$name'
			hasName = true
		}
		else if (tokens[i].type !== '$space') {
			tokens[i].type = '$error'
		}
	}
	//dissalow '=...'
	if (!hasName) tokens[tokens.length-1].type = '$error'
}

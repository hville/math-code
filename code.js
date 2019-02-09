var T = require('./types')

/**
 * @param {Array<Array<string>>} tokens
 * @return {Object}
 */
module.exports = function(tokens) {
	var code = ''
	for (var i=0; i<tokens.length; ++i) {
		var tkn = tokens[i]
		switch (tkn[1]) {
			case T.error:
				return new Error('Unexpected token '+tkn[0])
			case T.nline:
				code += ';'
				break
			case T.space:
				code += ' '
				break
			case T.number: case T.const: case T.assign: case T.operator:
				code += tkn[0]
				break
			case T.input: case T.yield:
				code += ('i.' + tkn[0])
				break
			default: //scope
				code += tkn[1] + tkn[0]
		}
	}
	return code
}

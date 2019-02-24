var T = require('./types')

/**
 * @param {Array<Array<string>>} tokens
 * @return {Object}
 */
module.exports = function(tokens) {
	var code = ''
	for (var i=0; i<tokens.length; ++i) {
		var txt = tokens[i],
				typ = tokens[++i]
		switch (typ) {
			case T.error:
				return new Error('Unexpected token ' + txt)
			case T.nline:
				code += ';'
				break
			case T.space:
				code += ' '
				break
			case T.number: case T.const: case T.assign: case T.operator:
				code += txt
				break
			case T.input: case T.yield:
				code += ('i.' + txt)
				break
			default: //scope
				code += typ + txt
		}
	}
	return code
}

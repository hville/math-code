/**
 * @param {Array<string>} tokens
 * @return {Object}
 */
module.exports = function(tokens) {
	var code = ''
	for (var i=0; i<tokens.length; ++i) {
		var txt = tokens[i],
				typ = tokens[++i]
		switch (typ) {
			case 'e':
				return new Error('Unexpected token ' + txt)
			case 'r':
				code += ';'
				break
			case ' ':
				code += ' '
				break
			case 'n': case 'k': case '=': case '*':
				code += txt
				break
			case 'x': case 'y':
				code += ('i.' + txt)
				break
			default: //scope
				code += typ + txt
		}
	}
	return code
}

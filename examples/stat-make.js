

module.exports = {
	percent: null,

}

/**
 * @param {Array<string>} tokens
 * @return {Array<string>}
 */
module.exports = function(tokens) {
	var xs = [],
			ys = []
	for (var i=1; i<tokens.length; ++i) {
		var tok = tokens[i]
		if (tok === 'x') xs.push(tokens[i-1])
		else if (tok === 'y') ys.push(tokens[i-1])
	}
	return {inputs: xs, yields: ys}
}


/**
 * @param {string} code
 * @return {Function|Error}
 */
module.exports = function(code) {
	try {
		return code.constructor === Error ? code : Function('i', 'if (!i) i={};' + code + ';return i')
	}
	catch (e) {
		return e
	}
}
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


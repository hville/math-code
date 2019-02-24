var T = require('../types')

/**
 * @param {Array<Array<string>>} tokens
 * @return {Array<Array<string>>}
 */
module.exports = function(tokens) {
	var exists = new Set // defined values

	//positions, ignoring whitespaces: 1:arg. 2:eq 3:!ns && !eq]
	for (var t=0, pos = 0; t<tokens.length; ++t) {
		var txt = tokens[t],
				typ = tokens[++t]
		switch (typ) {
			case T.nline:
				if (pos === 1 || pos === 2) tokens[t] = T.error //too short to be an assignment
				pos = 0
				break
			case T.input:
				//wrong position or Object properties
				if (pos === 1) tokens[t] = T.error
				else if (!exists.has(txt) && pos === 0) {
					tokens[t] = T.yield
					exists.add(txt)
				}
				++pos
				break
			case T.assign:
				if (pos !== 1) tokens[t] = T.error //wrong position
				++pos
				break
			case T.space: case T.error: break
			default: //number, operator, constant, custom
				if (pos < 2) tokens[t] = T.error
				++pos
				break
		}
	}
	return tokens
}

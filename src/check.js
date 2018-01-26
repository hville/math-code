var T = require('../types')

/**
 * @param {Array<Array<string>>} tokens
 * @return {Array<Array<string>>}
 */
module.exports = function(tokens) {
	var exists = new Set // defined values

	//positions, ignoring whitespaces: 1:arg. 2:eq 3:!ns && !eq]
	for (var t=0, pos = 0; t<tokens.length; ++t) {
		var tkn = tokens[t]
		switch (tkn[1]) {
			case T.nline:
				if (pos === 1 || pos === 2) tkn[1] = T.error //too short to be an assignment
				pos = 0
				break
			case T.input:
				//wrong position or Object properties
				if (pos === 1) tkn[1] = T.error
				else if (!exists.has(tkn[0]) && pos === 0) {
					tkn[1] = T.yield
					exists.add(tkn[0])
				}
				++pos
				break
			case T.assign:
				if (pos !== 1) tkn[1] = T.error //wrong position
				++pos
				break
			case T.space: case T.error: break
			default: //number, operator, constant, custom
				if (pos < 2) tkn[1] = T.error
				++pos
				break
		}
	}
	return tokens
}

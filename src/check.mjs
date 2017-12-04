//@ts-check
/**
 * @param {Array<{t,s}>} tokens
 * @return {Array<{t,s}>}
 */
export default function check(tokens) {
	//positions, ignoring whitespaces: 1:arg. 2:eq 3:!ns && !eq]
	for (var t=0, len=0; t<tokens.length; ++t) {
		var tkn = tokens[t]
		switch (tkn.t) {
			case 'ws': break
			case 'nl':
				if (len >= 3) len = 0
				else if (len) tkn.t = 'er'
				break
			case 'arg.':
				if (len === 1) tkn.t = 'er'
				else ++len
				break
			case 'eq':
				if (len !== 1) tkn.t = 'er'
				else ++len
				break
			default:
				if (len < 2) tkn.t = 'er'
				else ++len
				break
		}
	}
	// incomplete last expression
	if (len === 1 || len === 2) tkn.t = 'er'
	return tokens
}

/**
 * @param {Array<string>} tokens
 * @return {Array<string>}
 */
module.exports = function(tokens) {
	var exists = new Set, // defined values
			last = 'r'

	//positions, ignoring whitespaces: 1:arg. 2:eq 3:!ns && !eq]
	for (var t=0; t<tokens.length; ++t) {
		var txt = tokens[t],
				typ = tokens[++t]
		switch (typ) {
			case 'r':
				if (last === 'y' || last === '=') tokens[t] = 'e' //too short to be an assignment
				else last = typ
				break
			case 'x':
				//wrong position or Object properties
				if (last === 'y' || last === 'x') tokens[t] = 'e'
				else if (last === 'r') {
					tokens[t] = !exists.has(txt) ? (last = (exists.add(txt), 'y')) : 'e'
				}
				else last = typ
				break
			case '=':
				if (last !== 'y') tokens[t] = 'e' //wrong position
				else last = typ
				break
			case ' ': case 'e': break
			default: //number, operator, constant, custom
				if (last === 'r' || last === 'y') tokens[t] = 'e'
				else last = typ
				break
		}
	}
	if (last === 'y' || last === '=') tokens[tokens.length-1] = 'e'
	return tokens
}

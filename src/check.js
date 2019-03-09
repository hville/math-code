/**
 * @param {Array<string>} tokens
 * @return {Array<string>}
 */
module.exports = function(tokens) {
	var exists = new Set, // defined values
			last = 'r',
			lvls = []

	//positions, ignoring whitespaces: 1:arg. 2:eq 3:!ns && !eq]
	for (var t=0; t<tokens.length; ++t) {
		var txt = tokens[t],
				typ = tokens[++t]
		switch (typ) {
			case 'r':
				if (last === 'v' || last === 'r') last = 'r'
				else tokens[t] = 'e'
				break
			case '=':
				if (last !== 'y') tokens[t] = 'e'
				else last = '*'
				break
			case 'x':
				if (last === 'y' || last === 'v') tokens[t] = 'e'
				else if (last === 'r') {
					tokens[t] = !exists.has(txt) ? (last = (exists.add(txt), 'y')) : 'e'
				}
				else last = 'v'
				break
			case 'n': case 'k':
				if (last === '*') last = 'v'
				else tokens[t] = 'e'
				break
			case '*':
				if (txt === '(') { // A*() || =() || A()
					last = '*'
					lvls.push(t)
				}
				else if (txt === ')') {
					if (lvls.pop()) last = 'v'
					else tokens[t] = 'e'
				}
				else {
					if (last === 'v') last = typ
					else tokens[t] = 'e'
				}
				break
			case ' ': case 'e': break
			default: //custom
				if (typ[typ.length-1] === '.') {
					if (last === '*') last = 'v'
					else tokens[t] = 'e'
				}
				else tokens[t] = 'e'
				break
		}
	}
	if (last !== 'v' && last !== 'r') tokens[tokens.length-1] = 'e'
	for (var i=0; i<lvls.length; ++i) tokens[lvls[i]] = 'e'
	return tokens
}

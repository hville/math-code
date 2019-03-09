var rule = require('./rule')

/**
 * @param {string} brief
 * @param {Object} [scope]
 * @return {Array<string>}
 */
module.exports = function(brief, scope) {
	var tokens = [],
			names = new Map(), //eg sin: Math.
			match
	if (scope) for (var i=0, ns=Object.keys(scope); i<ns.length; ++i) {
		var name = ns[i],
				keys = !scope[name] ? [] : Array.isArray(scope[name]) ? scope[name] : Object.getOwnPropertyNames(scope[name])
		name += '.'
		for (var j=0; j<keys.length; ++j) names.set(keys[j], name)
	}

	while( (match = rule.exec(brief)) ) {
		var txt = match[0]
		tokens.push(txt, match[1] ? 'n'
			: match[2] ? 'e'
			: match[3] ? 'k'
			: match[4] ? names.get(txt) || 'x'
			: match[5] ? txt === '=' ? '=' : '*'
			: match[6] ? 'r'
			: match[7] ? ' '
			: 'e'
		)
	}
	//tokens.push('', T.nline)
	return tokens
}

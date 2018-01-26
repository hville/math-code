// combined assignments are not supported: >>>= <<= >>= **= += -= *= /= %= &= ^= |=
// not using js-tokens since whitelist is easier to maintain than blacklist

var T = require('../types'),
		rule = require('./rule')

/**
 * @param {string} brief
 * @param {Object} [scope]
 * @return {Array<Array<string>>}
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
		var typ = match[1] ? T.number
			: match[2] ? T.error
			: match[3] ? T.const
			: match[4] ? names.get(txt) || T.input
			: match[5] ? txt === '=' ? T.assign : T.operator
			: match[6] ? T.nline
			: match[7] ? T.space
			: T.error
		tokens.push([txt, typ])
	}
	tokens.push(['', T.nline])
	return tokens
}

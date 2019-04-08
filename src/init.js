/**
 * @param {Object} rules
 * @param {Object} [scope]
 * @return {function(string): Array<string>}
 */
module.exports = function(rules, scope) {
	var types = Object.keys(rules),
			re = ''
	for (var i=0; i<types.length; ++i) {
		var ri = rules[types[i]],
				rc = ri.constructor
		re += '(' + (
			///(?:NaN|Infinity|true|false|null)(?![_$A-Za-z0-9]*)/
			rc === RegExp ? ri.source : rc === Array ? ('(?:'+ri.join('|')+')(?![$\\w])') : (ri + '(?![$\\w])')
		) + ')|'
	}
	var rule = new RegExp(re+'([^])', 'g')

	/**
	 * @param {string} brief
	 * @return {Array<string>}
	 */
	return function(brief) {
		var tokens = [],
				names = new Map(), //eg sin: Math.
				match
		if (scope) for (var i=0, ns=Object.keys(scope); i<ns.length; ++i) {
			//TODO
			var name = ns[i],
					keys = !scope[name] ? [] : Array.isArray(scope[name]) ? scope[name] : Object.getOwnPropertyNames(scope[name])
			name += '.'
			for (var j=0; j<keys.length; ++j) names.set(keys[j], name)
		}

		while( (match = rule.exec(brief)) ) {
			var txt = match[0]
			for (var k=1; k<match.length; ++k) if (match[k]) tokens.push(txt, types[k-1] || '')
		}
		//tokens.push('', T.nline)
		return tokens
	}
}
console.log(
	module.exports(require('./rules', {Math, Number}))('y= PI+xx+-3.2e1*NaN @')
)

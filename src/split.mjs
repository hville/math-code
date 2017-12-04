//@ts-check
// combined assignments are not supported: >>>= <<= >>= **= += -= *= /= %= &= ^= |=
// not using js-tokens since whitelist is easier to maintain than blacklist

var rule = RegExp(
	[ //newline
		/(?:;|[\n\r]\s*(?=[_$A-Za-z][_$A-Za-z0-9]*\s*=(?!=)))/,
		// numeric before blacklist to catch allowed "."
		/(?:(?:\d*\.\d+|\d+)(?:[E|e][+|-]?\d+)?)/,
		// blacklist: brackets and dots for properties, assignment operators:. [ ] += -= /= *= %= &= ^= ++ -- >>>= <<=
		/(?:[.[\]{}]|[+\-/*%&|^]=|\+{2}|-{2}|>{2,3}=|<{2}=)/,
		// operations: & && | || = == === ! != !== * ** < << > >> >>> <= >=
		/(?:[<>]=|&{1,2}|\|{1,2}|={1,3}|!={0,2}|\*{1,2}|<{1,2}|>{1,3}|[?\-+%~^/?,:;()])/,
		// id
		/[_$A-Za-z][_$A-Za-z0-9]*/,
		// space
		/\s+/,
		//none of the above
		/[\s\S]/
	].map(r => '(' + r.source + ')').join('|'),
	'g'
)

var litterals = [
	'NaN', 'Infinity', 'true', 'false', 'null'
]
var prototype = Object.getPrototypeOf({})

/**
 * @param {string} brief
 * @param {object} [scope]
 * @return {Array<{t, s}>}
 */
export default function split(brief, scope) {
	var tokens = [],
			nls = [],
			eqs = [],
			match

	while( (match = rule.exec(brief)) ) {
		var txt = match[0]
		var typ = match[1] ? (nls.push(tokens.length), 'nl')
			: match[6] ? 'ws' : match[2] ? 'nb'
				: match[4] ? txt === '=' ? (eqs.push(tokens.length), 'eq') : 'op'
					: (!match[5] || txt === 'prototype' || prototype.hasOwnProperty(txt)) ? 'er'
						: litterals.indexOf(txt) !== -1 ? 'li'
							: Math.hasOwnProperty(txt) ? 'Math.'
								: Number.hasOwnProperty(txt) ? 'Number.'
									: (scope && scope.hasOwnProperty(txt)) ? 'this.'
										: 'arg.'
		tokens.push({t: typ, s: txt})
	}
	return tokens
}

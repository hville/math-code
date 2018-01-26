// combined assignments are not supported: >>>= <<= >>= **= += -= *= /= %= &= ^= |=
// not using js-tokens since whitelist is easier to maintain than blacklist
require('fs').writeFileSync('./src/rule.js',
	'/*eslint-disable no-useless-escape*/\nmodule.exports = /' + [

		// 1. numeric before blacklist to catch allowed "."
		/(?:\d*\.\d+|\d+)(?:[E|e][+|-]?\d+)?/,

		// 2. blacklist: brackets and dots for properties, assignment operators:. [ ] += -= /= *= %= &= ^= ++ -- >>>= <<=
		/[.[\]{}'"]|[+\-/*%&|^]=|\+{2}|-{2}|>{2,3}=|<{2}=|prototype|toString|constructor|valueOf|toLocaleString/,

		// 3. literal
		/(?:NaN|Infinity|true|false|null)(?![_$A-Za-z0-9]*)/,

		// 4. id
		/[_$A-Za-z][_$A-Za-z0-9]*/,

		// 5. operations: & && | || = == === ! != !== * ** < << > >> >>> <= >=
		/[<>]=|&{1,2}|\|{1,2}|={1,3}|!={0,2}|\*{1,2}|<{1,2}|>{1,3}|[?\-+%~^/?,:()]/,

		// 6. newline /(?:[\n\r]\s*(?=[_$A-Za-z][_$A-Za-z0-9]*\s*=(?!=)))/,
		/\s*[\n\r;]/,

		// 7. space
		/\s+/,

		// 8. none of the above
		/[\s\S]/
	].map(r => '(' + r.source + ')').join('|') + '/g\n'
)

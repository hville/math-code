module.exports = {
	// 1. numeric before blacklist to catch allowed "."
	n: /(?:\d*\.\d+|\d+)(?:[E|e][+|-]?\d+)?/,

	// 2. blacklist: brackets and dots for properties, assignment operators:. [ ] += -= /= *= %= &= ^= ++ -- >>>= <<=
	'': /[.[\]{}'"]|[+\-/*%&|^]=|\+{2}|-{2}|>{2,3}=|<{2}=|prototype|toString|constructor|valueOf|toLocaleString/,

	// 3. literal
	l: ['NaN','Infinity','true','false','null'],// /(?:NaN|Infinity|true|false|null)(?![$\w])/,

	// 4. id
	i: /[_$A-Za-z][$\w]*/,

	// 5. operations: & && | || = == === ! != !== * ** < << > >> >>> <= >=
	o: /[<>]=|&{1,2}|\|{1,2}|={1,3}|!={0,2}|\*{1,2}|<{1,2}|>{1,3}|[?\-+%~^/?,:()]/,

	// 6. newline /(?:[\n\r]\s*(?=[_$A-Za-z][_$A-Za-z0-9]*\s*=(?!=)))/,
	r: /\s*[\n\r;]/,

	// 7. space
	_: /\s+/
}

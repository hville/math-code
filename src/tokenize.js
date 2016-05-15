var nbRE =	/(?:(?:\d*\.\d+|\d+)(?:[E|e][+|-]?\d+)?)|NaN|Infinity/,
		liRE = /(?:true|false|null)(?![_\$A-Za-z0-9])/,
		MaRE = RegExp('(?:' + Object.getOwnPropertyNames(Math).map(parseKey, Math).join('|') + ')'),
		opRE = listToRE('( ) [ ] ** * / % + - ,'),
		bwRE = listToRE('>>> << >> ~ & ^ |'),
		loRE = listToRE('=== !== == != <= >= && || ! < > ? :'),
		idRE = /[_\$A-Za-z][_\$A-Za-z0-9]*/,
		exclude = /\.prototype(?:\.|$)|\.window(?:\.|$)|\.self(?:\.|$)|\.process(?:\.|$)/

// combined assignments are not supported: >>>= <<= >>= **= += -= *= /= %= &= ^= |=
// TODO add Number.Epsilon, .MAX_SAFE_INTEGER .MAX_VALUE .MIN_SAFE_INTEGER .MIN_VALUE...

function parseKey(key) {
	return escapeRegExp(typeof this[key] === 'function' ? key+'(' : key)
}

function listToRE(str) {
	return RegExp('(?:' + str.split(' ').map(escapeRegExp).join('|') + ')')
}

function escapeRegExp(stringRegex) {
	return stringRegex.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
}

module.exports = function(stringExpression, argumentsName) {
	var source = stringExpression,
			target = [],
			token = '',
			prefix = argumentsName || '$argument',
			name = ''

	var tests = [
		extract(nbRE),
		extract(liRE), // must be before functions and identifiers

		extract(bwRE), // must be before logical
		extract(loRE), // must be after bitwise
		extract(opRE), // must be after functions
		extract(MaRE, function(t) { return 'Math.' + t }),
		extract(idRE, function(t) { return prefix + '.' + t }), //must be after functions and constants,
		function assignmentTest(src) {
			// only a single assignment is allowed in second place. Will be checked on exit
			if (target.length === 1 && src[0] === '=') {
				source = source.slice(1)
				return '='
			}
		}
	]

	function extract(regexp, xfo) {
		var reg = RegExp('^' + regexp.source)
		return function() {
			var res = reg.exec(source)
			if (!res) return ''
			source = source.slice(res[0].length)
			return xfo ? xfo(res[0]) : res[0]
		}
	}

	function next() {
		for (var i=0; i<tests.length; ++i) {
			token = tests[i](source)
			if (token) return token
		}
	}

	while (source.length) {
		source = source.trim()
		next()
		if (!token) return Error('unknown token at ' + (stringExpression.length - source.length))
		if (exclude.test(token)) return Error('forbiden "'+exclude.exec(token)[0]+'" token at ' + (stringExpression.length - source.length))
		target.push(token)
	}
	// remove assignment if any and set name
	if (target[1] === '=') {
		for (var i=0; i<prefix.length; ++i) {
			if (target[0][i] !== prefix[i]) return Error('illegal assignment at ' + (target[0].length+1))
		}
		name = target.shift().slice(prefix.length+1)
		target.shift() //remove the remaining assignment
	}
	return {name: name, tokens: target}
}

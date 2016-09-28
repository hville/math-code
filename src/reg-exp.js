// combined assignments are not supported: >>>= <<= >>= **= += -= *= /= %= &= ^= |=
// TODO add Number.Epsilon, .MAX_SAFE_INTEGER .MAX_VALUE .MIN_SAFE_INTEGER .MIN_VALUE...

module.exports = {
	isNumeric: /(?:(?:\d*\.\d+|\d+)(?:[E|e][+|-]?\d+)?)|NaN|Infinity/,
	isLiteral: /(?:true|false|null)(?![_\$A-Za-z0-9])/,
	isMathFcn: RegExp('(?:' + Object.getOwnPropertyNames(Math).map(parseKey, Math).join('|') + ')'),
	isOperatr: listToRE('( ) [ ] ** * / % + - ,'),
	isBitwise: listToRE('>>> << >> ~ & ^ |'),
	isLogical: listToRE('=== !== == != <= >= && || ! < > ? :'),
	isVarName: /[_\$A-Za-z][_\$A-Za-z0-9]*/,
	isRemoved: /\.prototype(?:\.|$)|\.window(?:\.|$)|\.self(?:\.|$)|\.process(?:\.|$)/
}
function parseKey(key) { //RE map function to extract the Math object methods
	return escapeRegExp(typeof this[key] === 'function' ? key+'(' : key)
}
function listToRE(str) {
	return RegExp('(?:' + str.split(' ').map(escapeRegExp).join('|') + ')')
}
function escapeRegExp(stringRegex) {
	return stringRegex.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
}

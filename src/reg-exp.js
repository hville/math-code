// combined assignments are not supported: >>>= <<= >>= **= += -= *= /= %= &= ^= |=

module.exports = {
	isNumeric: /^(?:(?:\d*\.\d+|\d+)(?:[E|e][+|-]?\d+)?)|^NaN|^Infinity/,
	isLiteral: /^(?:true|false|null)(?![_\$A-Za-z0-9])/,
	isNumbObj: RegExp('^(?:' + Object.getOwnPropertyNames(Number).join('|') + ')'),
	isMathObj: RegExp('^(?:' + Object.getOwnPropertyNames(Math).join('|') + ')'),
	isOperatr: listToRE('( ) [ ] ** * / % + - ,'),
	isBitwise: listToRE('>>> << >> ~ & ^ |'),
	isLogical: listToRE('=== !== == != <= >= && || ! < > ? :'),
	isVarName: /^[_\$A-Za-z][_\$A-Za-z0-9]*/,
}
function listToRE(str) {
	return RegExp('^(?:' + str.split(' ').map(escapeRegExp).join('|') + ')')
}
function escapeRegExp(stringRegex) {
	return stringRegex.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
}

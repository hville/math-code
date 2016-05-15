var isNumberRES =	'(?:'+
		'(?:\\d+|\\d*\\.\\d+)'+
		'(?:[E|e][+|-]?\\d+)?'+
	')|NaN|Infinity'
var isVariableRES = '[_\$A-Za-z][_\$A-Za-z0-9]*'

function strTest(tokStr) {
	return function(source) {
		for (var i=0; i<str.length; i++) if (str[i] !== source[i]) return
		return tokStr
	}
}

function regTest(regStr) {
	var reg = RegExp('^\s*'+regStr)
	return function(source) {
		var res = reg.exec(source)
		return res ? res[0] : ''
	}
}


var tokTests = [
	regTest(isNumberRES),
]




/*eslint no-console:0*/
function escapeRegExp(stringRegex) {
	return stringRegex.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

// A. void if has a method or method-like
var hasMethodRES = '\\.[^0-9]' //TODO
var hasMethodRE = new RegExp( hasMethodRES, 'g' ) //TODO
// B. split in number, variables and arguments

//	(?:)	Matches x but does not remember the match.
//var isOperator1RES =	['\\(', '\\)', '\\!', '\\~'].join('|')
var isOperatorRES =	'( ) ** * / % + - ,'.split(' ').map(escapeRegExp).join('|')
var isBitwiseRES =	'~ << >> >>> & ^ |'.split(' ').map(escapeRegExp).join('|')
var isLogicalRES =	'! > >= < <= == != === !== && || ? :'.split(' ').map(escapeRegExp).join('|')
var isValueRES = 'true|false'
var isFunctionRES = Object.getOwnPropertyNames(Math).join('|')


var fullRES = [isNumberRES, isOperatorRES, isBitwiseRES, isLogicalRES, isValueRES, isFunctionRES, isVariableRES].join('|')
var fullRE = new RegExp( fullRES, 'g' )

var functions = {}
var constants = {}
Object.getOwnPropertyNames(Math).forEach(function(key) {
	if (typeof Math[key] === 'function') functions[key] = Math[key]
	else constants[key] = Math[key]
})

var finders = [
	function fcn(str) {
		var ids = fcn
	}
	function(str) { return [tid, arg] } //eg ['+', [-1, +1]] vs ['name', []] vs ['!', [1]]
]

module.exports = function tokenize(stringExpression) {
	var str = stringExpression //the remaining string

	return function next() {
		if (!str.length) return {done: true}
		for (var i=0; i < finders.length; ++i) {
			var tkn = finders[i](str)
			if (tkn) {
				str = str.slice(tkn.length)
				return {value: tkn}
			}
		}
		return {done: true, value: Error('can\'t parse '+str)}
	}
}

/*eslint no-console:0*/
function escapeRegExp(stringRegex) {
	return stringRegex.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

// A. void if has a method or method-like
var hasMethodRES = '\\.[^0-9]' //TODO
var hasMethodRE = new RegExp( hasMethodRES, 'g' ) //TODO
// B. split in number, variables and arguments
var isNumberRES = '(?:NaN|-?(?:(?:\\d+|\\d*\\.\\d+)(?:[E|e][+|-]?\\d+)?|Infinity))'
//	(?:)	Matches x but does not remember the match.
//var isOperator1RES =	['\\(', '\\)', '\\!', '\\~'].join('|')
var isOperatorRES =	'( ) ** * / % + - ,'.split(' ').map(escapeRegExp).join('|')
var isBitwiseRES =	'~ << >> >>> & ^ |'.split(' ').map(escapeRegExp).join('|')
var isLogicalRES =	'! > >= < <= == != === !== && || ? :'.split(' ').map(escapeRegExp).join('|')
var isValueRES = 'true|false'
var isFunctionRES = Object.getOwnPropertyNames(Math).join('|')
var isVariableRES = '[_$A-Za-z][_$A-Za-z0-9]*'

var fullRES = [isNumberRES, isOperatorRES, isBitwiseRES, isLogicalRES, isValueRES, isFunctionRES, isVariableRES].join('|')
var fullRE = new RegExp( fullRES, 'g' )



module.exports = function parse(str) {
	if (str.search(hasMethodRE) !== -1) return Error('Decimal point only for numbers')

	var arr = str.match(fullRE)
	console.log(arr)
	var tree = splitTree(arr)
	console.log(tree)
	var tree2 = replace(tree, '**', 'pow')
	var final = joinTree(tree)
	console.log('final: ', final )
	var final2 = joinTree(tree2)
	console.log('final2: ', final2 )
	var final3 = makeMath(final2)
	console.log('END STRING3: ', final3 )
	var myFunc = Function('return '+final3)
	console.log('FUNCTION ', myFunc())



	// C. tree
	// 1+(2+(3-4)+exp(9,3))
	// 00011122211111122210
	//for (var i=0, par0=[], par1=[]; i<arr.length; ++i) {
		//if (arr[i]==='(') par0
	//}



}

function splitTree(src, fcn) {
	var tgt = []
	tgt.fcn = fcn || ''
	while(src.length) {
		var str = src.shift()
		if (str === ')') return tgt
		else if (str === '(') tgt.push(splitTree(src))
		else if (Object.getOwnPropertyNames(Math).indexOf(str) !== -1 && src[0] === '(') {
			src.shift()
			var newItem = splitTree(src)
			newItem.fcn = str
			tgt.push(newItem)
		}
		else tgt.push(str)
	}
	return tgt
}


function joinTree(tree) {
	var str = ''
	while(tree.length) {
		var itm = tree.shift()
		if (typeof itm === 'string') str += itm
		else if (Array.isArray(itm)) str += itm.fcn + '(' + joinTree(itm) + ')'
	}
	return str
}

function replace(src, op, fcn) {
	var tgt = []
	var itm
	var newItm = []
	for (var i=0; i<src.length; ++i) {
		itm = src[i]

		if (Array.isArray(itm)) {
			newItm = replace(itm,op,fcn)
			newItm.fcn = itm.fcn
			tgt.push(newItm)
		}
		else if (itm === op) {
			var A = tgt.pop()
			var newItm2 = [A, ',', src[++i]]
			newItm2.fcn = fcn
			console.log('BEFORE: ', src)
			console.log('AFTER: ', newItm2)
			tgt.push(newItm2)
		}
		else tgt.push(itm)

	}
	return tgt
}

function makeMath(str) {
	var isFunctionRES = Object.getOwnPropertyNames(Math).join('|')
	var isFunctionRE = new RegExp(isFunctionRES, 'g')
	return str.replace(isFunctionRE, function(match) {return 'Math.'+match})
}

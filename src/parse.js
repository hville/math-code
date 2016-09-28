var	tkn = require('../src/tokenize')

module.exports = parse

function parse(stringExpression, argumentsName) {
	var prefix = argumentsName || '$argument',
			parts = tkn(stringExpression, prefix),
			name = parts.name,
			tokens = parts.tokens,
			args = []

	tokens.reduce(function(res, tok) {
		for (var i=0; i<prefix.length; ++i) if (tok[i] !== prefix[i]) return res
		var arg = tok.slice(prefix.length+1)
		if (args.indexOf(arg) === -1) res.push(arg)
		return res
	}, args)

	return {
		name: name,
		args: args,
		expr: Function(prefix, 'return ' + tokens.join(' '))
	}
}
/*
function splitTree(tokens, fcn) { //destroys the source array
	var	tgt = [fcn || '(', []]
	while(tokens.length) {
		var tok = tokens.shift()
		if (tok === ')') return tgt
		if (tok === '(') tgt[1].push(splitTree(tokens)) // group start
		else if (tok[tok.length-1] === '(') { //function argument start
			tgt[1].push(splitTree(tokens, tok))
		}
		else tgt[1].push(tok)
	}
	return tgt
}

function joinTree(tree) {
	var str = tree[0]
	while(tree[1].length) {
		var itm = tree[1].shift()
		if (typeof itm === 'string') str += itm
		else if (Array.isArray(itm)) str += joinTree(itm)
	}
	str += ')'
	return str
}
*/
/*
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
*/

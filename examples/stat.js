var rule = require('./stat-rule'),
		tok = require('../tok')

var tail = tok(/[^]+$/),
		mathKeys = new Set(Object.getOwnPropertyNames(Math))

function htmlRed(tgt, itm) {
	var txt = itm.txt
	if (txt) return tgt + (itm.err ? '<u>'+txt+'</u>' : itm.kin === 'id' ? '<i>'+txt+'</i>' : txt)
	if (this.err) {
		txt = itm.reduce(htmlRed, '')
		return /<u>/.test(txt) ? tgt + txt : tgt + '<u>'+txt+'</u>'
	}
	return itm.reduce(htmlRed, tgt)
}
function codeRed(tgt, itm) {
	if (itm.constructor === Error) return itm
	if (itm.err) {
		console.log('err',itm)
		return new Error('Unexpected token at ' + itm.i)
	}
	if (itm.kin === 'percent') return tgt + '/100'
	var txt = itm.txt
	if (itm.kin === 'id') {
		return mathKeys.has(txt) ? (tgt+'Math.'+txt) : (tgt + 'i.' + txt)
	}
	if (itm.kin === 'random') {
		console.log('random',itm)
		return tgt+'666'
	}
	return tgt + txt
}

module.exports = function(string) {
	var tree = rule.run(string)
	if (tree.j !== string.length) {
		var last = tail.run(string, tree.j)
		last.err = true
		tree.add(last)
	}
	var html = tree.reduce(htmlRed, ''),
			code = tree.reduce(codeRed, ''),
			exec
	try {
		exec = code.constructor === Error ? code : Function('i', 'if (!i) i={};' + code + ';return i')
	} catch (e) {
		exec = e
	}
	return {html, code, exec}
}


/*
 * @param {Array<string>} tokens
 * @return {Array<string>}
module.exports = function(tokens) {
	var xs = [],
			ys = []
	for (var i=1; i<tokens.length; ++i) {
		var tok = tokens[i]
		if (tok === 'x') xs.push(tokens[i-1])
		else if (tok === 'y') ys.push(tokens[i-1])
	}
	return {inputs: xs, yields: ys}
}
*/

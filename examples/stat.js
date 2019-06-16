var rule = require('./stat-rule'),
		tok = require('../tok')

var tail = tok(/[^]+$/),
		HTML = {
			'': function(alt) { return alt[0] === '<' ? alt : this.err ? '<u>'+alt+'</u>' : alt},
			id: function(alt) { return this.err ? '<u>'+alt+'</u>' : '<i>'+alt+'</i>'}
		},
		mathKeys = new Set(Object.getOwnPropertyNames(Math)),
		CODE = {
			percent: function() { return '/100' },
			id: function(txt) { return this.err ? new Error('Unexpected token ' + txt) : mathKeys.has(txt) ? 'Math.' + txt : 'i.' + txt}
		}

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
	if (itm.err) return new Error('Unexpected token at ' + itm.i)
	if (itm.kin === 'percent') return tgt + '/100'
	var txt = itm.txt
	if (itm.kin === 'id') {
		return mathKeys.has(txt) ? (tgt+'Math.'+txt) : (tgt + 'i.' + txt)
	}
	return tgt + txt
}

module.exports = function(string) {
	var tree = rule.run(string)
	if (tree.j !== string.length) {
		var last = tail.run(string, tree.j)
		last.err = true
		console.log('adding tail:', last)
		tree.add(last)
	}
	var html = tree.fuse(HTML),
			code = tree.fuse(CODE),
			htmR = tree.reduce(htmlRed, ''),
			codR = tree.reduce(codeRed, ''),
			exec,
			exeR
	try {
		exec = code.constructor === Error ? code : Function('i', 'if (!i) i={};' + code + ';return i')
	} catch (e) {
		exec = e
	}
	try {
		exeR = codR.constructor === Error ? codR : Function('i', 'if (!i) i={};' + codR + ';return i')
	} catch (e) {
		exeR = e
	}
	return {html, code, htmR, codR, exec, exeR}
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

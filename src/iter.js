var Z = require('random-z'),
		N = require('grosso-modo/norm')

var mathKeys = new Set(Object.getOwnPropertyNames(Math))

function codeRed(tgt, itm) {
	if (itm.constructor === Error) return itm
	if (itm.err) return new Error('Unexpected token at ' + itm.i)
	if (itm.kin === 'percent') {
		tgt.fcn += '/100'
		return tgt
	}

	var txt = itm.txt
	if (txt) switch (itm.kin) { //funcID, yID, xID
		case 'yID':
			tgt.ids[txt] = 1
			tgt.fcn += 'y.' + txt
			return tgt
		case 'xID': case 'funcID':
			if (mathKeys.has(txt)) tgt.fcn += 'Math.' + txt
			else if (tgt.ids[txt]) tgt.fcn += 'y.' + txt
			else return new Error('Undeclared variable at ' + itm.i)
			return tgt
		case 'riskID':
			return new Error('TODO-should never occur : ' + txt)
		default:
			tgt.fcn += txt
			return tgt
	}
	if (itm.kin === 'randEx') { //riskID
		var range = [],
				risks = []
		for (var i=2, set = itm.set; i<set.length; ++i) {
			var arg = set[i]
			if (arg.kin === 'nb') range.push(+arg.txt)
			else if (arg.kin === 'riskID') risks.push(arg.txt)
		}
		//interim ranged function
		tgt.ctx.push(N(range[0], range[1]))
		//add the modified random function
		tgt.fcn += 'this['+tgt.ctx.length+'](y)'

		//
		for (var r=0; r<risks.length; ++r) tgt.rsk.add(risks[r])
		var rand = 'return this['+(tgt.ctx.length-1)+']('+formatRiskArgs(risks)+')'
		tgt.ctx.push(Function('y', rand))
		return tgt
	}
	return itm.fold(codeRed, tgt)
}
function formatRiskArgs(risks) {
	for (var i=0, t='(this[0]()'; i<risks.length; ++i) t += ('+y.' + risks[i])
	return t + ')/'+ (i+1)
}
function formatRiskInit(risk) {
	this.fcn = 'y.' + risk + '=this[0]();' + this.fcn
}

module.exports = function(tree) {
	var code = codeRed({fcn:'', ctx:[Z], rsk: new Set(), ids: {}}, tree)
	if (code.constructor === Error) return code
	code.rsk.forEach(formatRiskInit, code)
	try {
		return Function('y', ';' + code.fcn + ';return y').bind(code.ctx, code.ids)
	} catch (e) {
		return e
	}
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

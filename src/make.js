var Z = require('random-z'),
		N = require('grosso-modo/norm'),
		L = require('grosso-modo/logn'),
		S = require('grosso-modo/step'),
		W = require('grosso-modo/walk'),
		R = require('grosso-modo/rate')

function codeRed(tgt, itm) {
	if (itm.constructor === Error) return itm
	if (itm.err) return new Error('Unexpected token at ' + itm.i)

	var txt = itm.txt

	//TODO move in switch (it is a Tree)
	if (itm.kin === 'percent') {
		tgt.fcn += '/100'
		return tgt
	}

	//is a Word
	if (txt) switch (itm.kin) { //funcID, yID, xID
		case 'yID':
			if (txt in tgt.ctx) return new Error('Can\'t reassign internal variable ' + txt)
			tgt.ext[txt] = 1 //creates the context property
			tgt.fcn += 'y.' + txt
			return tgt
		case 'xID': case 'funcID':
			if (txt in tgt.ctx) tgt.fcn += 'this.' + txt
			else if (tgt.ext[txt]) tgt.fcn += 'y.' + txt
			else return new Error('Undeclared variable at ' + itm.i)
			return tgt
		default:
			tgt.fcn += txt
			return tgt
	}

	//is a Tree
	//TODO move in switch + function
	if (itm.kin === 'randEx') { //riskID
		var range = [],
				risks = []
		for (var i=2, set = itm.set; i<set.length; ++i) {
			var arg = set[i]
			if (arg.kin === 'nb') range.push(+arg.txt)
			else if (arg.kin === 'riskID') risks.push(arg.txt)
		}

		//interim ranged function
		tgt.ctx[++tgt.idx] = N(range[0], range[1])

		//add the function with risk factors
		for (var r=0; r<risks.length; ++r) if (tgt.rsk.indexOf(risks[r]) === -1) tgt.rsk.push(risks[r])
		var rand = 'return this['+tgt.idx+']('+formatRiskArgs(risks)+')'
		tgt.ctx[++tgt.idx] = Function(rand)

		//add the modified random function
		tgt.fcn += 'this['+tgt.idx+']()'
		return tgt
	}
	return itm.fold(codeRed, tgt)
}
function formatRiskArgs(risks) {
	for (var i=0, t='(this.Z()'; i<risks.length; ++i) t += ('+this.' + risks[i])
	return t + ')/'+ (i+1)
}

module.exports = function(tree, ctx) {
	if (!ctx) ctx = createContext()

	var code = codeRed({fcn:'', idx: -1, rsk: [], ctx: ctx, ext:{}}, tree)
	if (code.constructor === Error) return code

	try {
		return Function('y', createFunction(code.fcn, code.rsk) + ';return y').bind(code.ctx, code.ext)
	} catch (e) {
		return e
	}
}

function createContext() {
	var ctx = {Z:Z, N:N, L:L, S:S, W:W, R:R}
	for (var i=0, ks=Object.getOwnPropertyNames(Math); i<ks.length; ++i) ctx[ks[i]] = Math[ks[i]]
	return ctx
}

function createFunction(fcn, rsk) {
	for (var j=0, init=''; j<rsk.length; ++j) init += 'this.' + rsk[j] + '=this.Z();'
	return init+fcn
}

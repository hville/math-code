var iZ = require('norm-dist/icdf'),
		N = require('grosso-modo/norm'),
		L = require('grosso-modo/logn'),
		W = require('grosso-modo/walk'),
		R = require('grosso-modo/rate'),
		D = require('grosso-modo/dice')

function codeRed(tgt, itm) {
	if (tgt.constructor === Error) return tgt
	if (itm.err) return new Error('Unexpected token at ' + itm.i)

	var txt = itm.txt

	switch (itm.kin) { //funcID, yID, xID
		case 'yID':
			if (txt in Math || txt in tgt.ctx) return new Error('Can\'t reassign internal variable ' + txt)
			tgt.ext[txt] = 1 //creates the context property
			tgt.fcn += 'y.' + txt
			return tgt

		case 'xID': case 'funcID':
			if (txt in Math) tgt.fcn += 'Math.' + txt
			else if (txt in tgt.ctx) tgt.fcn += 'this.' + txt
			else if (tgt.ext[txt]) tgt.fcn += 'y.' + txt
			else return new Error('Undeclared variable at ' + itm.i)
			return tgt

		case 'percent':
			tgt.fcn += '/100'
			return tgt

		default:
			return itm.kin === 'randEx' ? formatRandom(tgt, itm)
				: itm.fold ? itm.fold(codeRed, tgt)
				: ((tgt.fcn += txt), tgt)
	}
}

function formatRandom(tgt, itm) {
	var range = [],
			risks = [],
			count = 0,
			minus = false,
			chain = '',
			items = itm.set,
			name = items[0].txt
	//start at 2 to skip the initial name and paren: 'N(...
	for (var i=2; i<items.length; ++i) {
		var arg = items[i]
		if (arg.kin === 'nb') range.push(+arg.txt)
		else if (arg.txt === '-') minus = true
		else if (arg.kin === 'riskID') {
			++count
			chain += (minus ? '-' : '+') + 'this.' + arg.txt
			risks.push(arg.txt)
			minus = false
		}
	}
	var fullName = name + range.join(),
			existing = fullName in tgt.pool, //TODO sometimes tgt.pool is undefined
			getFunct = existing ? tgt.pool[fullName] : ++tgt.idx,
			getValue = ++tgt.idx

	//only add the ranged generator if it is not defined
	if (!existing) try {
		tgt.ctx[getFunct] = tgt.ctx[name](range[0], range[1])
		tgt.pool[fullName] = getFunct
	} catch (e) {
		return e
	}

	//add the function with risk factors
	for (var r=0; r<risks.length; ++r) if (tgt.rsk.indexOf(risks[r]) === -1) tgt.rsk.push(risks[r])
	tgt.ctx[getValue] = Function(
		'return this['+getFunct+']('
		+ (count ? '(this[0](Math.random())' + chain + ')/'+ (count+1) : 'this[0](Math.random())')
		+ ')'
	)

	//add the modified random function
	tgt.fcn += 'this['+getValue+']()'
	return tgt
}

module.exports = function(tree, ctx) {
	if (!ctx) ctx = {N:N, L:L, D:D, W:W, R:R, 0:iZ}

	var code = codeRed({fcn:'', idx: 0, rsk: [], ctx: ctx, ext:{}, pool:{}}, tree)
	if (code.constructor === Error) return code

	try {
		return Function('y', createFunction(code.fcn, code.rsk) + ';return y').bind(code.ctx, code.ext)
	} catch (e) {
		return e
	}
}

function createFunction(fcn, rsk) {
	for (var j=0, init=''; j<rsk.length; ++j) init += 'this.' + rsk[j] + '=this[0](Math.random());'
	return init+fcn
}

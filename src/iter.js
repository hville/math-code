var mathKeys = new Set(Object.getOwnPropertyNames(Math))

function codeRed(tgt, itm) {
	if (itm.constructor === Error) return itm
	if (itm.err) return new Error('Unexpected token at ' + itm.i)
	if (itm.kin === 'percent') {
		tgt.iter += '/100'
		return tgt
	}
	var txt = itm.txt
	if (txt) {
		if (itm.kin === 'id') tgt.iter += mathKeys.has(txt) ? 'Math.'+txt : 'y.'+txt
		else tgt.iter += txt
		return tgt
	}
	if (itm.kin === 'rand') {
		tgt.init += ';'
		tgt.iter += '0'
		return tgt
	}
	return itm.fold(codeRed, tgt)
}

module.exports = function(tree) {
	var code = codeRed({init:'', iter:''}, tree)

	if (code.constructor === Error) return code
	try {
		var init = Function('var f={};' + code.init + ';return {f:f, z:{}, y:{}}')
	} catch (e) {
		return e
	}
	try {
		var iter = Function('var f=this.y, z=this.z, y=this.y;' + code.iter + ';return y')
	} catch (e) {
		return e
	}
	return iter.bind(init())
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

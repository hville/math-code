var Pack = require('./src/_pack'),
		Rule = require('./src/_rule'),
		arrset = require('./src/__arrset')

module.exports = function() {
	var tok = new Rule(arrset, allrun)
	if (this instanceof String) tok.kin = ''+this
	return arrset.apply(tok, arguments)
}

function allrun(string, index, debug) {
	var ops = this.def,
			pack = new Pack(this.kin, index || 0)
	for (var i=0; i<ops.length; ++i) {
		if (pack.add(ops[i].run(string, pack.j, debug)).err && !debug) break
	}
	return pack
}

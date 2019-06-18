var THIS = require('./src/_this'),
		Pack = require('./src/_pack'),
		text = require('./tok')

module.exports = function() {
	var opt = []
	for (var i=0; i<arguments.length; ++i) {
		var arg = arguments[i],
				typ = arg.constructor
		opt[i] = typ === Object ? arg : text(arg)
	}
	if (this === THIS) return {
		kin: '',
		opt: opt,
		run: runall
	}
	this.opt = opt
	this.run = runall
	return this
}

function runall(string, index, debug) {
	var ops = this.opt,
			pack = new Pack(this.kin, index || 0)
	for (var i=0; i<ops.length; ++i) {
		if (pack.add(ops[i].run(string, pack.j, debug)).err && !debug) break
	}
	return pack
}

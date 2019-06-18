var THIS = require('./src/_this'),
		Pack = require('./src/_pack'),
		text = require('./tok')

module.exports = function(rule, min, max) {
	var typ = rule.constructor,
			opt = [typ === Object ? rule : text(rule), min || 0, max || Infinity]
	if (this === THIS) return {
		kin: '',
		opt: opt,
		run: runrep
	}
	this.opt = opt
	this.run = runrep
	return this
}

function runrep(string, index, debug) {
	var rule = this.opt[0],
			min = this.opt[1],
			max = Math.min(this.opt[2], string.length),
			pack = new Pack(this.kin, index || 0)
	for (var i=0; i<max; ++i) {
		var res = rule.run(string, pack.j, debug)
		if (res.err) break
		pack.add(res)
	}
	if (pack.set.length < min) pack.err = true
	if (pack.err) ++pack.j

	return pack
}

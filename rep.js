var THIS = require('./src/_this'),
		Pack = require('./src/_pack'),
		text = require('./tok'),
		any = require('./any')

module.exports = function(rule, min, max) {
	var typ = rule.constructor,
			opt = [typ === Object ? rule : typ === Array ? any.apply(null, rule) : text(rule), min || 0, max || Infinity]
	if (this === THIS) return {
		kin: '',
		opt: opt,
		run: runrep
	}
	this.opt = opt
	this.run = runrep
	return this
}

function runrep(string, index) {
	var rule = this.opt[0],
			min = this.opt[1],
			max = this.opt[2],
			pack = new Pack(this.kin, index || 0)
	for (var i=0; i<max; ++i) {
		var res = rule.run(string, pack.j)
		if (res.err) break
		pack.add(res)
	}
	if (pack.set.length < min) pack.err = true
	if (pack.err) ++pack.j

	return pack
}

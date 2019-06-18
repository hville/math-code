var THIS = require('./src/_this'),
		text = require('./tok')

module.exports = function(rule, cb) {
	var typ = rule.constructor,
			opt = [typ === Object ? rule : text(rule), cb]
	if (this === THIS) return {
		kin: '',
		opt: opt,
		run: runspy
	}
	this.opt = opt
	this.run = runspy
	return this
}

function runspy(string, index, debug) {
	var pos = index || 0,
			itm = this.opt[0].run(string, pos, debug)
	this.opt[1].call(itm, string, pos, debug)
	if (this.kin) itm.kin = this.kin
	return itm
}

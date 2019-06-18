var THIS = require('./src/_this'),
		text = require('./tok')

module.exports = function(rule) {
	var typ = rule.constructor,
			opt = typ === Object ? rule : text(rule)
	if (this === THIS) return {
		kin: '',
		opt: opt,
		run: runnot
	}
	this.opt = opt
	this.run = runnot
	return this
}

function runnot(string, index, debug) {
	var pos = index || 0,
			itm = this.opt.run(string, pos, debug)
	itm.err = !itm.err
	if (itm.err) {
		if (this.kin) itm.kin = this.kin
	} else {
		if (itm.txt) {
			itm.txt = ''
			itm.j = itm.i
		}
	}
	return itm
}

var THIS = require('./src/_this'),
		text = require('./tok'),
		any = require('./any')

module.exports = function() {
	var opt = []
	for (var i=0; i<arguments.length; ++i) {
		var arg = arguments[i],
				typ = arg.constructor
		opt[i] = typ === Object ? arg : typ === Array ? any.apply(null, arg) : text(arg)
	}
	if (this === THIS) return {
		kin: '',
		opt: opt,
		run: runnot
	}
	this.opt = opt
	this.run = runnot
	return this
}

function runnot(string, index) {
	var ops = this.opt,
			pos = index || 0,
			itm
	for (var i=0; i<ops.length; ++i) if (!(itm = ops[i].run(string, pos)).err) break
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

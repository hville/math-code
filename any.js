var THIS = require('./src/_this'),
		text = require('./tok')

module.exports = anyrule

function anyrule() {
	var opt = []
	for (var i=0; i<arguments.length; ++i) {
		var arg = arguments[i],
				typ = arg.constructor
		opt[i] = typ === Object ? arg : typ === Array ? anyrule.apply(null, arg) : text(arg)
	}
	if (this === THIS) return {
		kin: '',
		opt: opt,
		run: runany
	}
	this.opt = opt
	this.run = runany
	return this
}

function runany(string, index) {
	var ops = this.opt,
			pos = index || 0,
			itm
	for (var i=0; i<ops.length; ++i) if (!(itm = ops[i].run(string, pos)).err) break
	if (this.kin) itm.kin = this.kin
	return itm
}

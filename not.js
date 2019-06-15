var THIS = require('./src/_this'),
		text = require('./tok'),
		any = require('./any')

module.exports = function(rule) {
	var typ = rule.constructor,
			opt = typ === Object ? rule : typ === Array ? any.apply(null, rule) : text(rule)

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
	var item = this.opt.run(string, index)
	item.err = !item.err
	if (item.err) {
		if (this.kin) item.kin = this.kin
	} else {
		if (item.txt) {
			item.txt = ''
			item.j = item.i
		}
	}
	return item
}

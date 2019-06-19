var text = require('./tok'),
		Rule = require('./src/_rule')

module.exports = function(rule) {
	var tok = new Rule(notset, notrun)
	if (this instanceof String) tok.kin = ''+this
	return tok.set(rule)
}

function notset(rule) {
	this.def = rule.isRule ? rule : text(rule)
	return this
}

function notrun(string, index) {
	var pos = index || 0,
			itm = this.def.run(string, pos)
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

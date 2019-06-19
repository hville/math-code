var text = require('./tok'),
		Rule = require('./src/_rule')

module.exports = function(rule, cb) {
	var tok = new Rule(spyset, spyrun)
	if (this instanceof String) tok.kin = ''+this
	return tok.set(rule, cb)
}

function spyset(rule, cb) {
	this.def = [rule.isRule ? rule : text(rule), cb]
	return this
}

function spyrun(string, index) {
	var pos = index || 0,
			itm = this.def[0].run(string, pos)
	this.def[1](itm)
	if (this.kin) itm.kin = this.kin
	return itm
}

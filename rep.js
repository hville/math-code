var Pack = require('./src/_pack'),
		text = require('./tok'),
		Rule = require('./src/_rule')

module.exports = function(rule, min, max) {
	var tok = new Rule(repset, reprun)
	if (this instanceof String) tok.kin = ''+this
	return tok.set(rule, min, max)
}

function repset(rule, min, max) {
	this.def = [rule.isRule ? rule : text(rule), min || 0, max || Infinity]
	return this
}

function reprun(string, index) {
	var rule = this.def[0],
			min = this.def[1],
			max = Math.min(this.def[2], string.length),
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

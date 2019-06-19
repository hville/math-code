var Word = require('./src/_word'),
		Rule = require('./src/_rule')

module.exports = function(pattern) {
	var tok = new Rule(tokset)
	if (this instanceof String) tok.kin = ''+this
	return tok.set(pattern)
}
function tokset(pattern) {
	var src = pattern.source
	this.def = !src ? pattern : new RegExp(src, pattern.sticky == null ? 'g' : 'y')
	this.run = !src ? textAt : this.def.sticky ? stickyAt : globalAt
	return this
}
function textAt(string, index) {
	var ref = this.def,
			i = 0,
			pos = index || 0,
			j = pos
	while (i<ref.length) if (ref[i++] !== string[j++]) return new Word(this.kin, pos, string.slice(pos, j), true)
	return new Word(this.kin, pos, string.slice(pos, j), false)
}
function stickyAt(string, index) {
	var ref = this.def,
			pos = ref.lastIndex = index || 0,
			res = ref.exec(string)
	return res ? new Word(this.kin, pos, res[0], false) : new Word(this.kin, pos, pos >= string.length - 1 ? '' : string[pos], true)
}
function globalAt(string, index) {
	var ref = this.def,
			pos = ref.lastIndex = index || 0,
			res = ref.exec(string)
	return (res && res.index === pos) ? new Word(this.kin, pos, res[0], false) : new Word(this.kin, pos, pos >= string.length - 1 ? '' : string[pos], true)
}

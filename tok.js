var Word = require('./src/_word'),
		THIS = require('./src/_this')//,
		//Rule = require('./src/_rule')

module.exports = function(pattern) {
	var src = pattern.source,
			opt = !src ? pattern : new RegExp(src, pattern.sticky == null ? 'g' : 'y'),
			run = !src ? textAt : opt.sticky ? stickyAt : globalAt
	if (this === THIS) return {
		kin: '',
		opt: opt,
		run: run
	}
	this.opt = opt
	this.run = run
	return this
}
function textAt(string, index) {
	var ref = this.opt,
			i = 0,
			pos = index || 0,
			j = pos
	while (i<ref.length) if (ref[i++] !== string[j++]) return new Word(this.kin, pos, string.slice(pos, j), true)
	return new Word(this.kin, pos, string.slice(pos, j), false)
}
function stickyAt(string, index) {
	var ref = this.opt,
			pos = ref.lastIndex = index || 0,
			res = ref.exec(string)
	return res ? new Word(this.kin, pos, res[0], false) : new Word(this.kin, pos, pos >= string.length - 1 ? '' : string[pos], true)
}
function globalAt(string, index) {
	var ref = this.opt,
			pos = ref.lastIndex = index || 0,
			res = ref.exec(string)
	return (res && res.index === pos) ? new Word(this.kin, pos, res[0], false) : new Word(this.kin, pos, pos >= string.length - 1 ? '' : string[pos], true)
}

var Pack = require('./_pack'),
		Word = require('./_word')

module.exports = Rule

function Rule(set, run) {
	this.def = []
	this.set = set
	this.run = run
}
Rule.prototype.kin = ''
Rule.prototype.isRule = true
Rule.prototype.exec = function(string) {
	var res = this.run(string, 0)
	if (res.j !== string.length) {
		if (!res.add) res = (new Pack('', res.i).add(res))
		res.add(new Word('', res.j, string.slice(res.j), true))
	}
	return res
}

/*
RESULTS: WORD | PACK item, part, lump, unit, link, band, body, pool, yarn
children   set       list, pack, verse, phrase, content children
substring  txt, cnt, text, word
type       kin,      type, kind

RULES
arguments  arg, def, args
execute    run, lex, exec, tear, hack, split, parse
combine              fuse  join

FORCE
row lazy some chain until loose
all full force greedy
row seq join fuse weld mend cast


def define
alt alternate
cfg configure
run
exec
args



*/
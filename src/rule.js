var any = require('pico-parse/any'),
		all = require('pico-parse/all'),
		rep = require('pico-parse/rep'),
		tok = require('pico-parse/tok')

var number = tok.call('nb', /(?:\d*\.\d+|\d+)(?:[E|e][+|-]?\d+)?/),
		_ = tok.call('_', /[ \t]*/),
		$ = tok.call('$', /[ \t]*[;\n\r]+[ \t]*/),
		id = tok.call('id', /(?!(?:prototype|toString|constructor|valueOf|toLocaleString)(?![$\w]))[_$A-Za-z][$\w]*/),
		op = /\*{1,2}|[+\-*/]/,
		df = any('N', 'L', 'S', 'R', 'T'),
		percent = all.call( 'percent', '%'),
		value = all(),
		val0N_ = rep( all(value, _, rep(all(',', _, value, _))), 0,1),
		rsk0N_ = rep( all(id, _, rep(all(',', _, id, _))), 0,1),
		biOp = all(op, _, value),
		tern = all('?', _, value, _, ':', _, value),
		expr = any(percent, biOp, tern),
		func = all(id, _, '(', _, val0N_, ')'),
		rand = all.call('rand', df, _, '(', _, number, _, number, _, rsk0N_, ')'),
		eq_ = all(id, _, '=', _, value, _),
		eq_01 = rep(eq_, 0,1),
		_eq0N = rep(all($, eq_01))

value.set(
	any(number, rand, func, id, all('(', _, value, _, ')')),
	rep(all(_, expr))
)

module.exports = all(_, eq_01, _eq0N )

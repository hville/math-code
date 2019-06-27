var any = require('pico-parse/any'),
		all = require('pico-parse/all'),
		rep = require('pico-parse/rep'),
		opt = require('pico-parse/opt'),
		tok = require('pico-parse/tok')

var number = tok.call('nb', /[+-]?(?:\d*\.\d+|\d+)(?:[E|e][+-]?\d+)?/),
		//sign = /(?:\+(?!\+)|-(?!-))?/, //TODO
		_ = tok.call('_', /[ \t]*/),
		$ = tok.call('$', /[ \t]*[;\n\r]+[ \t]*/),
		idR = /(?!(?:prototype|toString|constructor|valueOf|toLocaleString)(?![$\w]))[_$A-Za-z][$\w]*/,
		op = /\*{1,2}|\+(?!\+)|-(?!-)|\//,
		df = any('N', 'L', 'S', 'R', 'T'),
		percent = all.call( 'percent', '%'),
		value = all(),
		val0N_ = opt( all(value, _, rep(all(',', _, value, _))) ),
		rsk0N_ = opt( all(',', _, tok.call('riskID', idR), _, rep(all(',', _, tok.call('riskID', idR), _))) ),
		biOp = all(op, _, value),
		tern = all('?', _, value, _, ':', _, value),
		expr = any(percent, biOp, tern),
		func = all(tok.call('funcID', idR), _, '(', _, val0N_, ')'),
		rand = all.call('randEx', df, _, '(', _, number, _, ',', _, number, _, rsk0N_, ')'),
		eq_ = all(tok.call('yID', idR), _, '=', _, value, _),
		eq_01 = opt(eq_),
		_eq0N = rep(all($, eq_01))
//TODO signs
value.set(
	any( number, rand, func, tok.call('xID', idR), all('(', _, value, _, ')')),
	rep(all(_, expr))
)
module.exports = all(_, eq_01, _eq0N )

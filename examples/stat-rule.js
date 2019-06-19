var any = require('../any'),
		all = require('../all'),
		rep = require('../rep'),
		tok = require('../tok'),
		spy = require('../tok')

var number = /(?:\d*\.\d+|\d+)(?:[E|e][+|-]?\d+)?/,
		string = /(?!(?:prototype|toString|constructor|valueOf|toLocaleString)(?![$\w]))[_$A-Za-z][$\w]*/,
		_ = /[ \t]*/,
		id = tok.call('id', string),
		risk = tok.call('risk', string),
		risks0N = spy(rep(
			all(
				risk,
				rep(
					all(_, ',', _, risk)
				)
			),
			0,1
		), function(res) { console.log('risks0N', res)}),
		op = /\*{1,2}|[+\-*/,]/,
		percent = all.call( 'percent', '%'),
		value = all(),
		values0N = rep( all(value, rep(all(_, ',', _, value))), 0,1),
		op_value = all(op, _, value),
		expression = any(percent, op_value, all('?', _, value, _, ':', _, value)),
		func = all(id, _, '(', _, values0N, _,')'),
		random = all.call('random', '(',_,value,_,',',_,value,_, spy(rep( spy(all(';', _, risks0N, _), res=>console.log('SPY-ALL;', res)), 0,1), res=>console.log('SPY-REP;', res)), ')'),
		assign = all(_, id, _, '=', _, value, _)

value.set(
	any(number, func, id, all('(', _, value, _, ')'), random),
	rep(all(_, expression))
)

module.exports = assign

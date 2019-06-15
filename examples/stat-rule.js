var any = require('../any'),
		all = require('../all'),
		rep = require('../rep'),
		tok = require('../tok')


var number = /(?:\d*\.\d+|\d+)(?:[E|e][+|-]?\d+)?/,
		id = tok.call({kin:'id'}, /(?!(?:prototype|toString|constructor|valueOf|toLocaleString)(?![$\w]))[_$A-Za-z][$\w]*/),
		op = /\*{1,2}|[+\-*/,]/,
		percent = all.call({kin: 'percent'}, '%'),
		_ = rep(' '), /// */,
		value = {},
		op_value = all(op, _, value),
		expression = all([percent, op_value, all('?', _, value, _, ':', _, value)], _),
		func = all(id, _, '(', any(all(_, value, _, rep(all(',', _, value, _))), _) ,')'),
		assign = all(_, id, _, '=', _, value, _)
all.call(value, [number, func, id, all('(', _, value, _, ')')], rep(all(_, expression)))

module.exports = assign

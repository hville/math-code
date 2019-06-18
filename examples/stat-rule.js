var any = require('../any'),
		all = require('../all'),
		rep = require('../rep'),
		tok = require('../tok')

var number = /(?:\d*\.\d+|\d+)(?:[E|e][+|-]?\d+)?/,
		string = /(?!(?:prototype|toString|constructor|valueOf|toLocaleString)(?![$\w]))[_$A-Za-z][$\w]*/,
		id = tok.call({kin:'id'}, string),
		risk = tok.call({kin:'risk'}, string),
		op = /\*{1,2}|[+\-*/,]/,
		percent = all.call({kin: 'percent'}, '%'),
		_ = rep(' '), /// */,
		value = {},
		op_value = all(op, _, value),
		expression = all(any(percent, op_value, all('?', _, value, _, ':', _, value)), _),
		func = all(id, _, '(', any(all(_, value, _, rep(all(',', _, value, _))), _) ,')'),
		random = all.call({kin: 'random'}, '(',_,value,_,',',_,value,_,rep(all(';', _, rep(risk, rep(_, ',', _, risk)), _),0,1),')'),
		assign = all(_, id, _, '=', _, value, _)
all.call(value, any(number, func, id, all('(', _, value, _, ')'), random), rep(all(_, expression)))

module.exports = assign

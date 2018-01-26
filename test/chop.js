var chop = require('../chop'),
		ct = require('cotest'),
		T = require('../types')

function tType(txt) {
	return chop(txt).map(t => t[1])
}

ct('finds inputs and yields', () => {
	const tkns = tType('a=b+c\nd=e+f')
	ct('===', tkns.length, 12)
	ct('===', tkns[0], T.yield)
	ct('===', tkns[1], T.assign)
	ct('===', tkns[2], T.input)
	ct('===', tkns[3], T.operator)
	ct('===', tkns[4], T.input)
	ct('===', tkns[5], T.nline)
	ct('===', tkns[6], T.yield)
	ct('===', tkns[7], T.assign)
	ct('===', tkns[8], T.input)
	ct('===', tkns[9], T.operator)
	ct('===', tkns[10], T.input)
})

ct('reject multiple =', () => {
	const tkns = tType('ab=cd=')
	ct('===', tkns.length, 5)
	ct('===', tkns[0], T.yield)
	ct('===', tkns[1], T.assign)
	ct('===', tkns[2], T.input)
	ct('===', tkns[3], T.error)
})

ct('reject incomplete line', () => {
	const tkns = tType(`b=c
		a=`)
	ct('===', tkns.length, 8)
	ct('===', tkns[4], T.space)
	ct('===', tkns[5], T.yield)
	ct('===', tkns[6], T.assign)
	ct('===', tkns[7], T.error)
})

ct('reject multiple ids before "="', () => {
	const tkns = tType('23+ab-cd=')
	ct('===', tkns.length, 7)
	ct('===', tkns[0], T.error)
	ct('===', tkns[1], T.error)
	ct('===', tkns[2], T.input)
	ct('===', tkns[3], T.operator)
	ct('===', tkns[4], T.input)
	ct('===', tkns[5], T.error)
})

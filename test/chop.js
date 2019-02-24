var chop = require('../chop'),
		ct = require('cotest'),
		T = require('../types')

function tType(txt) {
	return chop(txt).filter( (v,i) => !!(i&1) )
}

ct('finds inputs and yields', t => {
	const tkns = tType('a=b+c\nd=e+f')
	t('===', tkns.length, 11)
	t('===', tkns[0], T.yield)//! input!=yield
	t('===', tkns[1], T.assign)
	t('===', tkns[2], T.input)
	t('===', tkns[3], T.operator)
	t('===', tkns[4], T.input)
	t('===', tkns[5], T.nline)
	t('===', tkns[6], T.yield)//! input!=yield
	t('===', tkns[7], T.assign)
	t('===', tkns[8], T.input)
	t('===', tkns[9], T.operator)
	t('===', tkns[10], T.input)
})

ct('reject multiple =', t => {
	const tkns = tType('ab=cd=')
	t('===', tkns.length, 4)
	t('===', tkns[0], T.yield)
	t('===', tkns[1], T.assign)
	t('===', tkns[2], T.input)
	t('===', tkns[3], T.error)
})

ct('reject incomplete line', t => {
	const tkns = tType(`b=c
		a=`)
	t('===', tkns.length, 7)
	t('===', tkns[4], T.space)
	t('===', tkns[5], T.yield)
	t('===', tkns[6], T.assign)
})

ct('reject multiple ids before "="', t => {
	const tkns = tType('23+ab-cd=')
	t('===', tkns.length, 6)
	t('===', tkns[0], T.error)
	t('===', tkns[1], T.error)
	t('===', tkns[2], T.input)
	t('===', tkns[3], T.operator)
	t('===', tkns[4], T.input)
	t('===', tkns[5], T.error)
})

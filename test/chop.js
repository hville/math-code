var chop = require('../chop'),
		ct = require('cotest')

function tType(txt, ctx) {
	return chop(txt, ctx).filter( (v,i) => !!(i&1) )
}

ct('finds inputs and yields #1', t => {
	const tkns = tType('a=b+c\nd=e+f')
	t('===', tkns.length, 11)
	t('===', tkns[0], 'y')//! input!=yield
	t('===', tkns[1], '=')
	t('===', tkns[2], 'x')
	t('===', tkns[3], '*')
	t('===', tkns[4], 'x')
	t('===', tkns[5], 'r')
	t('===', tkns[6], 'y')//! input!=yield
	t('===', tkns[7], '=')
	t('===', tkns[8], 'x')
	t('===', tkns[9], '*')
	t('===', tkns[10], 'x')
})

ct('finds inputs and yields #1', t => {
	const tkns = tType('x1= f1(7) \nx2 =f2(f1(7))')
	t('===', tkns.length, 18)
	t('===', tkns[0], 'y')
	t('===', tkns[1], '=')
	t('===', tkns[3], 'x')
	t('===', tkns[4], '*')
	t('===', tkns[5], 'n')
	t('===', tkns[6], '*')
	t('===', tkns[7], 'r')//
	t('===', tkns[8], 'y')//! input!=yield
	t('===', tkns[10], '=')//
	t('===', tkns[11], 'x')//
	t('===', tkns[13], 'x')
})

ct('reject multiple =', t => {
	const tkns = tType('ab=cd=')
	t('===', tkns.length, 4)
	t('===', tkns[0], 'y')
	t('===', tkns[1], '=')
	t('===', tkns[2], 'x')
	t('===', tkns[3], 'e')
})

ct('reject incomplete line', t => {
	const tkns = tType(`b=c
		a=`)
	t('===', tkns.length, 7)
	t('===', tkns[4], ' ')
	t('===', tkns[5], 'y')
	t('===', tkns[6], 'e')
})

ct('reject parens mismatch', t => {
	t('===', tType('a=(')[2], 'e')
	t('===', tType('a=)')[2], 'e')
	t('===', tType('a=())')[4], 'e')
	t('{===}', tType('a=((3*2)')[2], 'e')
	t('===', tType('a=)()')[2], 'e')
	t('===', tType('a=(*)')[3], 'e')
})

ct('scoped', t => {
	t('===', tType('a=PI', {Math})[2], 'Math.')
	t('===', tType('a=cos(1)', {Math})[2], 'Math.')
})

ct('reject multiple ids before "="', t => {
	const tkns = tType('23+ab-cd=')
	t('===', tkns.length, 6)
	t('===', tkns[0], 'e')
	t('===', tkns[1], 'e')
	t('===', tkns[2], 'y')
	t('===', tkns[3], 'e')
	t('===', tkns[4], 'e')
	t('===', tkns[5], 'e')
})


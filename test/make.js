var chop = require('../chop'),
		code = require('../code'),
		make = require('../make'),
		ct = require('cotest')

function build(brief) {
	return make(code(chop(brief, {Math, Number})))
}

var input = {patate: 3}

ct('chop |> code |> make', t => {
	t('===', build('res=PI*EPSILON*patate')(input).res, Math.PI*Number.EPSILON*3)
	t('===', build('res=sin(PI)')(input).res, Math.sin(Math.PI))
	input.x3 = x=>x*3
	t('===', build('cst=PI*EPSILON; res=x3(cst)')(input).res, Math.PI*Number.EPSILON*3)
	t('===', build('cst=PI*EPSILON; res=x3(cst)')(input).res, Math.PI*Number.EPSILON*3)
})

ct('make errors', t => {
	t('===', build(';;;x=3===').message, 'Unexpected token ;')
	//t('===', build('x=').message, 'Unexpected token ;')
	t('===', build('=x').message, 'Unexpected token =')
	t('===', build('x=sin(').message, 'Unexpected token ;')
	t('===', build(';;;=PI').message, 'Unexpected token =')
	t('===', build(';;;x=prototype').message, 'Unexpected token prototype')
	t('===', build('sin()').message, 'Unexpected token sin')
})

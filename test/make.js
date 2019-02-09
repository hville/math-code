var chop = require('../chop'),
		code = require('../code'),
		make = require('../make'),
		ct = require('cotest')

function build(brief) {
	return make(code(chop(brief, {Math, Number})))
}

var input = {patate: 3}

ct('chop |> code |> make', function() {
	ct('===', build('res=PI*EPSILON*patate')(input).res, Math.PI*Number.EPSILON*3)
	ct('===', build('res=sin(PI)')(input).res, Math.sin(Math.PI))
	input.x3 = x=>x*3
	ct('===', build('cst=PI*EPSILON; res=x3(cst)')(input).res, Math.PI*Number.EPSILON*3)
	ct('===', build('cst=PI*EPSILON; res=x3(cst)')(input).res, Math.PI*Number.EPSILON*3)
})

ct('make errors', function() {
	ct('===', build(';;;x=3===').message, 'Unexpected token ;')
	ct('===', build('x=').message, 'Unexpected token ')
	ct('===', build('=x').message, 'Unexpected token =')
	ct('===', build('x=sin(').message, 'Unexpected token ;')
	ct('===', build(';;;=PI').message, 'Unexpected token =')
	ct('===', build(';;;x=prototype').message, 'Unexpected token prototype')
	ct('===', build('sin()').message, 'Unexpected token sin')
})

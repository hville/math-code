import build from '../src/build.mjs'
import ct from 'cotest'


ct('Inputs and yields', function() {
	ct('{===}', build('c=a+b').inputs, ['a', 'b'])
	ct('{===}', build('c=a+b').yields, ['c'])

	ct('{===}', build('c=a+b; d=a+b+c').inputs, ['a', 'b'])
	ct('{===}', build('c=a+b; d=a+b+c').yields, ['c', 'd'])
})

ct('modus', function() {
	//ct('===', build('res=PI*EPSILON'), 0)
	//ct('===', build('res=PI*EPSILON').modus().res, Math.PI*Number.EPSILON)
	//ct('===', build('cst=PI*EPSILON; res=arg*cst').modus({arg:1}).res, Math.PI*Number.EPSILON)
})

ct('scope', function() {
	ct('===', build('res=PI*EPSILON*patate', {patate: 3}).modus().res, Math.PI*Number.EPSILON*3)
	ct('===', build('cst=PI*EPSILON; res=x3(arg*cst)', {x3: x=>x*3}).modus({arg:1}).res, Math.PI*Number.EPSILON*3)
})

import split from '../src/split.mjs'
import ct from 'cotest'

function tType(txt) {
	return split(txt).map(t => t.t)
}
function tText(txt) {
	return split(txt).map(t => t.s)
}

ct('dot', () => {
	const tkns = tType('aa.bb')
	ct('===', tkns.length, 3)
	ct('===', tkns[0], 'arg.')
	ct('===', tkns[1], 'er')
	ct('===', tkns[2], 'arg.')
})

ct('Numbers', function() {
	ct('===', split('123a')[0].s, '123')
	ct('===', split('12.3a')[0].s, '12.3')
	ct('===', split('0.123a')[0].s, '0.123')
	ct('===', split('0.1e-23a')[0].s, '0.1e-23')
	ct('===', split('.123a')[0].s, '.123')
	ct('===', split('.1e-23a')[0].s, '.1e-23')

	ct('===', split('-123a')[1].s, '123')
	ct('===', split(' 12.3a')[1].s, '12.3')
	ct('===', split('+0.123a')[1].s, '0.123')
	ct('===', split('/0.1e-23a')[1].s, '0.1e-23')
	ct('===', split('*.123a')[1].s, '.123')
	ct('===', split('%.1e-23a')[1].s, '.1e-23')
})

ct('White Spaces', function() {
	ct('===', split(' .1e-23a')[0].s, ' ')
	ct('===', split('\u00A0')[0].s, '\u00A0')
	ct('===', split('	.1e-23a')[0].s, '	')
	ct('===', split('\n.1e-23a')[0].s, '\n')
	ct('===', split(' \n \f\t \v.1e-23a')[0].s, ' \n \f\t \v')
})

ct('Math', function() {
	ct('===', split('sin(0')[0].s, 'sin')
	ct('===', split('sin(0')[0].t, 'Math.')

	ct('===', split('PI+')[0].s, 'PI')
	ct('===', split('PI+')[0].t, 'Math.')
	ct('===', split('PI0')[0].s, 'PI0')

	ct('===', split('1+E+1')[2].s, 'E')
	ct('===', split('1+E+1')[2].t, 'Math.')

	ct('===', split('1+EPSILON+1')[2].s, 'EPSILON')
	ct('===', split('1+EPSILON+1')[2].t, 'Number.')
})

ct('Number', function() {
	ct('===', split('EPSILON+')[0].s, 'EPSILON')
	ct('===', split('EPSILON+')[0].t, 'Number.')
})

ct('operators', function() {
	ct('===', split('(a0123.3')[0].s, '(')
	ct('===', split('*_$Ab0.3')[0].s, '*')
	ct('===', split(',,$0.3')[0].s, ',')

	ct('===', split('a(a0123.3')[1].s, '(')
	ct('===', split('a*_$Ab0.3')[1].s, '*')
	ct('===', split('a,,$0.3')[1].s, ',')
})

ct('bitwise', function() {
	ct('===', split('>>>a0123.3')[0].s, '>>>')
	ct('===', split('>>_$Ab0.3')[0].s, '>>')
	ct('===', split('|$0.3')[0].s, '|')

	ct('===', split(' >>>a0123.3')[1].s, '>>>')
	ct('===', split('a>>_$Ab0.3')[1].s, '>>')
})

ct('logical', function() {
	ct('===', split('>a0123.3')[0].s, '>')
	ct('===', split('>=_$Ab0.3')[0].s, '>=')
	ct('===', split('===$0.3')[0].s, '===')
	ct('===', split('0||$0.3')[1].s, '||')

	ct('===', split('0>a0123.3')[1].s, '>')
	ct('===', split('.1>=_$Ab0.3')[1].s, '>=')
	ct('===', split('a===$0.3')[1].s, '===')
})

ct('literal', function() {
	ct('===', split('null>a0123.3')[0].s, 'null')
	ct('===', split('false>=_$Ab0.3')[0].s, 'false')
	ct('===', split('nully===$0.3')[0].s, 'nully')
	ct('===', split('nully===$0.3')[0].t, 'arg.')

	ct('===', split(' null>a0123.3')[1].s, 'null')
	ct('===', split('+false>=_$Ab0.3')[1].s, 'false')
	ct('===', split('-nully===$0.3')[1].s, 'nully')
	ct('===', split('/nully===$0.3')[1].t, 'arg.')
})

ct('identifiers', function() {
	ct('===', split(' a0123.3')[1].s, 'a0123')
	ct('===', split(' a0123.3')[1].t, 'arg.')
})

ct('assignment', function() {
	ct('===', split('myFunc = 4')[0].t, 'arg.')
	ct('===', split(' myFunc = 4')[1].t, 'arg.')

	ct('===', split('myFunc =4=')[0].t, 'arg.')
	ct('===', split('myFunc =4=')[1].t, 'ws')
	ct('===', split('myFunc =4=')[2].t, 'eq')
	ct('===', split('myFunc =4=')[3].t, 'nb')
	ct('===', split('myFunc =4=')[4].t, 'eq')

	ct('===', split('+myFunc=4=')[0].t, 'op')
	ct('===', split('+myFunc=4=')[1].t, 'arg.')
	ct('===', split('+myFunc=4=')[2].t, 'eq')
	ct('===', split('+myFunc=4=')[3].t, 'nb')
	ct('===', split('+myFunc=4=')[4].t, 'eq')
})

ct('javascript control characters', function() {
	ct('===', split('\u200C')[0].s, '\u200C')
	ct('===', split('\u200D')[0].s, '\u200D')
	ct('===', split('\uFEFF')[0].s, '\uFEFF')
})

ct('new line', function() {
	ct('===', split(';b')[0].t, 'nl')
	ct('===', split(`
		b = `)[0].t, 'nl'
	)
	ct('===', split(`b=a
		c=b`)[3].t, 'nl'
	)
	ct('===', split(`b=a
		+b`)[3].t, 'ws'
	)
	ct('===', split(`b=a
		33`)[3].t, 'ws'
	)
	ct('===', split(`b=a
	c+d`)[3].t, 'ws'
	)
})

ct('preserve string', function() {
	var acid = [
		'a+ 3- sin(3s)=.1e3+45',
		'1=34+op-null*false(return)9*87#$%nslkjv',
		'true+false-falsy=return+prototype.windows',
		' . ',
		' a = b ',
		'test=-sin(2+3x)*(2-patate[0]) ?PI : null '
	]
	acid.forEach(function(str) {
		ct('===', tText(str).join(''), str)
	})
})

ct('errors', function() {
	ct('===', split('a.b')[1].t, 'er')
	ct('===', split('cos.constructor')[2].t, 'er')
	ct('===', split('cos["constructor"]')[1].t, 'er')
	ct('===', split('cos["constructor"]')[2].t, 'er')
	ct('===', split('cos["constructor"]')[3].t, 'er')
	ct('===', split('__proto__')[0].t, 'er')
	ct('===', split('prototype')[0].t, 'er')
	ct('===', split('constructor')[0].t, 'er')
})

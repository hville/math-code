var split = require('../src/split'),
		ct = require('cotest'),
		T = require('../types')


function tType(txt) {
	return split(txt).map(t => t[1])
}
function tText(txt) {
	return split(txt).map(t => t[0])
}

ct('dot', () => {
	const tkns = tType('aa.bb')
	ct('===', tkns.length, 4)
	ct('===', tkns[0], T.input)
	ct('===', tkns[1], T.error)
	ct('===', tkns[2], T.input)
})

ct('Numbers', function() {
	ct('===', split('123a')[0][0], '123')
	ct('===', split('12.3a')[0][0], '12.3')
	ct('===', split('0.123a')[0][0], '0.123')
	ct('===', split('0.1e-23a')[0][0], '0.1e-23')
	ct('===', split('.123a')[0][0], '.123')
	ct('===', split('.1e-23a')[0][0], '.1e-23')

	ct('===', split('-123a')[1][0], '123')
	ct('===', split(' 12.3a')[1][0], '12.3')
	ct('===', split('+0.123a')[1][0], '0.123')
	ct('===', split('/0.1e-23a')[1][0], '0.1e-23')
	ct('===', split('*.123a')[1][0], '.123')
	ct('===', split('%.1e-23a')[1][0], '.1e-23')
})

ct('White Spaces', function() {
	ct('{==}', split(' \n.1e-23a')[0], [' \n', T.nline])
	ct('{==}', split(' \t .1e-23a')[0], [' \t ', T.space])

	ct('{==}', split('.1e-23 \n')[1], [' \n', T.nline])
	ct('{==}', split('.1e-23 \t ')[1], [' \t ', T.space])

	ct('===', split(`
		b = `)[0][1], T.nline
	)
	ct('===', split(`b=a
		c=b`)[3][1], T.nline
	)
})

ct('operators', function() {
	ct('===', split('(a0123.3')[0][0], '(')
	ct('===', split('*_$Ab0.3')[0][0], '*')
	ct('===', split(',,$0.3')[0][0], ',')

	ct('===', split('a(a0123.3')[1][0], '(')
	ct('===', split('a*_$Ab0.3')[1][0], '*')
	ct('===', split('a,,$0.3')[1][0], ',')
})

ct('bitwise', function() {
	ct('===', split('>>>a0123.3')[0][0], '>>>')
	ct('===', split('>>_$Ab0.3')[0][0], '>>')
	ct('===', split('|$0.3')[0][0], '|')

	ct('===', split(' >>>a0123.3')[1][0], '>>>')
	ct('===', split('a>>_$Ab0.3')[1][0], '>>')
})

ct('logical', function() {
	ct('===', split('>a0123.3')[0][0], '>')
	ct('===', split('>=_$Ab0.3')[0][0], '>=')
	ct('===', split('===$0.3')[0][0], '===')
	ct('===', split('0||$0.3')[1][0], '||')

	ct('===', split('0>a0123.3')[1][0], '>')
	ct('===', split('.1>=_$Ab0.3')[1][0], '>=')
	ct('===', split('a===$0.3')[1][0], '===')
})

ct('literal', function() {
	ct('===', split('null>a0123.3')[0][0], 'null')
	ct('===', split('false>=_$Ab0.3')[0][0], 'false')
	ct('===', split('nully===$0.3')[0][0], 'nully')
	ct('===', split('nully===$0.3')[0][1], T.input)

	ct('===', split(' null>a0123.3')[1][0], 'null')
	ct('===', split('+false>=_$Ab0.3')[1][0], 'false')
	ct('===', split('-nully===$0.3')[1][0], 'nully')
	ct('===', split('/nully===$0.3')[1][1], T.input)
})

ct('identifiers', function() {
	ct('===', split(' a0123.3')[1][0], 'a0123')
	ct('===', split(' a0123.3')[1][1], T.input)
})

ct('assignment', function() {
	ct('===', split('myFunc = 4')[0][1], T.input)
	ct('===', split(' myFunc = 4')[1][1], T.input)

	ct('===', split('myFunc =4=')[0][1], T.input)
	ct('===', split('myFunc =4=')[1][1], T.space)
	ct('===', split('myFunc =4=')[2][1], T.assign)
	ct('===', split('myFunc =4=')[3][1], T.number)
	ct('===', split('myFunc =4=')[4][1], T.assign)

	ct('===', split('+myFunc=4=')[0][1], T.operator)
	ct('===', split('+myFunc=4=')[1][1], T.input)
	ct('===', split('+myFunc=4=')[2][1], T.assign)
	ct('===', split('+myFunc=4=')[3][1], T.number)
	ct('===', split('+myFunc=4=')[4][1], T.assign)
})

ct('javascript control characters', function() {
	ct('===', split('\u200C')[0][0], '\u200C')
	ct('===', split('\u200D')[0][0], '\u200D')
	ct('===', split('\uFEFF')[0][0], '\uFEFF')
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

ct('scope', function() {
	var combo = split('cst=PI*EPSILON;res=x3(arg*cst)', {Math, Number: Object.getOwnPropertyNames(Number), X:null})
	ct('===', combo[0][1], T.input)
	ct('===', combo[1][1], T.assign)
	ct('===', combo[2][1], 'Math.')
	ct('===', combo[3][1], T.operator)
	ct('===', combo[4][1], 'Number.')
	ct('===', combo[5][1], T.nline)
	ct('===', combo[6][1], T.input)
})

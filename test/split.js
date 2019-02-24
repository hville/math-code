var split = require('../src/split'),
		ct = require('cotest'),
		T = require('../types')


function tType(txt) {
	return split(txt).filter( (v,i) => !!(i&1) )
}
function tText(txt) {
	return split(txt).filter( (v,i) => !(i&1) )
}

ct('dot', t => {
	const tkns = tType('aa.bb')
	t('===', tkns.length, 3)
	t('===', tkns[0], T.input)
	t('===', tkns[1], T.error)
	t('===', tkns[2], T.input)
})

ct('Numbers', t => {
	t('===', split('123a')[0], '123')
	t('===', split('12.3a')[0], '12.3')
	t('===', split('0.123a')[0], '0.123')
	t('===', split('0.1e-23a')[0], '0.1e-23')
	t('===', split('.123a')[0], '.123')
	t('===', split('.1e-23a')[0], '.1e-23')

	t('===', split('-123a')[2], '123')
	t('===', split(' 12.3a')[2], '12.3')
	t('===', split('+0.123a')[2], '0.123')
	t('===', split('/0.1e-23a')[2], '0.1e-23')
	t('===', split('*.123a')[2], '.123')
	t('===', split('%.1e-23a')[2], '.1e-23')
})

ct('White Spaces', t => {
	t('{==}', split(' \n.1e-23a')[1], T.nline)
	t('{==}', split(' \t .1e-23a')[1], T.space)

	t('{==}', split('.1e-23 \n')[3], T.nline)
	t('{==}', split('.1e-23 \t ')[3], T.space)

	t('===', split(`
		b = `)[1], T.nline
	)
	t('===', split(`b=a
		c=b`)[7], T.nline
	)
})

ct('operators', t => {
	t('===', split('(a0123.3')[0], '(')
	t('===', split('*_$Ab0.3')[0], '*')
	t('===', split(',,$0.3')[0], ',')

	t('===', split('a(a0123.3')[2], '(')
	t('===', split('a*_$Ab0.3')[2], '*')
	t('===', split('a,,$0.3')[2], ',')
})

ct('bitwise', t => {
	t('===', split('>>>a0123.3')[0], '>>>')
	t('===', split('>>_$Ab0.3')[0], '>>')
	t('===', split('|$0.3')[0], '|')

	t('===', split(' >>>a0123.3')[2], '>>>')
	t('===', split('a>>_$Ab0.3')[2], '>>')
})

ct('logical', t => {
	t('===', split('>a0123.3')[0], '>')
	t('===', split('>=_$Ab0.3')[0], '>=')
	t('===', split('===$0.3')[0], '===')
	t('===', split('0||$0.3')[2], '||')

	t('===', split('0>a0123.3')[2], '>')
	t('===', split('.1>=_$Ab0.3')[2], '>=')
	t('===', split('a===$0.3')[2], '===')
})

ct('literal', t => {
	t('===', split('null>a0123.3')[0], 'null')
	t('===', split('false>=_$Ab0.3')[0], 'false')
	t('===', split('nully===$0.3')[0], 'nully')
	t('===', split('nully===$0.3')[1], T.input)

	t('===', split(' null>a0123.3')[2], 'null')
	t('===', split('+false>=_$Ab0.3')[2], 'false')
	t('===', split('-nully===$0.3')[2], 'nully')
	t('===', split('/nully===$0.3')[3], T.input)
})

ct('identifiers', t => {
	t('===', split(' a0123.3')[2], 'a0123')
	t('===', split(' a0123.3')[3], T.input)
})

ct('assignment', t => {
	t('===', split('myFunc = 4')[1], T.input)
	t('===', split(' myFunc = 4')[3], T.input)

	t('===', split('myFunc =4=')[1], T.input)
	t('===', split('myFunc =4=')[3], T.space)
	t('===', split('myFunc =4=')[5], T.assign)
	t('===', split('myFunc =4=')[7], T.number)
	t('===', split('myFunc =4=')[9], T.assign)

	t('===', split('+myFunc=4=')[1], T.operator)
	t('===', split('+myFunc=4=')[3], T.input)
	t('===', split('+myFunc=4=')[5], T.assign)
	t('===', split('+myFunc=4=')[7], T.number)
	t('===', split('+myFunc=4=')[9], T.assign)
})

ct('javascript control characters', t => {
	t('===', split('\u200C')[0], '\u200C')
	t('===', split('\u200D')[0], '\u200D')
	t('===', split('\uFEFF')[0], '\uFEFF')
})

ct('preserve string', t => {
	var acid = [
		'a+ 3- sin(3s)=.1e3+45',
		'1=34+op-null*false(return)9*87#$%nslkjv',
		'true+false-falsy=return+prototype.windows',
		' . ',
		' a = b ',
		'test=-sin(2+3x)*(2-patate[0]) ?PI : null '
	]
	acid.forEach(function(str) {
		t('===', tText(str).join(''), str)
	})
})

ct('scope', t => {
	var combo = split('cst=PI*EPSILON;res=x3(arg*cst)', {Math, Number: Object.getOwnPropertyNames(Number), X:null})
	t('===', combo[1], T.input)
	t('===', combo[3], T.assign)
	t('===', combo[5], 'Math.')
	t('===', combo[7], T.operator)
	t('===', combo[9], 'Number.')
	t('===', combo[11], T.nline)
	t('===', combo[13], T.input)
})

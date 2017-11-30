/*eslint no-console:0*/

var ct = require('cotest'),
		tkn = require('../src/tokenize')


ct('Numbers', function() {
	ct('===', tkn('123a')[0].text, '123')
	ct('===', tkn('12.3a')[0].text, '12.3')
	ct('===', tkn('0.123a')[0].text, '0.123')
	ct('===', tkn('0.1e-23a')[0].text, '0.1e-23')
	ct('===', tkn('.123a')[0].text, '.123')
	ct('===', tkn('.1e-23a')[0].text, '.1e-23')

	ct('===', tkn('-123a')[1].text, '123')
	ct('===', tkn(' 12.3a')[1].text, '12.3')
	ct('===', tkn('+0.123a')[1].text, '0.123')
	ct('===', tkn('/0.1e-23a')[1].text, '0.1e-23')
	ct('===', tkn('*.123a')[1].text, '.123')
	ct('===', tkn('%.1e-23a')[1].text, '.1e-23')
})

ct('White Spaces', function() {
	ct('===', tkn(' .1e-23a')[0].text, ' ')
	ct('===', tkn('\u00A0')[0].text, '\u00A0')
	ct('===', tkn('	.1e-23a')[0].text, '	')
	ct('===', tkn('\n.1e-23a')[0].text, '\n')
	ct('===', tkn(' \n \f\t \v.1e-23a')[0].text, ' \n \f\t \v')
})

ct('Math', function() {
	ct('===', tkn('sin(0')[0].text, 'sin')
	ct('===', tkn('sin(0')[0].type, 'Math')

	ct('===', tkn('PI+')[0].text, 'PI')
	ct('===', tkn('PI+')[0].type, 'Math')
	ct('===', tkn('PI0')[0].text, 'PI0')

	ct('===', tkn('1+E+1')[2].text, 'E')
	ct('===', tkn('1+E+1')[2].type, 'Math')

	ct('===', tkn('1+EPSILON+1')[2].text, 'EPSILON')
	ct('===', tkn('1+EPSILON+1')[2].type, 'Number')
})

ct('Number', function() {
	ct('===', tkn('EPSILON+')[0].text, 'EPSILON')
	ct('===', tkn('EPSILON+')[0].type, 'Number')
})

ct('operators', function() {
	ct('===', tkn('(a0123.3')[0].text, '(')
	ct('===', tkn('*_$Ab0.3')[0].text, '*')
	ct('===', tkn(',,$0.3')[0].text, ',')

	ct('===', tkn('a(a0123.3')[1].text, '(')
	ct('===', tkn('a*_$Ab0.3')[1].text, '*')
	ct('===', tkn('a,,$0.3')[1].text, ',')
})

ct('bitwise', function() {
	ct('===', tkn('>>>a0123.3')[0].text, '>>>')
	ct('===', tkn('>>_$Ab0.3')[0].text, '>>')
	ct('===', tkn('||$0.3')[0].text, '|')

	ct('===', tkn(' >>>a0123.3')[1].text, '>>>')
	ct('===', tkn('a>>_$Ab0.3')[1].text, '>>')
	ct('===', tkn('0||$0.3')[1].text, '|')
})

ct('logical', function() {
	ct('===', tkn('>a0123.3')[0].text, '>')
	ct('===', tkn('>=_$Ab0.3')[0].text, '>=')
	ct('===', tkn('===$0.3')[0].text, '===')

	ct('===', tkn('0>a0123.3')[1].text, '>')
	ct('===', tkn('.1>=_$Ab0.3')[1].text, '>=')
	ct('===', tkn('a===$0.3')[1].text, '===')
})

ct('literal', function() {
	ct('===', tkn('null>a0123.3')[0].text, 'null')
	ct('===', tkn('false>=_$Ab0.3')[0].text, 'false')
	ct('===', tkn('nully===$0.3')[0].text, 'nully')
	ct('===', tkn('nully===$0.3')[0].type, '$param')

	ct('===', tkn(' null>a0123.3')[1].text, 'null')
	ct('===', tkn('+false>=_$Ab0.3')[1].text, 'false')
	ct('===', tkn('-nully===$0.3')[1].text, 'nully')
	ct('===', tkn('/nully===$0.3')[1].type, '$param')
})

ct('identifiers', function() {
	ct('===', tkn(' a0123.3')[1].text, 'a0123')
	ct('===', tkn(' a0123.3')[1].type, '$param')
})

ct('assignment', function() {
	ct('===', tkn('myFunc = 4')[0].type, '$name')
	ct('===', tkn(' myFunc = 4')[1].type, '$name')

	ct('===', tkn('myFunc =4=3')[0].type, '$error')
	ct('===', tkn('myFunc =4=3')[1].type, '$space')
	ct('===', tkn('myFunc =4=3')[2].type, '$error')
	ct('===', tkn('myFunc =4=3')[3].type, '$error')
	ct('===', tkn('myFunc =4=3')[4].type, '$error')

	ct('===', tkn('+myFunc =4=3')[0].type, '$error')
	ct('===', tkn('+myFunc =4=3')[1].type, '$error')
	ct('===', tkn('+myFunc =4=3')[2].type, '$space')
	ct('===', tkn('+myFunc =4=3')[3].type, '$error')

	ct('===', tkn('+myFunc= 4=3')[2].type, '$error')
})

ct('javascript control characters', function() {
	ct('===', tkn('\u200C')[0].text, '\u200C')
	ct('===', tkn('\u200D')[0].text, '\u200D')
	ct('===', tkn('\uFEFF')[0].text, '\uFEFF')
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
		ct('===', tkn(str).map(t => t.text).join(''), str)
	})
})

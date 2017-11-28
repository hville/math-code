/*eslint no-console:0*/

var ct = require('cotest'),
		tkn = require('../src/tokenize')


ct('Numbers', function() {
	ct('===', tkn('123a')[0], '123')
	ct('===', tkn('12.3a')[0], '12.3')
	ct('===', tkn('0.123a')[0], '0.123')
	ct('===', tkn('0.1e-23a')[0], '0.1e-23')
	ct('===', tkn('.123a')[0], '.123')
	ct('===', tkn('.1e-23a')[0], '.1e-23')

	ct('===', tkn('-123a')[1], '123')
	ct('===', tkn(' 12.3a')[1], '12.3')
	ct('===', tkn('+0.123a')[1], '0.123')
	ct('===', tkn('/0.1e-23a')[1], '0.1e-23')
	ct('===', tkn('*.123a')[1], '.123')
	ct('===', tkn('%.1e-23a')[1], '.1e-23')
})

ct('White Spaces', function() {
	ct('===', tkn(' .1e-23a')[0][0], ' ')
	ct('===', tkn('\u00A0')[0][0], '\u00A0')
	ct('===', tkn('	.1e-23a')[0][0], '	')
	ct('===', tkn('\n.1e-23a')[0][0], '\n')
	ct('===', tkn(' \n \f\t \v.1e-23a')[0][0], ' \n \f\t \v')
})

ct('Math', function() {
	ct('===', tkn('sin(0')[0][0], 'sin')
	ct('===', tkn('sin(0')[0].type, 'Math')

	ct('===', tkn('PI+')[0][0], 'PI')
	ct('===', tkn('PI+')[0].type, 'Math')
	ct('===', tkn('PI0')[0][0], 'PI0')

	ct('===', tkn('E')[0][0], 'E')
	ct('===', tkn('E')[0].type, 'Math')
})

ct('Number', function() {
	ct('===', tkn('EPSILON+')[0][0], 'EPSILON')
	ct('===', tkn('EPSILON+')[0].type, 'Number')
})

ct('operators', function() {
	ct('===', tkn('(a0123.3')[0], '(')
	ct('===', tkn('*_$Ab0.3')[0], '*')
	ct('===', tkn(',,$0.3')[0], ',')

	ct('===', tkn('a(a0123.3')[1], '(')
	ct('===', tkn('a*_$Ab0.3')[1], '*')
	ct('===', tkn('a,,$0.3')[1], ',')
})

ct('bitwise', function() {
	ct('===', tkn('>>>a0123.3')[0], '>>>')
	ct('===', tkn('>>_$Ab0.3')[0], '>>')
	ct('===', tkn('||$0.3')[0], '|')

	ct('===', tkn(' >>>a0123.3')[1], '>>>')
	ct('===', tkn('a>>_$Ab0.3')[1], '>>')
	ct('===', tkn('0||$0.3')[1], '|')
})

ct('logical', function() {
	ct('===', tkn('>a0123.3')[0], '>')
	ct('===', tkn('>=_$Ab0.3')[0], '>=')
	ct('===', tkn('===$0.3')[0], '===')

	ct('===', tkn('0>a0123.3')[1], '>')
	ct('===', tkn('.1>=_$Ab0.3')[1], '>=')
	ct('===', tkn('a===$0.3')[1], '===')
})

ct('literal', function() {
	ct('===', tkn('null>a0123.3')[0], 'null')
	ct('===', tkn('false>=_$Ab0.3')[0], 'false')
	ct('===', tkn('nully===$0.3')[0][0], 'nully')
	ct('===', tkn('nully===$0.3')[0].type, '$param')

	ct('===', tkn(' null>a0123.3')[1], 'null')
	ct('===', tkn('+false>=_$Ab0.3')[1], 'false')
	ct('===', tkn('-nully===$0.3')[1][0], 'nully')
	ct('===', tkn('/nully===$0.3')[1].type, '$param')
})

ct('identifiers', function() {
	ct('===', tkn(' a0123.3')[1][0], 'a0123')
	ct('===', tkn(' a0123.3')[1].type, '$param')
})

ct('assignment', function() {
	ct('{==}', tkn('myFunc = 4').$name, [0])
	ct('===', tkn('myFunc = 4')[0].type, '$name')

	ct('{==}', tkn(' myFunc = 4').$name, [1])
	ct('===', tkn(' myFunc = 4')[1].type, '$name')

	ct('{==}', tkn('myFunc= 4=3').$error, [4])
	ct('===', tkn('myFunc =4=3')[4].type, '$error')

	ct('===', tkn('+myFunc =4=3')[1].type, '$param')
	ct('===', tkn('+myFunc= 4=3')[2].type, '$error')
})

ct('javascript control characters', function() {
	ct('===', tkn('\u200C')[0][0], '\u200C')
	ct('===', tkn('\u200D')[0][0], '\u200D')
	ct('===', tkn('\uFEFF')[0][0], '\uFEFF')
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
		ct('===', tkn(str).join(''), str)
	})
})

ct('errors', function() {
	ct('>', tkn('a.b').$error.length, 0)
	ct('>', tkn('=b').$error.length, 0)
	ct('>', tkn('0=b').$error.length, 0)
	ct('>', tkn('a+b=c').$error.length, 0)

	ct('>', tkn(' __proto__').$error.length, 0)
	ct('>', tkn('a+constructor').$error.length, 0)
	ct('>', tkn('window["something"]').$error.length, 0)
	ct('>', tkn(' __proto__').$error.length, 0)

	ct('===', tkn(' constructorABC').$error.length, 0)
})

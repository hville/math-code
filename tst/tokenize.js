/*eslint no-console:0*/
'use strict'
var t = require('assert'),
		tkn = require('../src/tokenize')

console.log('=== START ===')

console.log('Numbers...')
t.equal(tkn('123a').tokens[0], '123')
t.equal(tkn('12.3a').tokens[0], '12.3')
t.equal(tkn('.123a').tokens[0], '.123')
t.equal(tkn('.1e-23a').tokens[0], '.1e-23')

console.log('Leading Spaces...')
t.equal(tkn(' .1e-23a').tokens[0], '.1e-23')
t.equal(tkn('	.1e-23a').tokens[0], '.1e-23')

console.log('Math...')
t.equal(tkn('sin(0').tokens[0], 'Math.sin')
t.equal(tkn('PI0').tokens[0], 'Math.PI')

console.log('identifiers...')
t.equal(tkn(' a0123.3').tokens[0], '$argument.a0123')
t.equal(tkn('	_$Ab0.3', 'user').tokens[0], 'user._$Ab0')
t.equal(tkn('	$0.3', '$vars').tokens[0], '$vars.$0')

console.log('operators...')
t.equal(tkn(' (a0123.3').tokens[0], '(')
t.equal(tkn('*_$Ab0.3', 'user').tokens[0], '*')
t.equal(tkn(',,$0.3', '$vars').tokens[0], ',')

console.log('bitwise...')
t.equal(tkn(' >>>a0123.3').tokens[0], '>>>')
t.equal(tkn('>>_$Ab0.3', 'user').tokens[0], '>>')
t.equal(tkn('||$0.3', '$vars').tokens[0], '|')

console.log('logical...')
t.equal(tkn(' >a0123.3').tokens[0], '>')
t.equal(tkn('>=_$Ab0.3', 'user').tokens[0], '>=')
t.equal(tkn('===$0.3', '$vars').tokens[0], '===')

console.log('literal...')
t.equal(tkn(' null>a0123.3').tokens[0], 'null')
t.equal(tkn('false>=_$Ab0.3', 'user').tokens[0], 'false')
t.equal(tkn('nully===$0.3', '$vars').tokens[0], '$vars.nully')

console.log('assignment...')
t.equal(tkn('myFunc=4').functionName, 'myFunc')
t.equal(tkn('myFunc=4').tokens[0], 4)

console.log('all together...')
t.deepEqual(tkn(
	'test=-sin(2+3x)*(2-patate[0]) ?PI : null ', '$vars').tokens,
	'- Math.sin ( 2 + 3 $vars.x ) * ( 2 - $vars.patate [ 0 ] ) ? Math.PI : null'.split(' ')
)

function chkErr(str) {
	var res = tkn(str)
	t.ok(res instanceof Error)
	console.log('...Passed:', res.message)
}
console.log('errors...')
chkErr('a.b')
chkErr('=b')
chkErr('0=b')
chkErr('a+b=c')
chkErr('Object.keys(a)')
chkErr('[].concat()')
chkErr('3,prototype')
chkErr('[].prototype')
chkErr('[].constructor')
chkErr('window["something"]')
chkErr('(3).constructor')
chkErr('process.hrtime')

console.log('=== END ===')

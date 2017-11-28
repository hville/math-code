/*eslint no-console:0*/
'use strict'
var ct = require('cotest'),
		parse = require('../src/parse')

ct('=== START ===')

ct('Arguments', function() {
	ct('===', parse('a').tokens[0].toString(), 'a')
	ct('===', parse('a').args.length, 1)
	ct('{==}', parse('a+b').tokens.$param, [0, 2])
	ct('{==}', parse('a+b').args, ['a', 'b'])
	ct('===', parse('a+b').args.length, 2)
})

ct('No Args', function() {
	ct('===', parse('1+1').exec(), 2)
	ct('===', parse('').exec(), undefined)
})

ct('Math', function() {
	ct('===', parse('PI').exec(), Math.PI)
})

ct('Number', function() {
	ct('===', parse('EPSILON').exec(), Number.EPSILON)
})

ct('Identity', function() {
	ct('===', parse('a').exec({a:1}), 1)
	ct('===', parse('a').exec({a:'1'}), '1')
	ct('{==}', parse('a').exec({a:[]}), [])
	ct('{==}', parse('a').exec({a:{}}), {})
})

ct('Algebra', function() {
	ct('===', parse('a*a+b*b').exec({a:1, b:2}), 5)
	ct('===', parse('3*a + 2*b').exec({a:1, b:2}), 7)
})

ct('Math Constants', function() {
	ct('===', parse('PI').exec({a:'IGNORED'}), Math.PI)
	ct('===', parse('a*PI+b*PI').exec({a:1, b:2}), 3*Math.PI)
})

ct('Math Functions', function() {
	ct('===', parse('max(2,qty)').exec({a:'IGNORED', qty:3}), 3)
})

ct('reserved words', function() {
	ct('===', parse('var').exec({var:'var'}), 'var')
	ct('===', parse('get').exec({get:'get'}), 'get')
	ct('===', parse('new').exec({new:'new'}), 'new')
})

ct('Named Function', function() {
	ct('===', parse('a=b+c').name, 'a')
	ct('===', parse('a=b+c').exec({b:10, c:20}), 30)
	ct('===', parse('new').exec({new:'new'}), 'new')
})

ct('string tricks \uD800 \uDC00 \uD800 \uDC00 \x66', function() {
	ct('===', parse('a').exec({a:'\'var'}), '\'var')
	ct('===', parse('a').exec({a:'\"var'}), '\"var')
	ct('===', parse('a').exec({a:'\"var'}), '"var')
	ct('===', parse('a').exec({a:'\uD800'}), '\uD800')
	ct('===', parse('a').exec({a:'\uDC00'}), '\uDC00')
	ct('===', parse('a').exec({a:'\x66'}), 'f')
	// \uXXXX unicode codepoint
	// \xXX the Latin-1 character
	// \u{X} ... \u{XXXXXX}	unicode codepoint
})

ct('Chained Named Function', function() {
	var robj = {two: 2, nine: 9},
			fobj = parse('eleven=two+nine')

	robj[fobj.name] = fobj.exec(robj)
	ct('===', robj.eleven, 11)

	fobj = parse('ninetynine = eleven * nine')
	robj[fobj.name] = fobj.exec(robj)
	ct('===', robj.ninetynine, 99)
})

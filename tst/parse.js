/*eslint no-console:0*/
'use strict'
var t = require('assert'),
		parse = require('../src/parse')

console.log('=== START ===')

console.log('Arguments...')
t.equal(parse('a').args[0], 'a')
t.equal(parse('a').expr.length, 1)
t.deepEqual(parse('a+b').args, ['a', 'b'])
t.equal(parse('a+b').expr.length, 1, 'The function always takes a single argument')

console.log('No Args...')
t.equal(parse('1+1').expr(), 2)
t.equal(parse('').expr(), undefined)

console.log('Math...')
t.equal(parse('PI').expr(), Math.PI)

console.log('Number...')
t.equal(parse('EPSILON').expr(), Number.EPSILON)

console.log('Identity...')
t.equal(parse('a').expr({a:1}), 1)
t.equal(parse('a').expr({a:'1'}), '1')
t.deepEqual(parse('a').expr({a:[]}), [])
t.deepEqual(parse('a').expr({a:{}}), {})

console.log('Algebra...')
t.equal(parse('a*a+b*b').expr({a:1, b:2}), 5)
t.equal(parse('3*a + 2*b').expr({a:1, b:2}), 7)

console.log('Math Constants...')
t.equal(parse('PI').expr({a:'IGNORED'}), Math.PI)
t.equal(parse('a*PI+b*PI').expr({a:1, b:2}), 3*Math.PI)

console.log('Math Functions...')
t.equal(parse('max(2,qty)').expr({a:'IGNORED', qty:3}), 3)

console.log('reserved words...')
t.equal(parse('var').expr({var:'var'}), 'var')
t.equal(parse('get').expr({get:'get'}), 'get')
t.equal(parse('new').expr({new:'new'}), 'new')

console.log('Named Function...')
t.equal(parse('a=b+c').name, 'a')
t.equal(parse('a=b+c').expr({b:10, c:20}), 30)
t.equal(parse('new').expr({new:'new'}), 'new')

console.log('string tricks...', '\uD800', '\uDC00', '\uD800\uDC00', '\x66')
t.equal(parse('a').expr({a:'\'var'}), '\'var')
t.equal(parse('a').expr({a:'\"var'}), '\"var')
t.equal(parse('a').expr({a:'\"var'}), '"var')
t.equal(parse('a').expr({a:'\uD800'}), '\uD800')
t.equal(parse('a').expr({a:'\uDC00'}), '\uDC00')
t.equal(parse('a').expr({a:'\x66'}), 'f')
// \uXXXX unicode codepoint
// \xXX the Latin-1 character
// \u{X} ... \u{XXXXXX}	unicode codepoint

console.log('Chained Named Function...')
var robj = {two: 2, nine: 9},
		fobj = parse('eleven=two+nine')

robj[fobj.name] = fobj.expr(robj)
t.equal(robj.eleven, 11)

fobj = parse('ninetynine = eleven * nine')
robj[fobj.name] = fobj.expr(robj)
t.equal(robj.ninetynine, 99)

console.log('=== END ===')

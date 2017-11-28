/* global process */
/* eslint no-console:0 */
var parse = require('./src/parse')
var source = process.argv.slice(2).join(' ')
console.log('Source:', source)

var res = parse(source)

//console.log('tokens: ', res.tokens)
console.log('prefix: ', res.prefix())
if (res.tokens.$error.length) console.log('formated: ', res.format())
else console.log('result: ', res.compile()())



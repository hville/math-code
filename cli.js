/* global process */
/* eslint no-console:0 */
var parse = require('./src/parse')
var source = process.argv.slice(2).join(' ')
console.log('Source:', source)

var res = parse(source)

console.log(
	res.args.length ? 'unknown arguments: ' + res.args.join(', ')
	: parse(source).expr()
)

/*global process */
var parse = require('./parse')
process.argv.slice(2).forEach(parse)

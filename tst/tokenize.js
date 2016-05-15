'use strict'
var t = require('assert'),
		tkn = require('./src/tokenize')

//numbers
t.equal(tkn('123a')[0], '123')
t.equal(tkn('12.3a')[0], '12.3')
t.equal(tkn('.123a')[0], '.123')
t.equal(tkn('.1e-23a')[0], '.1e-23')

//leading spaces
t.equal(tkn(' .1e-23a')[0], '.1e-23')
t.equal(tkn('	.1e-23a')[0], '.1e-23')

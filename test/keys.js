var chop = require('../chop'),
		keys = require('../keys'),
		ct = require('cotest')

ct('finds keys', t => {
	t('{==}', keys(chop('a=b')).yields, ['a'])
	t('{==}', keys(chop('a=b\nc=d')).yields, ['a','c'])
	t('{==}', keys(chop('a=b+c\nd=e')).yields, ['a','d'])

	t('{==}', keys(chop('a=b')).inputs, ['b'])
	t('{==}', keys(chop('a=b\nc=d')).inputs, ['b','d'])
	t('{==}', keys(chop('a=b+c\nd=e')).inputs, ['b','c', 'e'])
})


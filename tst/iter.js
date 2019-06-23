var ct = require('cotest'),
		rule = require('../src/rule'),
		iter = require('../src/iter')

ct('pass', t => {
	t('===', iter(rule.scan('y=1')).constructor, Function)
	t('{===}', iter(rule.scan('y=1'))(), {y:1})
	t('{===}', iter(rule.scan('y=((1+2)-2)*PI'))(), {y:Math.PI})
	t('{===}', iter(rule.scan('a=PI+1;b=a-1'))().b, Math.PI)
})
ct('fail', t => {
	t('===', iter(rule.scan('y=')).constructor, Error)
	t('===', iter(rule.scan('y=.')).constructor, Error)
})

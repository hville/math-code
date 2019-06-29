var ct = require('cotest'),
		rule = require('../src/rule'),
		iter = require('../src/make')

ct('pass', t => {
	t('===', iter(rule.scan('y=1')).constructor, Function)
	t('{===}', iter(rule.scan('y=1'))(), {y:1})
	t('{===}', iter(rule.scan('y=((1+2)-2)*PI'))(), {y:Math.PI})
	t('{===}', iter(rule.scan('a=PI+1;b=a-1'))().b, Math.PI)
	t('{===}', iter(rule.scan('a=cos(2)'))().a, Math.cos(2))
})
ct('pass', t => {
	var norm = rule.scan('x=N(10,11,a,b,c,d)%;y=N(100,101,a,b,c,d)'),
			func = iter(norm)
	t('>', func().y, 0)
	t('>', func().y, func().x)
})
ct('fail', t => {
	t('===', iter(rule.scan('y=')).constructor, Error)
	t('===', iter(rule.scan('y=.')).constructor, Error)
	t('===', iter(rule.scan('y=a')).constructor, Error)
})

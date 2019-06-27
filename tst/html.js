var ct = require('cotest'),
		rule = require('../src/rule'),
		html = require('../src/html')

ct('pass', t => {
	t('===', html(rule.scan('y=1')), '<b>y</b>=1')
	t('===', html(rule.scan('y=a')), '<b>y</b>=<i>a</i>')
})
ct('fail', t => {
	t('===', html(rule.scan('y=')), '<u>y=</u>')
	t('===', html(rule.scan('y=.')), '<u>y=.</u>')
})

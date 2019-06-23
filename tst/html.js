var ct = require('cotest'),
		rule = require('../src/rule'),
		html = require('../src/html')

ct('pass', t => {
	t('===', html(rule.scan('y=1')), '<i>y</i>=1')
	t('===', html(rule.scan('y=a')), '<i>y</i>=<i>a</i>')
})
ct('fail', t => {
	t('===', html(rule.scan('y=')), '<i>y</i><u>=</u>')
	t('===', html(rule.scan('y=.')), '<i>y</i>=<u>.</u>')
})

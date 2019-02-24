var code = require('../code'),
		chop = require('../chop'),
		ct = require('cotest')

function script(brief) {
	return code(chop(brief, {Math: Object.getOwnPropertyNames(Math), Number: Object.getOwnPropertyNames(Number)}))
}

ct('code', t => {
	t('===', script('r=PI'), 'i.r=Math.PI')
	t('===', script('r=PI*EPSILON*patate'), 'i.r=Math.PI*Number.EPSILON*i.patate')
	t('===', script('PI=EPSILON').message, 'Unexpected token PI')
	t('===', script('=EPSILON').message, 'Unexpected token =')
	t('===', script('r*x=EPSILON').message, 'Unexpected token *')
})

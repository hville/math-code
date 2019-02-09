var code = require('../code'),
		chop = require('../chop'),
		ct = require('cotest')

function script(brief) {
	return code(chop(brief, {Math: Object.getOwnPropertyNames(Math), Number: Object.getOwnPropertyNames(Number)}))
}

ct('code', function() {
	ct('===', script('r=PI'), 'i.r=Math.PI;')
	ct('===', script('r=PI*EPSILON*patate'), 'i.r=Math.PI*Number.EPSILON*i.patate;')
	ct('===', script('PI=EPSILON').message, 'Unexpected token PI')
	ct('===', script('=EPSILON').message, 'Unexpected token =')
	ct('===', script('r*x=EPSILON').message, 'Unexpected token *')
})

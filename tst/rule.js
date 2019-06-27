var ct = require('cotest'),
		rule = require('../src/rule')

ct('pass', t => {
	t('!', rule.scan('a=1').err)
	t('!', rule.scan('a =1').err)
	t('!', rule.scan('a= 1').err)
	t('!', rule.scan(' a=1').err)
	t('!', rule.scan('a=1 ').err)
	t('!', rule.scan(' abc = 0.34e-34 ').err)

	t('!', rule.scan(' ;a=1').err)
	t('!', rule.scan('; a=1').err)
	t('!', rule.scan('a=1 ;b=2').err)
	t('!', rule.scan('a=1; b=2').err)
	t('!', rule.scan('a=1;b=2 ').err)
	t('!', rule.scan('a=1;b=2;').err)
	t('!', rule.scan(`
		a=1
		b=2
	`).err)

	t('!', rule.scan('a= (1)').err)
	t('!', rule.scan('a=( 1)').err)
	t('!', rule.scan('a=(1 )').err)

	t('!', rule.scan('a= fcn(1)').err)
	t('!', rule.scan('a=fcn( 1)').err)
	t('!', rule.scan('a=fcn(1 )').err)

	t('!', rule.scan('a=fcn(    )').err)
	t('!', rule.scan('a=fcn(1,b )').err)
	t('!', rule.scan('a=fcn(1 ,b)').err)
	t('!', rule.scan('a=fcn(1, b)').err)

	t('!', rule.scan('a=N(1,2)').err)
	t('!', rule.scan('a=N(1,2,a)').err)
	t('!', rule.scan('a=N(1,2,a,b)').err)
})
ct('fail', t => {
	t('!!', rule.scan('a=').err)
	t('!!', rule.scan(' =1').err)
	t('!!', rule.scan('a= 1/').err)
	t('!!', rule.scan('a=1 3').err)

	t('!!', rule.scan('a= (1 2)').err)
	t('!!', rule.scan('a=( )').err)
	t('!!', rule.scan('a= ()').err)

	t('!!', rule.scan('a= fcn(1 2)').err)
	t('!!', rule.scan('a=fcn( 1 2)').err)
	t('!!', rule.scan('a=fcn(1  ))').err)
	t('!!', rule.scan('a=fcn((1  )').err)

	//t('!!', rule.scan('a=N(   )').err)//
	//t('!!', rule.scan('a=N(1  )').err)//
	//t('!!', rule.scan('a=N(a, 2 )').err)//
	//t('!!', rule.scan('a=N(1,2,3)').err)//
})
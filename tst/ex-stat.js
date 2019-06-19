var ct = require('cotest'),
		statRule = require('../examples/stat-rule'),
		stat = require('../examples/stat'),
		all = require('../all'),
		rep = require('../rep')

ct('stat rule', t => {
	t('===', statRule.run('y=50.3e2   ').j, 11)
	t('===', statRule.run('y =50.3e2 %').j, 11)
	t('===', statRule.run('y=  50.3e2%').j, 11)
	t('===', statRule.run('y =  50.3e2').j, 11)
	t('===', statRule.run('y =  50.3e2').j, 11)
	t('===', statRule.run('y =  5 % % ').j, 11)

	t('===', statRule.run('y= fcn(5)  ').j, 11)
	t('===', statRule.run('y= fcn(5,6)').j, 11)
	t('===', statRule.run('y=fcn(  )  ').j, 11)
	t('===', statRule.run('y=fcn(5 ,6)').j, 11)
	t('===', statRule.run('y=fcn(5, 6)').j, 11)
	t('===', statRule.run('y=f(u, v,w)').j, 11)

	t('===', statRule.run('y=f+g*h/2% ').j, 11)
	t('===', statRule.run('y= f ?g:2% ').j, 11)
	t('===', statRule.run('y=f/2?g/3:h').j, 11)
	t('===', statRule.run('y=(2+4  )+5').j, 11)

	t('===', statRule.run('y.x=2').err, true)
	t('===', statRule.run('y=prototype').err, true)
	t('===', statRule.run('y=prototypes').err, false)
	t('===', statRule.run('y=(1,3)').err, false)
	t('===', statRule.run('y=(1,3;)').err, false)

	//console.log(statRule.run('y=(1,3; temperature, economy)'))
	t('===', statRule.run('y=(1,3;temperature,economy)').err, false)
	t('===', statRule.exec('y=(1,3;temperature,economy)').err, false)

})
ct('fuse stat math', t => {
	//var res = stat('y=(2+cos(4%%)) * 25%')
	//console.log(res)
	//console.log(res.exec())
	//console.log(stat('y=(1,3; temperature, economy)'))
	//console.log(stat('y=(1,3; temperature, economy)'))
	//console.log(all(';', / */, rep(/[_$A-Za-z]/, rep(/ */, ',', / */, /[_$A-Za-z]/)), / */).exec('; temperature, economy'))
	//t('===', statRule.run('y=(2+cos(4%))+5%%').fuse(fuseCode), 'i.y=(2+Math.cos(4/100))+5/100/100')
	//t('===', statRule.run('y=prototypes+3').fuse(fuseHTML), '<i>y</i>=<i>prototypes</i>+3')
	//t('===', statRule.run('y=prototype+3').fuse(fuseHTML), '<i>y</i>=<i>prototypes</i>+3')
})

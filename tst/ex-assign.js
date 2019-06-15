var ct = require('cotest'),
		assign = require('../examples/stat-rule'),
		fuseCode = require('../examples/stat-code')

ct('all together now, and fail', t => {
	t('===', assign.run('y=50.3e2   ').j, 11)
	t('===', assign.run('y =50.3e2 %').j, 11)
	t('===', assign.run('y=  50.3e2%').j, 11)
	t('===', assign.run('y =  50.3e2').j, 11)
	t('===', assign.run('y =  50.3e2').j, 11)
	t('===', assign.run('y =  5 % % ').j, 11)

	t('===', assign.run('y= fcn(5)  ').j, 11)
	t('===', assign.run('y= fcn(5,6)').j, 11)
	t('===', assign.run('y=fcn(  )  ').j, 11)
	t('===', assign.run('y=fcn(5 ,6)').j, 11)
	t('===', assign.run('y=fcn(5, 6)').j, 11)
	t('===', assign.run('y=f(u, v,w)').j, 11)

	t('===', assign.run('y=f+g*h/2% ').j, 11)
	t('===', assign.run('y= f ?g:2% ').j, 11)
	t('===', assign.run('y=f/2?g/3:h').j, 11)
	t('===', assign.run('y=(2+4  )+5').j, 11)

	t('===', assign.run('y=(2+cos(4%))+5%%').fuse(), 'y=(2+cos(4%))+5%%')
	t('===', assign.run('y=(2+cos(4%))+5%%').fuse(fuseCode), 'i.y=(2+Math.cos(4/100))+5/100/100')
	t('===', assign.run('y.x=2').err, true)
})

var ct = require('cotest'),
		text = require('../tok')

var simNoSticky = Object.defineProperty(/abc/, 'sticky', {value: null}),
		abcT = text('abc'),
		abcG = text(simNoSticky),
		abcS = text(/abc/),
		voidS = text(/.{0,0}/),
		voidG = Object.defineProperty(/.{0,0}/, 'sticky', {value: null})

function test(t, res, ref) {
	for (var i=0, ks=Object.keys(ref); i<ks.length; ++i) t('===', res[ks[i]], ref[ks[i]])
}

ct('init sticky/global flags', t => {
	t('===', abcS.opt.sticky, true)
	t('===', abcS.opt.global, false)

	t('===', abcG.opt.sticky, false)
	t('===', abcG.opt.global, true)
})
ct('kin', t => {
	test(t, text.call({kin: 'kin'}, 'abc').run('abc'), {
		kin:'kin', i:0, txt: 'abc', j: 3, err: false
	})
	test(t, text.call({kin: 'kin'}, /abc/).run('abc'), {
		kin:'kin', i:0, txt: 'abc', j: 3, err: false
	})
	test(t, text.call({kin: 'kin'}, simNoSticky).run('abc'), {
		kin:'kin', i:0, txt: 'abc', j: 3, err: false
	})
})
ct('text string pass', t => {
	test(t, abcT.run('abc'), {
		kin:'', i:0, txt: 'abc', j: 3, err: false
	})
	test(t, abcT.run('aabc', 1), {
		kin:'', i:1, txt: 'abc', j: 4, err: false
	})
	test(t, text('').run('aabc', 1), {
		kin:'', i:1, txt: '', j: 1, err: false
	})
})
ct('text string fail', t => {
	test(t, abcT.run('ab'), {
		kin:'', i:0, txt: 'ab', j: 2, err: true
	})
	test(t, abcT.run('aabc'), {
		kin:'', i:0, txt: 'aa', j: 2, err: true
	})
	test(t, abcT.run('abc', 1), {
		kin:'', i:1, txt: 'b', j: 2, err: true
	})
	test(t, abcT.run('abc', 3), {
		kin:'', i:3, txt: '', j: 3, err: true
	})
})
ct('text sticky pass', t => {
	test(t, abcS.run('abc'), {
		kin:'', i:0, txt: 'abc', j: 3, err: false
	})
	test(t, abcS.run('aabc', 1), {
		kin:'', i:1, txt: 'abc', j: 4, err: false
	})
	test(t, text(voidS).run('aabc', 1), {
		kin:'', i:1, txt: '', j: 1, err: false
	})
})
ct('text sticky fail', t => {
	test(t, abcS.run('ab'), {
		kin:'', i:0, txt: 'a', j: 1, err: true
	})
	test(t, abcS.run('aabc'), {
		kin:'', i:0, txt: 'a', j: 1, err: true
	})
	test(t, abcS.run('abc', 1), {
		kin:'', i:1, txt: 'b', j: 2, err: true
	})
	test(t, abcS.run('abc', 3), {
		kin:'', i:3, txt: '', j: 3, err: true
	})
})
ct('text global pass', t => {
	test(t, abcG.run('abc'), {
		kin:'', i:0, txt: 'abc', j: 3, err: false
	})
	test(t, abcG.run('aabc', 1), {
		kin:'', i:1, txt: 'abc', j: 4, err: false
	})
	test(t, text(voidG).run('aabc', 1), {
		kin:'', i:1, txt: '', j: 1, err: false
	})
})
ct('text global fail', t => {
	test(t, abcG.run('ab'), {
		kin:'', i:0, txt: 'a', j: 1, err: true
	})
	test(t, abcG.run('aabc'), {
		kin:'', i:0, txt: 'a', j: 1, err: true
	})
	test(t, abcG.run('abc', 1), {
		kin:'', i:1, txt: 'b', j: 2, err: true
	})
	test(t, abcG.run('abc', 3), {
		kin:'', i:3, txt: '', j: 3, err: true
	})
})

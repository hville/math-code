var ct = require('cotest'),
		//not = require('../new/not'),
		any = require('../any'),
		all = require('../all'),
		rep = require('../rep'),
		not = require('../not'),
		spy = require('../spy')
function test(t, res, ref) {
	for (var i=0, ks=Object.keys(ref); i<ks.length; ++i) t('===', res[ks[i]], ref[ks[i]])
}

ct('all pass', t => {
	test(t, all.call('kin', 'abc').run('abc'), {
		kin:'kin', i:0, j: 3, err: false
	})
	test(t, all('abc').run('abc'), {
		kin:'', i:0, j: 3, err: false
	})
	test(t, all('abc').run('abc').set[0], {
		kin:'', i:0, j: 3, err: false
	})
	t('===', all('abc').run('abc').set.length, 1)

	t('===', all('bc').run('abc', 1).err, false)
	t('===', all('bc').run('abc', 1).kin, '')
	t('===', all.call('kin', 'bc').run('abc', 1).kin, 'kin')
	t('===', all('bc').run('abc', 1).i, 1)
	t('===', all('bc').run('abc', 1).j, 3)
	t('===', all('bc').run('abc').set.length, 1)

	t('===', all('ab', /c/).run('abc').err, false)
	t('===', all('ab', /c/).run('abc').kin, '')
	t('===', all.call('kin', 'ab', /c/).run('abc').kin, 'kin')
	t('===', all('ab', /c/).run('abc').i, 0)
	t('===', all('ab', /c/).run('abc').j, 3)
	t('===', all('ab', /c/).run('abc').set.length, 2)

	t('===', all('a', all('b', all('c'))).run('abc').err, false)
	t('===', all('a', all('b', all('c'))).run('abc').kin, '')
	t('===', all('a', all('b', all('c'))).run('abc').i, 0)
	t('===', all('a', all('b', all('c'))).run('abc').j, 3)
	t('===', all('a', all('b', all('c'))).run('abc').set.length, 3)

	var rule = all('a', all.call('A','b', all('c'))),
			pack = rule.run('abc'),
			nest = pack.set[1]
	t('===', pack.err, false)
	//t('===', nest.err, false)
	t('===', pack.kin, '')
	//t('===', nest.kin, 'A')
	t('===', pack.i, 0)
	//t('===', nest.i, 1)
	t('===', pack.j, 3)
	//t('===', nest.j, 3)
	t('===', pack.set.length, 2)
	//t('===', nest.set.length, 2)
	var _ = / */,
			spaced = all('a', _, 'b', _, 'c')
	t('===', spaced.run('abc').j, 3)
	t('===', spaced.run('a bc').j, 4)
	t('===', spaced.run('a  bc').j, 5)
	t('===', spaced.run('a  b c').j, 6)
})

ct('all fail', t => {
	t('===', all('abc').run('abc', 1).err, true)
	t('===', all('abc').run('abc', 1).i, 1)
	t('===', all('abc').run('abc', 1).j, 2)
	t('===', all('abc').run('abc', 1).set.length, 1)

	t('===', all('a', 'c').run('abc').err, true)
	t('===', all('a', 'c').run('abc').i, 0)
	t('===', all('a', 'c').run('abc').j, 2)
	t('===', all('a', 'c').run('abc').set.length, 2)
	t('===', all('a', 'c').run('abc').set[1].j, 2)

	var rule = all('a', all.call('A','b', all('C'))),
			pack = rule.run('abc'),
			nest = pack.set[1]
	t('===', pack.err, true)
	t('===', nest.err, true)
	t('===', pack.kin, '')
	t('===', nest.kin, 'A')
	t('===', pack.i, 0)
	t('===', nest.i, 1)
	t('===', pack.j, 3)
	t('===', nest.j, 3)
	t('===', pack.set.length, 2)
	t('===', nest.set.length, 2)
})

ct('any pass', t => {
	var fail = any('X', 'Y', 'Z'),
			ab = any(fail, 'ab'),
			rule = any(fail, any.call('kin', fail, ab, 'abc')),
			pack = rule.run('abc')
	t('===', pack.err, false)
	t('===', pack.kin, 'kin')
	t('===', pack.i, 0)
	t('===', pack.j, 2)
})

ct('any fail', t => {
	var fail = any('X', 'Y', 'abX'),
			rule = any(fail, any.call('kin', fail), fail),
			pack = rule.run('abc')
	t('===', pack.err, true)
	t('===', pack.kin, '')
	t('===', pack.i, 0)
	t('===', pack.txt, 'abc')
	t('===', pack.j, 3)
})

ct('rep pass', t => {
	t('===', rep('ab').run('ab').kin, '')
	t('===', rep.call('kin', 'bc').run('ab').kin, 'kin')

	t('===', rep('ab').run('x').err, false)
	t('===', rep('ab').run('x').i, 0)
	t('===', rep('ab').run('x').j, 0)

	t('===', rep('ab').run('ab').err, false)
	t('===', rep('ab').run('ab').i, 0)
	t('===', rep('ab').run('ab').j, 2)

	t('===', rep('ab').run('abababX').err, false)
	t('===', rep('ab').run('abababX').i, 0)
	t('===', rep('ab').run('abababX').j, 6)

	t('===', rep('ab', 1, 2).run('abababX').err, false)
	t('===', rep('ab', 1, 2).run('abababX').i, 0)
	t('===', rep('ab', 1, 2).run('abababX').j, 4)
})

ct('rep fail', t => {
	t('===', rep('ab', 1).run('x').err, true)
	t('===', rep('ab', 1).run('x').i, 0)
	t('===', rep('ab', 1).run('x').j, 1)

	t('===', rep('ab', 2).run('ab').err, true)
	t('===', rep('ab', 2).run('ab').i, 0)
	t('===', rep('ab', 2).run('ab').j, 3)

	t('===', rep('ab', 3).run('ababX').err, true)
	t('===', rep('ab', 3).run('ababX').i, 0)
	t('===', rep('ab', 3).run('ababX').j, 5)
})

/*
ct('any => array', t => {
	var allany = all(['a', 'b'], ['c', 'd']).run('bd'),
			repany = rep(['a', 'b']).run('aabb')

	t('===', allany.err, false)
	t('===', allany.j, 2)

	t('===', repany.err, false)
	t('===', repany.j, 4)
})
*/
ct('fuse', t => {
	t('===', all('ab', 'cd').run('ab').fuse(), 'ab')
	t('===', all('ab', any.call('xxx', /[^]*/)).run('abxy').fuse({xxx: txt => txt.toUpperCase() }), 'abXY')
	t('===', all.call('xxx', 'ab', /[^]*/).run('abxy').fuse({xxx: txt => txt.toUpperCase() }), 'ABXY')
	t('===', all.call('all', 'ab', any.call('not', /[^]*/)).run('abxy').fuse({
		not: txt=>txt.replace('y', 'z'),
		all: txt => txt.toUpperCase()
	}), 'ABXZ')

})
/*
ct('not fail', t => {
	test(t, not.call({kin: 'kin'}, 'abc').run('abc'), {
		kin:'kin', i:0, txt: 'abc', j: 3, err: true
	})
	test(t, not('abc').run('abc'), {
		kin:'', i:0, txt: 'abc', j: 3, err: true
	})
	test(t, not('abc').run('aabc', 1), {
		kin:'', i:1, txt: 'abc', j: 4, err: true
	})
	test(t, not('').run('aabc', 1), {
		kin:'', i:1, txt: '', j: 1, err: true
	})
})
*/
/*
ct('not fail', t => {
	t('===', not('abc').run('abc').err, true)
	t('===', not('def','abc').run('abc').err, true)
	t('===', not('abc').run('abc').i, 0)
	t('===', not('abc').run('abc').j, 3)

	t('===', not('bc').run('abc', 1).err, true)
	t('===', not('bc').run('abc', 1).i, 1)
	t('===', not('bc').run('abc', 1).j, 3)
})
ct('not pass', t => {
	test(t, not('abc').run('ab'), {
		kin:'', i:0, txt: '', j: 0, err: false
	})
	test(t, not('def', 'abc').run('ab'), {
		kin:'', i:0, txt: '', j: 0, err: false
	})
	test(t, not('abc').run('aabc'), {
		kin:'', i:0, txt: '', j: 0, err: false
	})
	test(t, not('abc').run('abc', 1), {
		kin:'', i:1, txt: '', j: 1, err: false
	})
	test(t, not('abc').run('abc', 3), {
		kin:'', i:3, txt: '', j: 3, err: false
	})
	test(t, not('def', 'abc').run('abc', 3), {
		kin:'', i:3, txt: '', j: 3, err: false
	})
})
*/
ct('all together now', t => {
	var ops = /[+*-/]/,
			nmb = /[0-9]+/,
			_ = rep(/[ \t]+/),
			exp = all(nmb, _, rep(all(ops, _, nmb)), spy.call('err',not(/[^]+/), function() { console.log('spy', this) })),
			ERR = spy(all(nmb, 'notFound'), function(string) { this.add(string.slice(this.j)) })
	var res = exp.run('12  +34+ 45')
	t('===', res.err, false)
	t('===', res.kin, '')
	t('===', res.set.length, 7)
	t('===', res.i, 0)
	t('===', res.fuse(), '12  +34+ 45')

	var err = exp.run('12+  ')
	t('===', err.err, true)
	t('===', err.kin, '')
	t('===', err.i, 0)
	t('===', err.fuse(), '12+  ')
	t('===', err.fuse({err: txt => txt.replace(/[^]/g, '#')}), '12###')

	var big = exp.run('12+  +  ', 0, true)
	t('===', big.err, true)
	t('===', big.kin, '')
	t('===', big.i, 0)
	t('===', big.fuse(), '12+  +  ')
	t('===', big.fuse({err: txt => txt.replace(/[^]/g, '#')}), '12######')

	var biG = exp.run('12+  +  ', 0)
	t('===', biG.err, true)
	t('===', biG.kin, '')
	t('===', biG.i, 0)
	t('===', biG.fuse(), '12+  +  ')
	t('===', biG.fuse({err: txt => txt.replace(/[^]/g, '#')}), '12######')

	var bIG = exp.run('12+  +  ', 0)
	t('===', bIG.err, true)
	t('===', bIG.kin, '')
	t('===', bIG.i, 0)
	t('===', bIG.fuse(), '12+  +  ')
	t('===', bIG.fuse({err: txt => txt.replace(/[^]/g, '#')}), '12######')

})
/*
ct('and pass', t => {
	test(t, and.call({kin: 'kin'}, 'abc', 'ab').run('abc'), {
		kin:'kin', i:0, txt: 'ab', j: 2, err: false
	})
	test(t, and(/[a-z]+/, not('prototype', 'constructor')).run('abc'), {
		kin:'kin', i:0, txt: 'abc', j: 3, err: false
	})
})
 */

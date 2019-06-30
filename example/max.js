var make = require('../make'),
		rule = require('../rule'),
		ct = require('cotest'),
		Stats = require('lazy-stats')

const stats = new Stats(3),
			N = 500000
const tree = rule.scan(`
	y1 = max(D(1, 6, r), D(1, 6))
	y2 = max(D(1, 6, r), D(1, 6, r))
	y3 = max(D(1, 6, r), D(1, 6, -r))
`)
//console.log(tree)
const sim = make(tree)

for (var i=0; i<N; ++i) {
	var res = sim()
	stats.push(res.y1, res.y2, res.y3)
}

ct('simulation', t => {
	t('===', stats.N, N)
	t('>', stats.ave(0), 2)
	t('>', stats.ave(1), 2)
	t('>', stats.ave(2), 2)
})

/* eslint-disable no-console */
console.log(`
	simulations: ${stats.N}
	independent  ave: ${stats.ave(0).toFixed(3)}
	+ corrolated ave: ${stats.ave(1).toFixed(3)}
	- corrolated ave: ${stats.ave(2).toFixed(3)}

	independent  dev: ${stats.dev(0).toFixed(3)}
	+ corrolated dev: ${stats.dev(1).toFixed(3)}
	- corrolated dev: ${stats.dev(2).toFixed(3)}

	cor(ind, plus)  : ${stats.cor(0,1).toFixed(3)}
	cor(ind, minus) : ${stats.cor(0,2).toFixed(3)}
	cor(plus, minus): ${stats.cor(1,2).toFixed(3)}
`)

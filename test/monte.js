var chop = require('../chop'),
		code = require('../code'),
		make = require('../make'),
		ct = require('cotest'),
		gmodo = require('grosso-modo'),
		Stats = require('lazy-stats')

function build(brief, scope) {
	return make(code(chop(brief, scope)))
}


const setup = build(`
	Frigo$ = logn(700, 1400, .8)
	Four$ = logn(600, 1200, .8)
	Lave$ = logn(600, 1200, .8)
	Micro$ = logn(100, 400, .8)
	SejourA = logn(3, 6, .8)
	ReventeR = logn(.15, .3)
	Interet = logn(.03, .06)
`)(gmodo)

const monte = build(`
	achat$ = Frigo$() + Four$() + Lave$() + Micro$()
	tempsA = SejourA()
	interet = Interet()
	cout = achat$ * (1 - ReventeR() * pow(1-interet, tempsA))
	mensuel = cout/tempsA/12
`, {Math, Number})

const stats = new Stats(3),
			N = 200000
for (var i=0; i<N; ++i) {
	monte(setup)
	stats.push(setup.achat$, setup.tempsA, setup.mensuel)
}

ct('simulation', () => {
	ct('===', stats.N, N)
	ct('>', stats.ave(0), 1000)
})

/* eslint-disable no-console */
console.log(`
	simulations: ${stats.N}
	valeur d'achat: ${stats.ave(0).toFixed(2)}
	nombre d'annees: ${stats.ave(1).toFixed(1)}
	cout mensuel: ${stats.ave(2).toFixed(2)}
`)

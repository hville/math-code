import parse from '../src/parse.mjs'
import ct from 'cotest'

function tType(txt) {
	return parse(txt).map(t => t.t)
}

ct('reject multiple =', () => {
	const tkns = tType('ab=cd=')
	ct('===', tkns.length, 4)
	ct('===', tkns[0], 'arg.')
	ct('===', tkns[1], 'eq')
	ct('===', tkns[2], 'arg.')
	ct('===', tkns[3], 'er')
})

ct('reject incomplelte line', () => {
	const tkns = tType(`b=c
		a=`)
	ct('===', tkns.length, 6)
	ct('===', tkns[3], 'nl')
	ct('===', tkns[4], 'arg.')
	ct('===', tkns[5], 'er')
})

ct('reject multiple ids before "="', () => {
	const tkns = tType('23+ab-cd=')
	ct('===', tkns.length, 6)
	ct('===', tkns[0], 'er')
	ct('===', tkns[1], 'er')
	ct('===', tkns[2], 'arg.')
	ct('===', tkns[3], 'er')
	ct('===', tkns[4], 'er')
	ct('===', tkns[5], 'er')
})

ct('allow multiline expression', function() {
	const tkns = tType(`a
	=
	b
	+
	3
	`)
	ct('===', tkns.length, 10)
	ct('===', tkns[0], 'arg.')
	ct('===', tkns[1], 'ws')
	ct('===', tkns[2], 'eq')
	ct('===', tkns[3], 'ws')
	ct('===', tkns[4], 'arg.')
	ct('===', tkns[5], 'ws')
	ct('===', tkns[6], 'op')
	ct('===', tkns[7], 'ws')
	ct('===', tkns[8], 'nb')
	ct('===', tkns[9], 'ws')
})

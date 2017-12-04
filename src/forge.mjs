//@ts-check
/**
 * @param {Array<{t,s}>} tokens
 * @param {Object} [scope]
 * @return {Object}
 */
export default function forge(tokens, scope) {
	var model = {
		inputs: [],
		yields: [],
		errors: 0,
		code: 'var arg=inputs||{};',
		modus: null
	}
	for (var i=0, left=true; i<tokens.length; ++i) {
		var tkn = tokens[i]
		switch (tkn.t) {
			case 'er': ++model.errors; break
			case 'nl': model.code += ';'; left = true; break
			case 'ws': model.code += ' '; break
			case 'eq': model.code += '='; left = false; break
			case 'arg.':
				var exist = model.inputs.indexOf(tkn.s) !== -1 || model.yields.indexOf(tkn.s) !== -1
				if (left) {
					if (exist) ++model.errors
					else model.yields.push(tkn.s)
				}
				else if (!exist) model.inputs.push(tkn.s)
			default: //eslint-disable-line no-fallthrough
				model.code += tkn.t[tkn.t.length-1] === '.' ? tkn.t+tkn.s : tkn.s
		}
	}
	if (!model.errors) model.modus = Function('inputs', model.code + ';return arg').bind(scope)
	return model
}

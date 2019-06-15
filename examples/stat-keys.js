/**
 * @param {Array<string>} tokens
 * @return {Array<string>}
 */
module.exports = function(tokens) {
	var xs = [],
			ys = []
	for (var i=1; i<tokens.length; ++i) {
		var tok = tokens[i]
		if (tok === 'x') xs.push(tokens[i-1])
		else if (tok === 'y') ys.push(tokens[i-1])
	}
	return {inputs: xs, yields: ys}
}

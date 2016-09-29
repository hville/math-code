var getNextToken = require('./get-token')

var forbidenRE = /\.prototype(?:\.|$)|\.window(?:\.|$)|\.self(?:\.|$)|\.process(?:\.|$)|\.constructor(?:\.|$)/


module.exports = tokenize
/**
 * Takes an expression (2+3) or assignment (y=m*x) string and returns and array of string tokens
 * Math methods are prepended with Math (eg. 'pow()'' => 'Math.pow()'')
 * Unknown variables are grouped into a named set (eg. 'y' => '$vars.y')
 *
 * @param {string} stringExpression - the equation to parse
 * @param {string} [argumentsName] - the name of the variable object
 * @return {Array<string>} - Array of tokens
 */
function tokenize(stringExpression, argumentsName) {
	var ctx = {
		functionName: '',
		source: stringExpression,
		tokens: [],
		argumentsName: argumentsName || '$argument'
	}

	while (ctx.source.length) {
		ctx.source = ctx.source.trim()
		var token = getNextToken(ctx)
		//if (token) source = source.slice(token.length)
		if (!token) return Error('unknown token at ' + (stringExpression.length - ctx.source.length))
		if (forbidenRE.test(token)) return Error('forbiden "'+forbidenRE.exec(token)[0]+'" token at ' + (stringExpression.length - ctx.source.length))
		ctx.tokens.push(token)
	}
	// remove assignment if any and set name
	if (ctx.tokens[1] === '=') {
		for (var i=0; i<ctx.argumentsName.length; ++i) {
			if (ctx.tokens[0][i] !== ctx.argumentsName[i]) return Error('illegal assignment at ' + (ctx.tokens[0].length+1))
		}
		ctx.functionName = ctx.tokens.shift().slice(ctx.argumentsName.length+1)
		ctx.tokens.shift() //remove the remaining assignment
	}
	ctx.source = stringExpression
	return ctx
}

var re = require('./reg-exp')

//dissalow dot operator and brackets
var forbidenRE = /\.prototype(?:\.|$)|\.window(?:\.|$)|\.self(?:\.|$)|\.process(?:\.|$)|\.constructor(?:\.|$)/

var tests = [
	extract(re.isNumeric),
	extract(re.isLiteral), // must be before functions and identifiers
	extract(re.isBitwise), // must be before logical
	extract(re.isLogical), // must be after bitwise
	extract(re.isNumbObj, function(ctx, t) { return 'Number.' + t }), //must be before Math (E vs EPSILON)
	extract(re.isMathObj, function(ctx, t) { return 'Math.' + t }), //must be after Number (E vs EPSILON)
	extract(re.isOperatr), // must be after functions
	extract(re.isVarName, function(ctx, t) { return ctx.argumentsName + '.' + t }), //must be after functions and constants,
	function assignmentTest(ctx) {
		// only a single assignment is allowed in second place. Will be checked on exit
		if (ctx.tokens.length === 1 && ctx.source[0] === '=') {
			ctx.source = ctx.source.slice(1)
			return '='
		}
	}
]

module.exports = getNextToken

function extract(regexp, xfo) {
	return function(ctx) {
		var res = regexp.exec(ctx.source)
		if (!res) return ''
		ctx.source = ctx.source.slice(res[0].length)
		return xfo ? xfo(ctx, res[0]) : res[0]
	}
}
//find the next token in the source
function getNextToken(ctx) {
	for (var i=0; i<tests.length; ++i) {
		var token = tests[i](ctx)
		if (token) return token
	}
}


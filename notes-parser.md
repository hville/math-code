PARSERS

SHUNTING Input: sin ( max ( 2 , 3 ) / 3 * 3.1415 ) => 2 3 max 3 / 3.1415 * sin => [[[[[2,3], max], 3], div], PI], pow], sin]
https://en.wikipedia.org/wiki/Shunting-yard_algorithm
While there are tokens to be read:
	Read a token.
	If the token is a number, then add it to the output queue.
	If the token is a function token, then push it onto the stack.
	If the token is a function argument separator (e.g., a comma):
		Until the token at the top of the stack is a left parenthesis, pop operators off the stack onto the output queue. If no left parentheses are encountered, either the separator was misplaced or parentheses were mismatched.
	If the token is an operator, o1, then:
		while there is an operator token o2, at the top of the operator stack and either
			o1 is left-associative and its precedence is less than or equal to that of o2, or
			o1 is right associative, and has precedence less than that of o2,
				pop o2 off the operator stack, onto the output queue;
		at the end of iteration push o1 onto the operator stack.
	If the token is a left parenthesis (i.e. "("), then push it onto the stack.
	If the token is a right parenthesis (i.e. ")"):
		Until the token at the top of the stack is a left parenthesis, pop operators off the stack onto the output queue.
		Pop the left parenthesis from the stack, but not onto the output queue.
		If the token at the top of the stack is a function token, pop it onto the output queue.
		If the stack runs out without finding a left parenthesis, then there are mismatched parentheses.
When there are no more tokens to read:
	While there are still operator tokens in the stack:
		If the operator token on the top of the stack is a parenthesis, then there are mismatched parentheses.
		Pop the operator onto the output queue.
Exit




PRATT
http://mathieuturcotte.ca/textes/vaughan-pratt-expose/
http://journal.stuffwithstuff.com/2011/03/19/pratt-parsers-expression-parsing-made-easy/
http://javascript.crockford.com/tdop/tdop.html

expr(k) {
	factor()
	while (next_token is an operator with precedence >= k) {
		consume()
		expr(k + 1)
	}
}
expr(k) {
	factor()
	while (next_token is an operator with precedence >= k) {
		token = consume()
		parseFn = get_parser_for_token(token)
		parseFn(token)
	}
}
// Multiplication, division.
public Expr factor() {
	Expr left = primary();
	if (lookAhead(TokenType.MULTIPLY)) {
		consume();
		Expr right = primary();
		return new MultiplyExpr(left, right);
	} else if (lookAhead(TokenType.DIVIDE)) {
		consume();
		Expr right = primary();
		return new DivideExpr(left, right);
	}

	// If we get here, there's no * or /.
	return left;
}
// Terminal expressions, literals, etc.
public Expr primary() {
	if (lookAhead(TokenType.NUMBER)) {
		return new NumberExpr(consume().numberValue);
	} else if (lookAhead(TokenType.STRING)) {
		return new StringExpr(consume().stringValue);
	}

	// If we get here, there's a syntax error.
	throw new ParseException("Unknown primary expression.");
}



Pratt's original formulation worked with functional languages in which everything is an expression
The heart of Pratt's technique is the expression function. It takes a right binding power that controls how aggressively it binds to tokens on its right.

function expression(rightBindingPower) {
		var left;
		var t = token;
		advance();
		left = t.nud();
		while (rbp < token.leftBindingPower) {
				t = token;
				advance();
				left = t.led(left);
		}
		return left;
}
.nud(null denotation): process literals, variables, and prefix operators. does not care about the tokens to the left. While (t0.rbp < t1.lbp) t.led(t1)
.led(left denotation): process infix and suffix operators
recursive. .nud and .led methods can call expression.
A token may have both: +V prefix->nud, V+V infix -> led

binding powers:
0	non-binding operators like ;
10	assignment operators like =
20	?
30	|| &&
40	relational operators like ===
50	+ -
60	* /
70	unary operators like !
80	. [ (

symbol("*", 60).led = function (left) {
		this.first = left;
		this.second = expression(60);
		this.arity = "binary";
		return this;
}

var infix = function (id, bp, led) {
		var s = symbol(id, bp);
		s.led = led || function (left) {
				this.first = left;
				this.second = expression(bp);
				this.arity = "binary";
				return this;
		};
		return s;
}

OTHER

SIZE, NOBABEL, NOES6, VARIABLE, CSTFCN
*fparser, NOLICENSE, 2y, 73, 447 lines (411 sloc)	12.9 KB var fObj = new Formula('2^x'), var result = fObj.evaluate({x: 3}), var results = fObj.evaluate([{x: 2},{x: 4},{x: 8}]); // results = [4,16,256] fObj.inverse = function(value){
		return 1/value; 4.4kbmin
} f4.getVariables()
happycalculator, 255, 5m, 25kb+lodash, addFormules({'name':$1 + $1}), no vars, 5.5kbm
*jsep, 3363, 1y, nodeps, .addBinaryOp("^", 10), =>AST, .addUnaryOp('@') .removeBinaryOp(">>>") 1kbg 4.3kbm 18kb
jseep
expression-parser 1y, 57, AST, ramdadep
complex-expression-parser, 5m, 94, nodeps, 31kbm
expression-parser-js, 5m, 27, nodeps, no rep? 32kb, 9kbm
math.js 421kbm
exp-parser 5m 24	parse(exp, {vars}) parse('sin(2)', {sin:Math.sin}, addBinaryOp, addUnaryOp,9kbm
jseep 4.3kbm
jexl 1w 544 13kbm
jseb 1y 183 AST=>JS jseb(jsep('a+1')); // 'a+1' 3kb
*jsepgen


AST:Abstract Syntax Tree

TEST a=sin(b)+c[0]
acorn: 112
espree: 112
esprima: 90
flow: 221
recast 221
shift: 187



JSEP
last(lowp)...first(highp)
'Compound',
	???
'Identifier' : [\$_A..Za..z]+[$_A..Za..z0..9]* => $1
'MemberExpression'
	computed:	id\[(*)\] => [MEC, $1, $2] => $1+'['+$2']'
	not comp: , A.B id\.id => [MEF, $1, $2] => $1+'.'+$2
'Literal', 2 'a' null true
	literals = {
		'true': true,
		'false': false,
		'null': null
	}
'ThisExpression',
'CallExpression',
	id(list) => [FC, $1, $2, $3] => $1+'('+$2+','+$3+')']
'UnaryExpression', [+-]B => [UE, $1, $2] => $1+$2
	unary_ops = {'-': t, '!': t, '~': t, '+': t}
'BinaryExpression', A[+-/*]B => [BE, $1, $2, $3] => $1+$2+$3
	binary_ops = {
			'||': 1, '&&': 2, '|': 3,	'^': 4,	'&': 5,
			'==': 6, '!=': 6, '===': 6, '!==': 6,
			'<': 7,	'>': 7,	'<=': 7,	'>=': 7,
			'<<':8,	'>>': 8, '>>>': 8,
			'+': 9, '-': 9,
			'*': 10, '/': 10, '%': 10
		}
'LogicalExpression',
		a && b and a || b are logical expressions
'ConditionalExpression', exp ? exp : exp => [EC, $1, $2, $3] => $1?$2:$3
'ArrayExpression'

IDENTIFIER: PREFIX+BODY*
ELEMENTS: EXPRESSION (,EXPRESSION)*
MEMBERN: IDENTIFIER(.IDENTIFIER)*
MEMBERC: IDENTIFIER[EXPRESSION]
FUNCTION: IDENTIFIER(LIST)



jseb.IDENTIFIER
jseb.ACCESSOR (extended)
jseb.MEMBER_EXP
jseb.LITERAL
jseb.THIS_EXP
jseb.CALL_EXP
jseb.UNARY_EXP
jseb.BINARY_EXP
jseb.LOGICAL_EXP
jseb.CONDITIONAL_EXP
jseb.ARRAY_EXP







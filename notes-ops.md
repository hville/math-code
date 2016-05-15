https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators
Operator type	Individual operators
member	. []
call / create instance	() new
negation/increment	! ~ - + ++ -- typeof void delete
multiply/divide	* / %
addition/subtraction	+ -
bitwise shift	<< >> >>>
relational	< <= > >= in instanceof
equality	== != === !==
bitwise-and	&
bitwise-xor	^
bitwise-or	|
logical-and	&&
logical-or	||
conditional	?:
assignment	= += -= *= /= %= <<= >>= >>>= &= ^= |=
comma	,

TESTS
 "2^-1^2^3", the returned expression tree takes precedence as ((2^(-1))^2)^3. But the expectation is 2^(-((1^2)^3)).
 A string literal containing "\" should be parsed to "\", but instead it gets parsed to "".
 2pi' is treated just like '2 pi' (with a compound
 https://github.com/soney/jsep/blob/master/test/tests.js
 1 * 2 + 3 != 1 * (2 + 3)
 1.2e3 === 1200

NOT SUPPORTED
{ object: 'Literal' }

change precedence
['!', '~'].forEach(jsep.removeUnaryOp);
['||', '&&', '|', '^', '&', '<<', '>>', '>>>'].forEach(jsep.removeBinaryOp);
['==', '!=', '===', '!==', '<', '>', '<=', '>='].forEach(jsep.removeBinaryOp);
jsep.addBinaryOp('^', 11)

http://www.ecma-international.org/ecma-262/5.1/#sec-11.3
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types
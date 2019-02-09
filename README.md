# math-code

*small and minimal math equation system parser*

[API](#api) • [Notes](#notes) • [License](#license)


## API

### types: Object

Map of available token type names (`nline`, `number`, `operator`, `assign`, `const`, `space`, `input`, `yield` and `error`).

Exmple: `types.error`


### chop(brief: string, scope: Object): [Token]

Parses the string with equations and returns an array of Tokens.

Example: `chop('x=3') === [['x', types.yield],['=', types.assign],['3', types.number]]`

if `scope` is specified, adds the scope keys as prefix to identifiers. Scope can be an `Object` (e.g. `Math`) or a list of keys (e.g. `Object.getOwnPropertyNames(Math)`)

Example: `chop('sin', {Math}) === [['sin', 'Math.']]`


### code(tokens: [Token]): string|Error

Creates safe javascript code from the token by adding prefix to identifiers. Retuns the empty string if any blacklisted tokens are encountered (Object.prototype keys, `[`, `]`, `"`, `.`, `'`)

Examples:

* `code(chop('x=sin(3)')) === 'i.x=i.sin(3)'`
* `code(chop('x=sin(3)', {Math, Number})) === 'i.x=Math.sin(3)'`
* `code(chop('new Worker')) === ''`
* `code(chop('Object.getPrototypeOf')) === ''`


### make(code: string): Function<Object => Object>|Error

Creates safe javascript function from the generated code. Return `null` if the function is invalid.
Examples:
`make(code(chop('y=cos(z);z=sin(y)'))({z:0}) === {z:0, y:1, x:0}`


## Notes

For security reasons, identifiers are prefixed (`x` => `y.x`) and tokens that can access object properties are invalid (`.[]"'`)
All new lines are converted to semicolons

The goal is to have a fast, safe and lightweight math equation parser to simplify the dynamic creation math function. For full javascript language parsers, consider the following:
* [Acorn](https://github.com/ternjs/acorn)
* [ESTree spec](https://github.com/estree/estree)
* [escodegen](https://github.com/estools/escodegen)
* [The new UglifyJS parser](https://github.com/mishoo/UglifyJS2)
* [Espree](https://github.com/eslint/espree)
* [Traceur](https://github.com/google/traceur-compiler)
* [Shift](https://github.com/shapesecurity/shift-parser-js)



## License

[MIT](http://www.opensource.org/licenses/MIT) © [Hugo Villeneuve](https://github.com/hville)

# todo

* match words except some (not?)
  `and(/[$_a-zA-Z0-9][$\w]*/, not('null'))`


fuse goals
* no args => original string (tree concat)
* error



```javascript
//[-]new apply [-] 3 calls!
if (this.constructor !== Any) return Any.apply(new Any, arguments))
//[-]new apply [-] 2 calls, !constructor
if (this.constructor !== Any) return Any.apply(Object.create(Any.prototype), arguments))
//[+]factory
return Object.create(Any.prototype)

//99 [+]all Rule Objects [~]new set prop
var A = any({kin: 'A'}),
    B = any({kin: 'B'}, A, 'b'),
    C = any(A, B, any('c'))
A.set('a')

//109 ? this.constructor === Any ? this : new Any
var A = any({kin: 'A'}),
    B = any({kin: 'B'}, A, 'b'),
    C = any(A, B, any('c'))
A.constructor('a')

//105 [+]current [~]vanillaObjects
var A = {kin: 'A'},
    B = any.call({kin: 'B'}, A, 'b'),
    C = any(A, B, any('c'))
any.call(A, 'a')

//107 [-]overwriteType [-](this.constructor !== Any ? Any.apply(new Any, arguments))
var A = Any(),
    B = Any({kin: 'B'}, A, 'b'),
    C = Any(A, B, Any('c'))
Any.call(A, 'a', {kin: 'A'})


//51 current [+] simple, short, weird
var value = {kin}
any.call(value, 'a', any('b'))

//56 current [+] simple, short, weird
var value = new Any
value.reset(kin, ['a', Any(['b'])])

//constructor [-] verbose, complex no constructor apply... Any.apply(Object.create(Any.prototype))
var value = new Any().kin(kin)
value.set('a', Any('b'))

//46 function [~] short, bind
var value = Any(kin)
value('a', Any()('b'))

//52 kinFirst [+] simple, short
var value = any(kin)
value.add('a', any('', 'b'))



var parse = init(
  words:{
    word: /[a-zA-Z]/,
    line: /[\r\n\f]+/,
    last: /./,
    _: /[\t ]+/
  },
  rules: {
    phrase = all('noun', 'verb', 'complement', kin()),
    noun = kin('word')
    name: all('name', all(kin('r')))
  },
  // skips: ['_'] TODO
)
var {list, tree, text} = parse('Ha Ha!')
```

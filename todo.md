# todo

## Input

```javascript
  N(12, 34, a, b, c)
```

## Output

```javascript
function(x) {
  x.a = this[0]()
  x.b = this[0]()
  x.c = this[0]()
  this[2](x)
  return x
}.bind([
  Z,
  N(12, 34),
  function(x) { return this[1]( this[0]() + x.a + x.b + x.c / 4 ) }
], {})
```

* [+] easy bind
* [+] no creative numbers
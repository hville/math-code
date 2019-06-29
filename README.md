<!-- markdownlint-disable MD036 MD041 -->

# math-code

*small and minimal math equation system parser*

[Example](#example) • [Syntax](#syntax) • [ToDo](#todo) • [License](#license)

## Example

```javascript
make(`
wage = L(45, 55, city, work)
rent = L(15, 25, city)
cost = L(15, 20, city, work)

save = pow(wage - rent - cost, 1 + N(1,2)%)
`)() // => { wage, rent, cost, save }
```

## Syntax

Syntax is the same as Javascript with the following exceptions:

* Object properties (`a[0]`, `a.x`) are not permitted
* Variable names `prototype`, `toString`, `constructor`, `valueOf`, `toLocaleString` are not permitted
* Variables are automatically declared. No variable declaration (`var a`)
* Percent sign (`%`) is converted to `/100`
* All `Math` functions (`cos`, `log`, ...) and values (`PI`, ...) are global, along with the following random function generators.
  * `Z()` => random unit normal number
  * `N(low, high [, ...risk factors])` => random normal number, 50% of times between low and high
  * `L(low, high [, ...risk factors])` => random lognormal number, 50% of times between low and high
  * `W(low, high [, ...risk factors])` => t => random normal number sum
  * `R(low, high [, ...risk factors])` => t => random normal number product
* random number generators can have additional risk factor seeds for corrolated variables

## ToDo

* [ ] test negative correlation
* [ ] add and test dice `D(low, high)`
* [ ] split immutable global `Math`, `GM` from mutable context `{risk, 0, 1}`
* [ ] build immutable global once
* [ ] iter(`y = Math.cos(Modo.N(1,1))`, Math, Modo)
* [?] `y = Init(1)` | `Init.y = 1` for run-once recursive
* [?] allow `prototype` by using `hasOwnProperty`
* [ ] step(low, high) at 50% dice(low, high) at 50%

## Workings

For the given input...

```javascript
  random = N(12, 34, a, b, c)
```

...the following function is compiled

```javascript
function(v) {
  this.a = this.Z()
  this.b = this.Z()
  this.c = this.Z()
  v.random = this[1]()
  return v
}.bind({Z: require('random-z'), N: require('grosso-modo').norm: , cos: Math.cos, //...and more
  0: N(12, 34),
  1: function() { return this[0]( this.Z() + this.a + this.b + this.c / 4 ) }
}, {v: 1})
```

## License

[MIT](http://www.opensource.org/licenses/MIT) © [Hugo Villeneuve](https://github.com/hville)

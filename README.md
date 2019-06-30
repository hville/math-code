<!-- markdownlint-disable MD036 MD041 -->

# math-code

*small and minimal math equation system parser*

[Example](#example) • [Syntax](#syntax) • [Workings](#workings) • [ToDo](#todo) • [License](#license)

## Example

```javascript
make(`
wage = L(45, 55, city, work)
rent = L(15, 25, city)
cost = L(15, 20, city, -work) //work less, spend more!

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
* Random number generators can have additional risk factor unit normal seeds for corrolated variables. For simplicity, the independent portion counts as one. For example, `X = N(low, high, riskA, riskB)` generates a random number from the unit normal seed `z = ( Z() + riskA + riskB ) / 3`

## Workings

For the given input string:

```javascript
  random = N(12, 34, a, b, c)
```

the following code gets compiled:

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

## ToDo

* [ ] test negative correlation
* [?] allow inline comments
* [?] return to Math namespace to avoid blocking common variable names (max, min, ...)
* [?] `y = Init(1)` | `Init.y = 1` for run-once recursive
* [?] allow `prototype` by using `hasOwnProperty`

## License

[MIT](http://www.opensource.org/licenses/MIT) © [Hugo Villeneuve](https://github.com/hville)

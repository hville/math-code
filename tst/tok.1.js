var ct = require('cotest')

function Three() {
	if (this.constructor !== Three) return Three.apply(new Three, arguments)
	if (!this.ops) this.ops = []
	for (var i=0; i<arguments.length; ++i) this.ops[this.ops.length] = arguments[i]
	return this
}

console.log('Three', 218, 4, '[-]if:8', Three(1,2,3).constructor(4,5,6).ops)

function share() {
	return setit.apply(new Share(setit), arguments)
}
function Share(set) {
	this.ops = []
	this.set = set
}
function setit() {
	for (var i=0; i<arguments.length; ++i) this.ops[this.ops.length] = arguments[i]
	return this
}

console.log('share', 239, '1+1+1+1', '[+]if:0', share(1,2,3).set(4,5,6).ops)






function one11() {
	return One11.prototype.set.apply(new One11, arguments)
}
function One11() {
	this.ops = []
}
One11.prototype.set = function() {
	for (var i=0; i<arguments.length; ++i) this.ops[this.ops.length] = arguments[i]
	return this
}

console.log('One11', 243, '1+1+1+1', '[+]if:0', one11(1,2,3).set(4,5,6).ops)


var prop = {
	ops: {value: []}
}
var proto = {
	constructor: Two_C
}
function Two_C() {
	if (this.constructor !== Two_C) return Two_C.apply(Object.create(proto, prop), arguments)
	for (var i=0; i<arguments.length; ++i) this.ops[this.ops.length] = arguments[i]
	return this
}

console.log('Two_C', 274, '3+1', '[~]if:3', Two_C(1,2,3).constructor(4,5,6).ops)

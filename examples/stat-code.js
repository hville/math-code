var mathKeys = new Set(Object.getOwnPropertyNames(Math))

module.exports = {
	percent: function() { return '/100' },
	id: function(txt) { return this.err ? new Error('Unexpected token ' + txt) : mathKeys.has(txt) ? 'Math.' + txt : 'i.' + txt}
}

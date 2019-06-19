var text = require('../tok')

module.exports = function() {
	var def = this.def
	for (var i=0; i<arguments.length; ++i) {
		var arg = arguments[i]
		def[def.length] = arg.isRule ? arg : text(arg)
	}
	return this
}

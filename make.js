/**
 * @param {string} code
 * @return {Function|Error}
 */
module.exports = function(code) {
	try {
		return code.constructor === Error ? code : Function('i', 'if (!i) i={};' + code + ';return i')
	}
	catch (e) {
		return e
	}
}


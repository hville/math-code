/**
 * @param {string} code
 * @return {Function}
 */
module.exports = function(code) {
	try {
		return code ? Function('i', 'if (!i) i={};' + code + 'return i') : null
	}
	catch (e) {
		return null
	}
}


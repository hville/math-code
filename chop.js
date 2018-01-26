var split = require('./src/split'),
		check = require('./src/check')

/**
 * @param {string} brief
 * @param {Object} [scope]
 * @return {Array<Array<string>>}
 */
module.exports = function(brief, scope) {
	return check(split(brief, scope))
}

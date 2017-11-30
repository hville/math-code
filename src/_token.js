//@ts-check
module.exports = Token

/**
 * @constructor
 * @param {string} text
 * @param {string} type
 */
function Token(text, type) {
	this.text = text
	this.type = type
}
Token.prototype = {
	constructor: Token,
	/**
	 * @return {string}
	 */
	get code() {
		return !this.type ? this.text : this.type === '$space' ? ' ' : this.type + '.' + this.text
	}
}

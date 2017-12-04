//@ts-check
import split from '../src/split.mjs'
import check from '../src/check.mjs'

/**
 * @param {string} brief
 * @param {object} [scope]
 * @return {Array<{t, s}>}
 */

export default function parse(brief, scope) {
	return check(split(brief, scope))
}

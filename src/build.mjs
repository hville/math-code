//@ts-check
import split from '../src/split.mjs'
import check from '../src/check.mjs'
import forge from '../src/forge.mjs'

/**
 * @param {string} brief
 * @param {object} [scope]
 * @return {Array<{t, s}>}
 */
export default function build(brief, scope) {
	return forge(check(split(brief, scope)), scope)
}

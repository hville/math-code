function htmlRed(html, itm) {
	var txt = itm.txt
	if (txt) return html + (itm.err ? '<u>'+txt+'</u>' : itm.kin === 'yID' ? '<b>'+txt+'</b>' : itm.kin === 'xID' ? '<i>'+txt+'</i>' : txt)
	if (itm.err) {
		txt = itm.fold(htmlRed, '')
		return html + (/<u>/.test(txt) ? txt : txt.replace(/[^]$/, '<u>$&</u>'))
	}
	return itm.fold(htmlRed, html)
}

module.exports = htmlRed.bind(null, '')

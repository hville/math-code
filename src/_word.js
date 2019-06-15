module.exports = Word

function Word(kin, i, txt, err) {
	this.kin = kin
	this.i = i
	this.txt = txt
	this.j = i+txt.length
	this.err = err
}

Word.prototype.fuse = function(xfos) {
	var fcn = xfos && xfos[this.kin]
	return fcn ? fcn.call(this, this.txt) : this.txt
}

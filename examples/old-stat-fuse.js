var HTML = {
			'': function(alt) { return alt[0] === '<' ? alt : this.err ? '<u>'+alt+'</u>' : alt},
			id: function(alt) { return this.err ? '<u>'+alt+'</u>' : '<i>'+alt+'</i>'}
		},
		CODE = {
			percent: function() { return '/100' },
			id: function(txt) { return this.err ? new Error('Unexpected token ' + txt) : mathKeys.has(txt) ? 'Math.' + txt : 'i.' + txt},
			random: function(txt) { return this.err ? new Error('Unexpected token ' + txt) : '666'}
		}


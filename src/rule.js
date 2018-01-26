/*eslint-disable no-useless-escape*/
module.exports = /((?:\d*\.\d+|\d+)(?:[E|e][+|-]?\d+)?)|([.[\]{}'"]|[+\-\/*%&|^]=|\+{2}|-{2}|>{2,3}=|<{2}=|prototype|toString|constructor|valueOf|toLocaleString)|((?:NaN|Infinity|true|false|null)(?![_$A-Za-z0-9]*))|([_$A-Za-z][_$A-Za-z0-9]*)|([<>]=|&{1,2}|\|{1,2}|={1,3}|!={0,2}|\*{1,2}|<{1,2}|>{1,3}|[?\-+%~^\/?,:()])|(\s*[\n\r;])|(\s+)|([\s\S])/g

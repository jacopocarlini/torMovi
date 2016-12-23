var Readable = require('stream').Readable;

function readable () {
  var n = 100;
  var nsjrs = new Readable();
  nsjrs._read = function _read () {
    if (n--)
      nsjrs.push('{"this":"is","js":"on"}\n');
    else
      nsjrs.push(null);
  }
  return nsjrs;
}

module.exports = readable;

var util = require('util');
var Transform = require('stream').Transform;
util.inherits(Stringifier, Transform);

function Stringifier(options) {
  if (!options)
    options = {};

  if (!(this instanceof Stringifier))
    return new Stringifier(options);

  Transform.call(this, options);
  this._writableState.objectMode = true;
  this._readableState.objectMode = false;
}

Stringifier.prototype._transform = function(chunk, encoding, done) {
  this.push(JSON.stringify(chunk)+'\n');
  done();
};

module.exports = Stringifier;

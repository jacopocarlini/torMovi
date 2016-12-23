var test = require('tap').test;
var Parser = require('../').Parser;
var Stringifier = require('../').Stringifier;
var PassThrough = require('stream').PassThrough;
var readable = require('./mocks/readable');
var stream2buffer = require('stream2buffer');

var expectedFinalBuffer;
test('the mock readable stream works', function (t) {
  var nsjrs = readable();
  stream2buffer(nsjrs, function (err, buffer) {
    t.equal(err, null);
    buffer = buffer.toString();
    t.equal(buffer.split(/\n/).length, 101, 'has 100 lines/objects');
    expectedFinalBuffer = buffer;
    t.end();
  });
});

test('parses and stringifies', function (t) {
  var parser = new Parser();
  var nsjrs = readable();
  nsjrs.pipe(parser);

  var parsedLines = 0;
  parser.on('data', function (data) {
    parsedLines++;
  });

  var stringifier = new Stringifier();
  parser.pipe(stringifier);

  var through = new PassThrough();
  stringifier.pipe(through);

  stream2buffer(through, function (err, buffer) {
    t.equal(err, null);
    t.equal(parsedLines, 100);
    t.equal(buffer.toString(), expectedFinalBuffer);
    t.end();
  });
});

test('parse produces useful error messages', function (t) {
  var parser = new Parser();
  parser.on('error', function (err) {
    var m = err.message;
    t.ok(m.indexOf('Unexpected token E') > -1, "contains original");
    t.ok(m.indexOf('Error:\\nhere\\nbe\\nstack') > -1, "contains context");
    t.ok(m.indexOf('day') == -1, "excludes previous");
    t.end();
  });
  parser.write('"one"\n"day"\nError:\nhere\nbe\nstack');
});

test('converts nulls and undefineds to false', function (t) {
  var parser = new Parser();
  parser.on('data', function (data) {
    t.ok(data === false);
    t.end();
  });
  parser.write('null\n');
});

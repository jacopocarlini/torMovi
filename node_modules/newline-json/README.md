# newline-json

Just like [JSONStream](https://github.com/dominictarr/JSONStream),
but instead of streaming valid JSON arrays, it streams new-line separated
JSON objects.

**It requires browserify 3.x from 0.1 upwards, versions 0.0.x are compatible with browserify 2.x.**

## Example

If you have a readable stream like

```js
var n = 100;
var nlj = new Readable();
nlj._read = function _read () {
  if (n--)
    nlj.push('{"this":"is","js":"on"}\n'); // new-line separated JSON!
  else
    nlj.push(null);
}
return nlj;
```

you can pipe it to the parser

```js
var Parser = require('newline-json').Parser;
var parser = new Parser();
nlj.pipe(parser);
```

what comes out of the parser will be the the objects you piped to it, parsed.
You can pipe those again to the stringifier:

```js
var Stringifier = require('newline-json').Stringifier;
var stringifier = new Stringifier();
parser.pipe(stringifier);
```

And if you have nothing better to do today, be sure to try

```js
parser.pipe(stringifier);
stringifier.pipe(parser);
```

## Why ?

Couldn't find one on npm that used the
[`Transform`](http://nodejs.org/api/stream.html#stream_class_stream_transform_1),
and IMO if you don't need to parse complex object paths, then you'd be better off
using a new-line separated JSON. Also, it's probably much easier to write parsers
like this in other languages and environments, which is good if your stack is
not 100% node.js.

# galago
`galago` /ɡəˈleɪɡoʊz/ is a set of very specific, opinionated helper functions for functional-like programming in js. It’s also the name of [this animal.](https://en.wikipedia.org/wiki/Galago)

🚧 Work in progress, but feel free to:
```bash
yarn add galago
# or
npm install galago --save
```
Or grab the source from `src/index.js` or `lib/index.js` (ES2015) and pluck it into your codebase as vendor code. The world is your oyster. `¯\_(ツ)_/¯`

## `compose` and `composeAsync`

Both of these functions recursively reduce an a array of functions by being a typical compose function / pipe mechanism. You can terminate the mechanism early by suppyling a `reduced?` function which check the output at each step.

Both functions accept the same three parameters:

* `@param {*} — used to provide the initial value
* `@param {array<Function>} fns` — array of function to execute
* `@param {?function} reducedFn` — optional function with signature `fn(x: Any): Boolean`; if returning true, exits the call and returns the last result

`compose` returns `{*}` (whatever you want), while `composeAsync` returns a `{Promise}`.

**Important note:**  the functions supplied to `composeAsync` don’t all have to be async/Promises — you can mix and match!

**Usage example for `compose`**

```javascript
const transducer = (data) =>
  compose(
    data,
    [fn1, fn2, fn3, fn4, … fnX]
  );
```

[Full explenation and code here.](https://github.com/filipdanic/galago/blob/master/example/transducer.js)

You can also clone the repo and run `yarn run example:transducer` to run this sample code.


**Usage example for `composeAsync`**

```javascript
const fakeHttpEndpoint = (requestBody) =>
  composeAsync(
    requestBody, // acc param
    [ // list of functions
      parse,
      validate,
      transform,
      saveToDb,
    ],
    isReduced // reducedFn param
  );
```

[Full explenation and code here.](https://github.com/filipdanic/galago/blob/master/example/fakeHttp.js)

You can also clone the repo and run `yarn run example:fakeHttp` to run this sample code.

## `branch2`

_🚧 TODO 🚧_

## `branchMultiple`

_🚧 TODO 🚧_

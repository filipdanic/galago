# galago
`galago` /ɡəˈleɪɡoʊz/ is a set of very specific, opinionated helper functions for functional-like programming in js. It’s also the name of [this animal.](https://en.wikipedia.org/wiki/Galago)

## `reduceFns`

 Recursively reduces an a array of functions (which can even be async) by being a typical compose function / pipe mechanism. It stops reducing the supplied arguments if one of the functions returns the specified error key in it’s response.

**Info:**

* @param {string} acc
* @param {exitProp} exitProp
* @param {array<Function>} fns
* @returns {Promise}

**Usage example:**

```javascript
const fakeHttpEndpoint = (requestBody) =>
  reduceFns(
    requestBody,
    'errors',
    [
      parse,
      validate,
      transform,
      saveToDb,
    ]
  );
```

[Full explenation and code here.](https://github.com/filipdanic/galago/blob/master/example/fakeHttp.js)

You can also clone the repo and run `yarn run example:fakeHttp` to run this sample code.

## `branch2`

_🚧 TODO 🚧_

## `branchMultiple`

_🚧 TODO 🚧_

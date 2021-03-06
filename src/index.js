/**
 * @fileoverview
 * @author Filip Danić
 *
 * This file exports the functions:
 *  - composeAsync
 *  - branch2
 *  - branchMultiple
 */

/*
 * compose and composeAsync
 *
 * Recursively reduce an a array of functions. In essance this is a
 * compose functions similar to:
 * (...fns) => x => fns.reduceLeft((v, f) => f(v), x);
 * but it comes with a reducedFn argument that lets you terminate early
 * with the result that was generated so far.
 *
 * the composeAsync function wraps everything in a Promise, even if some of
 * the function arguments are not async themselves.
*/

/**
 *
 * @param {*} acc
 * @param {array<Function>} fns
 * @param {?function} reducedFn
 * @returns {*}
 */
const compose = (acc, fns, reducedFn) => {
  if ((typeof reducedFn === 'function' && reducedFn(acc)) || fns.length === 0) {
    return acc;
  } else {
    return compose(fns[0](acc), fns.slice(1), reducedFn);
  }
};

/**
 *
 * @param {*} acc
 * @param {array<Function>} fns
 * @param {?function} reducedFn
 * @returns {Promise}
 */
const composeAsync = (acc, fns, reducedFn) => new Promise((resolve) => {
  if ((typeof reducedFn === 'function' && reducedFn(acc)) || fns.length === 0) {
    resolve(acc);
  } else {
    Promise
      .resolve(fns[0](acc))
      .then(x => resolve(composeAsync(x, fns.slice(1), reducedFn)));
  }
});

/**
 * Branch into two
 * @param {Function|boolean} cond
 * @param {Function} fn1
 * @param {Function} fn2
 */
const branch2 = (cond, fn1, fn2) => {
  if (typeof cond === 'boolean') {
    return cond ? fn1 : fn2;
  } else {
    return cond() ? fn1 : fn2;
  }
};

/**
 * Returns fn corresponding to key in fnMap
 * based on output of cond fn
 * @param {Function} cond
 * @param {Object} fnMap
 */
const branchMultiple = (cond, fnMap) => fnMap[cond()];

exports.compose = compose;
exports.composeAsync = composeAsync;
exports.branch2 = branch2;
exports.branchMultiple = branchMultiple;

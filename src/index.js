/**
 * @fileoverview
 * @author Filip Danić
 *
 * This file exports the functions:
 *  - reduceFns
 *  - branch2
 *  - branchMultiple
 */

/**
 * Recursively reduces an a array of functions. In essance this is a
 * compose functions similar to:
 * (...fns) => x => fns.reduceLeft((v, f) => f(v), x);
 * but it comes with an opinonated and quircky implementation specific
 * to web development.
 *
 * @param {string} acc
 * @param {exitProp} exitProp
 * @param {array<Function>} fns
 * @returns {Promise}
 */
const reduceFns = (acc, exitProp, fns) => new Promise((resolve) => {
  if (acc[exitProp] || fns.length === 0) {
    resolve(acc);
  } else {
    Promise
      .resolve(fns[0](acc))
      .then(x => resolve(reduceFns(x, exitProp, fns.slice(1))));
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

exports.reduceFns = reduceFns;
exports.branch2 = branch2;
exports.branchMultiple = branchMultiple;
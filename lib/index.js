'use strict';

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
var reduceFns = function reduceFns(acc, exitProp, fns) {
  return new Promise(function (resolve) {
    if (acc[exitProp] || fns.length === 0) {
      resolve(acc);
    } else {
      Promise.resolve(fns[0](acc)).then(function (x) {
        return resolve(reduceFns(x, exitProp, fns.slice(1)));
      });
    }
  });
};

/**
 * Branch into two
 * @param {Function|boolean} cond
 * @param {Function} fn1
 * @param {Function} fn2
 */
var branch2 = function branch2(cond, fn1, fn2) {
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
var branchMultiple = function branchMultiple(cond, fnMap) {
  return fnMap[cond()];
};

exports.reduceFns = reduceFns;
exports.branch2 = branch2;
exports.branchMultiple = branchMultiple;
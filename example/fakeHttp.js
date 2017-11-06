/**
 * @fileoverview
 * @author Filip Danić
 *
 * This example demonstrates a “fake HTTP” endpoint setup
 * where you have to do the most mundane task of all:
 * (1) parse the body,
 * (2) validate the data,
 * (3) transform it, and
 * (4) save it to a DB
 *
 * Each of the these steps can fail, and might be async. The function at the bottom called
 * `fakeHttpEndpoint` shows how you can use the reduceFns utility to easily
 * compose all of these steps and allow each of them to fail gracefuly with an
 * error message that can be forwarded to the client.
 *
 * This is a simple, but real-world example of composing functions.
 */


const reduceFns = require('../src/index').reduceFns;
const chalk = require('chalk');
const log = console.log;
const error = chalk.bold.red;
const success = chalk.bold.green;

/**
 * Used to parse (1)
 * @param {*} str
 * @returns {Object}
 */
const parse = (str) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    return { errors: [{ code: 0, message: 'Error.Parse.NotValid' }] };
  }
};

/**
 * (2) used to validate
 * @param {*} collection
 * @returns {boolean}
 */
const isEmptyCollection = (collection) =>
  !(Array.isArray(collection) && collection.length > 0);

/**
 * (2) used to validate
 * @param {*} bool
 * @returns {boolean}
 */
const isNonBool = (bool) => typeof bool !== 'boolean';

/**
 * (2) used to validate
 * @param {Object} obj
 * @returns {Object}
 */
const validate = (obj = {}) => {
  const { collection, bool } = obj;
  const errors = [];
  if (isEmptyCollection(collection)) {
    errors.push({ code: 1, message: 'Error.Validate.Collection.Empty' });
  }
  if (isNonBool(bool)) {
    errors.push({ code: 2, message: 'Error.Validate.Bool.Missing' });
  }
  return errors.length > 0 ? { errors } : obj;
}

/**
 * (3) used to transform
 * @param {Object} obj
 * @returns {Object}
 */
const transform = (obj, val) => Object.assign(
  {},
  obj,
  {
    collection: obj.collection
      .filter(x => x > 0)
      .map(x => x * val),
    meta: {
      prevLength: obj.collection.length,
      time: new Date().toJSON(),
    },
  }
);

/**
 * (4) used to save to DB
 * @param {Object} obj
 * @returns {Promise}
 */
const saveToDb = (obj) => new Promise((resolve) => {
  setTimeout(() => {
    if (obj.bool) {
      resolve(200);
    } else {
      resolve({
        errors: [{
          code: 3,
          message: 'Error.Db.SaveToDb.ConnectionTimeout',
        }],
      });
    }
  }, 1000);
});

/**
 * Example of simple function composition
 * @param {string} requestBody
 * @returns {Promise}
 */
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

/**
 * Tests
 */

fakeHttpEndpoint(JSON.stringify({ collection: [1, 2, 3], bool: true })).then((res) => {
  if (res === 200) {
    log(success('✔ Should equal 200 response code (Code: 200)'));
  } else {
    log(error('❌ Should equal 200 response code (Code: 200)'));
  }
});

fakeHttpEndpoint('fail').then((res) => {
  if (res.errors[0].message === 'Error.Parse.NotValid') {
    log(success('✔ Should fail at parsing step (Error: Error.Parse.NotValid)'));
  } else {
    log(error('❌ Should fail at parsing step (Error: Error.Parse.NotValid)'));
  }
});

fakeHttpEndpoint(JSON.stringify({ bool: true })).then((res) => {
  if (res.errors[0].message === 'Error.Validate.Collection.Empty') {
    log(success('✔ Should fail at validation of collection rule (Error: Error.Validate.Collection.Empty)'));
  } else {
    log(error('❌ Should fail at validation of collection rule (Error: Error.Validate.Collection.Empty)'));
  }
});

fakeHttpEndpoint(JSON.stringify({ collection: [1, 2, 3] })).then((res) => {
  if (res.errors[0].message === 'Error.Validate.Bool.Missing') {
    log(success('✔ Should fail at validation of boolean rule (Error: Error.Validate.Bool.Missing)'));
  } else {
    log(error('❌ Should fail at validation of boolean rule (Error: Error.Validate.Bool.Missing)'));
  }
});

fakeHttpEndpoint(JSON.stringify({})).then((res) => {
  if (res.errors.length === 2) {
    log(success('✔ Should fail at both validation rules (2 errors)'));
  } else {
    log(error('❌ Should fail at both validation rules (2 errors)'));
  }
});

fakeHttpEndpoint(JSON.stringify({ collection: [ 1, 2, 3 ], bool: false })).then((res) => {
  if (res.errors[0].message === 'Error.Db.SaveToDb.ConnectionTimeout') {
    log(success('✔ Should fail when saving to DB (Error: Error.Db.SaveToDb.ConnectionTimeout)'));
  } else {
    log(error('❌ Should fail when saving to DB (Error: Error.Db.SaveToDb.ConnectionTimeout)'));
  }
});

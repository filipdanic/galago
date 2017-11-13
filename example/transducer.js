/**
 * @fileoverview
 * @author Filip Danić
 *
 * This example demonstrates a transducer which will
 * take some data, do some filtering, apply defaults, and
 * perform some BI logic to transform results.
 *
 * This is a simple, but real-world example of composing
 * transformations to reach a final data structure.
 */

const compose= require('../src/index').compose;
const chalk = require('chalk');
const log = console.log;
const initial = chalk.bold.gray;
const transformed = chalk.bold.green;

/**
 * Task:
 *  1. Filter out all vehicles in “Showroom”
 *  2. All Model names should be UPPERCASE
 *  3. Add a new field “makeModel“
 *  4. Apply location “In Transit” as a default if one does not exist
 *  5. Change year to integer
 *  6. Sort collection by year
 */

// initial data
const vehicles = [
  { id: 'ae4a21f49de2', make: 'Lexus', model: 'CT', year: '2012', location: 'Workshop' },
  { id: 'a6e1b8be0189', make: 'Fiat', model: '500', year: '2012', location: 'Workshop' },
  { id: '2c8f2fe7df13', make: 'Hyundai', model: 'Azera', year: '2011', location: 'Workshop' },
  { id: 'caa913fe20a4', make: 'Hyundai', model: 'Genesis Coupe', year: '2010', location: 'Showroom' },
  { id: '6e6cb3207138', make: 'Acura', model: 'ZDX', year: '2011', location: 'Showroom' },
  { id: 'adf638096542', make: 'Nissan', model: 'Cube', year: '2011', location: undefined },
  { id: 'f5af63bffc6d', make: 'Dodge', model: 'Caravan', year: '2008', location: undefined },
  { id: '5bf8d072696d', make: 'Alfa Romeo', model: 'Romeo', year: '1993', location: 'Parking A' },
  { id: '1151dfa0b2c0', make: 'Toyota', model: 'Tercel', year: '1993', location: 'Parking A' },
  { id: '856039f0ff26', make: 'Toyota', model: 'Celica', year: '1976', location: 'Parking B' },
];

// transformation
// **obviously** all of the anonymous higher-order functions
// can be extracted to make the code more reausable or clean.
// for the purposes of the demo this is alright

const newVehicles = compose(
  vehicles, // initial value
  [
    (x) => x.filter(_ => _.location !== 'Showroom'),
    (x) => x.map(_ => Object.assign({}, _, { model: _.model.toUpperCase() })),
    (x) => x.map(_ => Object.assign({}, _, { makeModel: `${_.make} ${_.model}` })),
    (x) => x.map(_ => Object.assign({}, _, { location: _.location ? _.location : 'In Tranist' })),
    (x) => x.map(_ => Object.assign({}, _, { year: parseInt(_.year, 10) })),
    (x) => x.sort((left, right) => left.year - right.year)
  ]
);

log(initial('Initial data:'));
log(initial(JSON.stringify(vehicles)));

log(transformed('\nTransformed data:'));
log(transformed(JSON.stringify(newVehicles)));

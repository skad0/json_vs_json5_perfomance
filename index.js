'use strict';

const Benchmark = require('benchmark');
const JSON5 = require('json5');

const sample = require('fs').readFileSync(__dirname + '/examples/project-stub.json', 'utf8');
const parseSample = JSON.stringify(sample);
const stringifySample = require('node-eval')(`module.exports = ${sample};`);

const suite = new Benchmark.Suite;
const parsers = {
    JSON5: JSON5.parse,
    JSON: JSON.parse
};
const stringifiers = {
    JSON5: JSON5.stringify,
    JSON: JSON.stringify
};

function addSuites(suite, functions, fnName, sample) {
    for (let name in functions) {
        suite.add(`${name}#${fnName}`, () => functions[name](sample));
    }
}

addSuites(suite, parsers, 'parse', parseSample);
addSuites(suite, stringifiers, 'stringify', stringifySample);

suite
    .on('cycle', event => console.log(String(event.target)))
    .run();

// NPM Packages
const chai = require('chai');
const expect = chai.expect;

// Util functions being tested
const { uniqsPerMonth, totalConvertsPerInitiative, findLowestCPM, findTotalCPV } = require('../js/utils');




// +++ MOCKS +++  MOCKS +++  MOCKS +++  MOCKS +++  MOCKS +++  MOCKS +++  MOCKS +++  MOCKS +++ //


const csv1 = JSON.parse(JSON.stringify([ { "campaign"    : "fish_cow_desert",
    "date"        : "2015-05-01",
    "spend"       : "100",
    "impressions" : "1621",
    "actions"     : "[{ \"x\": 1, \"action\": \"conversions\" }, { \"y\": 1, \"action\": \"views\" }, { \"action\": \"views\", \"b\": 10 }]" },
  { "campaign"    : "fish_cow_desert",
    "date"        : "2015-05-01",
    "spend"       : "100",
    "impressions" : "1621",
    "actions"     : "[]" },
  { "campaign"    : "plants_cow_moon",
    "date"        : "2015-01-01",
    "spend"       : "100",
    "impressions" : "1621",
    "actions"     : "[{ \"x\": 1, \"action\": \"conversions\" }, { \"y\": 1, \"action\": \"views\" }, { \"action\": \"conversions\", \"y\": 10 },  { \"action\": \"conversions\", \"b\": 10 }, { \"action\": \"views\", \"b\": 10 }]" },
  { "campaign"    : "fish_cow_desert",
    "date"        : "2015-01-01",
    "spend"       : "100",
    "impressions" : "1621",
    "actions"     : "[{ \"x\": 1, \"action\": \"conversions\" }]" } ]));

const csv2 = JSON.parse(JSON.stringify([ { "campaign"    : "cow_moon_plants",
    "object_type" : "video" },
  { "campaign"    : "fish_desert_cow",
    "object_type" : "photo" } ]));




// +++ TESTS +++  TESTS +++  TESTS +++  TESTS +++  TESTS +++  TESTS +++  TESTS +++  TESTS +++ //


describe('Utils function tests', function () {

    // How many unique campaigns ran in February?
    it('Correctly filters out the number of unique campaigns per month', function(){
        expect(uniqsPerMonth(csv1, '05')).to.equal(1);
    });

    // What is the total number of conversions on plants?
    it('Finds the total number of conversions on plants', function(){
        totalConvertsPerInitiative(csv1, 'plants', ['x', 'y'])
        .then(numConversions => expect(numConversions).to.equal(11))
        .catch(console.error);
    });

    // What audience, asset combination had the least expensive conversions?
    it('Correctly filters out the number of unique campaigns per month', function(){
        findLowestCPM(csv1, ['x', 'y'])
        .then(combo => expect(combo).to.deep.equal(['cow', 'moon']))
        .catch(console.error)
    });

    // What was the total cost per video view?
    it('Correctly filters out the number of unique campaigns per month', function(){
        findTotalCPV(csv1, ['x', 'y'], csv2, 'video')
        .then(totalCPV => expect(totalCPV).to.equal(100))
        .catch(console.error)
    });
});

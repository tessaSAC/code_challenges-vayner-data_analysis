const fs = require('fs');
const neatCsv = require('neat-csv');
const { uniqsPerMonth, totalConvertsPerInitiative, findLowestCPM, findTotalCPV } = require('./utils');

let numsUnique,
	numPlantConversions,
	cheapestCampaign,
	totalCPV;

// get data from csv1:
fs.readFile(`${ __dirname }/../files/source1.csv`, function (err, data) {
	if (err) console.err(`Warning: ${ err }`);

	// Returns a promise for an array with the parsed CSV.
	neatCsv(data).then(data => {
		// Returns number of unique campaigns
			// Function signature: csv file, desired month
	    numsUnique = uniqsPerMonth(data, '02').size;

	    // Returns number of conversions in an initiative
	    	// Function signature: csv file, initiative's name, array of desired action types
	    // return Promise.all([totalConvertsPerInitiative(data, 'plants', ['x', 'y'])]);

	    // Returns lowest CPM
	    	// Function signature: data, array of desired action types
	    // return findLowestCPM(data, ['x', 'y']);

	    fs.readFile(`${ __dirname }/../files/source2.csv`, function (err, data2) {
	    	neatCsv(data2).then(data2 => {
	    		return findTotalCPV(data, ['x', 'y'], data2, 'video');
	    	}).then(console.log);
	    })
	})
	.then((data) => {
		// console.log(data)
		// console.log(numsUnique); // TODO: add numsUnique with action types `x` and `y`
		// console.log(numPlantConversions);
	})
	.catch(err);
});


// SAMPLE OUTPUT:
// [
// 	Row {
// 	    campaign: 'fish_cow_desert',
// 	    date: '2015-01-01',
// 	    spend: '10.98',
// 	    impressions: '1621',
// 	    actions: '[
// 	    	{
// 	    		"action": "conversions",
// 	    		"y": 47,
// 	    	}, {
// 	    		"action": "conversions",
// 	    		"b": 49
// 	    	}, {
// 	    		"action": "views",
// 	    		"x": 29
// 	    	}, {
// 	    		"action": "views",
// 	    		"a": 29
// 	    	}
// 	    ]'
// 	}
// ]

// Questions:
// How many unique campaigns ran in February? ✅
// What is the total number of conversions on plants?
// What audience, asset combination had the least expensive conversions?
// What was the total cost per video view?

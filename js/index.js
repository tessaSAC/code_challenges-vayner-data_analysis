const fs = require('fs');
const neatCsv = require('neat-csv');
const { uniqsPerMonth, totalConvertsPerInitiative, findLowestCPM, mergeDupes } = require('./utils');

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
mergeDupes(data)

	    // Returns number of conversions in an initiative
	    	// Function signature: csv file, initiative's name, array of desired action types
	    // return Promise.all([totalConvertsPerInitiative(data, 'plants', ['x', 'y'])]);

	    // Returns lowest CPM
	    	// Function signature: data, array of desired action types
	    return findLowestCPM(data, ['x', 'y']);
	})
	.then((data) => {
		console.log(data)
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

// CAMPAIGN: initiative_audience_asset




// 4. Total cost per video view -- cost per view or cost per video?
	// Filter out campaigns WITHOUT type VIDEO using csv2
		// Since campaign is in random order use `has` or `contains`
	// For each campaign reduce: spend / (total views of type x || y)
const fs = require('fs');
const neatCsv = require('neat-csv');
const { uniqsPerMonth } = require('./utils');


// get data from csv1:
fs.readFile(`${ __dirname }/../files/source1.csv`, function (err, data) {
	if (err) console.err(`Warning: ${ err }`);

	// Returns a promise for an array with the parsed CSV.
	neatCsv(data).then(data => {
	    return uniqsPerMonth('02', data);
	})
	// Returns number of unique campaigns
	.then(numsUnique => {
		console.log(numsUnique.size);
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
// 	    		"action": "conversions"
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
// How many unique campaigns ran in February?
// What is the total number of conversions on plants?
// What audience, asset combination had the least expensive conversions?
// What was the total cost per video view?

// CAMPAIGN: initiative_audience_asset


// 2. total conversions PLANT initiative
	// Add all conversions of type x || y that contains PLANTS initiative
// 3. audience + asset's lowest CPM
	// conversions / CPM -- CPM: spend/(conversions * 1000)
	// even if math is wrong proportionally this should be ok
// 4. Total cost per video view -- cost per view or cost per video?
	// Filter out campaigns WITHOUT type VIDEO using csv2
		// Since campaign is in random order use `has` or `contains`
	// For each campaign reduce: spend / (total views of type x || y)
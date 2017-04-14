const fs = require('fs');
const neatCsv = require('neat-csv');
const { uniqsPerMonth, totalConvertsPerInitiative, findLowestCPM, findTotalCPV } = require('./utils');

let data,
	filterData,
	numsUnique,
	numPlantConversions,
	cheapestCampaign,
	totalCPV;

// get data from csv1:
fs.readFile(`${ __dirname }/../files/source1.csv`, function (err, csv1) {
	if (err) console.err(`Warning: ${ err }`);

	// Returns a promise for an array with the parsed CSV.
	neatCsv(csv1).then(csv1 => {
		data = csv1;
	})
	.then(() => {
		fs.readFile(`${ __dirname }/../files/source2.csv`, function (err, csv2) {
			if (err) console.err(`Warning: ${ err }`);

			// Returns a promise for an array with the parsed CSV.
			neatCsv(csv2).then(csv2 => {
				filterData = csv2;
			})
			.then(() => {
				// Returns number of unique campaigns
					// Function signature: csv file, desired month
			    numsUnique = uniqsPerMonth(data, '02');

			    // Returns number of conversions in an initiative
			    	// Function signature: csv file, initiative's name, array of desired action types
			    numPlantConversions = totalConvertsPerInitiative(data, 'plants', ['x', 'y']);

			    // Returns lowest CPM
			    	// Function signature: data, array of desired action types
			    cheapestCampaign = findLowestCPM(data, ['x', 'y']);

			    // Returns total CPV
			    	// Function signature: data, array of desired action types, filter data, filter type
			    totalCPV =  findTotalCPV(data, ['x', 'y'], filterData, 'video');

			    return Promise.all([numsUnique, numPlantConversions, cheapestCampaign, totalCPV]);
			    // TODO: Why did `numPlantConversions` change? -- still not sure after tests -- should write more later
			})
			.then((data) => {
				console.log(data)
				// data looks like: [ 125, 100741, [ 'cow', 'plains' ], 0.01 ]
				
			})
		})
	})
});

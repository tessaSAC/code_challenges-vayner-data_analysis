// NPM Packages
const fs = require('fs');
const neatCsv = require('neat-csv');

// Util functions
const { uniqsPerMonth, totalConvertsPerInitiative, findLowestCPM, findTotalCPV } = require('./utils');

// Variables
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
			.then(data => {
				let dataString = '';

				// data looks like: [ 125, 100741, [ 'cow', 'plains' ], 0.01 ]
				dataString += `Number of Unique Campaigns in February: ${ data[0] }\n`;
				dataString += `Total number of conversions on plants: ${ data[1] }\n`;
				dataString += `Cheapest audience-asset combo: ${ data[2].join(', ') }\n`;
				dataString += `Total cost-per-video-views: $${ data[3] }\n`;

				console.log(dataString)

				// Write data to output file
				fs.writeFile('output.txt', dataString, function(err) {
				    if(err) {
				        return console.error(err);
				    }

				    console.log('The data\'s been written to the file.');
				});
			})
			.catch(console.error);
		})
	})
});

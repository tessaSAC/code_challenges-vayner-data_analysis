module.exports = {
	uniqsPerMonth,
	totalConvertsPerInitiative,
	findLowestCPM,
	findTotalCPV,
};

// QUESTIONS:
// How many unique campaigns ran in February? ✅
// What is the total number of conversions on plants? ✅
// What audience, asset combination had the least expensive conversions? ✅
// What was the total cost per video view? ✅


// 1. unique campaigns in Feb
	// Take the data from csv1 and parse for unique campaigns with month '02'
	// Does this include any that don't have action types `x` || `y`?
function uniqsPerMonth(data, month) {

	const monthRegExp = new RegExp(`\\d{4}-${month}-\\d{2}`);
	const campaigns = new Map();

	// For each campaign:
	data.forEach(row => {
		// If row matches the date
		if (monthRegExp.test(row.date)) {
			// If campaign doesn't exist add campaign
			if (!campaigns.has(row.campaign)) {
				campaigns.set(row.campaign, row);
			}
		}
	})

	return campaigns.size;
}

// 2. total conversions PLANTS initiative
	// Add all conversions of type x || y that contains PLANTS initiative
function totalConvertsPerInitiative(data, initiative, actionTypes) {

	let numConversions = 0;

	// Create a regular expression of the types:
	const actionTypesRegExp = actionTypesRegExer(actionTypes);

	// For each campaign:
	return Promise.resolve(data.forEach(row => {
		// If campagn has the desired initiative:
		if (row.campaign.slice(0, row.campaign.indexOf('_')) === initiative) {

			// If campaign contains the required actions
			if (actionTypesRegExp.test(JSON.stringify(row.actions))) {
				findNumActions(row.actions, actionTypes, 'conversions')
				.then(addlConversions => {
					numConversions += addlConversions || 0
				})
				.catch;
			};
		};
	}))
	.then(() => {
		return numConversions;
	});
}


// 3. audience + asset's lowest CPM
	// conversions / CPM -- CPM: spend/(conversions * 1000) -- OOP?
		// even if math is wrong proportionally this should be ok
function findLowestCPM(data, actionTypes) {
	let currentMinCPM = Infinity;
	let campaignDetails = '';

	return Promise.resolve(data.forEach(row => {
		findNumActions(row.actions, actionTypes, 'conversions')
		.then(numConversions => {
			const currentCampaignCPM = row.spend / numConversions * 1000;

			if (currentCampaignCPM < currentMinCPM) {
				currentMinCPM = currentCampaignCPM;
				campaignDetails = row.campaign;
			};
		})
	}))
	.then(() => campaignDetails.split('_').slice(1));
}


// 4. Total cost per video view
	// Merge numerical values of multi-day campaigns
	// Use csv2 to filter out non-video campaigns
	// Sum total spend for each campaign with action types `x` || `y`
	// Sum total views of types `x` || `y`
	// Return (total spend / total views)
function findTotalCPV(data, actionTypes, filterData, filterType) {
	let totalCost = 0;
	let totalViews = 0;

	// Merge campaigns across all days
	const mergedData = mergeDupes(data);

	// Filter out campaigns WITHOUT type VIDEO using csv2
	const videoCampaigns = filterBy(mergedData, filterData, 'video');

	// For each campaign:
	return Promise.resolve(videoCampaigns.forEach(row => {
		// Create a regular expression of the types:
		const actionTypesRegExp = actionTypesRegExer(actionTypes);

		// If campaign contains the required actions
		if (actionTypesRegExp.test(JSON.stringify(row.actions))) {
			// For each action of the required type add to `totalCost` and `totalViews`
			findNumActions(row.actions, actionTypes, 'views')
			.then(numViews => {
				totalCost += +row.spend;
				totalViews += numViews || 0;
			})
			.catch;
		};
	}))
	.then(() => {
		// Return CPV rounded to nearest penny:
		return dollarRound((totalCost / totalViews), 2);
	});
};



// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //



// HELPER FUNCTIONS:


// Rounds to the nearest penny
function dollarRound(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}


// Creates a regular expression to search for keys of the required action types
function actionTypesRegExer(actionTypes) {
	let actionTypesString = ''

	// Add all desired action types to a string:
	actionTypes.forEach(singleType => {
		if (actionTypesString) {
			actionTypesString += `|`; // IMPORTANT: DO *NOT* ADD SPACES HERE!!!!!!
		}
		actionTypesString += `\\\\"${ singleType }\\\\":`;

	});

	return new RegExp(actionTypesString);
}


// Finds the number of a certain action of certain types
function findNumActions(actions, actionTypes, actionFilter) {
	let numActions = 0;

	// For each action object,
	JSON.parse(actions).forEach(action => {
		// For each action that matches the `actionFilter` add to `numActions`
		actionTypes.forEach(singleType => {
			if (action.action === actionFilter) {
				numActions += action[singleType] || 0;
			}
		});
	});

	return Promise.resolve(numActions);
}


// Combines numerical values of multi-day campaigns
function mergeDupes(data) {

	// The future merged list of campaigns
	const uniqueCampaigns = {};

	// For each campaign:
	data.forEach(row => {

		// If `uniqueCampaigns` doesn't include the current campaign, add it:
		if (!uniqueCampaigns.hasOwnProperty(row.campaign)) {
			uniqueCampaigns[row.campaign] = row;

		// Else merge the two:
		}  else {

			// Save the action from the previous and current days
			const newRow = JSON.parse(row.actions);
			const oldRow = (JSON.parse(uniqueCampaigns[row.campaign]["actions"]));

			// Locate where they are in their respective campaign rows
			const newRowActionIndices = newRow.map(actionObj => JSON.stringify(Object.keys(actionObj).sort()) + `, ${ actionObj.action }`);
			const oldRowActionIndices = oldRow.map(actionObj => JSON.stringify(Object.keys(actionObj).sort()) + `, ${ actionObj.action }`);

			// Copy the previous day's action
			const mergedActions = oldRow;

			// Merge the previous and current day's actions:
			newRowActionIndices.forEach((actionString, idx) => {
				// Save index of matching action in the oldRow if it exists
				const oldRowIdx = oldRowActionIndices.indexOf(actionString);

				// If the action already exists
				if (oldRowIdx >= 0) {
					// Get the action type's name:
					const keyNames = Object.keys(oldRow[oldRowIdx]);
					// Since there should be only two keys it'll be one or the other
					const dynamicKeyName = keyNames[keyNames.indexOf("action") === 0 ? 1 : 0];

					// Combine the old and new action types' counts
					mergedActions[oldRowIdx][dynamicKeyName] = +mergedActions[oldRowIdx][dynamicKeyName] + newRow[idx][dynamicKeyName];

				// Else add the new action
				} else {
					mergedActions.push(newRow[idx]);
				}
			});

			// Add STRINGIFIED (bc JSON) merged actions to `uniqueCampaigns`
			uniqueCampaigns[row.campaign].actions = JSON.stringify(mergedActions);
		}
	});

	// Array conversion hack
	const uniqueCampaignsArray = [];
	for (let key in uniqueCampaigns) {
		uniqueCampaignsArray.push(uniqueCampaigns[key]);
	}
	return uniqueCampaignsArray;
}


// Filter campaigns of a specific type or name
function filterBy(data, filterData, filterType) {

	// Go through filterData and save campaign names of the correct filterType
	const filter = [];
	filterData.forEach(row =>  {
	 	if (row['object_type'] === filterType) filter.push(row.campaign.split('_').sort().join(',')); // Campaign may not be sorted
	});

	// Use `filter` to create a new array of campaigns that are of the correct type
	const postFilterData = [];
	data.forEach(row => {
		if (filter.indexOf(row.campaign.split('_').sort().join(',')) >=0) postFilterData.push(row);
	})

	// return the filtered data
	return postFilterData;
}
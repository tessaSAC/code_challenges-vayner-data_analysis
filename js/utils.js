module.exports = {
	uniqsPerMonth,
	totalConvertsPerInitiative,
	findLowestCPM,
	mergeDupes
};


// 1. unique campaigns in Feb -- csv1 parse date
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

			// Note: this step is unnecessary because we only need # of unique campaigns
				// Maybe I can add the TODO util reduce function in case we later want the unique campaigns
			// Else combine with previous campaign
			else {
				campaigns.set(row.campaign, Object.assign({}, campaigns[row.campaign], row));
			}
		}
	})

	return campaigns;
}

// 2. total conversions PLANTS initiative
	// Add all conversions of type x || y that contains PLANTS initiative
		// console.log(/"x":| "y":/.test(JSON.stringify(example.actions)))
function totalConvertsPerInitiative(data, initiative, actionTypes) {

	let numConversions = 0;
	let actionTypesString = ''

	// Add all desired action types to a string:
	actionTypes.forEach(singleType => {
		if (actionTypesString) {
			actionTypesString += ` | `;
		}
		actionTypesString += `\\\\"${ singleType }\\\\"\:`;
	});

	// Create a regular expression of the types:
	const actionTypesRegExp = new RegExp(actionTypesString);

	// For each campaign:
	return Promise.resolve(data.forEach(row => {
		// If campagn has the desired initiative:
		if (row.campaign.slice(0, row.campaign.indexOf('_')) === initiative) {

			// If campaign contains the required actions
			if (actionTypesRegExp.test(JSON.stringify(row.actions))) {
				findNumConversions(row.actions, actionTypes)
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
	// conversions / CPM -- CPM: spend/(conversions * 1000)
	// even if math is wrong proportionally this should be ok
	// is it per campaigns ever??
		// TODO: Create helper function to reduce multi-day campaigns
			// Note to self: `Object.assign` won't merge values
function findLowestCPM(data, actionTypes) {
	let currentMinCPM = Infinity;
	let campaignDetails = '';

	return Promise.resolve(data.forEach(row => {
		findNumConversions(row.actions, actionTypes)
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


// HELPER FUNCTIONS:

function findNumConversions(actions, actionTypes) {
	let numConversions = 0;

	// For each action object,
	JSON.parse(actions).forEach(action => {
		// For each `conversions` action with the required type add to `numConversions`
		actionTypes.forEach(singleType => {
			if (action.action === 'conversions') {
				numConversions += action[singleType] || 0;
			}
		});
	});

	return Promise.resolve(numConversions);
}


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

	return uniqueCampaigns;
}
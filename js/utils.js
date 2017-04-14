module.exports = {
	uniqsPerMonth,
	totalConvertsPerInitiative
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
	data.forEach(row => {
		// If campagn has the desired initiative:
		if (row.campaign.slice(0, row.campaign.indexOf('_')) === initiative) {

			// If campaign contains the required actions
			if (actionTypesRegExp.test(JSON.stringify(row.actions))) {

				// For each action object,
				JSON.parse(row.actions).forEach(action => {

					// For each `conversions` action with the required type add to `numConversions`
					actionTypes.forEach(singleType => {
						if (action.action === 'conversions') {
							numConversions += action[singleType] || 0;
						}
					});
				});
			};
		};
	});
	return numConversions;
}

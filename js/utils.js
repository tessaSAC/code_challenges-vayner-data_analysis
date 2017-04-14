module.exports = {
	uniqsPerMonth
};


// 1. unique campaigns in Feb -- csv1 parse date
function uniqsPerMonth(month, data) {
	// month = month separated
	// const month = date.split('-')[1]; -- change `date` to `month`
	const monthRegExp = new RegExp(`\\d{4}-${month}-\\d{2}`);

	// trim any leading zeros -- nvm; will just create more work in comparison stage
	// month = month.replace(/^0+/g, '');

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

import GoogleMaps from  './GoogleMaps'

module.exports = class Place extends GoogleMaps {
	constructor() {
		super()
	}

	placeAutocomplete = (keywords, cb) => {
		$.getJSON('https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' + encodeURIComponent(keywords) + '&key=' + this.config.placeKey)
		.done((results) => {
			if (results.status === 'OK') {
				cb(null, results.predictions)
			} else if (results.status === 'ZERO_RESULTS') {
				cb(null, null)
			} else {
				cb(results.status, results.error_message)
			}
		})
	}

	queryAutocomplete = (keywords, cb) => {
		$.getJSON('https://maps.googleapis.com/maps/api/place/queryautocomplete/json?input=' + encodeURIComponent(keywords) + '&key=' + this.config.placeKey)
		.done((results) => {
			if (results.status === 'OK') {
				cb(null, results.predictions)
			} else if (results.status === 'ZERO_RESULTS') {
				cb(null, null)
			} else {
				cb(results.status, results.error_message)
			}
		})
	}

	textSearch = (keywords, cb) => {
		$.getJSON('https://maps.googleapis.com/maps/api/place/textsearch/json?query=' + encodeURIComponent(keywords) + '&key=' + this.config.placeKey)
		.done((results) => {
			if (results.status === 'OK') {
				cb(null, results.results)
			} else if (results.status === 'ZERO_RESULTS') {
				cb(null, null)
			} else {
				cb(results.status, results.error_message)
			}
		})
	}

	placeDetail = (placeID, cb) => {
		$.getJSON('https://maps.googleapis.com/maps/api/place/details/json?placeid=' + encodeURIComponent(placeID) + '&key=' + config.placeKey)
		.done((result) => {
			if (result.status === 'OK') {
				cb(null, result.result)
			} else if (result.status === 'ZERO_RESULTS') {
				cb(null, null)
			} else {
				cb(result.status, result.error_message)
			}
		})
	}
}
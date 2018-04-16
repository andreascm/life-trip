import GoogleMaps from  './GoogleMaps'

module.exports = class DistanceMatrix extends GoogleMaps {
	constructor() {
		super()
	}

	getMatrix = (placeId, cb) => {
		var originRequest = place[0]

		for (var i=1; i<originsId.length; i++) {
			originRequest += '|place_id:' + originsId[i]
		}

		var destinationRequest = originRequest

		$.getJSON('https://maps.googleapis.com/maps/api/distancematrix/json?origins=place_id:' + originRequest + '&destinations=place_id:' + destinationRequest + '&key=' + config.directionKey)
		.done((results) => {
			if (results.status === 'OK') {
				cb(null, results.rows)
			} else if (results.status === 'ZERO_RESULTS') {
				cb(null, null)
			} else {
				cb(results.status, results.error_message)
			}
		})
	}	
}
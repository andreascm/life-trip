import GoogleMaps from  './GoogleMaps'

module.exports = class Direction extends GoogleMaps {
	constructor() {
		super()
	}

	getDirection = async (originId, destinationId, waypointsId, cb) => {
		var initial = 'https://maps.googleapis.com/maps/api/directions/json?origin=place_id:' + originId + '&destination=place_id:' + destinationId,
			api = '&key=' + this.config.directionKey,
			waypoints = '&waypoints=optimize:true',
			request

		if (waypointsId.length === 0) {
			request = initial + api
		} else {
			for (var i=0; i<waypointsId.length; i++) {
				waypoints += '|place_id:' + waypointsId[i]
			}

			request = initial + waypoints + api
		}

		console.log(request)

		try {
			var response = await fetch(request)
			let results = await response.json()
			if (results.status === 'OK') {
				cb(null, results.geocoded_waypoints, results.routes)
			} else if (results.status === 'ZERO_RESULTS') {
				cb(null, null)
			} else {
				cb(results.status, results.error_message)
			}
		} catch(error) {
			console.error(error);
		}
	}

	openMap = async (origin, destination, waypoints, cb) => {
		var initial = 'https://www.google.com/maps/dir/?api=1&origin=' + origin.name + '&origin_place_id=' + origin.id + '&destination=' + destination.name + '&destination_place_id=' + destination.id,
			waypoints = '&waypoints=',
			waypointIds = '&waypoint_place_ids=',
			request

		if (waypoints.length === 0) {
			request = initial
		} else {
			waypoints += waypoints[0].name
			waypointIds += waypoints[0].id

			for (var i=1; i<waypoints.length; i++) {
				waypoints += '%7C' +  waypoints[i].name
				waypointIds += '%7C' + waypoints[i].id
			}

			request = initial + waypoints
		}

		cb(request)
	}
}
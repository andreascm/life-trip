module.exports = class Cluster {
	constructor() {
	}

	getCluster = (placeCoords, minClusters, cb) => {
		var levels = cluster({
			input: placeCoords,
			distance: this.haversineDistance,
			linkage: this.singleLinkage,
			minClusters: minClusters
		})

		cb(levels)
	}

	haversineDistance = (a, b) => {
		var R = 6378137 // Earth's radius in metres
			φ1 = this.degreesToRadians(a.lat),
			φ2 = this.degreesToRadians(b.lat),
			Δφ = this.degreesToRadians(b.lat - a.lat),
			Δλ = this.degreesToRadians(b.lng - a.lng),
			a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
				Math.cos(φ1)     * Math.cos(φ2)     *
				Math.sin(Δλ / 2) * Math.sin(Δλ / 2),
			c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)),
			distance = R * c;
		return distance
	}

	singleLinkage = (distances) => {
		return Math.min.apply(null, distances)
	}

	degreesToRadians = (degree) => {
		return degree * (Math.PI) / 180
	}
}

const cluster = require('hierarchical-clustering')
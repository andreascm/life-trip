import Firebase from  './Firebase'

module.exports = class Plan extends Firebase {
	constructor() {
		super()
	}

	createPlan(name, startDate, endDate, clusters) {
		if (this.auth.currentUser !== null) {
			var ref = this.db.ref('plan/' + this.auth.currentUser.uid).push()
			ref.set({
				name: name,
				startDate: startDate,
				endDate: endDate,
				clusters: clusters
			})
		}
	}

	editPlan(name, startDate, endDate, clusters, key) {
		if (this.auth.currentUser !== null) {
			var ref = this.db.ref('plan/' + this.auth.currentUser.uid + '/' + key)
			ref.set({
				name: name,
				startDate: startDate,
				endDate: endDate,
				clusters: clusters
			})
		}
	}

	deletePlan(key) {
		if (this.auth.currentUser !== null) {
			var ref = this.db.ref('plan/' + this.auth.currentUser.uid + '/' + key)
			ref.remove()
		}
	}

	getAllPlan(cb) {
		if (this.auth.currentUser !== null) {
			this.db.ref('plan/' + this.auth.currentUser.uid).once('value')
			.then(function(snapshot) {
				var result = {}

				snapshot.forEach(function(childSnapshot) {
					var key = childSnapshot.key,
						value = childSnapshot.val()

					result[key] = value
				})

				cb(null, result)
			})
			.catch(function(error) {
				cb(error.code, error.message)
			})
		} else {
			cb('noUser', 'noCurrentUser')
		}
	}

	getPlanById(id, cb) {
		if (this.auth.currentUser !== null) {
			this.db.ref('plan/' + this.auth.currentUser.uid + '/' + id).once('value')
			.then(function(snapshot) {
				cb(null, snapshot.val())
			})
			.catch(function(error) {
				cb(error.code, error.message)
			})
		}
	}

	addChildAddedListener(cb) {
		if (this.auth.currentUser !== null) {
			this.db.ref('plan/' + this.auth.currentUser.uid).on('child_added', function(data) {
				cb(data.key, data.val())
			})
		}
	}

	addChildChangedListener(cb) {
		if (this.auth.currentUser !== null) {
			this.db.ref('plan/' + this.auth.currentUser.uid).on('child_changed', function(data) {
				cb(data.key, data.val())
			})
		}
	}

	addChildRemovedListener(cb) {
		if (this.auth.currentUser !== null) {
			this.db.ref('plan/' + this.auth.currentUser.uid).on('child_removed', function(data) {
				cb(data.key, data.val())
			})
		}
	}

	removeAllListeners() {
		if (this.auth.currentUser !== null) {
			this.db.ref('plan/' + this.auth.currentUser.uid).off()
		}
	}
}
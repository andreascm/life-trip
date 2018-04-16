import Firebase from  './Firebase'

module.exports = class Authentication extends Firebase {
	constructor() {
		super()
	}

	getAllUsername = (cb) => {
		this.db.ref('users').once('value')
		.then(function(snapshot) {
			var usernames = []

			snapshot.forEach(function(childSnapshot) {
				usernames.push(childSnapshot.val().username)
			})

			cb(usernames)
		})
		.catch(function(error) {
			cb(null)
		})
	}

	isUsernameValid = (username) => {
		this.getAllUsername((usernames) => {
			if (users !== null) {
				if (usernames !== null && usernames.indexOf(username) !== -1) {
					cb(false)
					return
				}

				cb(true)
				return
			}

			cb(false)
			return
		})
 	}

 	addUser = (email, username) => {
 		if (this.auth.currentUser !== null) {
	 		var ref = this.db.ref('users/' + this.auth.currentUser.uid).push()
			ref.set({
				username: username
			})
		}
 	}

	signUp = (email, username, password, cb) => {
		var username = username
		this.auth.createUserWithEmailAndPassword(email, password)
		.then(function() {
			while(this.auth.currentUser == null) {
			}

			cb(null, null)
		}) 
		.catch(function(error) {
			cb(error.code, error.message)
		})
	}

	signIn = (email, password, cb) => {
		this.auth.signInWithEmailAndPassword(email, password)
		.then(function() {
			cb(null, null)
		})
		.catch(function(error) {
			cb(error.code, error.message)
		})
	}

	signOut = () => {
		this.auth.signOut()
		.then(function() {
			cb(null, null)
		}).catch(function(error) {
			cb(error.code, error.message)
		});
	}
}
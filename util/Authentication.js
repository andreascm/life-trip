import Firebase from  './Firebase'

module.exports = class Authentication extends Firebase {
	constructor() {
		super()
	}

	getAllUsername = (cb) => {
		this.db.ref('users').once('value')
		.then((snapshot) => {
			var usernames = []

			snapshot.forEach(function(childSnapshot) {
				usernames.push(childSnapshot.val().username)
			})

			cb(usernames)
		})
		.catch((error) => {
			cb(null)
		})
	}

	isUsernameValid = (username, cb) => {
		this.getAllUsername((usernames) => {
			if (usernames !== null && usernames.indexOf(username) !== -1) {
				cb(false)
				return
			}

			cb(true)
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
		.then((user) => {
			while(this.auth.currentUser == null) {
			}

			cb(null, user)
		}) 
		.catch((error) => {
			cb(error.code, error.message)
		})
	}

	signIn = (email, password, cb) => {
		this.auth.signInWithEmailAndPassword(email, password)
		.then((user) => {
			cb(null, user)
		})
		.catch(function(error) {
			cb(error.code, error.message)
		})
	}

	signOut = () => {
		this.auth.signOut()
		.then(() => {
			cb(null, null)
		}).catch((error) => {
			cb(error.code, error.message)
		});
	}
}
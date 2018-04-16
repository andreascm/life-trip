var firebase = require("firebase"),
	config = {
		apiKey: "AIzaSyAE5a3xL-r6xoekrPOOxj_TDHFaXTymkow",
	    authDomain: "life-trip-3d638.firebaseapp.com",
	    databaseURL: "https://life-trip-3d638.firebaseio.com",
	    projectId: "life-trip-3d638",
	    storageBucket: "life-trip-3d638.appspot.com",
	    messagingSenderId: "664244402786"
	}
firebase.initializeApp(config)

module.exports = class Firebase {
	constructor() {
		this.firebase = firebase
		this.config = config
		this.user = null
		this.db = this.firebase.database()
		this.auth = this.firebase.auth()
	}
}
import React, { Component } from 'react'
import { StyleSheet, Text, View} from 'react-native'
import { Button, Dialog, FlatButton, Toolbar } from 'react-native-material-ui'
import { MKTextField } from 'react-native-material-kit'

import Router from '../navigation/Router'
import ColorsDay from '../constants/ColorsDay'
import ColorsNight from '../constants/ColorsNight'
import Util from '../util'

export default class SignUpScreen extends Component {
	static route = {
		navigationBar: {
			visible: false
		}
	}

	state = {
		email: "",
		username: "",
		password: "",

		wrongUsername: false,
		wrongEmail: false,
		wrongPassword: false,

		styles: (new Date().getHours() < 6 || new Date().getHours() >= 18)  ? stylesNight : stylesDay,
		stylesIntervalId: '',
		colors: (new Date().getHours() < 6 || new Date().getHours() >= 18)  ? ColorsNight : ColorsDay
	}

	componentWillMount = () => {
		var stylesIntervalId = setInterval(() => {
			currentTime = new Date()
			if (currentTime.getHours() < 6 || currentTime.getHours() >= 18) {
				this.setState({
					styles: stylesNight,
					colors: ColorsNight
				})
			} else {
				this.setState({
					styles: stylesDay,
					colors: ColorsDay
				})
			}
		}, 3600000)

		this.setState({ stylesIntervalId: stylesIntervalId })
	}

	handleCheck = () => {
		this.handleCheckEmail()
		this.handleCheckPassword()
		this.handleCheckUsername()
	}

	handleCheckEmail = () => {
		if (this.state.email.indexOf('@') < 0 || this.state.email.indexOf('.com') < 0 || this.state.email.length === 0) {
			this.setState({ wrongEmail: true })
		} else {
			this.setState({ wrongEmail: false })
		}
	}

	handleCheckPassword = () => {
		if (this.state.password.length < 6) {
		// if (this.state.password.length < 6 || this.state.password.toLowerCase() === this.state.password || !/\d/.test(this.state.password) || !/[a-zA-Z]/.test(this.state.password)) {
			this.setState({ wrongPassword: true })
		} else {
			this.setState({ wrongPassword: false })
		}
	}

	handleCheckUsername = () => {
		if (this.state.username.length === 0) {
			this.setState({ wrongUsername: true })
		} else {
			Util.authentication.isUsernameValid(this.state.username, (result) => {
				if (result && !this.state.wrongEmail && !this.state.wrongPassword) {
					this.setState({ wrongUsername: false })
					this.handleSubmit()
				} else {
					inputValid = false
					this.setState({ wrongUsername: true })
				}
			})
		}
	}

	handleSubmit = () => {
		Util.authentication.signUp(this.state.email, this.state.username, this.state.password, (error, result) => {
			if (error) {
				console.log(error)
			} else {
				Util.authentication.addUser(this.state.email, this.state.username)
				this.props.navigator.push(Router.getRoute('planner'))
			}
		})
	}

	render = () => {
		return (
			<View style={this.state.styles.container}>
				<Toolbar
					style={{
						container: this.state.styles.toolbar,
						titleText: this.state.styles.titleText,
						leftElement: { color: this.state.colors.background }
					}}
					leftElement='arrow-back'
					centerElement='Sign Up'
					onLeftElementPress={() => this.props.navigator.pop()} />
				<View style={this.state.styles.form}>
	        		<MKTextField
	        			style={this.state.styles.textField}
	        			autoCorrect={false}
						placeholder={this.state.wrongEmail ? "Invalid email" : "Email"}
						textInputStyle={this.state.styles.textInput}
						tintColor={this.state.wrongEmail ? this.state.colors.errorBackground : this.state.colors.primaryLight}
						highlightColor={this.state.wrongEmail ? this.state.colors.errorBackground : this.state.colors.primaryLight}
						placeholderTextColor={this.state.wrongEmail ? this.state.colors.errorText : this.state.colors.primaryLight}
						keyboardType='email-address'
						returnKeyType='next'
						floatingLabelEnabled={true}
						allowFontScaling={true}
						onChangeText={(email) => this.setState({email})}
						onBlur={this.handleCheckEmail.bind(this)}
						value={this.state.email} />
					<MKTextField
						style={this.state.styles.textField}
	        			autoCorrect={false}
						placeholder={this.state.wrongUsername ? "Invalid username" : "Username"}
						textInputStyle={this.state.styles.textInput}
						tintColor={this.state.wrongUsername ? this.state.colors.errorBackground : this.state.colors.primaryLight}
						highlightColor={this.state.wrongUsername ? this.state.colors.errorBackground : this.state.colors.primaryLight}
						placeholderTextColor={this.state.wrongUsername ? this.state.colors.errorText : this.state.colors.primaryLight}
						returnKeyType='next'
						floatingLabelEnabled={true}
						allowFontScaling={true}
						onChangeText={(username) => this.setState({username})}
						onBlur={this.handleCheckPassword.bind(this)}
						value={this.state.username} />
					<MKTextField
						style={this.state.styles.textField}
	        			autoCorrect={false}
						placeholder={this.state.wrongPassword ? "Invalid password" : "Password (at least 6 characters)"}
						textInputStyle={this.state.styles.textInput}
						tintColor={this.state.wrongPassword ? this.state.colors.errorBackground : this.state.colors.primaryLight}
						highlightColor={this.state.wrongPassword ? this.state.colors.errorBackground : this.state.colors.primaryLight}
						placeholderTextColor={this.state.wrongPassword ? this.state.colors.errorText : this.state.colors.primaryLight}
						password={true}
						returnKeyType='go'
						floatingLabelEnabled={true}
						allowFontScaling={true}
						onSubmitEditing={this.handleCheck.bind(this)}
						onChangeText={(password) => this.setState({password})}
						onBlur={this.handleCheckUsername.bind(this)}
						value={this.state.password} />
					<Button
						raised
						onPress={this.handleCheck.bind(this)}
						text='Submit'
						style={{
							container: this.state.styles.buttonContainer,
							text: this.state.styles.buttonText
						}} />
				</View>
			</View>
		)
	}

	componentWillUnmount = () => {
		clearInterval(this.state.stylesIntervalId)
	}
}

const stylesDay = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: ColorsDay.background
	},
	form: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'flex-start',
		padding: 16
	},
	textField: {
		height: 50,
		width: 350,
		marginBottom: 16
	},
	textInput: {
		flex: 1,
		color: ColorsDay.primaryDark
	},
	buttonContainer: {
		marginTop: 64,
		backgroundColor: ColorsDay.primary,
		width: 200,
		height: 60
	},
	buttonText: {
		color: ColorsDay.white,
		fontWeight: 'bold'
	},
	toolbar: {
		backgroundColor: ColorsDay.primary
	},
	titleText: {
		fontWeight: 'bold',
		color: ColorsDay.white
	}
});

const stylesNight = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: ColorsNight.background
	},
	form: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'flex-start',
		padding: 16
	},
	textField: {
		height: 50,
		width: 350,
		marginBottom: 16
	},
	textInput: {
		flex: 1,
		color: ColorsNight.primaryDark
	},
	buttonContainer: {
		marginTop: 64,
		backgroundColor: ColorsNight.primary,
		width: 200,
		height: 60
	},
	buttonText: {
		color: ColorsNight.black,
		fontWeight: 'bold'
	},
	toolbar: {
		backgroundColor: ColorsNight.primary
	},
	titleText: {
		fontWeight: 'bold',
		color: ColorsNight.black
	}
});
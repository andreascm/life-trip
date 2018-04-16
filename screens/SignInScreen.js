import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button, Dialog, DialogDefaultActions, Toolbar } from 'react-native-material-ui'
import { MKTextField } from 'react-native-material-kit'

import Router from '../navigation/Router'
import ColorsDay from '../constants/ColorsDay'
import ColorsNight from '../constants/ColorsNight'
import Util from '../util'

export default class SignInScreen extends Component {
	static route = {
		navigationBar: {
			visible: false
		}
	}

	state = {
		email: "",
		password: "",

		dialogOpen: false,

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

	handleDialogClose = () => {
		this.setState({ dialogOpen: false })
	}

	handleSubmit = () => {
		Util.authentication.signIn(this.state.email, this.state.password, (error, result) => {
			if (error) {
				this.setState({ dialogOpen: true })
			} else {
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
					centerElement='Sign In'
					onLeftElementPress={() => this.props.navigator.pop()} />
				<View>
					<View style={this.state.styles.form}>
						<MKTextField
							style={this.state.styles.textField}
		        			autoCorrect={false}
							placeholder="Email"
							textInputStyle={this.state.styles.textInput}
							tintColor={this.state.colors.primaryLight}
							highlightColor={this.state.colors.primaryLight}
							placeholderTextColor={this.state.colors.primaryLight}
							keyboardType='email-address'
							returnKeyType='next'
							floatingLabelEnabled={true}
							allowFontScaling={true}
							onChangeText={(email) => this.setState({email})}
							value={this.state.email} />
						<MKTextField
							style={this.state.styles.textField}
		        			autoCorrect={false}
							placeholder="Password"
							textInputStyle={this.state.styles.textInput}
							tintColor={this.state.colors.primaryLight}
							highlightColor={this.state.colors.primaryLight}
							placeholderTextColor={this.state.colors.primaryLight}
							password={true}
							returnKeyType='go'
							floatingLabelEnabled={true}
							allowFontScaling={true}
							onSubmitEditing={this.handleSubmit.bind(this)}
							onChangeText={(password) => this.setState({password})}
							value={this.state.password} />
						<Button
							raised
							onPress={this.handleSubmit.bind(this)}
							text='Submit'
							style={{
								container: this.state.styles.buttonContainer,
								text: this.state.styles.buttonText
							}} />
					</View>
				</View>
				{ this.state.dialogOpen ?
					<View style={this.state.styles.dialog}>
						<Dialog>
							<Dialog.Content>
								<Text style={{fontSize: 16}}>Incorrent username and password combination</Text>
							</Dialog.Content>
							<Dialog.Actions>
								<DialogDefaultActions
									actions={['close']}
									onActionPress={this.handleDialogClose.bind(this)} />
							</Dialog.Actions>
						</Dialog>
					</View>
					:
					<View></View>
				}
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
		color: ColorsDay.white,
		fontWeight: 'bold'
	},
	dialog: {
		alignItems: 'center',
		justifyContent: 'center',
		padding: '50%'
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
		color: ColorsNight.black,
		fontWeight: 'bold'
	},
	dialog: {
		alignItems: 'center',
		justifyContent: 'center',
		padding: '50%'
	}
});
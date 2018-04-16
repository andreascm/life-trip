import React, { Component } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { Button, Toolbar } from 'react-native-material-ui'

import Router from '../navigation/Router'
import ColorsDay from '../constants/ColorsDay'
import ColorsNight from '../constants/ColorsNight'

export default class HomeScreen extends Component {
	static route = {
		navigationBar: {
			visible: false
		}
	}

	state = {
		styles: (new Date().getHours() < 6 || new Date().getHours() >= 18)  ? stylesNight : stylesDay,
		stylesIntervalId: ''
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

	handleSignUp = () => {
		this.props.navigator.push(Router.getRoute('signUp'))
	}

	handleSignIn = () => {
		this.props.navigator.push(Router.getRoute('signIn'))
	}

	render = () => {
		return (
			<View style={this.state.styles.container}>
				<Image style={{ marginBottom: 8 }} source={require('../constants/flip-flops.png')} />
				<Text style={this.state.styles.appName}>Life Trip</Text>
				<Button
					raised
					onPress={this.handleSignUp}
					text='Sign Up'
					style={{
						container: this.state.styles.buttonContainer,
						text: this.state.styles.buttonText
					}} />
				<Button
					raised
					onPress={this.handleSignIn}
					text='Sign In'
					style={{
						container: this.state.styles.buttonContainer,
						text: this.state.styles.buttonText
					}} />
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
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: ColorsDay.background
	},
	buttonContainer: {
		marginTop: 32,
		backgroundColor: ColorsDay.primary,
		width: 200,
		height: 60
	},
	buttonText: {
		color: ColorsDay.white,
		fontWeight: 'bold'
	},
	appName: {
		fontWeight: 'bold',
		fontSize: 30,
		marginBottom: 16,
		color: ColorsDay.black
	}
})

const stylesNight = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: ColorsNight.background
	},
	buttonContainer: {
		marginTop: 32,
		backgroundColor: ColorsNight.primary,
		width: 200,
		height: 60
	},
	buttonText: {
		color: ColorsNight.black,
		fontWeight: 'bold'
	},
	appName: {
		fontWeight: 'bold',
		fontSize: 30,
		marginBottom: 16,
		color: ColorsNight.white
	}
});
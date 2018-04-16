import React, { Component } from 'react'
import { Dimensions, StatusBar, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import { Card } from 'react-native-material-ui'
import { MapView, PROVIDER_GOOGLE } from 'expo'

import ColorsDay from '../constants/ColorsDay'
import ColorsNight from '../constants/ColorsNight'

export default class PlanList extends Component {
	state = {
		cardList: [],
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

	componentDidMount = () => {
		var cardList = [],
			keys = Object.keys(this.props.planList)

		for (i=0; i<keys.length; i++) {
			// console.log(this.props.planList[keys[i]])
			cardList.push(
				<TouchableHighlight key={keys[i]} onPress={this.editPlan.bind(this.props.planList[keys[i]], keys[i])} underlayColor="white">
					<View key={keys[i]} style={{marginBottom: 16}}>
						<Card style={{ container: this.state.styles.card }}>
							<View style={this.state.styles.content}>
								<MapView
									style={this.state.styles.map}
									provider={PROVIDER_GOOGLE}
									initialRegion={{
										latitude: 37.78825,
										longitude: -122.4324,
										latitudeDelta: 0.0022,
										longitudeDelta: 0.0021,
									}}
									region={{
										latitude: this.props.planList[keys[i]].clusters[0][0].coordinate.latitude,
										longitude: this.props.planList[keys[i]].clusters[0][0].coordinate.longitude,
										latitudeDelta: 0.0022,
										longitudeDelta: 0.0021,
									}} >
									<MapView.Marker
										coordinate={{
											latitude: this.props.planList[keys[i]].clusters[0][0].coordinate.latitude,
											longitude: this.props.planList[keys[i]].clusters[0][0].coordinate.longitude
										}} />
								</MapView>
							</View>
							<View style={this.state.styles.text}>
								<Text style={{fontSize: 18, color: this.state.colors.background}}>{this.props.planList[keys[i]].name}</Text>
								<Text style={{color: this.state.colors.background}}>{new Date(this.props.planList[keys[i]].startDate).toDateString()} - {new Date(this.props.planList[keys[i]].endDate).toDateString()}</Text>
							</View>
						</Card>
					</View>
				</TouchableHighlight>
			)
		}

		this.setState({ cardList: cardList })
	}

	componentWillReceiveProps = (nextProps) => {
		var cardList = [],
			keys = Object.keys(nextProps.planList)

		for (i=0; i<keys.length; i++) {
			// console.log(nextProps.planList[keys[i]]])
			cardList.push(
				<TouchableHighlight key={keys[i]} onPress={this.editPlan.bind(this, nextProps.planList[keys[i]], keys[i])} underlayColor="white">
					<View key={keys[i]} style={{marginBottom: 16}}>
						<Card style={{ container: this.state.styles.card }}>
							<View style={this.state.styles.content}>
								<MapView
									style={this.state.styles.map}
									provider={PROVIDER_GOOGLE}
									initialRegion={{
										latitude: 37.78825,
										longitude: -122.4324,
										latitudeDelta: 0.0022,
										longitudeDelta: 0.0021,
									}}
									region={{
										latitude: nextProps.planList[keys[i]].clusters[0][0].coordinate.latitude,
										longitude: nextProps.planList[keys[i]].clusters[0][0].coordinate.longitude,
										latitudeDelta: 0.0022,
										longitudeDelta: 0.0021,
									}} >
									<MapView.Marker
										coordinate={{
											latitude: nextProps.planList[keys[i]].clusters[0][0].coordinate.latitude,
											longitude: nextProps.planList[keys[i]].clusters[0][0].coordinate.longitude
										}} />
								</MapView>
							</View>
							<View style={this.state.styles.text}>
								<Text style={{fontSize: 18, color: this.state.colors.background}}>{nextProps.planList[keys[i]].name}</Text>
								<Text style={{color: this.state.colors.background}}>{new Date(nextProps.planList[keys[i]].startDate).toDateString()} - {new Date(nextProps.planList[keys[i]].endDate).toDateString()}</Text>
							</View>
						</Card>
					</View>
				</TouchableHighlight>
			)
		}

		this.setState({ cardList: cardList })
	}

	editPlan = (data, key) => {
		this.props.editPlan(data, key)
	}

	render = () => {
		return (
			<View style={this.state.styles.container}>
				{this.state.cardList}
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
		alignItems: 'stretch',
		backgroundColor: ColorsDay.background
	},
	content: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 26,
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	map: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 26
	},
	text: {
		paddingTop: 150,
		paddingBottom: 8,
		paddingLeft: 16,
		paddingRight: 16
	},
	card: {
		backgroundColor: ColorsDay.primary
	}
})

const stylesNight = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'stretch',
		backgroundColor: ColorsNight.background
	},
	content: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 26,
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	map: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 26
	},
	text: {
		paddingTop: 150,
		paddingBottom: 8,
		paddingLeft: 16,
		paddingRight: 16
	},
	card: {
		backgroundColor: ColorsNight.primary
	}
})
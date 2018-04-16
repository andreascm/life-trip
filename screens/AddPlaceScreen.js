import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button, Card, Toolbar } from 'react-native-material-ui'
import { MapView, PROVIDER_GOOGLE } from 'expo'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'

import { config } from '../util/GoogleMaps'
import ColorsDay from '../constants/ColorsDay'
import ColorsNight from '../constants/ColorsNight'

export default class AddPlaceScreen extends Component {
	static route = {
		navigationBar: {
			visible: false,
			title(getAddedPlace) {
				this.props.getAddedPlace = getAddedPlace
			}
		}
	}

	state = {
		region: {
			latitude: 37.78825,
			longitude: -122.4324,
			latitudeDelta: 0.0022,
			longitudeDelta: 0.0021
		},
		coordinate: {},
		data: {},
		details: {},

		showMarker: false,

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

	handleAddPlace = () => {
		this.props.getAddedPlace({
			coordinate: this.state.coordinate,
			data: this.state.data,
			details: this.state.details
		})
		this.props.navigator.pop()
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
					centerElement='Add Place'
					onLeftElementPress={() => this.props.navigator.pop()} />
				<GooglePlacesAutocomplete
					placeholder='Search'
					minLength={2} // minimum length of text to search
					autoFocus={false}
					listViewDisplayed='auto'
					fetchDetails={true}
					renderDescription={(row) => row.description}
					onPress={(data, details = null) => {
						var region = {},
							coordinate = {}

						region.latitude = details.geometry.location.lat
						region.longitude = details.geometry.location.lng
						region.latitudeDelta = 0.0022
						region.longitudeDelta = 0.0021

						coordinate.latitude = details.geometry.location.lat
						coordinate.longitude = details.geometry.location.lng

						this.setState({
							data: data,
							details: details,
							region: region,
							coordinate: coordinate,
							showMarker: true
						})
					}}
					query={{
					  key: 'AIzaSyBgg0tf604dP5hPL5HPDyD_Izx06NS_Fb8'
					}}
					nearbyPlacesAPI='GooglePlacesSearch'
					GooglePlacesSearchQuery={{
					  rankby: 'distance'
					}}
					debounce={200} />
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
						region={this.state.region} >
						{ this.state.data.structured_formatting ?
							<MapView.Marker
								ref={(marker) => {if (marker !== null && this.state.showMarker) {marker.showCallout()}}}
								title={'ADD PLACE'}
								onCalloutPress={this.handleAddPlace.bind(this)}
								coordinate={{
									latitude: this.state.region.latitude,
									longitude: this.state.region.longitude
								}} />
							: null
						}
					</MapView>
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
		alignItems: 'stretch',
		backgroundColor: ColorsDay.background
	},
	content: {
		position: 'absolute',
		top: '55%',
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	map: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0
	},
	toolbar: {
		backgroundColor: ColorsDay.primary
	},
	titleText: {
		color: ColorsDay.white,
		fontWeight: 'bold'
	}
})

const stylesNight = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'stretch',
		backgroundColor: ColorsDay.background
	},
	content: {
		position: 'absolute',
		top: '55%',
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	map: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0
	},
	toolbar: {
		backgroundColor: ColorsNight.primary
	},
	titleText: {
		color: ColorsNight.black,
		fontWeight: 'bold'
	}
})
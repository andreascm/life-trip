import React, { Component } from 'react'
import { Dimensions, StatusBar, StyleSheet, Text, View } from 'react-native'
import { Button, Card } from 'react-native-material-ui'

import ColorsDay from '../constants/ColorsDay'
import ColorsNight from '../constants/ColorsNight'

export default class PlaceList extends Component {

	constructor(props) {
		super(props)
	}

	static defaultProps = {
		selectedPlaces: [],
		deletePlace: () => {},
		editPlace: false
	}

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

	componentDidMount() {
		var cardList = []

		for (i=0; i<this.props.selectedPlaces.length; i++) {
			cardList.push(
				<View key={i} style={{marginBottom: 8}}>
					<Card style={{ container: this.state.styles.card }}>
						{ this.props.editPlace ?
							<Button
								onPress={this.props.deletePlace.bind(this, i)}
								text='X'
								style={{
									container: this.state.styles.buttonContainer,
									text: this.state.styles.buttonText
								}} />
							:
							<Text style={{fontSize: 16, paddingTop: 24}}></Text>
						}
						<View style={this.state.styles.text}>
							<Text style={{fontSize: 18}}>{this.props.selectedPlaces[i].data.structured_formatting.main_text}</Text>
							<Text style={{fontSize: 14}}>{this.props.selectedPlaces[i].data.structured_formatting.secondary_text}</Text>
						</View>
					</Card>
				</View>
			)
		}

		this.setState({ cardList: cardList })
	}

	componentWillReceiveProps(nextProps) {
		var cardList = []

		for (i=0; i<this.props.selectedPlaces.length; i++) {
			cardList.push(
				<View key={i} style={{marginBottom: 8}}>
					<Card style={{ container: this.state.styles.card }}>
						{ this.props.editPlace ?
							<Button
								onPress={this.props.deletePlace.bind(this, i)}
								text='X'
								style={{
									container: this.state.styles.buttonContainer,
									text: this.state.styles.buttonText
								}} />
							:
							<Text style={{fontSize: 16, paddingTop: 24}}></Text>
						}
						<View style={this.state.styles.text}>
							<Text style={{fontSize: 18}}>{this.props.selectedPlaces[i].data.structured_formatting.main_text}</Text>
							<Text style={{fontSize: 14}}>{this.props.selectedPlaces[i].data.structured_formatting.secondary_text}</Text>
						</View>
					</Card>
				</View>
			)
		}

		this.setState({ cardList: cardList })
	}

	render() {

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
		backgroundColor: ColorsDay.background,
		paddingLeft: 8,
		paddingRight: 8,
		paddingTop: 8
	},
	text: {
		paddingBottom: 16,
		paddingLeft: 16,
		paddingRight: 16
	},
	buttonContainer: {
		alignSelf: 'flex-end',
		backgroundColor: ColorsDay.primary,
		padding: 0,
		width: 42,
		height: 32
	},
	buttonText: {
		color: ColorsDay.white,
		fontSize: 16
	},
	card: {
		backgroundColor: ColorsDay.primary
	}
})

const stylesNight = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'stretch',
		backgroundColor: ColorsNight.background,
		paddingLeft: 8,
		paddingRight: 8,
		paddingTop: 8
	},
	text: {
		paddingBottom: 16,
		paddingLeft: 16,
		paddingRight: 16
	},
	buttonContainer: {
		alignSelf: 'flex-end',
		backgroundColor: ColorsNight.primary,
		padding: 0,
		width: 42,
		height: 32
	},
	buttonText: {
		color: ColorsNight.black,
		fontSize: 16
	},
	card: {
		backgroundColor: ColorsNight.primary
	}
})
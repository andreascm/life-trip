import React, { Component } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { ActionButton, Toolbar } from 'react-native-material-ui'

import Router from '../navigation/Router'
import ColorsDay from '../constants/ColorsDay'
import ColorsNight from '../constants/ColorsNight'
import Util from '../util'

import PlanList from '../components/PlanList'

export default class PlannerScreen extends Component {
	static route = {
		navigationBar: {
			visible: false
		}
	}

	state = {
		planList: {},
		searchList: {},
		searchMode: false,

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
		Util.plan.getAllPlan((error, result) => {
			if (error) {
				console.log(error)
			} else {
				this.setState({ planList: result })
			}
		})

		Util.plan.addChildAddedListener((key, value) => {
			var planList = this.state.planList
			planList[key] = value
			this.setState({ planList: planList })
		})

		Util.plan.addChildChangedListener((key, value) => {
			var planList = this.state.planList
			planList[key] = value
			this.setState({ planList: planList })
		})

		Util.plan.addChildRemovedListener((key, value) => {
			var planList = this.state.planList
			delete planList[key]
			this.setState({ planList: planList })
		})
	}

	handleAddPlan = () => {
		this.props.navigator.push(Router.getRoute('newPlan', {
			toolbarTitle: 'New Plan',
			title: '',
			index: null,
			startDate: new Date((new Date()).setHours(0,0,0,0)),
			endDate: new Date((new Date()).setHours(0,0,0,0)),
			selectedDate: new Date((new Date()).setHours(0,0,0,0)),
			selectedPlaces: []
		}))
	}

	editPlan = (data, key) => {
		var selectedPlaces = []

		for (var i=0; i<data.clusters.length; i++) {
			for (var j=0; j<data.clusters[i].length; j++) {
				selectedPlaces.push(data.clusters[i][j])
			}
		}

		this.props.navigator.push(Router.getRoute('newPlan', {
			toolbarTitle: 'Edit Plan',
			title: data.name,
			index: key,
			startDate: new Date(data.startDate),
			endDate: new Date(data.endDate),
			selectedDate: new Date(data.startDate),
			selectedPlaces: selectedPlaces
		}))
	}

	searchPlan = (keyword) => {
		var keys = Object.keys(this.state.planList),
			result = {}

		for (var i=0; i<keys.length; i++) {
			console.log(this.state.planList[keys[i]].name.toLowerCase().indexOf(keyword.toLowerCase()))
			if (this.state.planList[keys[i]].name.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
				result[keys[i]] = this.state.planList[keys[i]]
			}
		}

		this.setState({
			searchList: result,
			searchMode: true
		})
	}

	endSearch = () => {
		this.setState({
			searchMode: false,
			searchList: {}
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
					centerElement='Planner'
					searchable={{
						autoFocus: true,
						placeholder: 'Enter plan title',
						onChangeText: (keyword) => this.searchPlan(keyword),
						onSearchClosed: this.endSearch.bind(this)
					}} />
				<ScrollView>
					<View style={this.state.styles.form}>
						{ this.state.searchMode ?
							<PlanList planList={this.state.searchList} editPlan={this.editPlan}/>
							: <PlanList planList={this.state.planList} editPlan={this.editPlan}/>
						}
					</View>
				</ScrollView>
				<ActionButton
					style={{
						container: this.state.styles.actionButton,
						speedDialActionIcon: this.state.styles.actionButton
					}}
					icon="create"
					onPress={this.handleAddPlan.bind(this)} />
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
	form: {
		flex: 1,
		padding: 16
	},
	toolbar: {
		backgroundColor: ColorsDay.primary
	},
	actionButton: {
		backgroundColor: ColorsDay.secondary
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
		backgroundColor: ColorsNight.background
	},
	form: {
		flex: 1,
		padding: 16
	},
	toolbar: {
		backgroundColor: ColorsNight.primary
	},
	actionButton: {
		backgroundColor: ColorsNight.secondary
	},
	titleText: {
		color: ColorsNight.black,
		fontWeight: 'bold'
	}
})
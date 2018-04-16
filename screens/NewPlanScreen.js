import React, { Component } from 'react'
import { DatePickerAndroid, DatePickerIOS, Platform, ScrollView, StyleSheet, Text, View } from 'react-native'
import { ActionButton, Dialog, DialogDefaultActions, Toolbar } from 'react-native-material-ui'
import { MKTextField } from 'react-native-material-kit'
import RNGooglePlaces from 'react-native-google-places'

import async from 'async'

import Router from '../navigation/Router'
import ColorsDay from '../constants/ColorsDay'
import ColorsNight from '../constants/ColorsNight'
import Util from '../util'
import PlaceList from '../components/PlaceList'

export default class NewPlanScreen extends Component {
	static route = {
		navigationBar: {
			visible: false
		}
	}

	static defaultProps = {
		selectedDate: new Date((new Date()).setHours(0,0,0,0)),
		startDate: new Date((new Date()).setHours(0,0,0,0)),
		endDate: new Date((new Date()).setHours(0,0,0,0)),
		timeZoneOffsetInHours: (-1) * (new Date((new Date()).setHours(0,0,0,0))).getTimezoneOffset() / 60,

		title: '',
		selectedPlaces: []
	}

	state = {
		title: this.props.title,
		startDate: this.props.startDate,
		endDate: this.props.endDate,

		selectedDate: this.props.selectedDate,
		timeZoneOffsetInHours: this.props.timeZoneOffsetInHours,
		iOSDatePickerOpen: false,

		dateType: 'start',

		selectedPlaces: this.props.selectedPlaces,

		deleteDialogOpen: false,

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

	startDatePicker = async () => {
		this.setState({
			dateType: 'start'
		})
		if (Platform.OS === 'ios') {
			this.setState({
				iOSDatePickerOpen: true
			})
		} else if (Platform.OS === 'android') {
			try {
				const {action, year, month, day} = await DatePickerAndroid.open({
					date: this.state.selectedDate,
					minDate: new Date()
				})
				if (action === DatePickerAndroid.dismissedAction) {
					var date = new Date(year, month, day)
					this.setState({ selectedDate: date })
				} else {
					var date = new Date(year, month, day)

					this.setState({
						startDate: date,
						selectedDate: date
					})	
				}
			} catch ({code, message}) {
				console.warn('Cannot open date picker', message);
			}
		}
	}

	endDatePicker = async () => {
		this.setState({
			dateType: 'end'
		})
		if (Platform.OS === 'ios') {
			this.setState({
				iOSDatePickerOpen: true
			})
		} else if (Platform.OS === 'android') {
			try {
				const {action, year, month, day} = await DatePickerAndroid.open({
					date: this.state.selectedDate,
					minDate: new Date()
				})
				if (action === DatePickerAndroid.dismissedAction) {
					var date = new Date(year, month, day)
					this.setState({ selectedDate: date })
				} else {
					var date = new Date(year, month, day)

					this.setState({
						endDate: date,
						selectedDate: date
					})
				}
			} catch ({code, message}) {
				console.warn('Cannot open date picker', message);
			}
		}
	}

	onDateChange = (date) => {
		this.setState({selectedDate: date})
	}

	onTimezoneChange = (event) => {
		var offset = parseInt(event.nativeEvent.text, 10)
		if (isNaN(offset)) {
		  return;
		}
		this.setState({timeZoneOffsetInHours: offset})
	}

	handleSelectDateAction = (action) => {
		if (action === 'Confirm') {
			if (this.state.dateType === 'start') {
				this.setState({
					startDate: this.state.selectedDate
				})
			} else if (this.state.dateType === 'end') {
				this.setState({
					endDate: this.state.selectedDate
				})
			}
		} else {
			this.setState({
				iOSDatePickerOpen: false
			})
		}
	}

	handleDeletePlanAction = (action) => {
		if (action === 'Yes') {
			if (this.props.index !== null) {
				Util.plan.deletePlan(this.props.index)
			}

			this.setState({
				deleteDialogOpen: false
			})

			this.props.navigator.pop()
		} else {
			this.setState({
				deleteDialogOpen: false
			})
		}
	}

	handleAction = (action) => {
		if (action === 'add-location') {
			this.handleAddPlace()
		} else if (action === 'assignment') {
			this.props.navigator.push(Router.getRoute('planSummary', {
				title: this.state.title,
				startDate: this.state.startDate,
				endDate: this.state.endDate,
				selectedPlaces: this.state.selectedPlaces,
				index: this.props.index
			}))
		} else if (action === 'delete') {
			this.setState({
				deleteDialogOpen: true
			})
		}
	}

	handleAddPlace = () => {
		this.props.navigator.push(Router.getRoute('addPlace', { getAddedPlace: this.handleGetAddedPlace }))
	}

	handleGetAddedPlace = (place) => {
		var selectedPlaces = this.state.selectedPlaces
		selectedPlaces.push(place)
		this.setState({
			selectedPlaces: selectedPlaces
		})
	}

	handleDeletePlace = (index) => {
		var selectedPlaces = this.state.selectedPlaces
		selectedPlaces.splice(index, 1)
		this.setState({
			selectedPlaces: selectedPlaces
		})
	}

 	render = () => {
 		console.log(this.state.startDate)
		return (
			<View style={this.state.styles.container}>
				<Toolbar
					style={{
						container: this.state.styles.toolbar,
						titleText: this.state.styles.titleText,
						leftElement: { color: this.state.colors.background }
					}}
					leftElement='arrow-back'
					centerElement={this.props.toolbarTitle}
					onLeftElementPress={() => this.props.navigator.pop()} />
				<ScrollView>
					<View style={this.state.styles.form}>
						<MKTextField
							style={this.state.styles.textField}
		        			autoCorrect={false}
							placeholder="Plan Title"
							textInputStyle={this.state.styles.textInput}
							tintColor={this.state.colors.primaryLight}
							highlightColor={this.state.colors.primaryLight}
							placeholderTextColor={this.state.colors.primaryLight}
							returnKeyType='next'
							floatingLabelEnabled={true}
							allowFontScaling={true}
							floatingLabelBottomMargin={45}
							onChangeText={(title) => this.setState({title})}
							value={this.state.title} />
						<View style={{flex: 1, flexDirection: 'row', marginTop: 8}}>
							<MKTextField
								style={this.state.styles.dateField}
			        			autoCorrect={false}
								placeholder="Start Date"
								textInputStyle={this.state.styles.textInput}
								tintColor={this.state.colors.primaryLight}
								highlightColor={this.state.colors.primaryLight}
								placeholderTextColor={this.state.colors.primaryLight}
								returnKeyType='next'
								floatingLabelEnabled={true}
								allowFontScaling={true}
								floatingLabelBottomMargin={45}
								onChangeText={(startDate) => this.setState({startDate})}
								onFocus={this.startDatePicker.bind(this)}
								value={this.state.startDate.toDateString()} />
							<Text style={{fontSize: 20, marginTop: 20, marginLeft: 16, marginRight: 16, color: this.state.colors.text}}>to</Text>
							<MKTextField
								style={this.state.styles.dateField}
			        			autoCorrect={false}
								placeholder="End Date"
								textInputStyle={this.state.styles.textInput}
								tintColor={this.state.colors.primaryLight}
								highlightColor={this.state.colors.primaryLight}
								placeholderTextColor={this.state.colors.primaryLight}
								returnKeyType='next'
								floatingLabelEnabled={true}
								allowFontScaling={true}
								floatingLabelBottomMargin={45}
								onChangeText={(endDate) => this.setState({endDate})}
								onFocus={this.endDatePicker.bind(this, 'end')}
								value={this.state.endDate.toDateString()} />
						</View>
						<View style={{flex: 1, marginTop: 32}}>
							<Text style={{fontSize: 20, color: this.state.colors.text}}>Places</Text>
						</View>
					</View>
					<PlaceList
						editPlace={true}
						selectedPlaces={this.state.selectedPlaces}
						deletePlace={this.handleDeletePlace} />
				</ScrollView>
				<ActionButton
					style={{
						container: this.state.styles.actionButton,
						speedDialActionIcon: this.state.styles.actionButton
					}}
					actions={[{icon: 'delete', label: 'Delete Plan', name: 'delete'}, {icon: 'add-location', label: 'Add Place', name: 'add-location'}, {icon: 'assignment', label: 'Make Plan', name: 'assignment'}]}
                    icon='add'
                    transition='speedDial'
                    onPress={(action) => this.handleAction(action)} />
				{ this.state.iOSDatePickerOpen ?
					<View style={this.state.styles.dialog}>
						<Dialog>
	                        <Dialog.Title><Text>Select a date</Text></Dialog.Title>
	                        <Dialog.Content>
	                            <DatePickerIOS
									date={this.state.selectedDate}
									mode="date"
									timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
									onDateChange={this.onDateChange} />
	                        </Dialog.Content>
	                        <Dialog.Actions>
	                            <DialogDefaultActions
	                                actions={['Cancel', 'Confirm']}
	                                onActionPress={(action) => {this.handleSelectDateAction(action)}} />
	                        </Dialog.Actions>
	                    </Dialog>
                    </View>
					: <View></View>
				}
				{ this.state.deleteDialogOpen ?
					<View style={this.state.styles.dialog}>
						<Dialog>
							<Dialog.Title><Text>Delete Plan</Text></Dialog.Title>
							<Dialog.Content>
								<Text>Are you sure you want to delete this plan?</Text>
							</Dialog.Content>
							<Dialog.Actions>
								<DialogDefaultActions
									actions={['No', 'Yes']}
									onActionPress={(action) => {this.handleDeletePlanAction(action)}} />
							</Dialog.Actions>
						</Dialog>
					</View>
					: <View></View>
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
		alignItems: 'stretch',
		backgroundColor: ColorsDay.background
	},
	form: {
		flex: 1,
		paddingLeft: 16,
		paddingRight: 16,
		paddingTop: 20
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
	dateField: {
		height: 50,
		width: '43%',
		marginBottom: 16
	},
	dialog: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: 'center',
		alignItems: 'center'
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
		paddingLeft: 16,
		paddingRight: 16,
		paddingTop: 20
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
	dateField: {
		height: 50,
		width: '43%',
		marginBottom: 16
	},
	dialog: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: 'center',
		alignItems: 'center'
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
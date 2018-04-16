import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { COLOR, ThemeProvider} from 'react-native-material-ui'
import { Provider } from 'react-redux'

import { AppLoading, Asset, Font } from 'expo'
import { NavigationProvider, NavigationContext, StackNavigation } from '@expo/ex-navigation'

import Router from './navigation/Router'
import Store from './state/Store'

const navigationContext = new NavigationContext({
	router: Router,
	store: Store,
})

cacheImages = (images) => {
	return images.map(image => {
		if (typeof image === 'string') {
			return Image.prefetch(image);
		} else {
			return Asset.fromModule(image).downloadAsync();
		}
	})
}

cacheFonts = (fonts) => {
	return fonts.map(font => Font.loadAsync(font));
}

export default class App extends React.Component {
	state = {
		isReady: false
	}

	loadAssetsAsync = async () => {
		const imageAssets = cacheImages([
			require('./constants/flip-flops.png'),
			])

		const fontAssets = cacheFonts([
			{ 'Roboto': require('./constants/Roboto-Regular.ttf') }
			])

		await Promise.all([...imageAssets, ...fontAssets]);
	}

	render() {
		const uiTheme = {
			palette: {
				primaryColor: '#3AA5E6',
			},
			toolbar: {
				container: {
					height: 50,
				},
			}
		}

		if (!this.state.isReady) {
			return (
				<AppLoading
					startAsync={this.loadAssetsAsync}
					onFinish={() => this.setState({ isReady: true })}
					onError={console.warn} />
			)
		}

		return (
			<Provider store={Store}>
				<NavigationProvider router={Router} context={navigationContext}>
					<ThemeProvider uiTheme={uiTheme}>
						<View style={styles.container}>
							<StackNavigation
								id='root'
								defaultRouteConfig={{navigationBar: {backgroundColor: '#ffffff'}}}
								initialRoute={Router.getRoute('home')} />
						</View>
					</ThemeProvider>
				</NavigationProvider>
			</Provider>
			)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
})
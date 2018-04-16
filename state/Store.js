import { createNavigationEnabledStore, NavigationReducer } from '@expo/ex-navigation'
import { combineReducers, createStore } from 'redux'

const createStoreWithNavigation = createNavigationEnabledStore({
	createStore,
	navigationStateKey: 'navigation'
})

const store = createStoreWithNavigation(
	combineReducers({
		navigation: NavigationReducer
	})
)

export default store
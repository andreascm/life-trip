import { createRouter } from '@expo/ex-navigation'

import HomeScreen from '../screens/HomeScreen'
import SignUpScreen from '../screens/SignUpScreen'
import SignInScreen from '../screens/SignInScreen'
import PlannerScreen from '../screens/PlannerScreen'
import NewPlanScreen from '../screens/NewPlanScreen'
import AddPlaceScreen from '../screens/AddPlaceScreen'
import PlanSummaryScreen from '../screens/PlanSummaryScreen'

export default createRouter(() => ({
	home: () => HomeScreen,
	signUp: () => SignUpScreen,
	signIn: () => SignInScreen,
	planner: () => PlannerScreen,
	newPlan: () => NewPlanScreen,
	addPlace: () => AddPlaceScreen,
	planSummary: () => PlanSummaryScreen
}), {
	ignoreSerializableWarnings: true
})
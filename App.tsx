import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import RootScreen from './src/screens/Root';
import { Create_AccountScreen } from './src/screens/Create_Account';
import { AlertNotificationRoot } from 'react-native-alert-notification';
import { HomeScreen } from './src/screens/Home';
import { TransactionScreen } from './src/screens/Transaction';
import { ProfileScreen } from './src/screens/Profile';



export type RootParamList = {

  Root: undefined;
  Create_Account: undefined;
  Home: undefined;
  Transaction:undefined;
  Profile:undefined

}

const Stack = createNativeStackNavigator<RootParamList>();

export default function App() {
  return (

    <AlertNotificationRoot>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Root" component={RootScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Create_Account" component={Create_AccountScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Transaction" component={TransactionScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </AlertNotificationRoot>

  );
}


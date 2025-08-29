import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import RootScreen from './src/screens/Root';
import { Create_AccountScreen } from './src/screens/Create_Account';

export type RootParamList = {

  Root: undefined;
  Create_Account: undefined;

}

const Stack = createNativeStackNavigator<RootParamList>();

export default function App() {
  return (
    
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Root" component={RootScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Create_Account" component={Create_AccountScreen} options={{headerShown:false}}/>
      </Stack.Navigator>
    </NavigationContainer>

  );
}


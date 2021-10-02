import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';
import Dashboard from './Dashboard';
import Setting from './Setting';
import Datalog from './Datalog';
const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Dashboard" component={Dashboard} options={{
          statusBarHidden: true,
          headerShown: false
        }} />
        <Stack.Screen name="Setting" component={Setting} options={{
          statusBarHidden: true,
          headerShown: false
        }} />
        <Stack.Screen name="Datalog" component={Datalog} options={{
          statusBarHidden: true,
          headerShown: false
        }} />
      </Stack.Navigator>
    </NavigationContainer>

  );
}
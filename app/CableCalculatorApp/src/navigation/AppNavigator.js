import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CableCalculatorScreen from '../screens/CableCalculatorScreen';
import ResultsScreen from '../screens/ResultsScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Calculator"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2196F3',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Calculator"
          component={CableCalculatorScreen}
          options={{
            title: 'Cable Calculator',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Results"
          component={ResultsScreen}
          options={{
            title: 'Results',
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 
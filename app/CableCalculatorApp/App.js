import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CableCalculatorScreen from './src/screens/CableCalculatorScreen';
import ResultsScreen from './src/screens/ResultsScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Calculator"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#2563eb',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}>
          <Stack.Screen 
            name="Calculator" 
            component={CableCalculatorScreen}
            options={{
              title: '🔌 Cable Calculator',
              headerTitleAlign: 'center',
            }}
          />
          <Stack.Screen 
            name="Results" 
            component={ResultsScreen}
            options={{
              title: '📊 Results',
              headerTitleAlign: 'center',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App; 
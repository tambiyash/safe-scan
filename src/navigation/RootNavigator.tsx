// SafeScan Root Navigator

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootStackParamList } from './types';
import {
  ScannerScreen,
  AnalyzingScreen,
  SimulationDetectedScreen,
  SuccessScreen,
  MaliciousPhishScreen,
  SafeLinkScreen,
  IsolatedBrowserScreen,
} from '../screens';
import { colors } from '../theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Scanner"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.ui.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Scanner" component={ScannerScreen} />
        <Stack.Screen 
          name="Analyzing" 
          component={AnalyzingScreen}
          options={{
            animation: 'fade',
            presentation: 'transparentModal',
          }}
        />
        <Stack.Screen 
          name="SimulationDetected" 
          component={SimulationDetectedScreen}
          options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen 
          name="Success" 
          component={SuccessScreen}
          options={{ animation: 'fade' }}
        />
        <Stack.Screen 
          name="MaliciousPhish" 
          component={MaliciousPhishScreen}
          options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen 
          name="SafeLink" 
          component={SafeLinkScreen}
          options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen 
          name="IsolatedBrowser" 
          component={IsolatedBrowserScreen}
          options={{ 
            animation: 'slide_from_bottom',
            presentation: 'fullScreenModal',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

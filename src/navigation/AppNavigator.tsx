/**
 * App Navigator
 * Main navigation configuration for MirrorMe
 */

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { MirrorSessionScreen } from '../screens/MirrorSessionScreen';
import { AIChatScreen } from '../screens/AIChatScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { useOnboardingStore } from '../stores/onboardingStore';
import type { RootStackParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const onboardingCompleted = useOnboardingStore(state => state.completed);
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList>('Onboarding');

  useEffect(() => {
    // Determine initial route based on onboarding status
    setInitialRoute(onboardingCompleted ? 'Home' : 'Onboarding');
  }, [onboardingCompleted]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="MirrorSession" component={MirrorSessionScreen} />
        <Stack.Screen name="AIChat" component={AIChatScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

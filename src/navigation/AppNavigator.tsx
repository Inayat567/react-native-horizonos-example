import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '@/navigation/types';
import { InputScreen } from '@/screens/InputScreen';
import { SelfieCameraScreen } from '@/screens/SelfieCameraScreen';
import { BackgroundAudioScreen } from '@/screens/BackgroundAudioScreen';
import { NewAppScreen } from '@/screens/NewAppScreen';

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="NewApp"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="NewApp" component={NewAppScreen} />
        <Stack.Screen name="Input" component={InputScreen} />
        <Stack.Screen name="SelfieCamera" component={SelfieCameraScreen} />
        <Stack.Screen
          name="BackgroundAudio"
          component={BackgroundAudioScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

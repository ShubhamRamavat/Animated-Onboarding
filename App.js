import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import Details from './src/screens/Details/Details';
import Onboarding from './src/screens/Onboarding/Onboarding';
import Home from './src/screens/Home/Home';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AsyncStorageKeys,
  eventEmitter,
  EventEmitterKeys,
  ScreenName,
} from './src/Constants/Constants';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

export default App = () => {
  const Stack = createNativeStackNavigator();
  const [isOnboarding, setOnBoarding] = useState(null);

  useEffect(() => {
    getOnBoardingStatus();

    eventEmitter.addListener(EventEmitterKeys.OnboardingStatusChange, () => {
      getOnBoardingStatus();
    });
  }, []);

  const getOnBoardingStatus = async () => {
    const temp = await AsyncStorage.getItem(AsyncStorageKeys.isOnboaring);
    setOnBoarding(temp === 'true');
  };

  if (isOnboarding === null) {
    return <GestureHandlerRootView style={{flex: 1}} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName={
          isOnboarding ? ScreenName.Home : ScreenName.Onboarding
        }>
        <Stack.Screen name={ScreenName.Onboarding} component={Onboarding} />
        <Stack.Screen name={ScreenName.Home} component={Home} />
        <Stack.Screen name={ScreenName.Details} component={Details} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

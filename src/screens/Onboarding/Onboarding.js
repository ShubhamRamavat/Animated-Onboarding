import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {
  AsyncStorageKeys,
  eventEmitter,
  EventEmitterKeys,
  ScreenName,
} from '../../Constants/Constants';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const Onboarding = ({navigation}) => {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);

  // Animated values for screen transitions and animations
  const translateX = useSharedValue(0);

  // Onboarding screens data
  const screens = [
    {
      title: 'Welcome to Our App',
      description: 'Discover a world of possibilities at your fingertips.',
      backgroundColor: '#6A5ACD',
    },
    {
      title: 'Seamless Experience',
      description: 'Enjoy a smooth and intuitive interface designed for you.',
      backgroundColor: '#20B2AA',
    },
    {
      title: 'Get Started',
      description: 'Everything you need, right here and right now.',
      backgroundColor: '#FF6347',
    },
  ];

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const hasCompletedOnboarding = await AsyncStorage.getItem(
        AsyncStorageKeys.isOnboaring,
      );
      if (hasCompletedOnboarding) {
        setIsOnboardingComplete(true);
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    }
  };

  const markOnboardingComplete = async () => {
    try {
      await AsyncStorage.setItem(AsyncStorageKeys.isOnboaring, 'true');
      eventEmitter.emit(EventEmitterKeys.OnboardingStatusChange);
      navigation.navigate(ScreenName.Home);
    } catch (error) {
      console.error('Error marking onboarding complete:', error);
    }
  };

  const handleNext = () => {
    if (currentScreen < screens.length - 1) {
      translateX.value = withTiming(-SCREEN_WIDTH * (currentScreen + 1), {
        duration: 300,
      });
      setCurrentScreen(prev => prev + 1);
    } else {
      markOnboardingComplete();
    }
  };

  const handlePrevious = () => {
    if (currentScreen > 0) {
      translateX.value = withTiming(-SCREEN_WIDTH * (currentScreen - 1), {
        duration: 300,
      });
      setCurrentScreen(prev => prev - 1);
    }
  };

  const animatedScreenStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: translateX.value}],
      opacity: interpolate(
        translateX.value,
        [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
        [0.5, 1, 0.5],
        Extrapolate.CLAMP,
      ),
    };
  });

  const renderScreen = (screen, index) => (
    <Animated.View
      key={index}
      style={[
        styles.screenContainer,
        {backgroundColor: screen.backgroundColor},
        animatedScreenStyle,
      ]}>
      <Text style={styles.titleText}>{screen.title}</Text>
      <Text style={styles.descriptionText}>{screen.description}</Text>
    </Animated.View>
  );

  // If onboarding is complete, return null or your main app component
  if (isOnboardingComplete) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.screenWrapper}>{screens.map(renderScreen)}</View>

      <View style={styles.navigationContainer}>
        {currentScreen > 0 && (
          <TouchableOpacity onPress={handlePrevious} style={styles.navButton}>
            <Text style={styles.navButtonText}>Previous</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={handleNext}
          style={[
            styles.navButton,
            {backgroundColor: screens[currentScreen].backgroundColor},
          ]}>
          <Text style={styles.navButtonText}>
            {currentScreen < screens.length - 1 ? 'Next' : 'Get Started'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        {screens.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              {
                backgroundColor:
                  index === currentScreen ? '#FFFFFF' : 'rgba(255,255,255,0.5)',
              },
            ]}
          />
        ))}
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenWrapper: {
    flexDirection: 'row',
    width: SCREEN_WIDTH * 3,
  },
  screenContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 15,
  },
  descriptionText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  navigationContainer: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  navButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  navButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  progressContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
});

export default Onboarding;

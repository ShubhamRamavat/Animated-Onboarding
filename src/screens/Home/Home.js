import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
} from 'react-native-gesture-handler';
import {ScreenName} from '../../Constants/Constants';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

export default Home = ({navigation}) => {
  const translateX = useSharedValue(0);
  const [gestureState, setGestureState] = useState(0);

  const navigateToDetails = () => {
    navigation.navigate(ScreenName.Details);
  };

  const onGestureEvent = event => {
    translateX.value = event.nativeEvent.translationX;
  };

  const onHandlerStateChange = event => {
    if (event.nativeEvent.state === State.END) {
      if (event.nativeEvent.translationX < -100) {
        navigateToDetails();
      }

      // Reset translation
      translateX.value = withTiming(0);
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
      ],
      opacity: interpolate(
        translateX.value,
        [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
        [0.5, 1, 0.5],
        Extrapolate.CLAMP,
      ),
    };
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}>
        <Animated.View
          style={[
            styles.contentContainer,
            animatedStyle,
            {backgroundColor: '#6A5ACD'},
          ]}>
          <Text style={styles.titleText}>Welcome Home</Text>
          <Text style={styles.subtitleText}>
            Swipe Left to Navigate to Details Screen
          </Text>

          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={navigateToDetails}>
              <Text style={styles.actionButtonText}>Go to Details</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6A5ACD',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 30,
  },
  actionContainer: {
    marginTop: 20,
  },
  actionButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    color: '#6A5ACD',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

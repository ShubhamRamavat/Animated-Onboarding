import EventEmitter from 'react-native/Libraries/vendor/emitter/EventEmitter';

export const eventEmitter = new EventEmitter();

export const ScreenName = {
  Onboarding: 'Onboarding',
  Home: 'Home',
  Details: 'Details',
};

export const AsyncStorageKeys = {
  isOnboaring: 'isOnboaring',
};

export const EventEmitterKeys = {
  OnboardingStatusChange: 'OnboardingStatusChange',
};

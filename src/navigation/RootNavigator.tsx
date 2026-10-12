import React from 'react';
import { useAuth } from '../auth/AuthContext';
import Loading from '../components/Loading';
import { LocationProvider } from '../location/LocationContext';
import LoginScreen from '../screens/login/LoginScreen';
import MainTabs from './MainTabs';

// Auth gate. Once signed in, live location is primed and provided to every
// screen (asks for location permission when the app opens).
export default function RootNavigator() {
  const { user, ready } = useAuth();
  if (!ready) {
    return <Loading label="Starting…" />;
  }
  return user ? (
    <LocationProvider>
      <MainTabs />
    </LocationProvider>
  ) : (
    <LoginScreen />
  );
}

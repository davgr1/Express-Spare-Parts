import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';
import SplashScreen from '../screens/auth/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import MainTabs from './MainTabs'; 

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { isLoading, userToken } = useContext(AuthContext);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userToken == null ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        <Stack.Screen name="MainApp" component={MainTabs} />
      )}
    </Stack.Navigator>
  );
}

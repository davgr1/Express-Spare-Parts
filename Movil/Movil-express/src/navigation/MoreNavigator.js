import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MoreScreen from '../screens/more/MoreScreen';
import AboutUsScreen from '../screens/more/AboutUsScreen';
import ContactScreen from '../screens/more/ContactScreen';
import ReviewsScreen from '../screens/more/ReviewsScreen';
import TermsScreen from '../screens/more/TermsScreen';

const Stack = createNativeStackNavigator();

export default function MoreNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1e3d8a',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerBackTitle: 'Volver',
      }}
    >
      <Stack.Screen
        name="MoreMain"
        component={MoreScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AboutUs"
        component={AboutUsScreen}
        options={{ title: '¿Quiénes Somos?' }}
      />
      <Stack.Screen
        name="Contact"
        component={ContactScreen}
        options={{ title: 'Contáctenos' }}
      />
      <Stack.Screen
        name="Reviews"
        component={ReviewsScreen}
        options={{ title: 'Valoraciones y Reseñas' }}
      />
      <Stack.Screen
        name="Terms"
        component={TermsScreen}
        options={{ title: 'Términos y Condiciones' }}
      />
    </Stack.Navigator>
  );
}

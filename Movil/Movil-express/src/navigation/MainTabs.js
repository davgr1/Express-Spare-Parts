import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';

const Tab = createBottomTabNavigator();

function PlaceholderScreen({ title }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{title}</Text>
    </View>
  );
}

export default function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Shop" children={() => <PlaceholderScreen title="Catálogo" />} />
      <Tab.Screen name="Cart" children={() => <PlaceholderScreen title="Carrito" />} />
      <Tab.Screen name="Profile" children={() => <PlaceholderScreen title="Perfil" />} />
    </Tab.Navigator>
  );
}

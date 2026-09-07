import React, { useContext, useState } from 'react';
import { TouchableOpacity, Alert, StyleSheet, Modal, View, Text, Pressable } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import ShopScreen from '../screens/ShopScreen';
import CartScreen from '../screens/CartScreen';
import PromoScreen from '../screens/PromoScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { AuthContext } from '../context/AuthContext';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  const { logout } = useContext(AuthContext);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const navigation = useNavigation();

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: () => logout(),
        },
      ]
    );
  };

  const handleMoreMenuOption = (screenName) => {
    setIsMoreMenuOpen(false);
    navigation.navigate('MoreScreens', { screen: screenName });
  };

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Productos') {
              iconName = focused ? 'cube' : 'cube-outline';
            } else if (route.name === 'Promociones') {
              iconName = focused ? 'pricetag' : 'pricetag-outline';
            } else if (route.name === 'Carrito') {
              iconName = focused ? 'cart' : 'cart-outline';
            } else if (route.name === 'Perfil') {
              iconName = focused ? 'person' : 'person-outline';
            } else if (route.name === 'Más') {
              iconName = focused || isMoreMenuOpen ? 'settings' : 'settings-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#2563eb',
          tabBarInactiveTintColor: '#94a3b8',
          headerShown: true,
          headerRight: () => (
            <TouchableOpacity
              style={styles.headerLogoutBtn}
              onPress={handleLogout}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="log-out-outline" size={24} color="#ef4444" />
            </TouchableOpacity>
          ),
        })}
      >
        <Tab.Screen name="Productos" component={ShopScreen} />
        <Tab.Screen name="Promociones" component={PromoScreen} />
        <Tab.Screen name="Carrito" component={CartScreen} />
        <Tab.Screen name="Perfil" component={ProfileScreen} />
        <Tab.Screen
          name="Más"
          component={() => null}
          options={{
            headerShown: false,
            tabBarLabel: 'Ver Más',
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              setIsMoreMenuOpen(!isMoreMenuOpen);
            },
          }}
        />
      </Tab.Navigator>

      <Modal
        visible={isMoreMenuOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsMoreMenuOpen(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setIsMoreMenuOpen(false)}>
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleMoreMenuOption('Terms')}>
              <Ionicons name="document-text-outline" size={20} color="#1f2937" style={styles.menuIcon} />
              <Text style={styles.menuText}>Términos y Condiciones</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem} onPress={() => handleMoreMenuOption('Contact')}>
              <Ionicons name="call-outline" size={20} color="#1f2937" style={styles.menuIcon} />
              <Text style={styles.menuText}>Contactos</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem} onPress={() => handleMoreMenuOption('AboutUs')}>
              <Ionicons name="information-circle-outline" size={20} color="#1f2937" style={styles.menuIcon} />
              <Text style={styles.menuText}>Sobre Nosotros</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem} onPress={() => handleMoreMenuOption('Reviews')}>
              <Ionicons name="star-outline" size={20} color="#1f2937" style={styles.menuIcon} />
              <Text style={styles.menuText}>Reseñas</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  headerLogoutBtn: {
    marginRight: 16,
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  menuContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 80, // Leave space for bottom tab bar if needed, or adjust
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  menuIcon: {
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
  }
});


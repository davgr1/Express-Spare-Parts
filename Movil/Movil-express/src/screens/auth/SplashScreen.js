import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Text } from 'react-native';

export default function SplashScreen() {
  const scaleValue = useRef(new Animated.Value(0)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.bounce,
        useNativeDriver: true,
      }),
      Animated.timing(opacityValue, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.logoContainer, 
          { 
            opacity: opacityValue,
            transform: [{ scale: scaleValue }] 
          }
        ]}
      >
        <View style={styles.mockLogo}>
          <Text style={styles.logoText}>eShop</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mockLogo: {
    width: 150,
    height: 150,
    backgroundColor: '#6C63FF',
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  logoText: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 2,
  }
});

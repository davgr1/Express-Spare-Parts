import React, { createContext, useState, useEffect } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        // let token = await AsyncStorage.getItem('userToken');
        setTimeout(() => {
          setUserToken(null); 
          setIsLoading(false);
        }, 2500); 
      } catch (e) {
        console.log("Error al obtener token", e);
        setIsLoading(false);
      }
    };

    checkToken();
  }, []);

  const login = (token) => {
    setUserToken(token);
  };

  const logout = () => {
    setUserToken(null);
  };

  return (
    <AuthContext.Provider value={{ isLoading, userToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

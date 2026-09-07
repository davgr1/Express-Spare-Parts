import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        // Splash screen delay
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

  const login = (token, user = null) => {
    setUserToken(token);
    setUserData(user);
  };

  const logout = () => {
    setUserToken(null);
    setUserData(null);
  };

  const updateUser = (newUserData) => {
    setUserData((prev) => ({ ...prev, ...newUserData }));
  };

  return (
    <AuthContext.Provider value={{ isLoading, userToken, userData, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

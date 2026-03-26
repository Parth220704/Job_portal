import { createContext, useState, useEffect } from "react";
import { getToken, setToken, removeToken } from "../api/token";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {

  const [isLoggedIn, setIsLoggedIn] = useState(!!getToken());

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Login
  const login = (data) => {
    setToken(data.token);

    setUser(data.user);
    localStorage.setItem("user", JSON.stringify(data.user));

    setIsLoggedIn(true);
  };

  // Logout
  const logout = () => {
    removeToken();

    setUser(null);
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

import { createContext, useState } from "react";
import { getToken, setToken, removeToken } from "../api/token"; // adjust path if needed

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!getToken());
  const [user, setUser] = useState(null);

  const login = (data) => {
    setToken(data.token);
    setUser(data.user);
    setIsLoggedIn(true);
  };

  const logout = () => {
    removeToken();
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

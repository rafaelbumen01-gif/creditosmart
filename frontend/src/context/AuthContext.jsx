import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/apiClient";
import { authApi } from "../api/services";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = api.getToken();
    if (token) {
      authApi
        .profile()
        .then((u) => setUser(u))
        .catch(() => {
          api.setToken(null);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const { user, token } = await authApi.login({ email, password });
    api.setToken(token);
    setUser(user);
    return user;
  };

  const register = async (name, email, password) => {
    const { user, token } = await authApi.register({ name, email, password });
    api.setToken(token);
    setUser(user);
    return user;
  };

  const logout = () => {
    api.setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}

import { createContext, useState, useEffect, useContext } from "react";
import { me, login as loginApi, register as registerApi, logout as logoutApi } from "../api/auth";
import { setAuthToken } from "../api/client";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await me();
      setUser(res.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const login = async (data) => {
    const res = await loginApi(data);
    const token = res.data?.accessToken || res.data?.token;
    if (token) setAuthToken(token);
    await load();
    return res;
  };

  const register = async (data) => {
    const res = await registerApi(data);
    const token = res.data?.accessToken || res.data?.token;
    if (token) setAuthToken(token);
    await load();
    return res;
  };

  const logout = async () => {
    await logoutApi();
    setUser(null);
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, loading, refresh: load }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

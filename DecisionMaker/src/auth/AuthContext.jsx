// src/auth/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const access_token = localStorage.getItem("access_token");
      if (!access_token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:4000/api/session", {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        const result = await res.json();
        if (res.ok && result.user) {
          setUser(result.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Session check failed", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // ✅ Add logout logic here
  const logout = async () => {
    try {
      const token = localStorage.getItem("access_token");

      if (token) {
        await fetch("http://localhost:4000/api/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      localStorage.removeItem("access_token");
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

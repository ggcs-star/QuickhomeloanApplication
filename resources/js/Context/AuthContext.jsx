import { createContext, useContext, useEffect, useState } from "react";
import api from "@/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isProUser, setIsProUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (!token) {
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return;
      }

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      await checkPro();

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkPro = async () => {
    try {
      const alreadyChecked = sessionStorage.getItem("pro_checked");

      if (alreadyChecked === "true") {
        const isPro = sessionStorage.getItem("is_pro_user") === "true";
        setIsProUser(isPro);
        return;
      }

      const res = await api.get("/check-access");

      if (res.data?.access) {
        setIsProUser(true);
        sessionStorage.setItem("is_pro_user", "true");
      } else {
        setIsProUser(false);
        sessionStorage.setItem("is_pro_user", "false");
      }

      sessionStorage.setItem("pro_checked", "true");
    } catch (err) {
      console.error(err);
    }
  };
  const refreshAuth = async () => {
    setLoading(true);

    try {
      // 🔥 clear old session cache
      sessionStorage.removeItem("pro_checked");

      // 🔥 reload everything
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (!token) {
        setUser(null);
        setIsProUser(false);
        return;
      }

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      await checkPro();

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <AuthContext.Provider value={{ user, isProUser, loading, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
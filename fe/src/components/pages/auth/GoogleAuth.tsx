import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";

type UserType = {
  id: number;
  ten: string;
  email: string;
  vai_tro_id: number;
  anh_dai_dien: string;
  google_id: string;
};

type GoogleAuthContextType = {
  loginWithGoogle: () => Promise<void>;
  handleGoogleCallback: () => Promise<void>;
  user: UserType | null;
  accessToken: string | null;
  loading: boolean;
  error: Error | null;
  logout: () => void;
};

type GoogleAuthProviderProps = {
  children: ReactNode;
};

const GoogleAuthContext = createContext<GoogleAuthContextType | undefined>(
  undefined
);

export const GoogleAuthProvider = ({ children }: GoogleAuthProviderProps) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 🔄 Load user từ localStorage khi trang tải
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (token && userStr) {
      setAccessToken(token);
      try {
        const parsedUser = JSON.parse(userStr);
        setUser(parsedUser);
      } catch (e) {
        console.error("❌ Lỗi parse user localStorage:", e);
      }
    }
  }, []);

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://127.0.0.1:8000/api/auth/google/redirect"
      );
      window.location.href = res.data.url;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleCallback = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      const userStr = params.get("user");
      const message = params.get("message");

      if (message) throw new Error(message);

      if (!token || !userStr) throw new Error("Thiếu token hoặc user");

      const parsedToken = decodeURIComponent(token);
      const parsedUser = JSON.parse(decodeURIComponent(userStr));
      const userId = parsedUser?.id;

      if (!userId) throw new Error("Không tìm thấy user.id");

      // 🚀 Gọi backend để lấy thông tin người dùng theo ID
      const res = await axios.get(
        `http://127.0.0.1:8000/api/client/nguoi_dung/${userId}`,
        {
          headers: { Authorization: `Bearer ${parsedToken}` },
        }
      );

      const fullUser = res.data?.data || res.data;

      // ✅ Lưu đầy đủ user vào state và localStorage
      setAccessToken(parsedToken);
      setUser(fullUser);
      localStorage.setItem("token", parsedToken);
      localStorage.setItem("user", JSON.stringify(fullUser));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(new Error(msg));
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    const token = localStorage.getItem("token");
    await axios.post("http://127.0.0.1:8000/api/logout", null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/"; 
  };

  return (
    <GoogleAuthContext.Provider
      value={{
        loginWithGoogle,
        handleGoogleCallback,
        user,
        accessToken,
        loading,
        error,
        logout,
      }}
    >
      {children}
    </GoogleAuthContext.Provider>
  );
};

export const useGoogleAuth = () => {
  const context = useContext(GoogleAuthContext);
  if (!context) {
    throw new Error("useGoogleAuth must be used within a GoogleAuthProvider");
  }
  return context;
};

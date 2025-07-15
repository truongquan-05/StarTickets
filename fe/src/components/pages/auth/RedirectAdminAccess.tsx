// src/pages/auth/RedirectAdminAccess.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RedirectAdminAccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(userData);
    const roleId = user?.vai_tro_id;

    if (roleId === 2 || roleId === null) {
      navigate("/", { state: { message: "Bạn không phải tài khoản được admin cung cấp" } });
    } else {
      navigate("/admin");
    }
  }, [navigate]);

  return null;
};

export default RedirectAdminAccess;

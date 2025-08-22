import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { message, Spin } from "antd";
import { useGoogleAuth } from "./GoogleAuth";

const GoogleCallback = () => {
  const { handleGoogleCallback } = useGoogleAuth();
  const navigate = useNavigate();
  const hasHandled = useRef(false); 
  useEffect(() => {
    if (hasHandled.current) return;
    hasHandled.current = true;

    (async () => {
      try {
        await handleGoogleCallback();
        message.success("Đăng nhập Google thành công!");
        navigate("/");
      } catch (err:any) {
        message.error( err.message||"Đăng nhập thất bại.");
        navigate("/login");
      }
    })();
  }, []);

  return (
    <div style={{ textAlign: "center", paddingTop: 100 }}>
      <Spin size="large" tip="Đang xử lý đăng nhập..." />
    </div>
  );
};

export default GoogleCallback;

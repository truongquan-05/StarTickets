import React, { useEffect, useRef, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Modal } from "antd";

interface NavigationBlockerProps {
  when: boolean;
  message: string;
  children: ReactNode;
}

export default function NavigationBlocker({
  when,
  message,
  children,
}: NavigationBlockerProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const lastLocation = useRef(location);

  const showWarning = () => {
    Modal.warning({
      title: "Không thể rời trang",
      content: message,
      okText: "OK",
    });
  };

  // Hàm chặn navigate
  const blockNavigate = (to: string | number) => {
    if (when) {
      showWarning();
      return;
    }
    if (typeof to === "string") {
      navigate(to);
    } else if (typeof to === "number") {
      navigate(to);
    }
  };

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (when) {
        e.preventDefault();
        showWarning();
        // Đẩy lại trang cũ sau khi back/forward
        setTimeout(() => {
          window.history.pushState(
            null,
            "",
            lastLocation.current.pathname + lastLocation.current.search
          );
        }, 0);
      } else {
        lastLocation.current = location;
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [location, when]);

  useEffect(() => {
    if (!when) {
      lastLocation.current = location;
    }
  }, [location, when]);

  return <>{children}</>;
}

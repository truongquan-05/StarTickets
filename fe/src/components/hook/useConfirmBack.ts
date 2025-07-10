import { useEffect, useRef } from "react";

export function useBackConfirm(selectedCheckGhe: any[]) {
  const selectedRef = useRef<any[]>([]);
  const confirmedRef = useRef(false);
  const hasFakeState = useRef(false);

  useEffect(() => {
    selectedRef.current = selectedCheckGhe;
  }, [selectedCheckGhe]);

  useEffect(() => {
    if (selectedRef.current.length === 0) return;

    const handlePopState = () => {
      if (confirmedRef.current) {
        console.log("🛑 Đã xác nhận, bỏ qua xử lý popstate");
        return;
      }

      const confirmed = window.confirm("Bạn có chắc chắn muốn quay lại không?");
      if (!confirmed) {
        window.history.pushState({ __keep: true }, "", window.location.pathname);
        hasFakeState.current = true;
      } else {
        confirmedRef.current = true;
        sendDataBeforeLeave();
        window.removeEventListener("popstate", handlePopState);
        history.back();
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (selectedRef.current.length === 0) return;
      e.preventDefault();
      e.returnValue = "";
    };

    const handleUnload = () => {
      sendDataBeforeLeave();
    };

    const sendDataBeforeLeave = () => {
      const dataUpdate = selectedRef.current.map((item: any) => ({
        id: item.id,
        lich_chieu_id: item.lich_chieu_id,
      }));
      if (dataUpdate.length === 0) return;

      const data = JSON.stringify({ data: dataUpdate });
      console.log("📤 Gửi API bằng sendBeacon...", data);
      navigator.sendBeacon("http://127.0.0.1:8000/api/check_ghe/bulk-update", data);
    };

    // ✅ Chỉ push state nếu chưa có
    if (!hasFakeState.current) {
      window.history.pushState({ __keep: true }, "", window.location.pathname);
      hasFakeState.current = true;
      console.log("🧱 Push giữ chân sau reload");
    }

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
      confirmedRef.current = false;
      hasFakeState.current = false;
    };
  }, [selectedCheckGhe.length]);
}
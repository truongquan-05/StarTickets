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
        return;
      }

      const confirmed = window.confirm("Bạn có chắc chắn muốn quay lại không?");
      if (!confirmed) {
        window.history.pushState(
          { __keep: true },
          "",
          window.location.pathname
        );
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
      navigator.sendBeacon(
        "http://127.0.0.1:8000/api/check_ghe/bulk-update",
        data
      );
    };

    // ✅ Chỉ push state nếu chưa có
    if (!hasFakeState.current) {
      window.history.pushState({ __keep: true }, "", window.location.pathname);
      hasFakeState.current = true;
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



export function useBackDelete(dat_ve_id: number) {
  const confirmedRef = useRef(false);
  const hasFakeState = useRef(false);
  const hasTriggeredOnce = useRef(false);

  useEffect(() => {
      const sendDataBeforeLeave = () => {
      if (!dat_ve_id || hasTriggeredOnce.current) return;
      hasTriggeredOnce.current = true;

      console.log("📤 Gửi API xoá vé với ID:", dat_ve_id);
      navigator.sendBeacon(`http://127.0.0.1:8000/api/delete-dat-ve/${dat_ve_id}`);
    };

    const handlePopState = () => {
      if (confirmedRef.current) return;

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
      e.preventDefault();
      e.returnValue = "";
    };

    const handleUnload = () => {
      sendDataBeforeLeave();
    };

    if (!hasFakeState.current) {
      window.history.pushState({ __keep: true }, "", window.location.pathname);
      hasFakeState.current = true;
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
  }, [dat_ve_id]);
}



// src/hooks/useBookingTimer.ts

import { useEffect, useRef, useCallback, useState } from 'react'; // 💡 Thêm useState
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

interface UseBookingTimerProps {
  selectedSeatsCount: number;
  selectedLichChieuId: number | null;
  onTimerEndCallback?: () => Promise<void>;
  timeoutMinutes?: number;
}

export const useBookingTimer = ({
  selectedSeatsCount,
  selectedLichChieuId,
  onTimerEndCallback,
  timeoutMinutes = 5,
}: UseBookingTimerProps) => {
  const timerRef = useRef<number | null>(null); // Để quản lý timer nghiệp vụ
  const intervalIdRef = useRef<number | null>(null); // 💡 Ref mới để quản lý interval UI
  const navigate = useNavigate();

  // 💡 STATE MỚI ĐỂ LƯU THỜI GIAN CÒN LẠI CHO UI
  const [remainingTime, setRemainingTime] = useState<number>(timeoutMinutes * 60);

  // Hàm callback khi timer nghiệp vụ kết thúc
  const handleTimerEnd = useCallback(async () => {
    message.warning(`Đã hết thời gian đặt vé (${timeoutMinutes} phút)! Vui lòng chọn lại ghế.`);
    if (onTimerEndCallback) {
      await onTimerEndCallback();
    }
    setRemainingTime(0); // Đảm bảo UI timer cũng về 0
    navigate('/');
  }, [onTimerEndCallback, navigate, timeoutMinutes]);


  // 💡 useEffect CHÍNH để quản lý CẢ TIMER NGHIỆP VỤ VÀ TIMER HIỂN THỊ
  useEffect(() => {
    // Luôn reset UI timer về thời gian ban đầu khi dependencies thay đổi
    // Hoặc khi có ghế được chọn/lịch chiếu được chọn để khởi động lại
    setRemainingTime(timeoutMinutes * 60);

    // Xóa tất cả các timer hiện có trước khi thiết lập lại
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }


    // Điều kiện khởi động CẢ HAI timer: Có ghế được chọn và có ID lịch chiếu
    if (selectedSeatsCount > 0 && selectedLichChieuId !== null) {

      // 1. Khởi tạo timer nghiệp vụ (cho việc hết giờ thực sự)
      timerRef.current = setTimeout(handleTimerEnd, timeoutMinutes * 60 * 1000);

      // 2. Khởi tạo interval cho UI đếm ngược
      intervalIdRef.current = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            // Khi UI timer về 0, dừng interval này
            if (intervalIdRef.current) {
              clearInterval(intervalIdRef.current);
              intervalIdRef.current = null;
            }
            return 0;
          }
          return prevTime - 1; // Giảm 1 giây
        });
      }, 1000); // Cập nhật mỗi 1 giây
    } else {
      // Nếu không có ghế hoặc lịch chiếu, reset cả UI timer
      setRemainingTime(0);
    }


    // Cleanup function: Đảm bảo dừng cả hai timer khi component unmount hoặc dependencies thay đổi
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };
  }, [selectedSeatsCount, selectedLichChieuId, handleTimerEnd, timeoutMinutes]); // Dependencies của useEffect


  // Hàm để hủy timer thủ công từ component sử dụng
  const clearManualTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
    setRemainingTime(0); // Reset thời gian hiển thị khi hủy thủ công
  }, []);

  // 💡 HOOK TRẢ VỀ remainingTime ĐỂ HIỂN THỊ TRÊN UI
  return {
    clearTimer: clearManualTimer,
    remainingTime, // Trả về thời gian còn lại
  };
};
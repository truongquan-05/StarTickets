import React from "react";
import dayjs from "dayjs";

import "./LichChieu.css";
import { ILichChieu } from "../../Admin/interface/lichchieu";
import { CalendarTwoTone } from "@ant-design/icons";

interface IRap {
  id: number;
  ten_rap: string;
}
interface LichChieuProps {
  groupedLichChieu: { [rapId: number]: ILichChieu[] };
  rapList: IRap[];
  onLichChieuClick?: (item: ILichChieu) => void;
  selectedLichChieuId: number | null;
}

const LichChieuDatVe: React.FC<LichChieuProps> = ({
  groupedLichChieu,
  rapList,
  onLichChieuClick,
  selectedLichChieuId,
}) => {
  const now = dayjs(); // Lấy thời gian hiện tại
  let hasFutureShowtimes = false; // Biến cờ để kiểm tra có lịch chiếu nào trong tương lai không

  const renderedShowtimes = Object.entries(groupedLichChieu).map(([rapId, lichChieus]) => {
    const rap = rapList.find((r) => r.id === Number(rapId));

    // Lọc các lịch chiếu: chỉ giữ lại những lịch chiếu có thời gian (gio_chieu) lớn hơn thời gian hiện tại
    const futureLichChieus = lichChieus
      .filter((item) => dayjs(item.gio_chieu).isAfter(now))
      .sort((a, b) => dayjs(a.gio_chieu).diff(dayjs(b.gio_chieu))); // Sắp xếp theo thời gian tăng dần

    // Nếu có lịch chiếu trong tương lai, đặt biến cờ là true
    if (futureLichChieus.length > 0) {
      hasFutureShowtimes = true;
    }

    // Chỉ hiển thị rạp nếu có lịch chiếu trong tương lai
    if (futureLichChieus.length === 0) {
      return null; // Không hiển thị rạp này nếu không có lịch chiếu nào trong tương lai
    }

    return (
      <div key={rapId} className="lichchieu-box">
        <h4 className="rap-title">{rap?.ten_rap || "Rạp không xác định"}</h4>
        <div className="lich-chieu-buttons">
          {futureLichChieus.map((item) => (
            <button
              key={item.id}
              className={`lich-chieu-button ${
                item.id === selectedLichChieuId ? "selected" : ""
              }`}
              onClick={() => onLichChieuClick?.(item)}
            >
              {dayjs(item.gio_chieu).format("HH:mm")} - {dayjs(item.gio_ket_thuc).format("HH:mm")} ({dayjs(item.gio_chieu).format("DD/MM")})
            </button>
          ))}
        </div>
      </div>
    );
  });

  return (
    <>
      {hasFutureShowtimes ? (
        <div className="lichchieu">
          {renderedShowtimes} {/* Nếu có lịch chiếu, hiển thị các rạp và lịch chiếu */}
        </div>
      ) : (
        // Nếu không có bất kỳ lịch chiếu nào trong tương lai, hiển thị thông báo
        <p style={{ textAlign: 'center', fontSize: '35px', color: 'yellow', padding: '20px',margin:"auto", fontFamily: "Anton, sans-serif" }}>
          <CalendarTwoTone
            twoToneColor="yellow"
            style={{ fontSize: "35px", marginRight: "10px", zIndex: 1 }}
          />HIỆN CHƯA CÓ LỊCH CHIẾU
        </p>
      )}
    </>
  );
};

export default LichChieuDatVe;
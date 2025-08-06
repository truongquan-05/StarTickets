import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import "dayjs/locale/vi"; // Import locale tiếng Việt
import "./LichChieu.css";
import { ILichChieu } from "../../Admin/interface/lichchieu";
import { CalendarTwoTone } from "@ant-design/icons";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";

// Thiết lập locale mặc định là tiếng Việt
dayjs.locale('vi');

interface IRap {
  id: number;
  ten_rap: string;
  dia_chi: string; // Thêm địa chỉ rạp để hiển thị
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
  // Lấy danh sách các ngày có lịch chiếu từ hôm nay trở đi (chỉ lấy suất chiếu chưa qua)
  const availableDates = Object.values(groupedLichChieu)
    .flatMap(lichChieus => 
      lichChieus
        .filter(item => dayjs(item.gio_chieu).isAfter(dayjs())) // Lọc suất chiếu chưa qua (theo giờ)
        .map(item => dayjs(item.gio_chieu).startOf('day'))
    )
    .filter((date, index, self) => 
      self.findIndex(d => d.isSame(date, 'day')) === index
    )
    .sort((a, b) => a.diff(b));

  // Nếu không có ngày nào có lịch chiếu, hiển thị thông báo ngay lập tức
  if (availableDates.length === 0) {
    return (
      <div className="lichchieu-container">
        <p style={{ textAlign: 'center', fontSize: '35px', color: 'yellow', padding: '20px', margin:"auto", fontFamily: "Anton, sans-serif" }}>
          <CalendarTwoTone
            twoToneColor="yellow"
            style={{ fontSize: "35px", marginRight: "10px", zIndex: 1 }}
          />HIỆN CHƯA CÓ LỊCH CHIẾU
        </p>
      </div>
    );
  }

  // State để lưu trữ ngày được chọn
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs()); 
  // State để lưu trữ rạp đang được mở
  const [expandedRapId, setExpandedRapId] = useState<number | null>(null);

  // Effect để set ngày đầu tiên có lịch chiếu làm selectedDate
  useEffect(() => {
    if (availableDates.length > 0) {
      setSelectedDate(availableDates[0]);
    }
  }, [availableDates.length > 0 ? availableDates[0].toString() : '']);

  const handleDateClick = (date: dayjs.Dayjs) => {
    setSelectedDate(date);
    // Chỉ đóng các rạp khi chuyển sang ngày khác, không đóng khi chọn cùng ngày
    if (!date.isSame(selectedDate, 'day')) {
      setExpandedRapId(null);
    }
  };

  const handleRapClick = (rapId: number) => {
    setExpandedRapId(expandedRapId === rapId ? null : rapId);
  };
  
  // Lọc lịch chiếu theo ngày đã chọn
  const filteredLichChieu = Object.entries(groupedLichChieu).reduce((acc, [rapId, lichChieus]) => {
    const futureLichChieus = lichChieus
      .filter((item) => dayjs(item.gio_chieu).isAfter(dayjs())) // Lọc suất chiếu đã qua
      .filter((item) => dayjs(item.gio_chieu).isSame(selectedDate, 'day')) // Lọc theo ngày được chọn
      .sort((a, b) => dayjs(a.gio_chieu).diff(dayjs(b.gio_chieu)));
    if (futureLichChieus.length > 0) {
      acc[Number(rapId)] = futureLichChieus;
    }
    return acc;
  }, {} as { [rapId: number]: ILichChieu[] });

  return (
    <div className="lichchieu-container">
      {/* Date Selector */}
      <div className="date-selector-wrapper">
        {availableDates.map((date) => (
          <div 
            key={date.toString()} 
            className={`date-box ${date.isSame(selectedDate, 'day') ? "selected" : ""}`}
            onClick={() => handleDateClick(date)}
          >
            <span className="date-day">{date.format("DD/MM")}</span>
            <span className="date-weekday">{date.format("dddd")}</span>
          </div>
        ))}
      </div>
      
      {/* Theater List */}
      <div className="rap-list-wrapper">
        {Object.entries(filteredLichChieu).length > 0 ? (
          Object.entries(filteredLichChieu).map(([rapId, lichChieus]) => {
            const rap = rapList.find((r) => r.id === Number(rapId));
            return (
              <div key={rapId} className="rap-box">
                <div className="rap-header" onClick={() => handleRapClick(Number(rapId))}>
                  <div>
                    <h4 className="rap-title-2">{rap?.ten_rap || "Rạp không xác định"}</h4>
                    <p className="rap-address">{rap?.dia_chi}</p>
                  </div>
                  {expandedRapId === Number(rapId) ? <CaretUpOutlined /> : <CaretDownOutlined />}
                </div>
                {expandedRapId === Number(rapId) && (
                  <div className="lich-chieu-buttons-horizontal">
                    {lichChieus.map((item) => (
                      <button
                        key={item.id}
                        className={`lich-chieu-button ${
                          item.id === selectedLichChieuId ? "selected" : ""
                        }`}
                        onClick={() => {
                          onLichChieuClick?.(item);
                          // Không đóng rạp sau khi chọn giờ chiếu
                        }}
                      >
                        {dayjs(item.gio_chieu).format("HH:mm")}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p style={{ textAlign: 'center', fontSize: '35px', color: 'yellow', padding: '20px', margin:"auto", fontFamily: "Anton, sans-serif" }}>
            <CalendarTwoTone
              twoToneColor="yellow"
              style={{ fontSize: "35px", marginRight: "10px", zIndex: 1 }}
            />HIỆN CHƯA CÓ LỊCH CHIẾU
          </p>
        )}
      </div>
    </div>
  );
};

export default LichChieuDatVe;
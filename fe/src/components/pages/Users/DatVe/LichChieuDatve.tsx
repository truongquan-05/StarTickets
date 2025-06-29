import React from "react";
import dayjs from "dayjs";

import "./LichChieu.css";
import { ILichChieu } from "../../Admin/interface/lichchieu";


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
  return (
    <div className="lichchieu">
      {Object.entries(groupedLichChieu).map(([rapId, lichChieus]) => {
        const rap = rapList.find((r) => r.id === Number(rapId));
        return (
          <div key={rapId} className="lichchieu-box">
            <h4 className="rap-title">{rap?.ten_rap || "Rạp không xác định"}</h4>
            <div className="lich-chieu-buttons">
              {lichChieus.map((item) => (
                <button
                  key={item.id}
                  className={`lich-chieu-button ${
                    item.id === selectedLichChieuId ? "selected" : ""
                  }`}
                  onClick={() => onLichChieuClick?.(item)}
                >
                  {dayjs(item.gio_chieu).format("DD/MM HH:mm")}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LichChieuDatVe;

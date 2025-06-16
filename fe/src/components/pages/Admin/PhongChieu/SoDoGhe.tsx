import React, { useEffect, useState } from "react";
import { IGhe } from "../interface/ghe";

interface SoDoGheProps {
  phongId: number | null;
  loaiSoDo: string | number | undefined;
  danhSachGhe: IGhe[];
  isLoadingGhe: boolean;
  isErrorGhe: boolean;
}

const SoDoGhe: React.FC<SoDoGheProps> = ({
  phongId,
  loaiSoDo,
  danhSachGhe,
  isLoadingGhe,
  isErrorGhe,
}) => {
  const [localDanhSachGhe, setLocalDanhSachGhe] = useState<IGhe[]>([]);

  useEffect(() => {
    setLocalDanhSachGhe(danhSachGhe);
  }, [danhSachGhe]);

  // Click 1 lần: đổi loại ghế giữa 1 và 2
 const handleClick = (soGhe: string) => {
  setLocalDanhSachGhe((prev) =>
    prev.map((ghe) => {
      if (ghe.so_ghe === soGhe) {
        if (!ghe.trang_thai) {
          // Ghế đã tắt thì không đổi loại ghế nữa
          return ghe;
        }
        if (ghe.loai_ghe_id === 1) return { ...ghe, loai_ghe_id: 2 };
        if (ghe.loai_ghe_id === 2) return { ...ghe, loai_ghe_id: 1 };
      }
      return ghe;
    })
  );
};

  const handleDoubleClick = (soGhe: string) => {
    setLocalDanhSachGhe((prev) =>
      prev.map((ghe) => {
        if (ghe.so_ghe === soGhe) {
          if (ghe.trang_thai) {
            const confirm = window.confirm(
              `Ghế ${soGhe} đang bật, bạn có chắc chắn tắt ghế này không?`
            );
            if (!confirm) return ghe;
            return { ...ghe, trang_thai: false };
          } else {
            return { ...ghe, trang_thai: true };
          }
        }
        return ghe;
      })
    );
  };

  if (isLoadingGhe) {
    return <div style={{ textAlign: "center", padding: 20 }}>Đang tải ghế...</div>;
  }

  if (isErrorGhe) {
    return <div style={{ color: "red", textAlign: "center" }}>Lỗi tải danh sách ghế</div>;
  }

  if (!phongId) return null;

  const numCols = loaiSoDo ? parseInt(String(loaiSoDo).split("x")[0], 10) : 0;
  if (numCols <= 0) return null;

  const numRows = numCols;
  const rows = Array.from({ length: numRows });

  return (
    <div style={{ userSelect: "none", display: "inline-block" }}>
      {rows.map((_, rowIndex) => {
        const hang = String.fromCharCode(65 + rowIndex);
        const cols = [];
        let colIndex = 1;

        while (colIndex <= numCols) {
          const soGheCurrent = `${hang}${colIndex}`;

          const ghe = localDanhSachGhe.find((g: IGhe) => {
            if (!g.so_ghe) return false;

            if (g.loai_ghe_id === 3) {
              const gheParts = g.so_ghe.split("-");
              return gheParts.includes(soGheCurrent);
            }
            return g.so_ghe === soGheCurrent;
          });

          if (!ghe) {
            cols.push(
              <div
                key={`${hang}-${colIndex}`}
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: "#eee",
                  borderRadius: 4,
                  border: "1px solid #ccc",
                  marginRight: 6,
                }}
              />
            );
            colIndex += 1;
            continue;
          }

          const isDoi = ghe.loai_ghe_id === 3;
          const span = isDoi ? 2 : 1;

          if (isDoi && colIndex + 1 > numCols) {
            cols.push(
              <div
                key={`${hang}-${colIndex}`}
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: "#eee",
                  borderRadius: 4,
                  border: "1px solid #ccc",
                  marginRight: 6,
                }}
              />
            );
            colIndex += 1;
            continue;
          }

          let borderColor = "";
          let color = "";

          switch (ghe.loai_ghe_id) {
            case 1:
              borderColor = "#000";
              color = "#000";
              break;
            case 2:
              borderColor = "red";
              color = "red";
              break;
            case 3:
              borderColor = "blue";
              color = "blue";
              break;
            default:
              borderColor = "#999";
              color = "#000";
          }

          cols.push(
            <div
              key={`${hang}-${colIndex}`}
              onClick={() => handleClick(soGheCurrent)}
              onDoubleClick={() => handleDoubleClick(soGheCurrent)}
              title={`${ghe.so_ghe} - ${ghe.trang_thai ? "Còn ghế" : "Đã đặt"}`}
              style={{
                width: span * 40 + (span - 1) * 6,
                height: 40,
                backgroundColor: "#fff",
                borderRadius: 4,
                border: `2px solid ${borderColor}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                userSelect: "none",
                cursor: ghe.trang_thai ? "pointer" : "not-allowed",
                opacity: ghe.trang_thai ? 1 : 0.5,
                marginRight: 6,
                position: "relative",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  color,
                  fontWeight: "bold",
                  fontSize: 14,
                  pointerEvents: "none",
                }}
              >
                {soGheCurrent}
              </span>
            </div>
          );

          colIndex += span;
        }

        return (
          <div key={`row-${hang}`} style={{ display: "flex", marginBottom: 8 }}>
            {cols}
          </div>
        );
      })}
    </div>
  );
};

export default SoDoGhe;

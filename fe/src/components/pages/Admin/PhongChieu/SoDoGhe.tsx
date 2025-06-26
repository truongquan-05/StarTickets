import React, { useEffect, useState } from "react";
import { IGhe } from "../interface/ghe";

interface SoDoGheProps {
  phongId: number | null;
  loaiSoDo: string | number | undefined;
  danhSachGhe: IGhe[];
  isLoadingGhe: boolean;
  isErrorGhe: boolean;
  trangThaiPhong: number; // 0 cho phép sửa, 1 không cho sửa, 3 cho phép mua ghế, không sửa
}

const SoDoGhe: React.FC<SoDoGheProps> = ({
  phongId,
  loaiSoDo,
  danhSachGhe,
  isLoadingGhe,
  isErrorGhe,
  trangThaiPhong,
}) => {
  const [localDanhSachGhe, setLocalDanhSachGhe] = useState<IGhe[]>([]);

  useEffect(() => {
    setLocalDanhSachGhe(danhSachGhe);
  }, [danhSachGhe]);

  // Xử lý click đổi loại ghế (chỉ khi trạng thái 0)
  const handleClick = (soGhe: string) => {
    if (trangThaiPhong !== 0) return; // Chỉ cho đổi loại ghế khi trạng thái 0

    setLocalDanhSachGhe((prev) =>
      prev.map((ghe) => {
        if (ghe.so_ghe === soGhe) {
          if (!ghe.trang_thai) return ghe;
          if (ghe.loai_ghe_id === 1) return { ...ghe, loai_ghe_id: 2 };
          if (ghe.loai_ghe_id === 2) return { ...ghe, loai_ghe_id: 1 };
        }
        return ghe;
      })
    );
  };

  // Xử lý double click ẩn/hiện ghế (chỉ khi trạng thái 0 hoặc 1)
  const handleDoubleClick = (soGhe: string) => {
    if (trangThaiPhong !== 0 && trangThaiPhong !== 1) return; // Không cho sửa khi trạng thái khác 0,1

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

  // Xử lý click khi trạng thái 3 (mua ghế)
  const handleClickMuaGhe = (soGhe: string) => {
    if (trangThaiPhong !== 3) return;

    const ghe = localDanhSachGhe.find((g) => g.so_ghe === soGhe);
    if (!ghe) return;

    // Hiện thông tin ghế, bạn có thể thay bằng popup, modal, hoặc logic mua ghế
    alert(`Chi tiết ghế:\n- Số ghế: ${ghe.so_ghe}\n- Loại ghế: ${ghe.loai_ghe_id}\n- Trạng thái: ${ghe.trang_thai ? "Còn ghế" : "Ghế đã tắt"}`);
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
    <div
      style={{
        userSelect: "none",
        maxWidth: trangThaiPhong === 0 ? "75%" : "100%",
        margin: "0 auto",
        padding: "0 12px",
        display: trangThaiPhong === 0 ? "flex" : "inline-block",
      }}
    >
      <div
        className="seat-map"
        style={{
          display: "inline-block",
          width: "100%",
          maxWidth: 700,
          margin: "0 auto",
        }}
      >
        {rows.map((_, rowIndex) => {
          const hang = String.fromCharCode(65 + rowIndex);
          const cols = [];
          let colIndex = 1;

          while (colIndex <= numCols) {
            const soGheCurrent = `${hang}${colIndex}`;
            const ghe = localDanhSachGhe.find((g) => {
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
                onClick={() => {
                  if (trangThaiPhong === 3) {
                    handleClickMuaGhe(soGheCurrent);
                  } else {
                    handleClick(soGheCurrent);
                  }
                }}
                onDoubleClick={() => handleDoubleClick(soGheCurrent)}
                title={`${ghe.so_ghe} - ${ghe.trang_thai ? "Còn ghế" : "Ghế đã tắt"}`}
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
                  cursor:
                    ghe.trang_thai && (trangThaiPhong === 0 || trangThaiPhong === 1 || trangThaiPhong === 3)
                      ? "pointer"
                      : "not-allowed",
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

      {/* Legend (chú thích) */}
      {trangThaiPhong !== 3 && (
        <div
          className="legend"
          style={{
            marginTop: 24,
            maxWidth: 700,
            marginLeft: "auto",
            marginRight: "auto",
            display: "flex",
            justifyContent: "center",
            gap: 40,
            fontWeight: 600,
            fontSize: 14,
            padding: 12,
            borderRadius: 6,
            flexWrap: "wrap",
            userSelect: "none",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 20, height: 20, backgroundColor: "black", borderRadius: 4 }} />
            <span>Ghế thường</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 20, height: 20, backgroundColor: "red", borderRadius: 4 }} />
            <span>Ghế VIP</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 20, height: 20, backgroundColor: "blue", borderRadius: 4 }} />
            <span>Ghế đôi</span>
          </div>
          {trangThaiPhong === 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span>
                <strong>Click:</strong> Đổi loại ghế
              </span>
            </div>
          )}
          {(trangThaiPhong === 0 || trangThaiPhong === 1) && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span>
                <strong>Double click:</strong> Ẩn/hiện ghế
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SoDoGhe;

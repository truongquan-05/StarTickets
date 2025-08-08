import React, { useEffect, useMemo, useState } from "react";
import { message } from "antd";
import { IGhe } from "../interface/ghe";
import { useUpdateLoaiGhe, useUpdateTrangThaiGhe } from "../../../hook/hungHook";

interface SoDoGheProps {
  phongId: number | null;
  loaiSoDo: string | number | undefined;
  danhSachGhe: IGhe[];
  isLoadingGhe: boolean;
  isErrorGhe: boolean;
  trangThaiPhong: number;
  danhSachCheckGhe: any[];
  onClickCheckGhe: (gheId: number, isSelected: boolean) => void;
  selectedSeats: string[];
}

interface IGheDoi extends IGhe {
  ghe_doi: [IGhe, IGhe];
}

interface ISeatStyle {
  bgColor: string;
  borderColor: string;
  fontColor: string;
  cursor: string;
  opacity: number;
  isDisabled: boolean;
  isVisible: boolean;
  status: string;
}

const SoDoGhe: React.FC<SoDoGheProps> = ({
  phongId,
  loaiSoDo,
  danhSachGhe,
  isLoadingGhe,
  isErrorGhe,
  trangThaiPhong,
  danhSachCheckGhe,
  onClickCheckGhe,
  selectedSeats,
}) => {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const currentUserId = user?.id;

  const processedGhe = useMemo(() => {
    if (!danhSachGhe || danhSachGhe.length == 0) return [];
    const used = new Set<string>();
    const result: (IGhe | IGheDoi)[] = [];
    for (const ghe of danhSachGhe) {
      if (used.has(ghe.so_ghe)) continue;
      if (ghe.loai_ghe_id == 3) {
        const hang = ghe.so_ghe[0];
        const so = parseInt(ghe.so_ghe.slice(1), 10);
        const soGhe2 = `${hang}${so % 2 == 0 ? so - 1 : so + 1}`;
        const ghe2 = danhSachGhe.find(
          (g) => g.so_ghe == soGhe2 && g.loai_ghe_id == 3
        );
        if (ghe2 && !used.has(soGhe2)) {
          const gheDoi: IGheDoi = {
            ...ghe,
            so_ghe: `${
              ghe.so_ghe.localeCompare(ghe2.so_ghe) < 0 ? ghe.so_ghe : ghe2.so_ghe
            }-${
              ghe.so_ghe.localeCompare(ghe2.so_ghe) < 0 ? ghe2.so_ghe : ghe.so_ghe
            }`,
            ghe_doi: ghe.so_ghe.localeCompare(ghe2.so_ghe) < 0 ? [ghe, ghe2] : [ghe2, ghe],
          };
          result.push(gheDoi);
          used.add(ghe.so_ghe);
          used.add(ghe2.so_ghe);
        } else {
          result.push(ghe);
          used.add(ghe.so_ghe);
        }
      } else {
        result.push(ghe);
        used.add(ghe.so_ghe);
      }
    }
    return result;
  }, [danhSachGhe]);

  const [localDanhSachGhe, setLocalDanhSachGhe] = useState<(IGhe | IGheDoi)[]>([]);
  useEffect(() => {
    setLocalDanhSachGhe(processedGhe);
  }, [processedGhe]);

  const getSeatStatusAndStyle = (seatData: IGhe): ISeatStyle => {
    const check = danhSachCheckGhe.find((c) => c.ghe_id == seatData.id);

    // Mặc định ghế trống
    let styles: ISeatStyle = {
      bgColor: "white",
      borderColor: "black",
      fontColor: "black",
      cursor: "pointer",
      opacity: 1,
      isDisabled: false,
      isVisible: true,
      status: "trong",
    };

    // Ghế VIP
    if (seatData.loai_ghe_id == 2) {
      styles.borderColor = "blue";
      styles.fontColor = "blue";
    }

    if (!seatData.trang_thai) {
      // Ghế không khả dụng
      styles.bgColor = "lightgray";
      styles.fontColor = "#666";
      styles.cursor = "not-allowed";
      styles.opacity = 0.5;
      styles.isDisabled = true;
      styles.isVisible = false;
      styles.status = "bi_an";
    } else if (!check || check.nguoi_dung_id == null) {
      // Ghế trống (không có check hoặc user_id null)
      styles.status = "trong";
      styles.isDisabled = false;
      styles.bgColor = "white";
      styles.fontColor = "black";
      styles.cursor = "pointer";
    } else if (check.trang_thai == "da_dat") {
      // Ghế đã bán
      styles.bgColor = "#47566B";
      styles.fontColor = "white";
      styles.cursor = "not-allowed";
      styles.opacity = 0.5;
      styles.isDisabled = true;
      styles.status = "da_dat";
    } else if (check.trang_thai == "dang_dat") {
      // Ghế đang giữ
      if (check.nguoi_dung_id == currentUserId) {
        // Ghế của mình
        styles.bgColor = "yellow";
        styles.fontColor = "black";
        styles.status = "dang_dat_cua_toi";
        styles.isDisabled = false; // cho phép click để bỏ chọn
      } else {
        // Ghế người khác đang giữ
        styles.bgColor = "#1E90FF";
        styles.fontColor = "white";
        styles.cursor = "not-allowed";
        styles.isDisabled = true;
        styles.status = "dang_dat_cua_nguoi_khac";
      }
    }

    return styles;
  };

  const handleSeatClick = (ghe: IGhe | IGheDoi) => {
    if (trangThaiPhong !== 3) return;

    if ((ghe as IGheDoi).ghe_doi) {
      const gheDoi = ghe as IGheDoi;
      const [g1, g2] = gheDoi.ghe_doi;
      const status1 = getSeatStatusAndStyle(g1);
      const status2 = getSeatStatusAndStyle(g2);

      if (status1.isDisabled || status2.isDisabled) {
        message.warning("Ghế này không thể chọn!");
        return;
      }

      const check = danhSachCheckGhe.find((c) => c.ghe_id == g1.id);
      const isCurrentlySelected = check?.nguoi_dung_id == currentUserId;
      onClickCheckGhe(g1.id, isCurrentlySelected);
    } else {
      const gheDon = ghe as IGhe;
      const { isDisabled } = getSeatStatusAndStyle(gheDon);
      if (isDisabled) {
        message.warning("Ghế này không thể chọn!");
        return;
      }

      const check = danhSachCheckGhe.find((c) => c.ghe_id == gheDon.id);
      const isCurrentlySelected = check?.nguoi_dung_id == currentUserId;
      onClickCheckGhe(gheDon.id, isCurrentlySelected);
    }
  };

  const handleDoubleClick = async (soGhe: string) => {
    // Logic double-click của bạn...
  };

  if (isLoadingGhe)
    return (
      <div style={{ textAlign: "center", padding: 20 }}>Đang tải ghế...</div>
    );
  if (isErrorGhe)
    return (
      <div style={{ color: "red", textAlign: "center" }}>
        Lỗi tải danh sách ghế
      </div>
    );
  if (!phongId) return null;

  const numCols = loaiSoDo
    ? parseInt(String(loaiSoDo).split("x")[0], 10)
    : 0;
  if (numCols <= 0) return null;

  const numRows = numCols;
  const rows = Array.from({ length: numRows });
  const skippedSeats = new Set<string>();

  return (
    <div style={{ userSelect: "none", margin: "0 auto", padding: "0 12px" }}>
      {/* Màn hình chiếu */}
      <div
        style={{
          width: "100%",
          height: 40,
          background: "#333",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
          borderRadius: 5,
        }}
      >
        MÀN HÌNH
      </div>
      <div
        className="seat-map"
        style={{
          display: "inline-block",
          width: "auto",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        {rows.map((_, rowIndex) => {
          const hang = String.fromCharCode(65 + rowIndex);
          const cols = [];
          let colIndex = 1;

          while (colIndex <= numCols) {
            const soGheCurrent = `${hang}${colIndex}`;
            if (skippedSeats.has(soGheCurrent)) {
              colIndex++;
              continue;
            }

            const ghe = localDanhSachGhe.find((g) =>
              (g as IGheDoi).ghe_doi
                ? (g as IGheDoi).ghe_doi.some((sg) => sg.so_ghe == soGheCurrent)
                : g.so_ghe == soGheCurrent
            );

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
              colIndex++;
              continue;
            }

            const isDoi = (ghe as IGheDoi).ghe_doi !== undefined;
            if (isDoi) {
              const gheDoi = ghe as IGheDoi;
              const [g1, g2] = gheDoi.ghe_doi;
              const style1 = getSeatStatusAndStyle(g1);
              const style2 = getSeatStatusAndStyle(g2);

              skippedSeats.add(g2.so_ghe);

              cols.push(
                <div
                  key={g1.id}
                  style={{
                    display: "flex",
                    width: 86,
                    height: 32,
                    margin: "5px 13.5px",
                    cursor:
                      style1.isDisabled && style2.isDisabled
                        ? "not-allowed"
                        : "pointer",
                    opacity: Math.min(style1.opacity, style2.opacity),
                    userSelect: "none",
                    borderRadius: 5,
                    boxSizing: "border-box",
                  }}
                  onClick={() => handleSeatClick(ghe)}
                  onDoubleClick={() => handleDoubleClick(ghe.so_ghe)}
                >
                  {/* Nửa ghế trái */}
                  <div
                    style={{
                      width: "50%",
                      height: "100%",
                      backgroundColor: style1.bgColor,
                      borderTop: "1.5px solid black",
                      borderBottom: "1.5px solid black",
                      borderLeft: "1.5px solid black",
                      borderRight: "none",
                      borderRadius: "5px 0 0 5px",
                      boxSizing: "border-box",
                      color: style1.fontColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      fontSize: 11,
                      pointerEvents: style1.isDisabled ? "none" : "auto",
                      whiteSpace: "nowrap",
                      textAlign: "center",
                    }}
                  >
                    {style1.status == "bi_an" ? "X" : g1.so_ghe}
                  </div>

                  {/* Nửa ghế phải */}
                  <div
                    style={{
                      width: "50%",
                      height: "100%",
                      backgroundColor: style2.bgColor,
                      borderTop: "1.5px solid black",
                      borderBottom: "1.5px solid black",
                      borderRight: "1.5px solid black",
                      borderLeft: "none",
                      borderRadius: "0 5px 5px 0",
                      boxSizing: "border-box",
                      color: style2.fontColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      fontSize: 11,
                      pointerEvents: style2.isDisabled ? "none" : "auto",
                      whiteSpace: "nowrap",
                      textAlign: "center",
                    }}
                  >
                    {style2.status == "bi_an" ? "X" : g2.so_ghe}
                  </div>
                </div>
              );
            } else {
              // Ghế đơn
              const gheDon = ghe as IGhe;
              const style = getSeatStatusAndStyle(gheDon);

              cols.push(
                <div
                  key={gheDon.id}
                  onClick={() => handleSeatClick(gheDon)}
                  onDoubleClick={() => handleDoubleClick(gheDon.so_ghe)}
                  style={{
                    width: 40,
                    height: 29,
                    margin: "3px 8px",
                    opacity: style.opacity,
                    cursor: style.isDisabled ? "not-allowed" : "pointer",
                    pointerEvents: style.isDisabled ? "none" : "auto",
                    userSelect: "none",
                    color: style.fontColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 8,
                    border: `1.5px solid ${style.borderColor}`,
                    backgroundColor: style.bgColor,
                    fontWeight: "bold",
                    fontSize: style.status == "bi_an" ? 24 : 11,
                    textAlign: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  {style.status == "bi_an" ? "X" : gheDon.so_ghe}
                </div>
              );
            }

            colIndex += isDoi ? 2 : 1;
          }

          return (
            <div
              key={`row-${hang}`}
              style={{ display: "flex", marginBottom: 8, alignItems: "center" }}
            >
              <div
                style={{
                  width: 20,
                  textAlign: "center",
                  fontWeight: "bold",
                  lineHeight: "30px",
                  marginRight: 10,
                  userSelect: "none",
                }}
              >
                {hang}
              </div>
              {cols}
            </div>
          );
        })}
      </div>

      {/* Chú thích */}
      <div
        className="legend"
        style={{
          marginTop: 24,
          maxWidth: 800,
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
          <div
            style={{
              width: 40,
              height: 20,
              backgroundColor: "white",
              borderRadius: 5,
              border: "3px solid black",
            }}
          />
          <span>Ghế thường</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: 40,
              height: 20,
              backgroundColor: "white",
              borderRadius: 5,
              border: "3px solid blue",
            }}
          />
          <span>Ghế VIP</span>
        </div>
        <div
          style={{
            width: 90,
            height: 20,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <div
            style={{
              width: 90,
              height: 20,
              display: "flex",
              position: "relative",
            }}
          >
            <div
              style={{
                width: "50%",
                height: "100%",
                backgroundColor: "white",
                borderTop: "1.5px solid black",
                borderBottom: "1.5px solid black",
                borderLeft: "1.5px solid black",
                borderRight: "none",
                borderRadius: "5px 0 0 5px",
                boxSizing: "border-box",
              }}
            />
            <div
              style={{
                width: "50%",
                height: "100%",
                backgroundColor: "white",
                borderTop: "1.5px solid black",
                borderBottom: "1.5px solid black",
                borderRight: "1.5px solid black",
                borderLeft: "none",
                borderRadius: "0 5px 5px 0",
                boxSizing: "border-box",
              }}
            />
            <span
              style={{
                position: "absolute",
                color: "black",
                fontWeight: "bold",
                fontSize: 11,
                pointerEvents: "none",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "100%",
                textAlign: "center",
              }}
            >
              ĐÔI
            </span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: 40,
              height: 20,
              backgroundColor: "yellow",
              borderRadius: 5,
              border: "3px solid black",
            }}
          />
          <span>Ghế đang giữ (của bạn)</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: 40,
              height: 20,
              backgroundColor: "#1E90FF",
              borderRadius: 5,
              border: "3px solid black",
            }}
          />
          <span>Ghế đang giữ (của người khác)</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: 40,
              height: 20,
              backgroundColor: "#47566B",
              borderRadius: 5,
              border: "3px solid black",
            }}
          />
          <span>Ghế đã bán</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: 40,
              height: 20,
              backgroundColor: "lightgray",
              borderRadius: 5,
              border: "3px solid black",
            }}
          />
          <span>Ghế không khả dụng</span>
        </div>
      </div>
    </div>
  );
};

export default SoDoGhe;

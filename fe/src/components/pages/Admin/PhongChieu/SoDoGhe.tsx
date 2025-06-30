import React, { useEffect, useState, useMemo } from "react";
import { IGhe } from "../interface/ghe";
import { ICheckGhe } from "../interface/checkghe";

interface SoDoGheProps {
  phongId: number | null;
  loaiSoDo: string | number | undefined;
  danhSachGhe: IGhe[];
  isLoadingGhe: boolean;
  isErrorGhe: boolean;
  trangThaiPhong: number; // 0 cho phép sửa, 1 không cho sửa, 3 cho phép mua ghế, không sửa
  danhSachCheckGhe?: ICheckGhe[];
  onClickCheckGhe?: (gheId: number, currentTrangThai: string) => void;
}

interface IGheDoi extends IGhe {
  ghe_doi: [IGhe, IGhe]; // Mảng chứa 2 ghế con
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
}) => {
  // Bước 1: Gom ghế đôi thành 1 bản ghi
  const processedGhe = useMemo(() => {
    if (!danhSachGhe || danhSachGhe.length === 0) return [];

    const used = new Set<string>();
    const result: (IGhe | IGheDoi)[] = [];

    for (const ghe of danhSachGhe) {
      if (used.has(ghe.so_ghe)) continue;

      if (ghe.loai_ghe_id === 3) {
        // Ghế đôi có 2 bản ghi riêng: ví dụ L1 và L2
        // Tách hàng và số ghế
        const hang = ghe.so_ghe[0];
        const so = parseInt(ghe.so_ghe.slice(1), 10);

        const soGhe1 = ghe.so_ghe;
        const soGhe2 = `${hang}${so + 1}`;

        // Tìm ghế kế bên để ghép đôi
        const ghe2 = danhSachGhe.find(
          (g) => g.so_ghe === soGhe2 && g.loai_ghe_id === 3
        );

        if (ghe2 && !used.has(soGhe2)) {
          // Gom 2 ghế lại thành 1
          const gheDoi: IGheDoi = {
            ...ghe,
            so_ghe: `${soGhe1}-${soGhe2}`,
            ghe_doi: [ghe, ghe2],
          };
          result.push(gheDoi);
          used.add(soGhe1);
          used.add(soGhe2);
        } else {
          // Không có ghế kế bên => giữ nguyên
          result.push(ghe);
          used.add(soGhe1);
        }
      } else {
        // Ghế thường hoặc VIP bình thường
        result.push(ghe);
        used.add(ghe.so_ghe);
      }
    }
    return result;
  }, [danhSachGhe]);

  //check-ghế
  useEffect(() => {
    if (!danhSachGhe || !danhSachCheckGhe) return;

    // Tạo map ghe_id => trang_thai string từ check_ghe

    const checkGheMap = new Map<number, string>();
    danhSachCheckGhe.forEach((check) => {
      checkGheMap.set(check.ghe_id, check.trang_thai);
    });
  }, [danhSachGhe, danhSachCheckGhe]);

  // State nội bộ để thao tác cập nhật ghế
  const [localDanhSachGhe, setLocalDanhSachGhe] = useState<(IGhe | IGheDoi)[]>(
    []
  );
  useEffect(() => {
    setLocalDanhSachGhe(processedGhe);
  }, [processedGhe]);
  const checkGheStatusMap = useMemo(() => {
    const map = new Map<number, string>();
    danhSachCheckGhe?.forEach((check) => {
      map.set(check.ghe_id, check.trang_thai);
    });
    return map;
  }, [danhSachCheckGhe]);

  // Bước 2: Hàm cập nhật trạng thái ghế (cả ghế đôi)
  const updateGheState = (soGhe: string, updater: (ghe: IGhe) => IGhe) => {
    setLocalDanhSachGhe((prev) =>
      prev.map((ghe) => {
        // Ghế đôi
        if ((ghe as IGheDoi).ghe_doi && ghe.so_ghe === soGhe) {
          const gheDoi = ghe as IGheDoi;
          const updatedGheDoi = gheDoi.ghe_doi.map((g) => updater(g));
          return { ...gheDoi, ghe_doi: updatedGheDoi };
        }
        // Ghế thường
        if (ghe.so_ghe === soGhe) {
          return updater(ghe);
        }
        return ghe;
      })
    );
  };

  // Bước 3: Xử lý click đổi loại ghế
  const handleClick = (soGhe: string) => {
    if (trangThaiPhong !== 0) return;

    updateGheState(soGhe, (ghe) => {
      if (!ghe.trang_thai) return ghe;
      if (ghe.loai_ghe_id === 1) return { ...ghe, loai_ghe_id: 2 };
      if (ghe.loai_ghe_id === 2) return { ...ghe, loai_ghe_id: 1 };
      return ghe;
    });
  };

  // Bước 4: Xử lý double click ẩn/hiện ghế
  const handleDoubleClick = (soGhe: string) => {
    if (trangThaiPhong !== 0 && trangThaiPhong !== 1) return;

    updateGheState(soGhe, (ghe) => {
      if (ghe.trang_thai) {
        const confirm = window.confirm(
          `Ghế ${ghe.so_ghe} đang bật, bạn có chắc chắn tắt ghế này không?`
        );
        if (!confirm) return ghe;
        return { ...ghe, trang_thai: false };
      } else {
        return { ...ghe, trang_thai: true };
      }
    });
  };

  if (isLoadingGhe) {
    return (
      <div style={{ textAlign: "center", padding: 20 }}>Đang tải ghế...</div>
    );
  }

  if (isErrorGhe) {
    return (
      <div style={{ color: "red", textAlign: "center" }}>
        Lỗi tải danh sách ghế
      </div>
    );
  }

  if (!phongId) return null;

  const numCols = loaiSoDo ? parseInt(String(loaiSoDo).split("x")[0], 10) : 0;
  if (numCols <= 0) return null;

  const numRows = numCols;
  const rows = Array.from({ length: numRows });

  // Dùng set để lưu vị trí ghế đôi đã render để skip ô kế tiếp
  const skippedSeats = new Set<string>();

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

            if (skippedSeats.has(soGheCurrent)) {
              colIndex++;
              continue;
            }

            const ghe = localDanhSachGhe.find((g) => {
              if ((g as IGheDoi).ghe_doi) {
                // Ghế đôi lưu so_ghe dạng "L1-L2"
                return g.so_ghe.startsWith(soGheCurrent);
              } else {
                return g.so_ghe === soGheCurrent;
              }
            });

            if (!ghe) {
              // Ghế không tồn tại, render ô trống
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

            // --- Xử lý màu nền dựa trên trạng thái check_ghe ---

            // Hàm lấy trạng thái check_ghe cho ghế đơn
            const getTrangThaiCheckGhe = (gheSingle: IGhe): string => {
              return checkGheStatusMap.get(gheSingle.id) || "trong"; // mặc định "trong" nếu ko có
            };

            if (isDoi) {
              const gheDoi = ghe as IGheDoi;
              const tt1 = getTrangThaiCheckGhe(gheDoi.ghe_doi[0]);
              const tt2 = getTrangThaiCheckGhe(gheDoi.ghe_doi[1]);

              // Quy tắc: nếu 1 trong 2 ghế là "da_dat" thì đen, nếu 1 trong 2 là "dang_dat" thì vàng, còn lại trắng
              let bgColor = "#fff"; // mặc định trắng
              if (tt1 === "da_dat" || tt2 === "da_dat") bgColor = "black";
              else if (tt1 === "dang_dat" || tt2 === "dang_dat")
                bgColor = "yellow";

              // Đánh dấu skip ghế kế tiếp
              const ghe1So = gheDoi.ghe_doi[0].so_ghe;
              const hangDoi = ghe1So[0];
              const soDoi = parseInt(ghe1So.slice(1), 10);
              const soBoQua = `${hangDoi}${soDoi + 1}`;
              skippedSeats.add(soBoQua);

              cols.push(
                <div
                  key={`${hang}-${colIndex}`}
                  onClick={() => {
                    if (trangThaiPhong === 3 && onClickCheckGhe) {
                      if ((ghe as IGheDoi).ghe_doi) {
                        // Ghế đôi => xử lý cả hai ghế con
                        const gheDoi = ghe as IGheDoi;
                        gheDoi.ghe_doi.forEach((g) => {
                          const currentStatus =
                            checkGheStatusMap.get(g.id) || "trong";
                          onClickCheckGhe(g.id, currentStatus);
                        });
                      } else {
                        // Ghế đơn
                        const gheDon = ghe as IGhe;
                        const currentStatus =
                          checkGheStatusMap.get(gheDon.id) || "trong";
                        onClickCheckGhe(gheDon.id, currentStatus);
                      }
                    } else {
                      handleClick(ghe.so_ghe);
                    }
                  }}
                  onDoubleClick={() => handleDoubleClick(ghe.so_ghe)}
                  title={`${ghe.so_ghe} - Trạng thái: ${tt1}, ${tt2}`}
                  style={{
                    width: 40 * 2 + 6,
                    height: 40,
                    backgroundColor: bgColor,
                    borderRadius: 4,
                    border: `2px solid blue`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    userSelect: "none",
                    cursor:
                      trangThaiPhong === 0 ||
                      trangThaiPhong === 1 ||
                      trangThaiPhong === 3
                        ? "pointer"
                        : "not-allowed",
                    opacity: tt1 === "da_dat" || tt2 === "da_dat" ? 0.5 : 1,
                    marginRight: 6,
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      color: "blue",
                      fontWeight: "bold",
                      fontSize: 14,
                      pointerEvents: "none",
                    }}
                  >
                    {ghe.so_ghe}
                  </span>
                </div>
              );
              colIndex += 2;
              continue;
            }

            // Ghế thường/VIP đơn lẻ
            const trangThaiCheck = getTrangThaiCheckGhe(ghe as IGhe);

            let bgColor = "#fff"; // mặc định trắng
            if (trangThaiCheck === "da_dat") bgColor = "black";
            else if (trangThaiCheck === "dang_dat") bgColor = "yellow";

            cols.push(
              <div
                key={`${hang}-${colIndex}`}
                onClick={() => {
                  if (trangThaiPhong === 3 && onClickCheckGhe) {
                    if ((ghe as IGheDoi).ghe_doi) {
                      // Ghế đôi => xử lý cả hai ghế con
                      const gheDoi = ghe as IGheDoi;
                      gheDoi.ghe_doi.forEach((g) => {
                        const currentStatus =
                          checkGheStatusMap.get(g.id) || "trong";
                        onClickCheckGhe(g.id, currentStatus);
                      });
                    } else {
                      // Ghế đơn
                      const gheDon = ghe as IGhe;
                      const currentStatus =
                        checkGheStatusMap.get(gheDon.id) || "trong";
                      onClickCheckGhe(gheDon.id, currentStatus);
                    }
                  } else {
                    handleClick(ghe.so_ghe);
                  }
                }}
                onDoubleClick={() => handleDoubleClick(ghe.so_ghe)}
                title={`${ghe.so_ghe} - Trạng thái: ${trangThaiCheck}`}
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: bgColor,
                  borderRadius: 4,
                  border: `2px solid ${ghe.loai_ghe_id === 1 ? "#000" : "red"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  userSelect: "none",
                  cursor:
                    trangThaiCheck !== "da_dat" &&
                    (trangThaiPhong === 0 ||
                      trangThaiPhong === 1 ||
                      trangThaiPhong === 3)
                      ? "pointer"
                      : "not-allowed",
                  opacity: trangThaiCheck === "da_dat" ? 0.5 : 1,
                  marginRight: 6,
                  position: "relative",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    color: ghe.loai_ghe_id === 1 ? "#000" : "red",
                    fontWeight: "bold",
                    fontSize: 14,
                    pointerEvents: "none",
                  }}
                >
                  {ghe.so_ghe}
                </span>
              </div>
            );

            colIndex++;
          }

          return (
            <div
              key={`row-${hang}`}
              style={{ display: "flex", marginBottom: 8 }}
            >
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
            <div
              style={{
                width: 20,
                height: 20,
                backgroundColor: "black",
                borderRadius: 4,
              }}
            />
            <span>Ghế thường</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 20,
                height: 20,
                backgroundColor: "red",
                borderRadius: 4,
              }}
            />
            <span>Ghế VIP</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 20,
                height: 20,
                backgroundColor: "blue",
                borderRadius: 4,
              }}
            />
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

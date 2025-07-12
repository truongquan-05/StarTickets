import React, { useEffect, useState, useMemo } from "react";
import { IGhe } from "../interface/ghe"; // Đảm bảo đường dẫn này đúng
import { ICheckGhe } from "../interface/checkghe";
import {
  useUpdateLoaiGhe,
  useUpdateTrangThaiGhe,
} from "../../../hook/hungHook"; // Đảm bảo đường dẫn này đúng
import { getListCheckGheByGhe } from "../../../provider/hungProvider";

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
  const processedGhe = useMemo(() => {
    if (!danhSachGhe || danhSachGhe.length === 0) return [];
    const used = new Set<string>();
    const result: (IGhe | IGheDoi)[] = [];
    for (const ghe of danhSachGhe) {
      if (used.has(ghe.so_ghe)) continue;
      if (ghe.loai_ghe_id === 3) {
        const hang = ghe.so_ghe[0];
        const so = parseInt(ghe.so_ghe.slice(1), 10);
        const soGhe1 = ghe.so_ghe;
        const soGhe2 = `${hang}${so + 1}`;
        const ghe2 = danhSachGhe.find(
          (g) => g.so_ghe === soGhe2 && g.loai_ghe_id === 3
        );
        if (ghe2 && !used.has(soGhe2)) {
          const gheDoi: IGheDoi = {
            ...ghe,
            so_ghe: `${soGhe1}-${soGhe2}`,
            ghe_doi: [ghe, ghe2],
          };
          result.push(gheDoi);
          used.add(soGhe1);
          used.add(soGhe2);
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

  const { mutate: updateLoaiGheAPI } = useUpdateLoaiGhe({ resource: "ghe" });
  const { mutate: updateTrangThaiGheAPI } = useUpdateTrangThaiGhe({
    resource: "ghe",
  });

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

  const updateGheState = (soGhe: string, updater: (ghe: IGhe) => IGhe) => {
    setLocalDanhSachGhe((prev) =>
      prev.map((ghe) => {
        if ((ghe as IGheDoi).ghe_doi && ghe.so_ghe === soGhe) {
          const gheDoi = ghe as IGheDoi;
          const updatedGheDoi = gheDoi.ghe_doi.map((g) => updater(g));
          return { ...gheDoi, ghe_doi: updatedGheDoi };
        }
        if (ghe.so_ghe === soGhe) {
          return updater(ghe);
        }
        return ghe;
      })
    );
  };

  const handleClick = (soGhe: string) => {
    const gheHienTai = localDanhSachGhe.find((g) => g.so_ghe === soGhe);
    if (!gheHienTai) return;

    // --- LOGIC MỚI CHO TRẠNG THÁI PHÒNG 3 (MUA VÉ) ---
    if (trangThaiPhong === 3) {
      let isHidden = false;
      let isBooked = false; // Thêm biến để kiểm tra trạng thái "da_dat"

      if ((gheHienTai as IGheDoi).ghe_doi) {
        const gheDoi = gheHienTai as IGheDoi;
        const tt1 = checkGheStatusMap.get(gheDoi.ghe_doi[0].id) || "trong";
        const tt2 = checkGheStatusMap.get(gheDoi.ghe_doi[1].id) || "trong";

        if (!gheDoi.ghe_doi[0].trang_thai || !gheDoi.ghe_doi[1].trang_thai) {
          isHidden = true;
        }
        if (tt1 === "da_dat" || tt2 === "da_dat") {
          isBooked = true;
        }
      } else {
        const gheDon = gheHienTai as IGhe;
        const currentStatus = checkGheStatusMap.get(gheDon.id) || "trong";

        if (!gheDon.trang_thai) {
          isHidden = true;
        }
        if (currentStatus === "da_dat") {
          isBooked = true;
        }
      }

      if (isHidden) {
        alert("Ghế đang hỏng, vui lòng chọn ghế khác.");
        return; // Không làm gì thêm nếu ghế đang hỏng
      }
      if (isBooked) {
        alert("Ghế đã có người mua, vui lòng chọn ghế khác.");
        return; // Không làm gì thêm nếu ghế đã có người mua
      }

      // Nếu không ẩn và không bị đặt, mới cho phép chọn ghế
      if (onClickCheckGhe) {
        if ((gheHienTai as IGheDoi).ghe_doi) {
          const gheDoi = gheHienTai as IGheDoi;
          gheDoi.ghe_doi.forEach((g) => {
            const currentStatus = checkGheStatusMap.get(g.id) || "trong";
            onClickCheckGhe(g.id, currentStatus);
          });
        } else {
          const gheDon = gheHienTai as IGhe;
          const currentStatus = checkGheStatusMap.get(gheDon.id) || "trong";
          onClickCheckGhe(gheDon.id, currentStatus);
        }
      }
      return; // Kết thúc hàm nếu ở chế độ mua vé
    }
    if (trangThaiPhong !== 0) return; // Chỉ cho phép sửa khi trangThaiPhong là 0
    if ((gheHienTai as IGheDoi).ghe_doi) {
      console.log(`Ghế ${soGhe} là ghế đôi, không thể đổi loại bằng click.`);
      return;
    }

    const gheDon = gheHienTai as IGhe;
    if (gheDon.loai_ghe_id !== 1 && gheDon.loai_ghe_id !== 2) {
      console.log(
        `Ghế ${gheDon.so_ghe} không thuộc loại có thể đổi (chỉ Ghế thường và VIP).`
      );
      return;
    }
    const newLoaiGheId = gheDon.loai_ghe_id === 1 ? 2 : 1;

    updateLoaiGheAPI(
      {
        id: gheDon.id,
        values: { loai_ghe_id: newLoaiGheId },
      },
      {
        onSuccess: () => {
          updateGheState(soGhe, (ghe) => ({
            ...ghe,
            loai_ghe_id: newLoaiGheId,
          }));
          console.log(
            `Đã cập nhật loại ghế ${gheDon.so_ghe} thành ${newLoaiGheId}`
          );
        },
        onError: (error) => {
          console.error("Lỗi khi cập nhật loại ghế:", error);
          alert(
            `Có lỗi xảy ra khi cập nhật loại ghế: ${
              error.message || "Không rõ lỗi"
            }`
          );
        },
      }
    );
  };

  const handleDoubleClick = async (soGhe: string) => {
    if (trangThaiPhong === 3) return;
    if (trangThaiPhong !== 0 && trangThaiPhong !== 1) return;

    const gheHienTai = localDanhSachGhe.find((g) => g.so_ghe === soGhe);
    if (!gheHienTai) return;

    let targetGheIds: number[] = [];
    let currentTrangThai: boolean;
    let soGheLog: string = soGhe;

    if ((gheHienTai as IGheDoi).ghe_doi) {
      const gheDoi = gheHienTai as IGheDoi;
      targetGheIds = gheDoi.ghe_doi.map((g) => g.id);
      currentTrangThai = gheDoi.ghe_doi[0].trang_thai;
      soGheLog = `${gheDoi.ghe_doi[0].so_ghe} và ${gheDoi.ghe_doi[1].so_ghe}`;
    } else {
      const gheDon = gheHienTai as IGhe;
      targetGheIds = [gheDon.id];
      currentTrangThai = gheDon.trang_thai;
    }

    const newTrangThai = !currentTrangThai;

    // Nếu muốn ẩn ghế (tức newTrangThai = false), thì kiểm tra check_ghe
    if (!newTrangThai) {
      try {
        const allCheckData = await Promise.all(
          targetGheIds.map((id) =>
            getListCheckGheByGhe({ resource: "show-all-checkghe", id })
          )
        );

        const flatCheckList = allCheckData.flat();
        const hasDat = flatCheckList.some(
          (check) => check.trang_thai !== "trong"
        );

        // if (hasDat) {
        //   alert(`Ghế ${soGheLog} đang có người đặt hoặc đã mua, không thể ẩn.`);
        //   return;
        // }
      } catch (error) {
        console.error("Lỗi khi kiểm tra trạng thái check_ghe:", error);
        alert("Không thể kiểm tra trạng thái đặt ghế. Vui lòng thử lại.");
        return;
      }
    }

    const confirmMessage = `Bạn có chắc chắn muốn ${
      newTrangThai ? "hiện" : "ẩn"
    } ghế ${soGheLog} không?`;
    const confirmed = window.confirm(confirmMessage);

    if (!confirmed) return;

    targetGheIds.forEach((gheId) => {
      updateTrangThaiGheAPI(
        {
          id: gheId,
          values: { trang_thai: newTrangThai },
        },
        {
          onSuccess: () => {
            updateGheState(soGhe, (ghe) => {
              if ((ghe as IGheDoi).ghe_doi) {
                const gheDoi = ghe as IGheDoi;
                const updatedGheCon = gheDoi.ghe_doi.map((g) =>
                  g.id === gheId ? { ...g, trang_thai: newTrangThai } : g
                ) as [IGhe, IGhe];
                return { ...gheDoi, ghe_doi: updatedGheCon };
              }
              if (ghe.id === gheId) {
                return { ...ghe, trang_thai: newTrangThai };
              }
              return ghe;
            });

            console.log(
              `Đã cập nhật trạng thái của ghế ${soGheLog} (ID: ${gheId}) thành ${
                newTrangThai ? "hiện" : "ẩn"
              }`
            );
          },
          onError: (error) => {
            console.error(
              `Lỗi khi cập nhật trạng thái ghế ${soGheLog} (ID: ${gheId}):`,
              error
            );
            alert(
              `Có lỗi xảy ra khi cập nhật trạng thái ghế: ${
                error.message || "Không rõ lỗi"
              }`
            );
          },
        }
      );
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

  const skippedSeats = new Set<string>();

  return (
    <div
      style={{
        userSelect: "none",
        // maxWidth: trangThaiPhong === 0 ? "75%" : "100%",
        margin: "0 auto",
        padding: "0 12px",
        // display: trangThaiPhong === 0 ? "flex" : "inline-block",
      }}
    >
      <div
        className="seat-map"
        style={{
          display: "inline-block",
          width: "auto",
          maxWidth:1200,
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
                return g.so_ghe.startsWith(soGheCurrent);
              } else {
                return g.so_ghe === soGheCurrent;
              }
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
              colIndex++;
              continue;
            }

            const isDoi = (ghe as IGheDoi).ghe_doi !== undefined;
            const getTrangThaiCheckGhe = (gheSingle: IGhe): string => {
              return checkGheStatusMap.get(gheSingle.id) || "trong";
            };

            let bgColor = "#fff";
            let borderColor =
              ghe.loai_ghe_id === 1
                ? "#000"
                : ghe.loai_ghe_id === 2
                ? "red"
                : "blue";
            let fontColor = borderColor;
            let opacity = 1;
            let cursor = "not-allowed";
            let isHidden = false;
            let isBookedGlobal = false; // Biến mới để kiểm tra trạng thái "da_dat" cho cả ghế đôi và đơn

            if (isDoi) {
              const gheDoi = ghe as IGheDoi;
              const tt1 = getTrangThaiCheckGhe(gheDoi.ghe_doi[0]);
              const tt2 = getTrangThaiCheckGhe(gheDoi.ghe_doi[1]);

              if (tt1 === "da_dat" || tt2 === "da_dat") {
                bgColor = "#47566B";
                opacity = 0.5;
                isBookedGlobal = true; // Đánh dấu là đã đặt
              } else if (tt1 === "dang_dat" || tt2 === "dang_dat") {
                bgColor = "yellow";
              }

              if (
                !gheDoi.ghe_doi[0].trang_thai ||
                !gheDoi.ghe_doi[1].trang_thai
              ) {
                isHidden = true;
              }

              const ghe1So = gheDoi.ghe_doi[0].so_ghe;
              const hangDoi = ghe1So[0];
              const soDoi = parseInt(ghe1So.slice(1), 10);
              const soBoQua = `${hangDoi}${soDoi + 1}`;
              skippedSeats.add(soBoQua);

              // Cập nhật logic con trỏ cho ghế đôi
              if (isHidden || isBookedGlobal) {
                // Nếu ẩn HOẶC đã đặt
                cursor = "not-allowed";
              } else if (
                trangThaiPhong === 0 ||
                trangThaiPhong === 1 ||
                trangThaiPhong === 3
              ) {
                cursor = "pointer";
              }

              cols.push(
                <div
                  key={`${hang}-${colIndex}`}
                  onClick={() => {
                    if (trangThaiPhong === 3 && (isHidden || isBookedGlobal)) {
                      // Xử lý click cho ghế ẩn hoặc đã đặt trong chế độ mua
                      alert(
                        isHidden
                          ? "Ghế đang hỏng, vui lòng chọn ghế khác."
                          : "Ghế đã có người mua, vui lòng chọn ghế khác."
                      );
                      return;
                    }
                    handleClick(ghe.so_ghe); // Gọi hàm handleClick chung
                  }}
                  onDoubleClick={() => handleDoubleClick(ghe.so_ghe)}
                  title={`${ghe.so_ghe} - Loại: Ghế đôi - Trạng thái API: ${
                    gheDoi.ghe_doi[0].trang_thai ? "Bật" : "Tắt"
                  } - Trạng thái đặt: ${tt1}, ${tt2}`}
                  style={{
                    width: 40 * 2 + 6,
                    height: 29,
                    backgroundColor: isHidden ? "lightgray" : bgColor,
                    borderRadius: 8,
                    border: `1px solid ${borderColor}`,
                    display: trangThaiPhong === 3 && isHidden ? "none" : "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    userSelect: "none",
                    cursor: cursor,
                    opacity: isHidden ? 0.7 : opacity,
                    margin: "5px 13.5px",
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      color: isHidden ? "#666" : fontColor,
                      fontWeight: "bold",
                      fontSize: isHidden ? 24 : 14,
                      pointerEvents: "none",
                      lineHeight: isHidden ? "40px" : "normal",
                    }}
                  >
                    {isHidden ? "X" : ghe.so_ghe}
                  </span>
                </div>
              );
              colIndex += 2;
              continue;
            }

            // Ghế thường/VIP đơn lẻ
            const trangThaiCheck = getTrangThaiCheckGhe(ghe as IGhe);

            if (trangThaiCheck === "da_dat") {
              bgColor = "#47566B";
              fontColor = "#FFFFFF";
              opacity = 0.5;
              isBookedGlobal = true; // Đánh dấu là đã đặt
            } else if (trangThaiCheck === "dang_dat") {
              bgColor = "yellow";
            }

            if (!ghe.trang_thai) {
              isHidden = true;
            }

            // Cập nhật logic con trỏ cho ghế đơn
            if (isHidden || isBookedGlobal) {
              // Nếu ẩn HOẶC đã đặt
              cursor = "not-allowed";
            } else if (
              trangThaiPhong === 0 ||
              trangThaiPhong === 1 ||
              trangThaiPhong === 3
            ) {
              cursor = "pointer";
            }

            cols.push(
              <div
                key={`${hang}-${colIndex}`}
                onClick={() => {
                  if (trangThaiPhong === 3 && (isHidden || isBookedGlobal)) {
                    // Xử lý click cho ghế ẩn hoặc đã đặt trong chế độ mua
                    alert(
                      isHidden
                        ? "Ghế đang hỏng, vui lòng chọn ghế khác."
                        : "Ghế đã có người mua, vui lòng chọn ghế khác."
                    );
                    return;
                  }
                  handleClick(ghe.so_ghe);
                }}
                onDoubleClick={() => handleDoubleClick(ghe.so_ghe)}
                title={`${ghe.so_ghe} - Loại: ${
                  ghe.loai_ghe_id === 1
                    ? "Thường"
                    : ghe.loai_ghe_id === 2
                    ? "VIP"
                    : "Đôi"
                } - Trạng thái API: ${
                  ghe.trang_thai ? "Bật" : "Tắt"
                } - Trạng thái đặt: ${trangThaiCheck}`}
                style={{
                  width:
                  ghe.loai_ghe_id === 3 ? 0 : 40,
                  height: ghe.loai_ghe_id === 3 ? 0 : 29,
                  opacity: ghe.loai_ghe_id === 3 ? 0 : isHidden ? 0.7 : opacity,
                  visibility: ghe.loai_ghe_id === 3 ? "hidden" : "visible",
                  pointerEvents: ghe.loai_ghe_id === 3 ? "none" : "auto",
                  backgroundColor: isHidden ? "lightgray" : bgColor,
                  borderRadius: 8,
                  border: `1.5px solid ${borderColor}`,
                  display: ghe.loai_ghe_id === 3 ? "none" : "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  userSelect: "none",
                  cursor: cursor,
                  margin: "3px 8px",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    color: isHidden ? "#666" : fontColor,
                    fontWeight: "bold",
                    fontSize: isHidden ? 24 : 14,
                    pointerEvents: "none",
                    lineHeight: isHidden ? "40px" : "normal",
                  }}
                >
                  {isHidden ? "X" : ghe.so_ghe}
                </span>
              </div>
            );

            colIndex++;
          }

          return (
            <div
              key={`row-${hang}`}
              style={{ display: "flex", marginBottom: 8, justifyContent:"center" }}
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
                border: "3px solid red",
              }}
            />
            <span>Ghế VIP</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 50,
                height: 20,
                backgroundColor: "white",
                borderRadius: 5,
                border: "3px solid blue",
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

      {trangThaiPhong === 3 && ( // Chú thích cho chế độ mua
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
          {/* <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 40,
                height: 20,
                backgroundColor: "white",
                borderRadius: 4,
                border: '2px solid black'
              }}
            />
            <span>Ghế trống</span>
          </div> */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 40,
                height: 20,
                backgroundColor: "yellow",
                borderRadius: 4,
                border: "2px solid orange",
              }}
            />
            <span>Đang chọn</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 40,
                height: 20,
                backgroundColor: "#47566B",
                opacity: 0.5,
                borderRadius: 4,
              }}
            />
            <span>Đã đặt</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SoDoGhe;

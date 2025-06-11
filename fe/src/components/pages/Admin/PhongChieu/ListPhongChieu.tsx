import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Table, Button, Modal } from "antd";
import type { ColumnsType } from "antd/es/table";
import { IPhongChieu } from "../interface/phongchieu";
import { IGhe } from "../interface/ghe";

interface IRap {
  id: number;
  ten_rap: string;
}



const BASE_URL = "http://localhost:3000";

const fetchPhongChieu = async (): Promise<IPhongChieu[]> => {
  const res = await axios.get(`${BASE_URL}/phong_chieu`);
  return res.data.data || res.data;
};

const fetchRap = async (): Promise<IRap[]> => {
  const res = await axios.get(`${BASE_URL}/rap`);
  return res.data.data || res.data;
};

const ListPhongChieu = () => {
  const [open, setOpen] = useState(false);
  const [selectedPhong, setSelectedPhong] = useState<IPhongChieu | null>(null);
  const [danhSachGhe, setDanhSachGhe] = useState<IGhe[]>([]);

  // Lấy danh sách phòng chiếu
  const {
    data: phongChieuData,
    isLoading: isLoadingPhong,
    isError: isErrorPhong,
  } = useQuery({
    queryKey: ["phongChieu"],
    queryFn: fetchPhongChieu,
  });

  // Lấy danh sách rạp
  const {
    data: rapData,
    isLoading: isLoadingRap,
    isError: isErrorRap,
  } = useQuery({
    queryKey: ["rap"],
    queryFn: fetchRap,
  });
  useEffect(() => {
    if (!selectedPhong) {
      setDanhSachGhe([]);
      return;
    }

    axios
      .get(`${BASE_URL}/ghe?phong_id=${selectedPhong.id}`)
      .then((res) => {
        setDanhSachGhe(res.data.data || res.data);
      })
      .catch(() => {
        setDanhSachGhe([]);
      });
  }, [selectedPhong]);

  if (isLoadingPhong || isLoadingRap)
    return <div style={{ padding: 20, fontSize: 16 }}>Đang tải dữ liệu...</div>;

  if (isErrorPhong || isErrorRap)
    return (
      <div style={{ padding: 20, fontSize: 16, color: "red" }}>
        Đã xảy ra lỗi khi tải dữ liệu!
      </div>
    );

  const rapMap = new Map<number, string>();
  rapData?.forEach((r) => {
    rapMap.set(r.id, r.ten_rap);
  });

  const openModal = (phong: IPhongChieu) => {
    setSelectedPhong(phong);
    setOpen(true);
  };

  // Hàm hiển thị ma trận ghế với dữ liệu thực tế, theo yêu cầu màu viền và nền chữ
  const renderMatrix = () => {
    if (!selectedPhong) return null;

    const size = selectedPhong.loai_so_do; // số cột = số hàng (giả sử hình vuông)
    const rows = Array.from({ length: size });

    return (
      <div style={{ display: "grid", gap: 6 }}>
        {rows.map((_, rowIndex) => {
          const hang = String.fromCharCode(65 + rowIndex); // A, B, C...

          const cols = [];
          let colIndex = 1;

          while (colIndex <= size) {
            const cotStr = colIndex.toString();

            // Tìm ghế đúng vị trí hàng, cột
            const ghe = danhSachGhe.find((g) => {
              if (g.hang !== hang) return false;
              if (g.cot === cotStr) return true;
              if (g.loai_ghe_id === 3) {
                // Ghế đôi có cot dạng "2-3"
                const parts = g.cot.split("-");
                return parts.includes(cotStr);
              }
              return false;
            });

            if (!ghe) {
              // Không có ghế ở vị trí này
              cols.push(
                <div
                  key={colIndex}
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

            // Ghế đôi chiếm 2 ô
            const isDoi = ghe.loai_ghe_id === 3;
            const span = isDoi ? 2 : 1;

            if (isDoi && colIndex + 1 > size) break; // tránh tràn ô

            // Xác định màu viền, nền và chữ theo loại ghế
            let borderColor = "";
            let backgroundColor = "";
            let color = "";

            switch (ghe.loai_ghe_id) {
              case 1: // Ghế thường
                borderColor = "#000";
                color = "#000";
                break;
              case 2: // Ghế VIP
                borderColor = "red";
                color = "red";
                break;
              case 3: // Ghế đôi
                borderColor = "blue";
                color = "blue";
                break;
              default:
                borderColor = "#999";
                backgroundColor = "#fff";
                color = "#000";
            }

            cols.push(
              <div
                key={colIndex}
                title={`${ghe.so_ghe} - ${ghe.trang_thai ? "Còn ghế" : "Đã đặt"}`}
                style={{
                  position: "relative",
                  width: span * 40 + (span - 1) * 6,
                  height: 40,
                  backgroundColor: backgroundColor,
                  borderRadius: 4,
                  border: `2px solid ${borderColor}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 6,
                  userSelect: "none",
                  cursor: ghe.trang_thai ? "pointer" : "not-allowed",
                  opacity: ghe.trang_thai ? 1 : 0.5,
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    color: color,
                    fontWeight: "bold",
                    pointerEvents: "none",
                    userSelect: "none",
                    fontSize: 14,
                  }}
                >
                  {ghe.so_ghe}
                </span>
              </div>
            );

            colIndex += span;
          }

          return (
            <div
              key={rowIndex}
              style={{ display: "flex", justifyContent: "center" }}
            >
              {cols}
            </div>
          );
        })}

        {/* Chú thích loại ghế */}
        <div style={{ marginTop: 20, textAlign: "center", fontSize: 16 }}>
          <span
            style={{
              margin: "0 12px",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                border: "2px solid #000",
              }}
            />
            Ghế Thường
          </span>

          <span
            style={{
              margin: "0 12px",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                border: "2px solid red",
              }}
            />
            Ghế VIP
          </span>
          <span
            style={{
              margin: "0 12px",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                border: "2px solid blue",
              }}
            />
            Ghế Đôi
          </span>
        </div>
      </div>
    );
  };

  const columns: ColumnsType<IPhongChieu> = [
    {
      title: "STT",
      key: "index",
      render: (_text, _record, index) => index + 1,
      width: 60,
      align: "center",
    },
    {
      title: "Tên Rạp",
      dataIndex: "rap_id",
      key: "rap_id",
      align: "center",
      render: (rap_id: number) =>
        rapMap.get(rap_id) || `Không có rạp ID ${rap_id}`,
    },
    {
      title: "Tên phòng",
      dataIndex: "ten_phong",
      key: "ten_phong",
    },
    {
      title: "Loại sơ đồ",
      dataIndex: "loai_so_do",
      key: "loai_so_do",
      align: "center",
    },
    {
      title: "Hàng thường",
      dataIndex: "hang_thuong",
      key: "hang_thuong",
      align: "center",
    },
    {
      title: "Hàng VIP",
      dataIndex: "hang_vip",
      key: "hang_vip",
      align: "center",
    },
    {
      title: "Thao tác",
      key: "actions",
      align: "center",
      render: (_text, record) => (
        <Button onClick={() => openModal(record)}>Xem Ghế</Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>Danh sách phòng chiếu</h2>
      <Table
        columns={columns}
        dataSource={phongChieuData}
        rowKey={(record) => record.id}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={selectedPhong?.ten_phong || ""}
        open={open}
        onCancel={() => setOpen(false)}
        footer={[
          <Button key="close" onClick={() => setOpen(false)}>
            Đóng
          </Button>,
        ]}
        width={700}
      >
        {renderMatrix()}
      </Modal>
    </div>
  );
};

export default ListPhongChieu;

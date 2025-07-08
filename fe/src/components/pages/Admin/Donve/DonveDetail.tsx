// pages/Admin/DonVe/DonVeDetail.tsx
import { useEffect, useState } from "react";
import { Descriptions, message } from "antd";
import { useParams } from "react-router-dom";
import { getDonVeById } from "../../../provider/duProvider";

export default function DonVeDetail() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchDetail();
  }, []);

  const fetchDetail = async () => {
    try {
      const res = await getDonVeById(id!);
      setData(res);
    } catch (err) {
      message.error("Lỗi khi tải chi tiết");
    }
  };

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h2>Chi tiết đơn vé #{id}</h2>

      <Descriptions
        bordered
        column={1}
        size="middle"
        labelStyle={{ fontWeight: "bold", width: 200 }}
        contentStyle={{ width: 400 }}
      >
        <Descriptions.Item label="Họ tên">
          {data.nguoi_dung?.ten}
        </Descriptions.Item>
        <Descriptions.Item label="SĐT">
          {data.nguoi_dung?.so_dien_thoai || "—"}
        </Descriptions.Item>
        <Descriptions.Item label="Email">
          {data.nguoi_dung?.email}
        </Descriptions.Item>
        <Descriptions.Item label="Phim">
          {data.dat_ve?.lich_chieu?.phim?.ten_phim}
        </Descriptions.Item>
        <Descriptions.Item label="Suất chiếu">
          {data.dat_ve?.lich_chieu?.gio_chieu}
        </Descriptions.Item>
        <Descriptions.Item label="Rạp">
          {data.dat_ve?.lich_chieu?.rap?.ten_rap}
        </Descriptions.Item>
        <Descriptions.Item label="Phòng chiếu">
          {data.dat_ve?.lich_chieu?.phong_chieu?.ten_phong}
        </Descriptions.Item>
        <Descriptions.Item label="Ghế">
          {data.dat_ve?.ghe_da_dat?.join(", ")}
        </Descriptions.Item>
        <Descriptions.Item label="Tổng tiền">
          {Number(data.dat_ve?.tong_tien || 0).toLocaleString()} đ
        </Descriptions.Item>
        <Descriptions.Item label="Thanh toán">
          {data.phuong_thuc?.ten}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
}

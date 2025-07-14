import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Typography, Tag, Divider } from "antd";

const { Title, Text } = Typography;

const LichSuDatVe = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);

  const [data, setData] = useState<null | {
    dat_ve_id: string;
    phuong_thuc_thanh_toan_id: string;
    nguoi_dung_id: string;
    ma_giao_dich: string;
  }>(null);

  useEffect(() => {
    const dat_ve_id = params.get("dat_ve_id");
    const phuong_thuc_thanh_toan_id = params.get("phuong_thuc_thanh_toan_id");
    const nguoi_dung_id = params.get("nguoi_dung_id");
    const ma_giao_dich = params.get("ma_giao_dich");

    if (dat_ve_id && phuong_thuc_thanh_toan_id && nguoi_dung_id && ma_giao_dich) {
      setData({
        dat_ve_id,
        phuong_thuc_thanh_toan_id,
        nguoi_dung_id,
        ma_giao_dich,
      });
    } else {
      // Nếu thiếu dữ liệu thì redirect về trang chủ
      navigate("/", { replace: true });
    }
  }, [location.search, navigate]);

  return (
    <div style={{ padding: 24, maxWidth: 700, margin: "0 auto" }}>
      <Title level={2} style={{ color: "white" }}>
        Chi tiết đơn đặt vé
      </Title>
      <Divider />
      {data ? (
        <Card bordered style={{ fontSize: 16 }}>
          <p>
            <Text strong>Mã đặt vé:</Text> {data.dat_ve_id}
          </p>
          <p>
            <Text strong>Phương thức thanh toán:</Text>{" "}
            {data.phuong_thuc_thanh_toan_id === "1" ? "MoMo" : data.phuong_thuc_thanh_toan_id}
          </p>
          <p>
            <Text strong>Người dùng ID:</Text> {data.nguoi_dung_id}
          </p>
          <p>
            <Text strong>Mã giao dịch MoMo:</Text>{" "}
            <Tag color="green">{data.ma_giao_dich}</Tag>
          </p>
        </Card>
      ) : (
        <p>Không có dữ liệu đặt vé.</p>
      )}
    </div>
  );
};

export default LichSuDatVe;

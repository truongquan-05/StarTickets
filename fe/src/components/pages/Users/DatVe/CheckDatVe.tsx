import { Button } from "antd";
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const CheckDatVe = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const error = searchParams.get("error");
  const datVeId = searchParams.get("dat_ve_id");
  const maGiaoDich = searchParams.get("ma_giao_dich");

  const containerStyle: React.CSSProperties = {
    minHeight: "60vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(180deg, #0a091aff 0%, #211f3eff 80%)",
    color: "white",
    textAlign: "center",
    padding: "2rem",
    fontFamily: "'Roboto', sans-serif",
  };

  const titleStyle = {
    fontSize: "2.5rem",
    fontWeight: "700",
    marginBottom: "1rem",
    letterSpacing: "1.5px",
    fontFamily: '"Anton", sans-serif',
  };

  const messageStyle = {
    fontSize: "1.1rem",
    lineHeight: "1.6",
    maxWidth: "500px",
    margin: "0 auto",
  };

  if (error) {
    return (
      <div style={containerStyle}>
        <div style={titleStyle}>GIAO DỊCH THẤT BẠI</div>
        <div style={messageStyle}>
          Giao dịch không thành công, vui lòng kiểm tra lại thông tin thanh toán
          của bạn
          <br />
          Xin chân thành cảm ơn!
        </div>
          <br />
        <Button  onClick={() => navigate("/")}>
          Quay lại trang chủ
        </Button>
      </div>
    );
  }

  if (datVeId && maGiaoDich) {
    return (
      <div style={containerStyle}>
        <div
          style={{
            ...titleStyle,
            color: "white",
            textAlign: "center" /* vàng nổi bật */,
          }}
        >
          Giao dịch thành công
        </div>
        <div style={messageStyle}>
          Vui lòng kiểm tra email để nhận vé và thông tin chi tiết.
          <br />
          Cảm ơn bạn đã mua vé.
        </div>
        <br />
        <Button onClick={() => navigate("/")}>Quay lại trang chủ</Button>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={titleStyle}>KHÔNG CÓ DỮ LIỆU ĐẶT VÉ</div>
      <div style={messageStyle}>
        Vui lòng thực hiện đặt vé để xem thông báo ở đây.
      </div>
    </div>
  );
};

export default CheckDatVe;

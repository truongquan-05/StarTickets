import { CheckCircleTwoTone } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import bgImage from "../../../../assets/live-cover2.webp";
const CheckDatVe = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const error = searchParams.get("error");
  const datVeId = searchParams.get("dat_ve_id");
  const maGiaoDich = searchParams.get("ma_giao_dich");

  const containerStyle: React.CSSProperties = {
    position: "relative",
    minHeight: "80vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: `url(${bgImage}) no-repeat center center`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    color: "white",
    textAlign: "center",
    overflow: "hidden",
    zIndex: 1,
  };

  const titleStyle = {
    fontSize: "34px",
    fontWeight: "100",
    marginBottom: "1rem",
    letterSpacing: "1px",
    fontFamily: '"Anton", sans-serif',
    zIndex: 1,
  };

  const messageStyle = {
    fontFamily: '"Poppins", sans-serif',
    fontSize: "1.1rem",
    lineHeight: "1.6",
    maxWidth: "500px",
    margin: "0 auto",
    zIndex: 1,
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
        <Button onClick={() => navigate("/")}>Quay lại trang chủ</Button>
      </div>
    );
  }

  if (datVeId && maGiaoDich) {
    return (
      <div className="boxloithanhtoan" style={{ textAlign: "center",position: "relative"  }}>
        <div style={containerStyle}>
          {/* Lớp phủ mờ đen */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              zIndex: 0,
            }}
          />
          <CheckCircleTwoTone
            twoToneColor="yellow"
            style={{ fontSize: "150px", marginBottom: "1rem", zIndex: 1, }}
          />
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
          <button
            style={{ padding: "4px 24px", fontSize: "16px" }}
            className="primary-button"
            onClick={() => navigate("/")}
          >
            <span>Quay lại trang chủ</span>
          </button>
        </div>
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

import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Form,
  Input,
  Checkbox,
  Button,
  Card,
  Typography,
  Spin,
  message,
  Modal,
  Descriptions,
} from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useCreateThanhToanMoMo, useListCinemas } from "../../../hook/hungHook";

const { Title, Text } = Typography;

interface BookingData {
  id: number;
  nguoi_dung_id: number;
  lich_chieu_id: number;
  tong_tien: string;
  created_at: string;
  dat_ve_chi_tiet: Array<{
    id: number;
    ghe_dat: {
      so_ghe: string;
      hang: string;
    };
    gia_ve: string;
  }>;
}

interface LichChieuInfo {
  phim?: {
    ten_phim: string;
    do_tuoi_gioi_han: number;
  };
  phong_chieu?: {
    ten_phong: string;
    rap_id: number;
  };
  gio_chieu: string;
  gia_ve?: Array<{
    ten_loai_ghe: string;
  }>;
}

interface RapInfo {
  ten_rap: string;
  dia_chi: string;
}

const ThanhToan: React.FC = () => {
  const [countdown, setCountdown] = useState(30000); // 5 phút
  const [lichChieuInfo, setLichChieuInfo] = useState<LichChieuInfo | null>(
    null
  );
  const momoMutation = useCreateThanhToanMoMo({ resource: "momo-pay" });
  const [rapInfo, setRapInfo] = useState<RapInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [checkedTerms1, setCheckedTerms1] = useState(false);
  const [checkedTerms2, setCheckedTerms2] = useState(false);
  const [isConfirmingPaymentMethod, setIsConfirmingPaymentMethod] =
    useState(false);
  const [customerInfo, setCustomerInfo] = useState<any>({});
  const [step, setStep] = useState<"form" | "selectMethod">("form");

  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state?.bookingData as BookingData | undefined;

  const { data: rapList, isLoading: loadingRap } = useListCinemas({
    resource: "rap",
  });

  // Lấy user từ localStorage
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  // Gán thông tin user vào form
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        fullName: user.ten,
        phone: user.so_dien_thoai,
        email: user.email,
      });
    }
  }, [user, form]);

  // Đếm ngược thời gian giữ vé
  useEffect(() => {
    if (countdown <= 0) {
      message.warning("Bạn đã hết thời gian giữ vé. Vui lòng chọn lại!");
      setTimeout(() => {
        navigate("/");
      }, 2000);
      return;
    }

    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown, navigate]);

  // Lấy dữ liệu lịch chiếu
  useEffect(() => {
    if (!bookingData?.lich_chieu_id || !rapList) return;

    setLoading(true);
    fetch(`http://127.0.0.1:8000/api/lich_chieu/${bookingData.lich_chieu_id}`)
      .then((res) => res.json())
      .then((data: LichChieuInfo) => {
        setLichChieuInfo(data);
        const rapId = data.phong_chieu?.rap_id;
        const matchedRap = rapList.find((r: any) => r.id === rapId);
        setRapInfo(matchedRap);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [bookingData?.lich_chieu_id, rapList]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m} : ${s}`;
  };

  const onFinish = (values: any) => {
    setCustomerInfo(values); // nếu bạn muốn lưu lại
    setStep("selectMethod"); // chuyển qua phần chọn phương thức
  };

  const handleThanhToanMomo = async () => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;

    if (!bookingData || !user) {
      message.error("Thiếu thông tin đặt vé hoặc người dùng.");
      return;
    }

    const payload = {
      tong_tien: Number(bookingData.tong_tien),
      dat_ve_id: bookingData.id,
      nguoi_dung_id: user.id,
      phuong_thuc_thanh_toan_id: 1,
    };

    console.log("📦 Payload gửi đi:", payload);

    

    momoMutation.mutate(payload, {
      onSuccess: (response) => {
        window.location.href = response.data.payUrl;
      },
      onError: (error: any) => {
        console.error("❌ Lỗi thanh toán:", error);
        message.error("Thanh toán thất bại. Vui lòng thử lại!");
      },
    });
  };

  if (!bookingData) {
    return (
      <div style={{ textAlign: "center", padding: 50 }}>
        <Title level={3}>Không tìm thấy thông tin đặt vé</Title>
        <Button type="primary" onClick={() => navigate("/")}>
          Quay về trang chủ
        </Button>
      </div>
    );
  }

  if (loading || loadingRap || !lichChieuInfo) {
    return (
      <div style={{ textAlign: "center", padding: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  // Trích xuất thông tin từ bookingData
  const selectedSeats = bookingData.dat_ve_chi_tiet.map(
    (item) => item.ghe_dat.so_ghe
  );
  const totalPrice = bookingData.tong_tien;

  const thoiGian = lichChieuInfo.gio_chieu
    ? `${lichChieuInfo.gio_chieu.slice(
        11,
        16
      )} ngày ${lichChieuInfo.gio_chieu.slice(0, 10)}`
    : "";

  return (
    <>
      <Row
        gutter={24}
        style={{
          padding: 24,
          minHeight: 600,
          maxWidth: 1200,
          margin: "auto",
          background: "linear-gradient(180deg, #2d0058 0%, #5d23c8 100%)",
          color: "white",
        }}
      >
        <Col span={14}>
          <Title level={3} style={{ color: "#e6e600" }}>
            TRANG THANH TOÁN
          </Title>
          <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
            <Text style={{ color: "#e6e600", fontWeight: "bold" }}>
              1 THÔNG TIN KHÁCH HÀNG
            </Text>
            <Text style={{ opacity: 0.5 }}>2 THANH TOÁN</Text>
            <Text style={{ opacity: 0.5 }}>3 THÔNG TIN VÉ PHIM</Text>
          </div>

          <Form layout="vertical" onFinish={onFinish} form={form}>
            <Form.Item
              label="Họ và tên"
              name="fullName"
              rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
            >
              <Input placeholder="Họ và tên" />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email" },
                { type: "email", message: "Email không hợp lệ" },
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>

            <Form.Item
              name="terms1"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error(
                            "Bạn phải đảm bảo mua vé đúng độ tuổi quy định"
                          )
                        ),
                },
              ]}
            >
              <Checkbox
                checked={checkedTerms1}
                onChange={(e) => setCheckedTerms1(e.target.checked)}
              >
                Đảm bảo mua vé đúng số tuổi quy định.
              </Checkbox>
            </Form.Item>

            <Form.Item
              name="terms2"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error("Bạn phải đồng ý với điều khoản của rạp")
                        ),
                },
              ]}
            >
              <Checkbox
                checked={checkedTerms2}
                onChange={(e) => setCheckedTerms2(e.target.checked)}
              >
                Đồng ý với{" "}
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    setIsModalVisible(true);
                  }}
                  style={{ color: "#e6e600", cursor: "pointer" }}
                >
                  điều khoản của rạp
                </a>
                .
              </Checkbox>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                block
                icon={
                  <img
                    src="/momo-icon.png"
                    alt="Momo"
                    style={{ width: 20, marginRight: 8 }}
                  />
                } // giả sử ảnh được import đúng
                disabled={!(checkedTerms1 && checkedTerms2)}
                style={{
                  backgroundColor: "#b800ff",
                  borderColor: "#b800ff",
                  color: "#fff",
                  fontWeight: "bold",
                }}
                onClick={handleThanhToanMomo} // gọi xử lý MOMO trực tiếp
              >
                Thanh toán qua Momo
              </Button>
            </Form.Item>
          </Form>
        </Col>

        <Col span={10}>
          <Card
            style={{ backgroundColor: "#5d23c8", color: "white" }}
            bodyStyle={{ padding: "24px" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <Title level={5} style={{ color: "#fff" }}>
                {lichChieuInfo.phim?.ten_phim}
              </Title>
              <div
                style={{
                  backgroundColor: "yellow",
                  color: "#000",
                  fontWeight: "bold",
                  padding: "4px 8px",
                  borderRadius: 4,
                }}
              >
                THỜI GIAN GIỮ VÉ: {formatTime(countdown)}
              </div>
            </div>

            <Text style={{ fontWeight: "bold", color: "yellow" }}>
              Phim dành cho khán giả từ {lichChieuInfo.phim?.do_tuoi_gioi_han}+
              tuổi
            </Text>

            <div style={{ marginTop: 16, fontSize: 14 }}>
              <Text strong>{rapInfo?.ten_rap || "Không tìm thấy rạp"}</Text>
              <br />
              <Text>{rapInfo?.dia_chi || ""}</Text>
            </div>

            <div style={{ marginTop: 24, fontWeight: "bold" }}>
              <Text>Thời gian</Text>
              <br />
              <Text>{thoiGian}</Text>
            </div>

            <Row style={{ marginTop: 16 }}>
              <Col span={8}>
                <Text strong>Phòng chiếu</Text>
                <br />
                <Text>{lichChieuInfo.phong_chieu?.ten_phong}</Text>
              </Col>
              <Col span={8}>
                <Text strong>Số vé</Text>
                <br />
                <Text>{selectedSeats.length}</Text>
              </Col>
            </Row>

            <Row style={{ marginTop: 16 }}>
              <Col span={8}>
                <Text strong>Loại ghế</Text>
                <br />
                <Text>
                  {lichChieuInfo.gia_ve?.[0]?.ten_loai_ghe || "Ghế Thường"}
                </Text>
              </Col>
              <Col span={8}>
                <Text strong>Số ghế</Text>
                <br />
                <Text>{selectedSeats.join(", ")}</Text>
              </Col>
            </Row>

            <div
              style={{
                marginTop: 16,
                borderTop: "1px dotted #999",
                paddingTop: 12,
              }}
            >
              <Text strong>Bắp nước</Text>
              <br />
              <Text>-</Text>
            </div>

            <div
              style={{
                marginTop: 24,
                fontWeight: "bold",
                fontSize: 18,
                display: "flex",
                justifyContent: "space-between",
                color: "yellow",
              }}
            >
              <Text>SỐ TIỀN CẦN THANH TOÁN</Text>
              <Text style={{ fontSize: 20 }}>
                {Number(totalPrice).toLocaleString("vi-VN")} VND
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      <Modal
        title="Điều khoản của rạp"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={700}
        bodyStyle={{ maxHeight: "60vh", overflowY: "auto", padding: 24 }}
      >
        {/* Nội dung điều khoản */}
        <p>Điều khoản sử dụng và thanh toán...</p>
      </Modal>
      {isConfirmingPaymentMethod ? (
        <div style={{ marginTop: 32 }}>
          <Text strong style={{ color: "#e6e600", fontSize: 16 }}>
            Chọn phương thức thanh toán:
          </Text>
          <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
            <Button
              type="primary"
              style={{
                backgroundColor: "#b800ff",
                borderColor: "#b800ff",
                fontWeight: "bold",
              }}
              onClick={handleThanhToanMomo}
            >
              Thanh toán qua MOMO
            </Button>
          </div>
        </div>
      ) : (
        <Form layout="vertical" onFinish={onFinish} form={form}>
          {/* Các trường nhập họ tên, email, checkbox... như bạn đã có */}
        </Form>
      )}
    </>
  );
};

export default ThanhToan;

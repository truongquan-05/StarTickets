import React, { useState, useEffect, useRef, useCallback } from "react";
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
  Select,
} from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useCreateThanhToanMoMo,
  useListCinemas,
  useUpdateCheckGhe,
} from "../../../hook/hungHook";
import { useListVouchers } from "../../../hook/thinhHook";
import { IVoucher } from "../../Admin/interface/vouchers";

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
  const [step, setStep] = useState<1 | 2>(1);
  const [countdown, setCountdown] = useState(30000); // 5 phút
  const [lichChieuInfo, setLichChieuInfo] = useState<LichChieuInfo | null>(
    null
  );
  const [rapInfo, setRapInfo] = useState<RapInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [checkedTerms1, setCheckedTerms1] = useState(false);
  const [checkedTerms2, setCheckedTerms2] = useState(false);
  const [selectedVoucherId, setSelectedVoucherId] = useState<number | null>(
    null
  );
  const { data } = useListVouchers({
    resource: "ma_giam_gia",
  });
  const voucherList = data?.data ?? [];

  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state?.bookingData as BookingData | undefined;
  const phuongThucThanhToanId = useRef<number>(1);

  const { data: rapList, isLoading: loadingRap } = useListCinemas({
    resource: "rap",
  });

  // Lấy user từ localStorage (chỉ lấy ten và email)
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  const isPayingRef = useRef(false);
  const { mutate: updateCheckGhe } = useUpdateCheckGhe({
    resource: "check_ghe",
  });
  const momoMutation = useCreateThanhToanMoMo({ resource: "momo-pay" });

  const releaseSeats = useCallback(() => {
    if (!bookingData) return;
    bookingData.dat_ve_chi_tiet.forEach((ct) => {
      updateCheckGhe({
        id: ct.id,
        values: { trang_thai: "trong" },
        lichChieuId: bookingData.lich_chieu_id,
      });
    });
  }, [bookingData, updateCheckGhe]);

  // Gán tên và email mặc định vào form, có thể sửa được
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        fullName: user.ten || "",
        email: user.email || "",
      });
    }
  }, [user, form]);

  // Đếm ngược giữ vé
  useEffect(() => {
    if (countdown <= 0) {
      message.warning("Bạn đã hết thời gian giữ vé. Vui lòng chọn lại!");
      setTimeout(() => navigate("/"), 2000);
      return;
    }
    const interval = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [countdown, navigate]);

  // Lấy thông tin lịch chiếu và rạp
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

  const onFinishStep1 = (values: any) => {
    setStep(2);
  };

  const onBackStep2 = () => {
    setStep(1);
  };

  const onFinishStep2 = (values: any) => {
    if (!bookingData || !user) {
      message.error("Thiếu thông tin đặt vé hoặc người dùng.");
      return;
    }
    
    const payload = {
      tong_tien: Number(bookingData.tong_tien),
      dat_ve_id: bookingData.id,
      nguoi_dung_id: user.id,
      phuong_thuc_thanh_toan_id: phuongThucThanhToanId.current,
      fullName: values.fullName,
      email: values.email,
      ma_giam_gia_id: selectedVoucherId,
    };
    console.log("đơn vé:",payload);
    

    isPayingRef.current = true;
    sessionStorage.setItem("skipRelease", "true");

    momoMutation.mutate(payload, {
      onSuccess: (response) => {
        window.location.href = response.data.payUrl;
      },
      onError: () => {
        message.error("Thanh toán thất bại. Vui lòng thử lại!");
        isPayingRef.current = false;
        sessionStorage.removeItem("skipRelease");
      },
    });
  };

  // Giải phóng ghế khi unmount hoặc chuyển trang nếu chưa thanh toán
  useEffect(() => {
    return () => {
      if (
        !isPayingRef.current &&
        sessionStorage.getItem("skipRelease") !== "true"
      ) {
        releaseSeats();
      }
      sessionStorage.removeItem("skipRelease");
    };
  }, [location.pathname, releaseSeats]);

  // Giải phóng ghế khi reload hoặc thoát trang nếu chưa thanh toán
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (
        !isPayingRef.current &&
        sessionStorage.getItem("skipRelease") !== "true"
      ) {
        navigator.sendBeacon(
          "http://127.0.0.1:8000/api/release-seats-on-exit",
          JSON.stringify({
            lich_chieu_id: bookingData?.lich_chieu_id,
            ghe_so: bookingData?.dat_ve_chi_tiet.map((ct) => ct.ghe_dat.so_ghe),
          })
        );
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [bookingData]);

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

  const isSubmitDisabled = !checkedTerms1 || !checkedTerms2;

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
            <Text
              style={{
                color: step === 1 ? "#e6e600" : "white",
                fontWeight: step === 1 ? "bold" : "normal",
              }}
            >
              1 THÔNG TIN KHÁCH HÀNG
            </Text>
            <Text
              style={{
                color: step === 2 ? "#e6e600" : "white",
                fontWeight: step === 2 ? "bold" : "normal",
              }}
            >
              2 THANH TOÁN
            </Text>
          </div>

          <Form
            layout="vertical"
            form={form}
            onFinish={step === 1 ? onFinishStep1 : onFinishStep2}
          >
            {step === 1 && (
              <>
                <Form.Item
                  label="Họ và tên"
                  name="fullName"
                  rules={[
                    { required: true, message: "Vui lòng nhập họ và tên" },
                  ]}
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
                <Form.Item label="Mã giảm giá">
                  <Select
                    showSearch
                    placeholder="Chọn mã giảm giá"
                    allowClear
                    value={selectedVoucherId ?? undefined}
                    onChange={(value) => {
                      setSelectedVoucherId(value || null);
                      if (value) {
                        const selected = voucherList.find(
                          (v:IVoucher) => v.id === value
                        );
                        if (selected) {
                          message.success(
                            `Mã "${selected.ma}" đã được áp dụng!`
                          );
                        }
                      }
                    }}
                    options={voucherList.map((voucher:IVoucher) => ({
                      label: `${voucher.ma} - Giảm ${voucher.phan_tram_giam}%`,
                      value: voucher.id, // Lưu id chứ không phải ma
                    }))}
                  />
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
                              new Error(
                                "Bạn phải đồng ý với điều khoản của rạp"
                              )
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
                    disabled={isSubmitDisabled}
                    style={{
                      backgroundColor: "#b800ff",
                      borderColor: "#b800ff",
                      color: "#fff",
                      fontWeight: "bold",
                    }}
                    htmlType="submit"
                  >
                    Tiếp tục
                  </Button>
                </Form.Item>
              </>
            )}

            {step === 2 && (
              <>
                <Form.Item>
                  <Button
                    type="primary"
                    block
                    icon={
                      <img
                        src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png"
                        alt="Momo"
                        style={{ width: 20, marginRight: 8 }}
                      />
                    }
                    style={{
                      backgroundColor: "#b800ff",
                      borderColor: "#b800ff",
                      color: "#fff",
                      fontWeight: "bold",
                      marginBottom: 12,
                    }}
                    onClick={() => {
                      phuongThucThanhToanId.current = 1;
                      form.submit();
                    }}
                  >
                    Thanh toán qua Momo
                  </Button>
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    block
                    icon={
                      <img
                        src="https://vinadesign.vn/uploads/thumbnails/800/2023/05/vnpay-logo-vinadesign-25-12-59-16.jpg"
                        alt="Momo"
                        style={{ width: 20, marginRight: 8 }}
                      />
                    }
                    style={{
                      backgroundColor: "#b800ff",
                      borderColor: "#b800ff",
                      color: "#fff",
                      fontWeight: "bold",
                    }}
                    onClick={() => {
                      phuongThucThanhToanId.current = 2;
                      form.submit();
                    }}
                  >
                    Thanh toán qua VNPay
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Button
                    type="default"
                    block
                    style={{ marginBottom: 16 }}
                    onClick={onBackStep2}
                  >
                    Quay lại
                  </Button>
                </Form.Item>
              </>
            )}
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
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={700}
        bodyStyle={{ maxHeight: "60vh", overflowY: "auto", padding: 24 }}
        maskClosable={true}
      >
        <p>Điều khoản sử dụng và thanh toán...</p>
      </Modal>
    </>
  );
};

export default ThanhToan;

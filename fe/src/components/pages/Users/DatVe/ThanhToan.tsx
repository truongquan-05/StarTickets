import React, { useState, useEffect, useRef } from "react"; // Đã bỏ useCallback vì không còn releaseSeats
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
  useDestroyVoucher,
  useListCinemas,
  useVoucher,
  // useUpdateCheckGhe // Đã bỏ import này
} from "../../../hook/hungHook";
import { useListVouchers } from "../../../hook/thinhHook";
import { IVoucher } from "../../Admin/interface/vouchers";
import { DonDoAn, Food } from "../../../types/Uses";
import { useBackDelete } from "../../../hook/useConfirmBack";
// IMPORT CÁC INTERFACE CỦA BẠN TẠI ĐÂY

const { Title, Text } = Typography;

// CẬP NHẬT INTERFACE BOOKINGDATA ĐỂ BAO GỒM don_do_an VÀ CÁC THUỘC TÍNH KHÁC
interface BookingData {
  id: number;
  nguoi_dung_id: number;
  lich_chieu_id: number | null; // Có thể là null nếu chỉ mua đồ ăn mà không có vé
  tong_tien: string; // Giữ string nếu backend trả về string
  created_at: string;
  dat_ve_chi_tiet: Array<{
    id: number;
    ghe_id: number;
    ghe_dat: {
      id: number;
      ten_ghe: string;
      hang: string;
      loai_ghe_id: number;
      loai_ghe?: {
        id: number;
        ten_loai: string;
      };
    };
    gia_ve: string; // Giữ string nếu backend trả về string
  }>;
  // SỬ DỤNG INTERFACE DonDoAn VÀ Food VỚI TÊN THUỘC TÍNH ĐÚNG LÀ `don_do_an` và `do_an`
  don_do_an?: Array<DonDoAn & { do_an: Food }>; // Dùng interface DonDoAn và Food đã cung cấp, tên là `do_an`
}

interface LichChieuInfo {
  id: number;
  phim?: {
    id: number;
    ten_phim: string;
    do_tuoi_gioi_han: number;
  };
  phong_chieu?: {
    id: number;
    ten_phong: string;
    rap_id: number;
  };
  gio_chieu: string;
  gia_ve?: Array<{
    id: number;
    gia: number;
    loai_ghe_id: number;
    ten_loai_ghe: string;
  }>;
}

interface RapInfo {
  id: number;
  ten_rap: string;
  dia_chi: string;
}

const ThanhToan: React.FC = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [countdown, setCountdown] = useState(30000); // 5 phút = 300 giây
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
  const { mutate: usevoucher } = useVoucher({ resource: "voucher-check" });
  const { mutate: destroyVoucher } = useDestroyVoucher({ resource: "voucher" });
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
  const tongTienGoc = Number(bookingData?.tong_tien ?? 0);
  const [tongTienSauVoucher, setTongTienSauVoucher] = useState<number | null>(
    tongTienGoc
  );

  // Lấy user từ localStorage (chỉ lấy ten và email)
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  // Đã bỏ isPayingRef và các logic liên quan đến giải phóng ghế frontend
  const momoMutation = useCreateThanhToanMoMo({ resource: "momo-pay" });

  // Gán tên và email mặc định vào form, có thể sửa được
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        fullName: user.ten || "",
        email: user.email || "",
      });
    }
  }, [user, form]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    number | undefined
  >(undefined);

  // Gọi luôn hook, không cần điều kiện
  useBackDelete(bookingData?.id, selectedPaymentMethod === undefined);

  // eslint-disable-next-line

  // Đếm ngược thời gian
  useEffect(() => {
    // Chỉ bắt đầu đếm ngược nếu có bookingData
    if (!bookingData) return;

    if (countdown <= 0) {
      message.warning("Bạn đã hết thời gian giữ vé. Vui lòng chọn lại!");
      // Frontend không còn giải phóng ghế, backend sẽ xử lý
      setTimeout(() => navigate("/"), 2000);
      return;
    }
    const interval = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [countdown, navigate, bookingData]);

  // Lấy thông tin lịch chiếu và rạp
  useEffect(() => {
    if (!bookingData?.lich_chieu_id || !rapList) {
      // Nếu không có lich_chieu_id (chỉ mua đồ ăn), tạo lichChieuInfo mặc định
      if (
        !bookingData?.lich_chieu_id &&
        bookingData?.don_do_an &&
        bookingData.don_do_an.length > 0
      ) {
        setLichChieuInfo({
          id: 0,
          gio_chieu: new Date().toISOString(),
          phim: { id: 0, ten_phim: "Đồ Ăn & Thức Uống", do_tuoi_gioi_han: 0 },
          phong_chieu: { id: 0, ten_phong: "Online", rap_id: 0 },
        });
        setLoading(false);
      }
      return;
    }
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

  const [formStep1Data, setFormStep1Data] = useState<any>(null); // LƯU THÔNG TIN Ở STEP 1

  const onFinishStep1 = (values: any) => {
    setFormStep1Data(values);
    setStep(2);
  };

  const onBackStep2 = () => {
    setStep(1);
  };

  const onFinishStep2 = () => {
    if (!bookingData || !user) {
      message.error("Thiếu thông tin đặt vé hoặc người dùng.");
      return;
    }
    const payload = {
      tong_tien: Number(tongTienSauVoucher),
      dat_ve_id: bookingData.id,
      nguoi_dung_id: user.id,
      phuong_thuc_thanh_toan_id: phuongThucThanhToanId.current,
      ho_ten: formStep1Data.fullName,
      email: formStep1Data.email,
      ma_giam_gia_id: formStep1Data.ma_giam_gia_id,
    };
    // Không còn đặt cờ isPayingRef hoặc skipRelease vì backend xử lý
    momoMutation.mutate(payload, {
      onSuccess: (response) => {
        window.location.href = response.data.payUrl;
      },
      onError: () => {
        message.error("Thanh toán thất bại. Vui lòng thử lại!");
        // Không còn logic giải phóng ghế ở đây
      },
    });
  };

  // Đã bỏ tất cả các useEffect liên quan đến giải phóng ghế khi unmount/reload/exit
  // Backend sẽ chịu trách nhiệm cho việc này.

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

  // Nếu không có lichChieuInfo nhưng có don_do_an, thì không cần loading cho lichChieuInfo
  if (
    loading ||
    loadingRap ||
    (!lichChieuInfo && bookingData.dat_ve_chi_tiet.length > 0)
  ) {
    return (
      <div style={{ textAlign: "center", padding: 50 }}>
        <Spin size="large" />
      </div>
    );
  }
  const movieTitle = lichChieuInfo?.phim?.ten_phim || "Đồ Ăn & Thức Uống";
  const ageRestriction = lichChieuInfo?.phim?.do_tuoi_gioi_han;
  const cinemaName = rapInfo?.ten_rap || "Online";
  const cinemaAddress = rapInfo?.dia_chi || "";
  const screeningTime = lichChieuInfo?.gio_chieu
    ? `${lichChieuInfo.gio_chieu.slice(
        11,
        16
      )} ngày ${lichChieuInfo.gio_chieu.slice(0, 10)}`
    : "";
  const roomName = lichChieuInfo?.phong_chieu?.ten_phong || "Không có phòng";
  const selectedSeats = bookingData.dat_ve_chi_tiet.map(
    (item) => item.ghe_dat.ten_ghe
  );
  const seatType =
    bookingData.dat_ve_chi_tiet[0]?.ghe_dat.loai_ghe?.ten_loai || "Ghế Thường";

  const totalPrice = Number(bookingData.tong_tien); // Chắc chắn là number để tính toán

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
                  <Input placeholder="Họ và tên" style={{ color: "black" }} />
                </Form.Item>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Vui lòng nhập email" },
                    { type: "email", message: "Email không hợp lệ" },
                  ]}
                >
                  <Input placeholder="Email" style={{ color: "black" }} />
                </Form.Item>
                <Form.Item label="Mã giảm giá" name="ma_giam_gia_id">
                  <Select
                    showSearch
                    placeholder="Chọn mã giảm giá"
                    allowClear
                    value={selectedVoucherId ?? undefined}
                    onChange={(value) => {
                      if (value === undefined) {
                        form.setFieldsValue({ ma_giam_gia_id: null }); // <- thêm dòng này
                        if (selectedVoucherId) {
                          destroyVoucher(
                            {
                              id: bookingData.id,
                              values: {
                                dat_ve_id: bookingData.id,
                                tong_tien: bookingData.tong_tien,
                              },
                            },
                            {
                              onSuccess: (res) => {
                                const newTongTien = res?.data?.tong_tien;
                                setTongTienSauVoucher(newTongTien);
                                message.info("Đã hủy áp dụng mã giảm giá.");
                              },
                            }
                          );
                        }
                        setSelectedVoucherId(null);
                      } else {
                        setSelectedVoucherId(value);
                        form.setFieldsValue({ ma_giam_gia_id: value }); // <- đảm bảo form có giá trị đúng
                        const selected = voucherList.find(
                          (v: IVoucher) => v.id === value
                        );
                        if (selected) {
                          usevoucher(
                            {
                              id: selected.id,
                              dat_ve_id: bookingData.id,
                              tong_tien: bookingData.tong_tien,
                            },
                            {
                              onSuccess: (res) => {
                                const newTongTien = res?.data?.tong_tien;
                                setTongTienSauVoucher(newTongTien);
                                message.success(
                                  `Mã "${selected.ma}" đã được áp dụng!`
                                );
                              },
                            }
                          );
                        }
                      }
                    }}
                    options={voucherList.map((voucher: IVoucher) => ({
                      label: `${voucher.ma} - Giảm ${voucher.phan_tram_giam}%`,
                      value: voucher.id,
                    }))}
                    style={{ color: "black" }}
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
                      setSelectedPaymentMethod(2);
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
                        alt="VNPay"
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
                      setSelectedPaymentMethod(2);
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
                {movieTitle}
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

            {ageRestriction !== undefined && (
              <Text style={{ fontWeight: "bold", color: "yellow" }}>
                Phim dành cho khán giả từ {ageRestriction}+ tuổi
              </Text>
            )}

            <div style={{ marginTop: 16, fontSize: 14 }}>
              <Text strong>{cinemaName}</Text>
              <br />
              <Text>{cinemaAddress}</Text>
            </div>

            {bookingData.lich_chieu_id && (
              <>
                <div style={{ marginTop: 24, fontWeight: "bold" }}>
                  <Text>Thời gian</Text>
                  <br />
                  <Text>{screeningTime}</Text>
                </div>

                <Row style={{ marginTop: 16 }}>
                  <Col span={8}>
                    <Text strong>Phòng chiếu</Text>
                    <br />
                    <Text>{roomName}</Text>
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
                    <Text>{seatType}</Text>
                  </Col>
                  <Col span={8}>
                    <Text strong>Số ghế</Text>
                    <br />
                    <Text>{selectedSeats.join(", ")}</Text>
                  </Col>
                </Row>
              </>
            )}

            {/* HIỂN THỊ THÔNG TIN ĐỒ ĂN Ở ĐÂY */}
            <div
              style={{
                marginTop: 16,
                borderTop: "1px dotted #999",
                paddingTop: 12,
              }}
            >
              <Text strong>Đồ Ăn & Thức Uống</Text>
              <br />
              {bookingData.don_do_an && bookingData.don_do_an.length > 0 ? (
                <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
                  {bookingData.don_do_an.map((item, index) => (
                    <li key={item.id || index} style={{ marginBottom: 4 }}>
                      <Text style={{}}>
                        {item.do_an.ten_do_an} x {item.so_luong}{" "}
                        <span style={{ float: "right" }}>
                          {(item.gia_ban * item.so_luong).toLocaleString(
                            "vi-VN"
                          )}{" "}
                          VNĐ
                        </span>
                      </Text>
                    </li>
                  ))}
                </ul>
              ) : (
                <Text style={{ color: "white" }}>
                  Không có đồ ăn/thức uống nào được mua.
                </Text>
              )}
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
                {(tongTienSauVoucher ?? 0).toLocaleString("vi-VN")} VND
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

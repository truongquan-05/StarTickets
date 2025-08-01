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
import "./ThanhToan.css"; // Đảm bảo đường dẫn đúng
import bgImage from "../../../../assets/live-cover2.webp";
import {
  useCheckDiem,
  useCreateThanhToanMoMo,
  useDestroyVoucher,
  useGetTongTien,
  useListCinemas,
  useListDatVe,
  useListDiem,
  useVoucher,
  // useUpdateCheckGhe // Đã bỏ import này
} from "../../../hook/hungHook";
import { useListVouchers } from "../../../hook/thinhHook";
import { IVoucher } from "../../Admin/interface/vouchers";
import { DonDoAn, Food } from "../../../types/Uses";
import { useBackDelete } from "../../../hook/useConfirmBack";
import { EyeInvisibleTwoTone, TagsOutlined } from "@ant-design/icons";
// IMPORT CÁC INTERFACE CỦA BẠN TẠI ĐÂY

const { Title, Text } = Typography;

// CẬP NHẬT INTERFACE BOOKINGDATA ĐỂ BAO GỒM don_do_an VÀ CÁC THUỘC TÍNH KHÁC
interface BookingData {
  id: number;
  nguoi_dung_id: number;
  lich_chieu_id: number | null; // Có thể là null nếu chỉ mua đồ ăn mà không có vé
  tong_tien: string; // Giữ string nếu backend trả về string
  created_at: string;
  lich_chieu: any;
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
      so_ghe: string;
      phong_id: number;
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
  const [countdown, setCountdown] = useState(300); // 5 phút = 300 giây
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
  const valueWhenFocused = useRef("");

  const { data: rapList, isLoading: loadingRap } = useListCinemas({
    resource: "client/rap",
  });
  const tongTienGoc = Number(bookingData?.tong_tien ?? 0);
  const [tongTienSauVoucher, setTongTienSauVoucher] = useState<number | null>(
    tongTienGoc
  );
  const { data: listDiem } = useListDiem({ resource: "diem_thanh_vien" });
  const checkDiem = useCheckDiem({ resource: "diem_thanh_vien" });

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
  useBackDelete(bookingData?.id, selectedPaymentMethod === undefined , selectedVoucherId );


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
    const token = localStorage.getItem("token");
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
          phong_chieu: { id: 0, ten_phong: "Online", rap_id: 0 },
        });
        setLoading(false);
      }
      return;
    }
    setLoading(true);
    fetch(`http://127.0.0.1:8000/api/lich_chieu/${bookingData.lich_chieu_id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
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
  const { data: tongTienData, refetch: refetchTongTien } = useGetTongTien({
    resource: "dat_ve",
    id: bookingData?.id ?? 0,
  });

  const onFinishStep2 = () => {
    if (!bookingData || !user) {
      message.error("Thiếu thông tin đặt vé hoặc người dùng.");
      return;
    }
    const payload = {
      tong_tien: Number(tongTienData?.data?.tong_tien),
      dat_ve_id: bookingData.id,
      nguoi_dung_id: user.id,
      phuong_thuc_thanh_toan_id: phuongThucThanhToanId.current,
      ho_ten: formStep1Data.fullName,
      email: formStep1Data.email,
      ma_giam_gia_id: formStep1Data.ma_giam_gia_id,
      diem_thanh_vien :  null
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
      <div className="boxloithanhtoan" style={{ textAlign: "center" }}>
        <div
          style={{
            position: "relative",
            textAlign: "center",
            minHeight: "80vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: `url(${bgImage}) no-repeat center center`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            overflow: "hidden",
          }}
        >
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

          {/* Giữ nguyên phần này */}
          <div style={{ position: "relative", zIndex: 1 }}>
            <EyeInvisibleTwoTone
              twoToneColor="yellow"
              style={{ fontSize: "150px" }}
            />

            <h3
              style={{
                color: "white",
                fontWeight: 100,
                fontFamily: "Anton, sans-serif",
                fontSize: "34px",
              }}
            >
              Không tìm thấy thông tin đặt vé
            </h3>
            <p
              style={{
                fontFamily: "Alata, sans-serif",
                color: "white",
                fontSize: "1.1rem",
                lineHeight: "1.6",
                maxWidth: "500px",
                margin: "0 auto",
              }}
            >
              Vui lòng kiểm tra hoặc tiến hành đặt lại để nhận vé và thông tin
              chi tiết.
            </p>
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
  // const movieTitle = lichChieuInfo?.phim?.ten_phim || "Đồ Ăn & Thức Uống";
  // const ageRestriction = lichChieuInfo?.phim?.do_tuoi_gioi_han;
  // const cinemaName = rapInfo?.ten_rap || "Online";
  // const cinemaAddress = rapInfo?.dia_chi || "";
  // const screeningTime = lichChieuInfo?.gio_chieu
  //   ? `${lichChieuInfo.gio_chieu.slice(
  //       11,
  //       16
  //     )} ngày ${lichChieuInfo.gio_chieu.slice(0, 10)}`
  //   : "";
  // const roomName = lichChieuInfo?.phong_chieu?.ten_phong || "Không có phòng";
  const selectedSeats = bookingData.dat_ve_chi_tiet.map(
    (item) => item.ghe_dat.so_ghe
  );
  const seatType =
    bookingData.dat_ve_chi_tiet[0]?.ghe_dat.loai_ghe?.ten_loai || "Ghế Thường";

  // const totalPrice = Number(bookingData.tong_tien); // Chắc chắn là number để tính toán

  const isSubmitDisabled = !checkedTerms1 || !checkedTerms2;

  return (
    <>
      <div className="thanhtoanbox">
        <h3 className="payment-title">TRANG THANH TOÁN</h3>
        <div className="payment-steps">
          <Text className={`payment-step ${step === 1 ? "active" : ""}`}>
            <div className="step-number">1</div>
            <div className="step-label">THÔNG TIN KHÁCH HÀNG</div>
          </Text>
          <button className="step-button"></button>
          <Text className={`payment-step ${step === 2 ? "active" : ""}`}>
            <div className="step-number">2</div>
            <div className="step-label">PHƯƠNG THỨC THANH TOÁN</div>
          </Text>
        </div>
        <Row gutter={24} className="payment-container">
          <Col span={12} className="payment-form-col">
            <Form
              layout="vertical"
              form={form}
              onFinish={step === 1 ? onFinishStep1 : onFinishStep2}
            >
              {step === 1 && (
                <>
                  <Form.Item
                    label={
                      <span
                        style={{
                          color: "white",
                          fontWeight: 100,
                          fontFamily: "Alata, sans-serif",
                        }}
                      >
                        Họ và tên
                      </span>
                    }
                    name="fullName"
                    rules={[
                      { required: true, message: "Vui lòng nhập họ và tên" },
                    ]}
                  >
                    <Input
                      placeholder="Nhập tên của bạn"
                      size="large"
                      className="form-input"
                    />
                  </Form.Item>
                  <Form.Item
                    label={
                      <span
                        style={{
                          color: "white",
                          fontWeight: 100,
                          fontFamily: "Alata, sans-serif",
                        }}
                      >
                        Email
                      </span>
                    }
                    name="email"
                    rules={[
                      { required: true, message: "Vui lòng nhập email" },
                      { type: "email", message: "Email không hợp lệ" },
                    ]}
                  >
                    <Input
                      placeholder="Nhập email của bạn"
                      size="large"
                      className="form-input"
                    />
                  </Form.Item>
                  <Form.Item
                    label={
                      <span
                        style={{
                          color: "white",
                          fontWeight: 100,
                          fontFamily: "Alata, sans-serif",
                        }}
                      >
                        * Mã giảm giá (nếu có)
                      </span>
                    }
                    name="ma_giam_gia_id"
                  >
                    <Select
                      prefix={
                        <TagsOutlined
                          style={{
                            color: "yellow",
                            fontSize: "22px",
                            marginRight: "8px",
                          }}
                        />
                      }
                      size="large"
                      className="form-select"
                      showSearch
                      placeholder="Chọn mã giảm giá (nếu có)"
                      allowClear
                      value={selectedVoucherId ?? undefined}
                      onChange={(value) => {
                        if (value === undefined) {
                          form.setFieldsValue({ ma_giam_gia_id: null }); // <- thêm dòng này
                          if (selectedVoucherId) {
                            let tienVoucher = 0;
                            voucherList.map((voucher: IVoucher) => {
                              if (voucher.id === selectedVoucherId) {
                                tienVoucher =
                                  (Number(bookingData?.tong_tien) *
                                    voucher.phan_tram_giam) /
                                  100;
                              }
                            });
                            destroyVoucher(
                              {
                                id: bookingData.id,
                                values: {
                                  dat_ve_id: bookingData.id,
                                  tong_tien: tongTienData?.data?.tong_tien,
                                  ma_giam_gia_id: selectedVoucherId,
                                  tien_voucher: tienVoucher,
                                },
                              },
                              {
                                onSuccess: () => {
                                  message.success("Hủy mã thành công!");
                                  refetchTongTien(); // Gọi lại API để cập nhật tổng tiền mới
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
                                tong_tien: tongTienData?.data?.tong_tien,
                                tien_voucher:
                                  (Number(bookingData?.tong_tien) *
                                    selected.phan_tram_giam) /
                                  100,
                              },
                              {
                                onSuccess: () => {
                                  message.success("Áp dụng mã thành công!");
                                  refetchTongTien(); // Gọi lại API để cập nhật tổng tiền mới
                                },
                                onError: (err: any) => {
                                  message.error(err.response?.data.message);
                                  form.setFieldsValue({ ma_giam_gia_id: null });
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
                    />
                  </Form.Item>
                  <Form.Item
                    label={
                      <span
                        style={{
                          color: "white",
                          fontWeight: 100,
                          fontFamily: "Alata, sans-serif",
                        }}
                      >
                        * Điểm của bạn: {listDiem?.data?.diem}
                      </span>
                    }
                    name="diem"
                  >
                    <Input
                      style={{
                        height: "50px",
                        borderRadius: "1px",
                        fontWeight: 100,
                        fontFamily: "Alata, sans-serif",
                      }}
                      placeholder="Nhập điểm tích lũy (nếu có)"
                      onFocus={(e) => {
                        valueWhenFocused.current = e.target.value;
                      }}
                      onBlur={(e) => {
                        const value = e.target.value.trim();
                        const valueToSubmit = valueWhenFocused.current.trim();

                        checkDiem.mutate(
                          {
                            dat_ve_id: bookingData.id,
                            tong_tien: tongTienData?.data?.tong_tien,
                            diem: value === "" ? undefined : Number(value),
                            diemCu:
                              valueToSubmit === ""
                                ? undefined
                                : Number(valueToSubmit),
                          },
                          {
                            onSuccess: (ok) => {
                              message.success(ok.message);
                              refetchTongTien();
                            },
                            onError: (error: any) => {
                              form.setFieldsValue({ diem: "" });
                              message.error(
                                error?.response?.data.message ||
                                  "Lỗi không xác định"
                              );
                              refetchTongTien();
                            },
                          }
                        );
                      }}
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
                      className="form-checkbox"
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
                      className="form-checkbox"
                    >
                      Đồng ý với{" "}
                      <a
                        onClick={(e) => {
                          e.preventDefault();
                          setIsModalVisible(true);
                        }}
                        className="terms-link"
                      >
                        điều khoản của rạp.
                      </a>
                    </Checkbox>
                  </Form.Item>

                  <Form.Item>
                    <button
                      type="submit"
                      className="primary-button"
                      disabled={isSubmitDisabled}
                      style={{ width: "100%" }} // Tương đương với `block` trong AntD
                    >
                      <span>Tiếp tục</span>
                    </button>
                  </Form.Item>
                </>
              )}

              {step === 2 && (
                <>
                  <Form.Item>
                    <Button
                      type="default"
                      block
                      icon={
                        <img
                          src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png"
                          alt="Momo"
                          className="payment-icon"
                        />
                      }
                      className="payment-button momo-button"
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
                      type="default"
                      block
                      icon={
                        <img
                          src="https://vinadesign.vn/uploads/thumbnails/800/2023/05/vnpay-logo-vinadesign-25-12-59-16.jpg"
                          alt="VNPay"
                          className="payment-icon"
                        />
                      }
                      className="payment-button vnpay-button"
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
                    <button
                      type="button"
                      className="back-button"
                      onClick={onBackStep2}
                      style={{ width: "100%" }} // nếu bạn muốn giữ `block` như AntD
                    >
                      <span>Quay lại</span>
                    </button>
                  </Form.Item>
                </>
              )}
            </Form>
          </Col>

          <Col span={12} className="payment-form-coll">
            <Card
              className="booking-summary-card"
              bodyStyle={{ padding: "24px" }}
            >
              <div className="movie-header">
                <h2 className="movie-title">
                  {bookingData.lich_chieu.phim.ten_phim}
                </h2>
                <div className="countdown-timer">
                  THỜI GIAN GIỮ VÉ {formatTime(countdown)}
                </div>
              </div>

              {bookingData.lich_chieu.phim.do_tuoi_gioi_han !== undefined && (
                <Text className="age-restriction">
                  Phim dành cho khán giả từ{" "}
                  {bookingData.lich_chieu.phim.do_tuoi_gioi_han} tuổi trở lên (
                  {bookingData.lich_chieu.phim.do_tuoi_gioi_han}+)
                </Text>
              )}

              {bookingData.lich_chieu_id && (
                <>
                  <div className="screening-time">
                    <Text
                      style={{
                        color: "yellow",
                        fontFamily: "'Alata', sans-serif",
                        fontWeight: "100",
                      }}
                    >
                      Thời gian
                    </Text>
                    <br />
                    <Text
                      style={{
                        color: "#fff",
                        fontFamily: "'Alata', sans-serif",
                      }}
                    >
                      {bookingData.lich_chieu.gio_chieu}
                    </Text>
                  </div>

                  <Row className="booking-details-row">
                    <Col span={8}>
                      <Text
                        style={{
                          color: "yellow",
                          fontFamily: "'Alata', sans-serif",
                        }}
                      >
                        Tên rạp
                      </Text>
                      <br />
                      <Text
                        style={{
                          color: "#fff",
                          fontFamily: "'Alata', sans-serif",
                        }}
                      >
                        {bookingData.lich_chieu.phong_chieu.rap.ten_rap}
                      </Text>
                    </Col>
                    <Col span={8}>
                      <Text
                        style={{
                          color: "yellow",
                          fontFamily: "'Alata', sans-serif",
                        }}
                      >
                        Phòng chiếu
                      </Text>
                      <br />
                      <Text
                        style={{
                          color: "#fff",
                          fontFamily: "'Alata', sans-serif",
                        }}
                      >
                        {bookingData.lich_chieu.phong_chieu.ten_phong}
                      </Text>
                    </Col>
                  </Row>

                  <Row className="booking-details-row">
                    <Col span={8}>
                      <Text
                        style={{
                          color: "yellow",
                          fontFamily: "'Alata', sans-serif",
                        }}
                      >
                        Loại ghế
                      </Text>
                      <br />
                      <Text
                        style={{
                          color: "#fff",
                          fontFamily: "'Alata', sans-serif",
                        }}
                      >
                        {seatType}
                      </Text>
                    </Col>
                    <Col span={8}>
                      <Text
                        style={{
                          color: "yellow",
                          fontFamily: "'Alata', sans-serif",
                        }}
                      >
                        Số ghế
                      </Text>
                      <br />
                      <Text
                        style={{
                          color: "#fff",
                          fontFamily: "'Alata', sans-serif",
                        }}
                      >
                        {selectedSeats.join(", ")}
                      </Text>
                    </Col>
                  </Row>
                </>
              )}

              {/* HIỂN THỊ THÔNG TIN ĐỒ ĂN Ở ĐÂY */}
              <div className="food-drinks-section">
                <Text
                  style={{
                    color: "yellow",
                    fontFamily: "'Alata', sans-serif",
                  }}
                >
                  Đồ ăn & Thức uống
                </Text>
                <br />
                {bookingData.don_do_an && bookingData.don_do_an.length > 0 ? (
                  <ul className="food-drinks-list">
                    {bookingData.don_do_an.map((item, index) => (
                      <li key={item.id || index} className="food-drink-item">
                        <Text
                          style={{
                            color: "white",
                            fontFamily: "'Alata', sans-serif",
                          }}
                        >
                          {item.do_an.ten_do_an} x {item.so_luong}{" "}
                          <span className="food-drink-price">
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
                  <Text
                    className="no-food-drinks"
                    style={{
                      color: "white",
                      fontFamily: "'Alata', sans-serif",
                    }}
                  >
                    Không có đồ ăn, thức uống nào được mua.
                  </Text>
                )}
              </div>

              <div className="total-amount2">
                <Text
                  style={{
                    color: "yellow",
                    fontFamily: "'Alata', sans-serif",
                    fontWeight: "100",
                    fontSize: "18px",
                  }}
                >
                  SỐ TIỀN CẦN THANH TOÁN
                </Text>
                <Text className="total-price">
                  {(tongTienData?.data?.tong_tien ?? 0).toLocaleString("vi-VN")}{" "}
                  VNĐ
                </Text>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

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

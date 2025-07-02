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
} from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useListCinemas } from "../../../hook/hungHook";

const { Title, Text } = Typography;

export default function ThanhToan() {
  const [countdown, setCountdown] = useState(300); // 5 phút
  const [lichChieuInfo, setLichChieuInfo] = useState<any>(null);
  const [rapInfo, setRapInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const location = useLocation();
  const navigate = useNavigate();
  const { lichChieuId, selectedSeats, totalPrice } = location.state || {};

  const { data: rapList, isLoading: loadingRap } = useListCinemas({
    resource: "rap",
  });

  // Modal điều khoản
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Theo dõi 2 checkbox
  const [checkedTerms1, setCheckedTerms1] = useState(false);
  const [checkedTerms2, setCheckedTerms2] = useState(false);

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
    if (!lichChieuId || !rapList) return;

    setLoading(true);
    fetch(`http://127.0.0.1:8000/api/lich_chieu/${lichChieuId}`)
      .then((res) => res.json())
      .then((data) => {
        setLichChieuInfo(data);
        const rapId = data?.phong_chieu?.rap_id;
        const matchedRap = rapList.find((r: any) => r.id === rapId);
        setRapInfo(matchedRap);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [lichChieuId, rapList]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m} : ${s}`;
  };

  const onFinish = (values: any) => {
    console.log("Thông tin khách hàng:", values);
    // Xử lý tiếp tục thanh toán
  };

  if (loading || loadingRap || !lichChieuInfo) {
    return (
      <div style={{ textAlign: "center", padding: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  const thoiGian = lichChieuInfo?.gio_chieu
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
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại" },
                { pattern: /^[0-9]+$/, message: "Số điện thoại không hợp lệ" },
              ]}
            >
              <Input placeholder="Số điện thoại" maxLength={10} />
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
                          new Error(
                            "Bạn phải đồng ý với điều khoản của Cinestar"
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
                  điều khoản của Cinestar
                </a>
                .
              </Checkbox>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                disabled={!(checkedTerms1 && checkedTerms2)}
                style={{
                  backgroundColor: "#e6e600",
                  borderColor: "#e6e600",
                  color: "#000",
                  fontWeight: "bold",
                }}
              >
                TIẾP TỤC
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
                {lichChieuInfo?.phim?.ten_phim}
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
              Phim dành cho khán giả từ {lichChieuInfo?.phim?.do_tuoi_gioi_han}+
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
                <Text>{lichChieuInfo?.phong_chieu?.ten_phong}</Text>
              </Col>
              <Col span={8}>
                <Text strong>Số vé</Text>
                <br />
                <Text>{selectedSeats?.length || 0}</Text>
              </Col>
            </Row>

            <Row style={{ marginTop: 16 }}>
              <Col span={8}>
                <Text strong>Loại ghế</Text>
                <br />
                <Text>
                  {lichChieuInfo?.gia_ve?.[0]?.ten_loai_ghe || "Ghế Thường"}
                </Text>
              </Col>
              <Col span={8}>
                <Text strong>Số ghế</Text>
                <br />
                <Text>{selectedSeats?.join(", ")}</Text>
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
                {totalPrice?.toLocaleString("vi-VN")} VND
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      <Modal
  title="Điều khoản của Cinestar"
  visible={isModalVisible}
  onCancel={() => setIsModalVisible(false)}
  footer={null}
  width={700}
  bodyStyle={{ maxHeight: "60vh", overflowY: "auto", padding: 24 }}
>
  <div style={{ fontSize: 14, lineHeight: 1.8, color: "#333" }}>
    <p>
      <strong>Điều khoản chung</strong><br />
      Việc bạn sử dụng website này đồng nghĩa với việc bạn đồng ý với những
      thỏa thuận dưới đây. Nếu bạn không đồng ý, xin vui lòng không sử dụng
      website.
    </p>

    <p>
      <strong>1. Trách nhiệm của người sử dụng:</strong><br />
      Khi truy cập vào trang web này, bạn đồng ý chấp nhận mọi rủi ro.
      Cinestar và các bên đối tác khác không chịu trách nhiệm về bất kỳ tổn
      thất nào do những hậu quả trực tiếp, tình cờ hay gián tiếp; những thất
      thoát, chi phí (bao gồm chi phí pháp lý, chi phí tư vấn hoặc các khoản
      chi tiêu khác) có thể phát sinh trực tiếp hoặc gián tiếp do việc truy
      cập trang web hoặc khi tải dữ liệu về máy; những tổn hại gặp phải do
      virus, hành động phá hoại trực tiếp hay gián tiếp của hệ thống máy
      tính khác, đường dây điện thoại, phần cứng, phần mềm, lỗi chương trình,
      hoặc bất kì các lỗi nào khác; đường truyền dẫn của máy tính hoặc nối
      kết mạng bị chậm…
    </p>

    <p>
      <strong>2. Về nội dung trên trang web:</strong><br />
      Tất cả những thông tin ở đây được cung cấp cho bạn một cách trung thực
      như bản thân sự việc. Cinestar và các bên liên quan không bảo đảm, hay
      có bất kỳ tuyên bố nào liên quan đến tính chính xác, tin cậy của việc
      sử dụng hay kết quả của việc sử dụng nội dung trên trang web này. Nột
      dung trên website được cung cấp vì lợi ích của cộng đồng và có tính phi
      thương mại. Các cá nhân và tổ chức không được phếp sử dụng nội dung trên
      website này với mục đích thương mại mà không có sự ưng thuận của
      Cinestar bằng văn bản. Mặc dù Cinestar luôn cố gắng cập nhật thường
      xuyên các nội dung tại trang web, nhưng chúng tôi không bảo đảm rằng
      các thông tin đó là mới nhất, chính xác hay đầy đủ. Tất cả các nội dung
      website có thể được thay đổi bất kỳ lúc nào.
    </p>

    <p>
      <strong>3. Về bản quyền:</strong><br />
      Cinestar là chủ bản quyền của trang web này. Việc chỉnh sửa trang,
      nội dung, và sắp xếp thuộc về thẩm quyền của Cinestar. Sự chỉnh sửa,
      thay đổi, phân phối hoặc tái sử dụng những nội dung trong trang này vì
      bất kì mục đích nào khác được xem như vi phạm quyền lợi hợp pháp của
      Cinestar.
    </p>

    <p>
      <strong>4. Về việc sử dụng thông tin:</strong><br />
      Chúng tôi sẽ không sử dụng thông tin cá nhân của bạn trên website này
      nếu không được phép. Nếu bạn đồng ý cung cấp thông tin cá nhân, bạn sẽ
      được bảo vệ. Thông tin của bạn sẽ được sử dụng với mục đích, liên lạc
      với bạn để thông báo các thông tin cập nhật của Cinestar như lịch chiếu
      phim, khuyến mại qua email hoặc bưu điện. Thông tin cá nhân của bạn sẽ
      không được gửi cho bất kỳ ai sử dụng ngoài trang web Cinestar, ngoại
      trừ những mở rộng cần thiết để bạn có thể tham gia vào trang web
      (những nhà cung cấp dịch vụ, đối tác, các công ty quảng cáo) và yêu
      cầu cung cấp bởi luật pháp. Nếu chúng tôi chia sẻ thông tin cá nhân của
      bạn cho các nhà cung cấp dịch vụ, công ty quảng cáo, các công ty đối
      tác liên quan, thì chúng tôi cũng yêu cầu họ bảo vệ thông tin cá nhân
      của bạn như cách chúng tôi thực hiện.
    </p>

    <p>
      <strong>5. Vể việc tải dữ liệu:</strong><br />
      Nếu bạn tải về máy những phần mềm từ trang này, thì phần mềm và các
      dữ liệu tải sẽ thuộc bản quyền của Cinestar và cho phép bạn sử dụng.
      Bạn không được sở hữu những phầm mềm đã tải và Cinestar không nhượng
      quyền cho bạn. Bạn cũng không được phép bán, phân phối lại, hay bẻ khóa
      phần mềm…
    </p>

    <p>
      <strong>6. Thay đổi nội dung:</strong><br />
      Cinestar giữ quyền thay đổi, chỉnh sửa và loại bỏ những thông tin hợp
      pháp vào bất kỳ thời điểm nào vì bất kỳ lý do nào.
    </p>

    <p>
      <strong>7. Liên kết với các trang khác:</strong><br />
      Mặc dù trang web này có thể được liên kết với những trang khác, Cinestar
      không trực tiếp hoặc gián tiếp tán thành, tổ chức, tài trợ, đứng sau hoặc
      sát nhập với những trang đó, trừ phi điều này được nêu ra rõ ràng. Khi
      truy cập vào trang web bạn phải hiểu và chấp nhận rằng Cinestar không thể
      kiểm soát tất cả những trang liên kết với trang Cinestar và cũng không
      chịu trách nhiệm cho nội dung của những trang liên kết.
    </p>

    <p>
      <strong>8. Đưa thông tin lên trang web:</strong><br />
      Bạn không được đưa lên, hoặc chuyển tải lên trang web tất cả những hình
      ảnh, từ ngữ khiêu dâm, thô tục, xúc phạm, phỉ báng, bôi nhọ, đe dọa,
      những thông tin không hợp pháp hoặc những thông tin có thể đưa đến việc
      vi phạm pháp luật, trách nhiệm pháp lý. Cinestar và tất cả các bên có
      liên quan đến việc xây dựng và quản lý trang web không chịu trách nhiệm
      hoặc có nghĩa vụ pháp lý đối với những phát sinh từ nội dung do bạn tải
      lên trang web.
    </p>

    <p>
      <strong>9. Luật áp dụng:</strong><br />
      Mọi hoạt động phát sinh từ trang web có thể sẽ được phân tích và đánh
      giá theo luật pháp Việt Nam và toà án Tp. Hồ Chí Minh. Và bạn phải đồng ý
      tuân theo các điều khoản riêng của các toà án này.
    </p>
  </div>
</Modal>

    </>
  );
}

import {
  CreditCardOutlined,
  EuroCircleOutlined,
  HomeOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import {
  DatePicker,
  Select,
  Button,
  Row,
  Col,
  Form,
  Card,
  Statistic,
  Typography,
} from "antd";
import {
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  Line,
  Tooltip,
  Legend,
  Cell,
  PieChart,
  Pie,
  BarChart,
  Bar,
} from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";

const { Option } = Select;
const { Paragraph } = Typography;

const ThongKeDoanhThu = () => {
  const token = localStorage.getItem("token");
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [dataRap, setDataRap] = useState<{ data: any[] }>({ data: [] });
  const [loadingRap, setLoadingRap] = useState<boolean>(true);
  const [form] = Form.useForm();

  // Lấy danh sách rạp (rap)
  useEffect(() => {
    const fetchDataRap = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/rap", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDataRap(res.data);
      } catch (error) {
        console.error("Lỗi khi gọi API rap:", error);
      } finally {
        setLoadingRap(false);
      }
    };

    fetchDataRap();
  }, [token]);

  // Lấy dữ liệu thống kê doanh thu lần đầu (payload rỗng)
  useEffect(() => {
    const fetchDoanhThu = async () => {
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/doanh-thu",
          {}, // payload rỗng khi chưa lọc
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(response.data);
      } catch (error) {
        console.error("Lỗi POST doanh-thu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoanhThu();
  }, [token]);

  // Xử lý submit form lọc
  const onFinish = async (values: any) => {
    const payload = {
      bat_dau: values.startDate?.format("YYYY-MM-DD"),
      ket_thuc: values.endDate?.format("YYYY-MM-DD"),
      rap_id: values.rap || null,
    };

    setLoading(true);
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/doanh-thu",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(res.data);
    } catch (error) {
      console.error("Lỗi POST khi lọc doanh-thu:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || loadingRap) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "white",
        }}
      >
        <div
          style={{
            border: "6px solid #f3f3f3",
            borderTop: "6px solid #3498db",
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            animation: "spin 1s linear infinite",
          }}
        />
        <style>
          {`@keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
          }`}
        </style>
      </div>
    );
  }

  const doanhThuTheoThangData = data?.doanhthutheothang
    ? Object.entries(data.doanhthutheothang).map(([month, val]) => ({
        month,
        doanhThu: Number(val) || 0,
      }))
    : [];

  const thongTinRap = data?.rap?.rap;
  const stats = [
    {
      icon: <EuroCircleOutlined style={{ color: "#52c41a", fontSize: 24 }} />,
      title: "TỔNG DOANH THU",
      value: data?.doanhThu,
      suffix: "",
      description: "",
    },
    {
      icon: <HomeOutlined style={{ color: "#1890ff", fontSize: 24 }} />,
      title: "RẠP CÓ DOANH THU CAO NHẤT",
      value: data?.rap?.rap_id?.ten_rap || '0',
      suffix: "",
      description: ``,
    },
    {
      icon: <VideoCameraOutlined style={{ color: "#faad14", fontSize: 24 }} />,
      title: "PHIM CÓ DOANH THU NHIỀU NHẤT",
      value: data?.phimDoanhThuMax?.phim_id?.ten_phim || "Không có dữ liệu",
      suffix: "",
      description: "",
    },
    {
      icon: <CreditCardOutlined style={{ color: "#722ed1", fontSize: 24 }} />,
      title: "PHƯƠNG THỨC THANH TOÁN PHỔ BIẾN",
      value: data?.phuongThucTT?.phuong_thuc?.nha_cung_cap || 0,
      suffix: "",
      description: `${data?.phuongThucTT?.phan_tram || 0}%`,
    },
  ];

  const dataPhim = Object.values(data?.DoanhThuPhim || {}).map((item: any) => ({
    tenPhim: item?.phim_id?.ten_phim,
    doanhThu: item?.tong_doanh_thu,
  }));

  const dataRaps = Object.values(data?.doanhthurap || {}).map((item: any) => ({
    name: item.rap_id.ten_rap,
    value: item.chiem,
  }));

  const COLORS = [
    "#2f54eb",
    "#fa186bff",
    "#faad14",
    "#f5222d",
    "#9254de",
    "#52c41a",
    "#1890ff",
    "#73d13d",
  ];
  const vnpayPercent = parseFloat(data?.phuongThucTT?.phan_tram);
  const momoPercent = 100 - vnpayPercent;

  const Pay = [
    { name: data?.phuongThucTT?.phuong_thuc?.ten, value: vnpayPercent },
    { name: "MOMO", value: momoPercent },
  ];

  const COLORSS = ["#2F3A8F", "#1db80fff"]; // màu gần giống trong ảnh

  return (
    <Card style={{ maxWidth: 1500, margin: "0 auto", padding: 24 }}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16} align="bottom">
          <Col span={6}>
            <Form.Item
              label="Ngày bắt đầu"
              name="startDate"
              rules={[
                { required: true, message: "Vui lòng chọn ngày bắt đầu" },
              ]}
            >
              <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Ngày kết thúc"
              name="endDate"
              rules={[
                { required: true, message: "Vui lòng chọn ngày kết thúc" },
              ]}
            >
              <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Rạp chiếu" name="rap">
              <Select
                allowClear
                placeholder="--- Tất cả ---"
                style={{ width: "100%" }}
              >
                {dataRap.data.map((rap: any) => (
                  <Option key={rap.id} value={rap.id}>
                    {rap.ten_rap}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginTop: 30 }}
              >
                Lọc
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Row gutter={[16, 16]}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div>{stat.icon}</div>
                <div>
                  <div style={{ fontSize: 12, color: "#888", fontWeight: 500 }}>
                    {stat.title}
                  </div>

                  {/* Nếu là dạng chuỗi nhiều dòng */}
                  {typeof stat.value === "string" ? (
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        lineHeight: "1.5em",
                        maxHeight: "4.5em",
                      }}
                    >
                      {stat.value}
                    </div>
                  ) : (
                    // Nếu vẫn dùng số, vẫn giữ Statistic
                    <Statistic
                      value={stat.value}
                      suffix={stat.suffix}
                      valueStyle={{ fontSize: 20, marginBottom: 0 }}
                    />
                  )}

                  <div style={{ fontSize: 12, color: "#aaa" }}>
                    {stat.description}
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Card title="Doanh thu theo rạp">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dataRaps}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(1)}%`
                  }
                >
                  {dataRaps.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <div style={{ textAlign: "center" }}>
            <h3>Phương thức thanh toán</h3>
            <p>Tỷ lệ sử dụng các phương thức thanh toán</p>
            <PieChart width={400} height={300}>
              <Pie
                data={Pay}
                cx="50%"
                cy="50%"
                label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                outerRadius={100}
                dataKey="value"
              >
                {Pay.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORSS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={24}>
          {" "}
          <Card title="Doanh thu theo phim">
            <ResponsiveContainer
              width="100%"
              height={Math.max(dataPhim.length * 50, 150)}
            >
              <BarChart
                layout="vertical"
                data={dataPhim}
                margin={{ top: 20, right: 20, left: 100, bottom: 10 }}
              >
                <XAxis type="number" domain={[0, "dataMax"]} />
                <YAxis
                  type="category"
                  dataKey="tenPhim"
                  tick={{ fontSize: 14 }}
                  width={200}
                />
                <Tooltip />
                <Bar dataKey="doanhThu" barSize={30}>
                  {dataPhim.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            <div style={{ display: "flex", flexWrap: "wrap", marginTop: 12 }}>
              {dataPhim.map((phim, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginRight: 16,
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      backgroundColor: COLORS[index % COLORS.length],
                      marginRight: 6,
                      borderRadius: 2,
                    }}
                  />
                  <span style={{ fontSize: 12 }}>{phim.tenPhim}</span>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>



      {/* Biểu đồ doanh thu theo tháng */}
      <Card title="Doanh Thu Theo Tháng" style={{ marginTop: 16 }}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={doanhThuTheoThangData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              formatter={(val: any) =>
                val != null ? val.toLocaleString("vi-VN") + " VND" : "0 VND"
              }
            />
            <Line
              type="monotone"
              dataKey="doanhThu"
              stroke="#8884d8"
              strokeWidth={3}
              name="Doanh thu"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>


    </Card>
  );
};

export default ThongKeDoanhThu;

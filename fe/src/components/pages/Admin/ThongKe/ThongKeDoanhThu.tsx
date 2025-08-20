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
  CartesianGrid,
} from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";

const { Option } = Select;

const ThongKeDoanhThu = () => {
  const token = localStorage.getItem("token");
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [dataRap, setDataRap] = useState<{ data: any[] }>({ data: [] });
  const [loadingRap, setLoadingRap] = useState<boolean>(true);
  const [form] = Form.useForm();
   const [dataFilterPhim, setDataPhim] = useState<{ data: any[] }>({ data: [] });
  const [loadingPhim, setLoadingPhim] = useState<boolean>(true);

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

    useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchData = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/phim", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDataPhim(res.data);
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      } finally {
        setLoadingPhim(false);
      }
    };

    fetchData();
  }, []);

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
      phim_id: values.phim || null,
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

  if (loading || loadingRap || loadingPhim) {
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
      value: data?.rap?.rap_id?.ten_rap || "0",
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
    doanh_thu: item.tong_doanh_thu,
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
  const vnpayPercent = parseFloat(data?.phuongThucTT?.phan_tram ?? 0);
  const vnpayName = data?.phuongThucTT?.phuong_thuc?.ten ?? "VNPAY";
  const vnpayDoanhThu = data?.phuongThucTT?.doanh_thu ?? 0;

  const momoPercent = 100 - vnpayPercent;

  const Pay = [
    {
      name: vnpayName,
      value: vnpayPercent,
      doanhthu: vnpayDoanhThu,
    },
    {
      name: "MOMO",
      value: momoPercent,
      doanhthu: 0,
    },
  ];

 

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ color?: string; value?: number } & Record<string, any>>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "8px 12px",
            fontSize: "13px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            maxWidth: "200px",
          }}
        >
          <p style={{ margin: "0 0 4px 0", fontWeight: "bold" }}>{label}</p>
          <p style={{ margin: "0", color: payload[0].color }}>
            Doanh thu: {new Intl.NumberFormat("vi-VN").format(payload[0].value ?? 0)}{" "}
            đ
          </p>
        </div>
      );
    }
    return null;
  };

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
            <Form.Item label="Phim" name="phim">
              <Select
                allowClear
                showSearch  
                placeholder="--- Tất cả ---"
                style={{ width: "100%" }}
                optionFilterProp="children"  
                filterOption={(input, option) =>
                  (option?.children as unknown as string)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                {dataFilterPhim.data.map((phim: any) => (
                  <Select.Option key={phim.id} value={phim.id}>
                    {phim.ten_phim}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          
          <Col span={2}>
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
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const { name, value, doanh_thu } = payload[0].payload;
                      return (
                        <div
                          style={{
                            backgroundColor: "#fff",
                            border: "1px solid #ccc",
                            padding: "8px",
                          }}
                        >
                          <p>{`${name}: ${value} %`}</p>
                          <p>{`Doanh thu: ${doanh_thu.toLocaleString()}đ`}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <div style={{ textAlign: "center" }}>
            <h3>Phương thức thanh toán</h3>
            <p>Tỷ lệ sử dụng các phương thức thanh toán</p>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
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
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const { name, value, doanhthu } = payload[0].payload;
                      return (
                        <div
                          style={{
                            backgroundColor: "#fff",
                            border: "1px solid #ccc",
                            padding: "8px",
                          }}
                        >
                          <p>{`${name}: ${value} %`}</p>
                          <p>{`Doanh thu: ${doanhthu?.toLocaleString()}đ`}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Col>
      </Row>
      <Row gutter={16}>
        {/* <Col xs={24}>
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
        </Col> */}
        <div style={{ width: "100%", height: 300, padding: "20px" }}>
          <h3>Doanh Thu Phim</h3>
          <p>Doanh thu theo phim hôm nay</p>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dataPhim}
              margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
              barCategoryGap="45%"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tenPhim" fontSize={12} />
              <YAxis allowDecimals={false} fontSize={12} />
              <Tooltip content={<CustomTooltip />} cursor={false} />
              <Bar dataKey="doanhThu" radius={[5, 5, 0, 0]}>
                {dataPhim.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Row>
      <br />
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

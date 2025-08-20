import {
  CalendarOutlined,
  ClockCircleOutlined,
  EuroCircleOutlined,
  LineChartOutlined,
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
  Tooltip,
} from "antd";
import {
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  Bar,
  BarChart,
  CartesianGrid,
} from "recharts";
const { Option } = Select;
import { useEffect, useState } from "react";
import axios from "axios";

const ThongKeVe = () => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [dataRap, setDataRap] = useState<{ data: any[] }>({ data: [] });
  const [form] = Form.useForm();
  const [loadingRap, setLoadingRap] = useState<boolean>(true);
  const [extraText, setExtraText] = useState("Các giờ được mua nhiều nhất");
  const [extraPhim, setExtraPhim] = useState("Phim bán chạy nhất");
  const [dataPhim, setDataPhim] = useState<{ data: any[] }>({ data: [] });
  const [loadingPhim, setLoadingPhim] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchData = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/rap", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDataRap(res.data);
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      } finally {
        setLoadingRap(false);
      }
    };

    fetchData();
  }, []);

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


  useEffect(() => {
    const token = localStorage.getItem("token");
    const payload = {
      bat_dau: null,
      ket_thuc: null,
      rap_id: null,
      phim_id: null,
    };
    const postData = async () => {
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/thong-ke-ve",
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(response.data);
      } catch (error) {
        console.error("Lỗi POST:", error);
      } finally {
        setLoading(false); // Tắt loading sau khi gọi xong
      }
    };

    postData();
  }, []);

  const onFinish = async (values: any) => {
    const token = localStorage.getItem("token");
    const payload = {
      bat_dau: values.startDate?.format("YYYY-MM-DD"),
      ket_thuc: values.endDate?.format("YYYY-MM-DD"),
      rap_id: values.rap || null,
      phim_id: values.phim || null,
    };
    const startDate = values.startDate?.format("DD/MM/YYYY");
    const endDate = values.endDate?.format("DD/MM/YYYY");
    const text =
      startDate && endDate ? `${startDate} đến ${endDate}` : "Không có dữ liệu";

    setExtraText(text);
    setExtraPhim(text);

    setLoading(true);
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/thong-ke-ve",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(res.data);
    } catch (error) {
      console.error("Lỗi POST:", error);
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

  const chartData = data?.tyLeDat?.map((item: any) => ({
    name: item.rap,
    value: 100,
    daDat: item.daDatChiem,
  }));

  const COLORSS = {
    gheDaDat: "#00c0ef",
    gheTrong: "#3c8dbc",
  };
  const CustomBar = (props: any) => {
    const { x, y, width, height, payload } = props;
    const daDat = payload?.daDat ?? 0;
    const daDatHeight = (daDat / 100) * height;
    const chuaDatHeight = height - daDatHeight;

    const centerX = x + width / 2;
    const centerY = y + height / 2;

    return (
      <g>
        {/* Lớp nền 100% */}
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill="#2c3e91"
          rx={6}
          ry={6}
        />
        {/* Lớp phủ (đã đặt) */}
        <rect
          x={x}
          y={y + chuaDatHeight}
          width={width}
          height={daDatHeight}
          fill="#00c2ff"
          rx={6}
          ry={6}
        />
        <text
          x={centerX}
          y={centerY}
          fill="#fff"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: 14, fontWeight: "bold" }}
        >
          {`${daDat}%`}
        </text>
      </g>
    );
  };

  const legendItems = [
    { color: COLORSS.gheDaDat, label: "Ghế đã đặt" },
    { color: COLORSS.gheTrong, label: "Ghế trống" },
  ];

  const Legends = () => (
    <div
      style={{
        display: "flex",
        gap: 24,
        alignItems: "center",
        marginTop: 16,
        justifyContent: "center",
      }}
    >
      {legendItems.map((item, index) => (
        <div key={index} style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 16,
              height: 16,
              backgroundColor: item.color,
              borderRadius: 2,
              marginRight: 6,
            }}
          />
          <span style={{ fontWeight: 500, color: "#333" }}>{item.label}</span>
        </div>
      ))}
    </div>
  );

  const COLORS_TICKET_TYPE = ["#2C3E50", "#1ABC9C", "#F39C12"];
  const COLORS_PEAK_HOUR = [
    "#2C3E50",
    "#1ABC9C",
    "#F39C12",
    "#E74C3C",
    "#2D3436",
  ];

  const ticketTypeData =
    data?.phanLoaiGhe?.[0] != null
      ? [
          { name: "Ghế VIP", value: data?.phanLoaiGhe?.[0]?.gheVip || 0 },
          { name: "Ghế Thường", value: data?.phanLoaiGhe?.[0]?.gheThuong || 0 },
          { name: "Ghế Đôi", value: data?.phanLoaiGhe?.[0]?.gheDoi || 0 },
        ]
      : [];

  const peakHourData =
    data?.gioCaoDiemTop5?.map((item: { gio: number; so_luong: number }) => ({
      hour: `${item.gio.toString().padStart(2, "0")}:00`,
      value: item.so_luong,
    })) || [];

  const COLORS = [
    "#3f51b5",
    "#4caf50",
    "#ff9800",
    "#f44336",
    "#ff5722",
    "#00bcd4",
    "#9c27b0",
    "#8bc34a",
  ];

  const dataLineChart = Object.entries(data?.xuHuongve || {}).map(
    ([time, value]) => ({
      date: time,
      value,
    })
  );

  const dataPieChart =
    data?.phimBanChay?.map((item: { phim: string; phan_tram: number }) => ({
      name: item.phim,
      value: item.phan_tram,
    })) || [];

  const stats = [
    {
      icon: <EuroCircleOutlined style={{ color: "#52c41a", fontSize: 24 }} />,
      title: "TỔNG VÉ BÁN RA",
      value: data?.tongVe,
      suffix: "",
      description: "",
    },
    {
      icon: <CalendarOutlined style={{ color: "#1890ff", fontSize: 24 }} />,
      title: "TRUNG BÌNH MỖI NGÀY",
      value: data?.trungBinhNgay,
      suffix: "",
      description: `Tháng ${new Date().getMonth() + 1}`,
    },
    {
      icon: <ClockCircleOutlined style={{ color: "#faad14", fontSize: 24 }} />,
      title: "GIỜ CAO ĐIỂM",
      value: data?.gioCaoDiem,
      suffix: "",
      description: "",
    },
    {
      icon: <LineChartOutlined style={{ color: "#722ed1", fontSize: 24 }} />,
      title: "TỶ LỆ LẤP ĐẦY",
      value: data?.tiLeLapDay,
      suffix: "",
      description: "",
    },
  ];

  return (
    <Card style={{ maxWidth: 1500, margin: "0 auto", padding: 24 }}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16} align="bottom">
          <Col span={6}>
            <Form.Item
              label="Ngày bắt đầu"
              name="startDate"
              rules={[{ required: true }]}
            >
              <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Ngày kết thúc"
              name="endDate"
              rules={[{ required: true }]}
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
                {dataPhim.data.map((phim: any) => (
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
                loading={loading}
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
                  <Statistic
                    value={stat.value}
                    suffix={stat.suffix}
                    valueStyle={{ fontSize: 20, marginBottom: 0 }}
                  />
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
          <Card title="Xu Hướng Bán Vé" extra={extraText}>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={dataLineChart}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3f51b5"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Top Phim Bán Chạy" extra={extraPhim}>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={dataPieChart}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {dataPieChart.map((entry, index: any) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
      <div style={{ display: "flex", gap: 20 }}>
        <Card
          title="Phân Loại Vé"
          extra="Phân bố theo loại vé"
          style={{ flex: 1 }}
        >
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={ticketTypeData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={50}
                dataKey="value"
                label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
              >
                {ticketTypeData.map((_, index) => (
                  <Cell key={index} fill={COLORS_TICKET_TYPE[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card
          title="Giờ Cao Điểm"
          extra="Số lượng vé bán ra theo giờ trong hôm nay"
          style={{ flex: 1 }}
        >
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={peakHourData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" barSize={50}>
                {peakHourData.map((_: any, index: any) => (
                  <Cell key={index} fill={COLORS_PEAK_HOUR[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <Card title="Tỷ Lệ Lấp Đầy Rạp" extra="Tỷ lệ ghế đã đặt trên tổng số ghế">
        <>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, bottom: 20, left: 20 }}
            >
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} />
              <Tooltip formatter={(value: any) => `${value}%`} />
              <Bar
                dataKey="value"
                shape={(props: any) => <CustomBar {...props} />}
              />
            </BarChart>
          </ResponsiveContainer>
          <Legends />
        </>
      </Card>
    </Card>
  );
};

export default ThongKeVe;

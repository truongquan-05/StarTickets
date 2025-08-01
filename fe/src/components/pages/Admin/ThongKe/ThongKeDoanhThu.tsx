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
  Table,
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
  CartesianGrid,
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
      const res = await axios.post("http://127.0.0.1:8000/api/doanh-thu", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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

  // Xử lý dữ liệu cho các phần

  // Doanh thu theo phim
  const doanhThuPhimData = data?.DoanhThuPhim
    ? Object.values(data.DoanhThuPhim).map((item: any, index: number) => ({
        key: index,
        tenPhim: item.phim_id?.ten_phim || `Phim ${index + 1}`,
        doanhThu: item.tong_doanh_thu || 0,
      }))
    : [];

  // Doanh thu theo rạp
  const doanhThuRapData = data?.doanhthurap
    ? Object.values(data.doanhthurap).map((item: any, index: number) => ({
        key: index,
        tenRap: item.rap_id?.ten_rap || "Không rõ",
        diaChi: item.rap_id?.dia_chi || "-",
        doanhThu: item.tong_doanh_thu || 0,
      }))
    : [];

  // Doanh thu theo tháng (chuyển object thành array)
  const doanhThuTheoThangData = data?.doanhthutheothang
    ? Object.entries(data.doanhthutheothang).map(([month, val]) => ({
        month,
        doanhThu: Number(val) || 0,
      }))
    : [];

  // Phim doanh thu max
  const phimMax = data?.phimDoanhThuMax?.phim_id;

  // Phương thức thanh toán (đưa object thành mảng 1 phần tử)
  const phuongThucTTData = data?.phuongThucTT ? [data.phuongThucTT] : [];

  const columnsPhuongThucTT = [
    {
      title: "Phương thức thanh toán",
      dataIndex: ["phuong_thuc", "ten"],
      key: "phuong_thuc",
      render: (text: any) => text || "Không xác định",
    },
    { title: "Số lượng", dataIndex: "so_luong", key: "so_luong" },
    {
      title: "Phần trăm",
      dataIndex: "phan_tram",
      key: "phan_tram",
      render: (val: string) => `${parseFloat(val).toFixed(2)}%`,
    },
  ];

  // Thông tin rạp
  const thongTinRap = data?.rap?.rap;

  return (
    <Card style={{ maxWidth: 1500, margin: "0 auto", padding: 24 }}>
      {/* Form lọc */}
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16} align="bottom">
          <Col span={6}>
            <Form.Item
              label="Ngày bắt đầu"
              name="startDate"
              rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu" }]}
            >
              <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Ngày kết thúc"
              name="endDate"
              rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc" }]}
            >
              <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Rạp chiếu" name="rap">
              <Select allowClear placeholder="--- Tất cả ---" style={{ width: "100%" }}>
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
              <Button type="primary" htmlType="submit" style={{ marginTop: 30 }}>
                Lọc
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      {/* Bảng Doanh Thu Theo Phim */}
      <Card title="Doanh Thu Theo Phim" style={{ marginTop: 16 }}>
        <Table
          dataSource={doanhThuPhimData}
          columns={[
            { title: "Tên phim", dataIndex: "tenPhim", key: "tenPhim" },
            {
              title: "Doanh thu",
              dataIndex: "doanhThu",
              key: "doanhThu",
              render: (val: any) =>
                val != null ? val.toLocaleString("vi-VN") + " VND" : "0 VND",
            },
          ]}
          pagination={{ pageSize: 5 }}
          rowKey="key"
          locale={{ emptyText: "Không có dữ liệu" }}
        />
      </Card>

      {/* Bảng Doanh Thu Theo Rạp */}
      <Card title="Doanh Thu Theo Rạp" style={{ marginTop: 16 }}>
        <Table
          dataSource={doanhThuRapData}
          columns={[
            { title: "Tên rạp", dataIndex: "tenRap", key: "tenRap" },
            { title: "Địa chỉ", dataIndex: "diaChi", key: "diaChi" },
            {
              title: "Doanh thu",
              dataIndex: "doanhThu",
              key: "doanhThu",
              render: (val: any) =>
                val != null ? val.toLocaleString("vi-VN") + " VND" : "0 VND",
            },
          ]}
          pagination={{ pageSize: 5 }}
          rowKey="key"
          locale={{ emptyText: "Không có dữ liệu" }}
        />
      </Card>

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

      {/* Phim doanh thu cao nhất */}
      <Card title="Phim Doanh Thu Cao Nhất" style={{ marginTop: 16 }}>
        <Paragraph>
          {phimMax ? phimMax.ten_phim || "Không xác định" : "Không có dữ liệu"}
        </Paragraph>
      </Card>

      {/* Phương thức thanh toán */}
      <Card title="Phương Thức Thanh Toán" style={{ marginTop: 16 }}>
        <Table
          dataSource={phuongThucTTData}
          columns={columnsPhuongThucTT}
          pagination={false}
          locale={{ emptyText: "Không có dữ liệu" }}
          rowKey="phuong_thuc_thanh_toan_id"
        />
      </Card>

      {/* Thông tin rạp */}
      {thongTinRap && (
        <Card title="Thông Tin Rạp" style={{ marginTop: 16 }}>
          <Paragraph>
            <b>Tên rạp:</b> {thongTinRap.ten_rap} <br />
            <b>Địa chỉ:</b> {thongTinRap.dia_chi} <br />
            <b>Số điện thoại:</b> {thongTinRap.so_dien_thoai || "-"} <br />
            <b>Email:</b> {thongTinRap.email || "-"} <br />
          </Paragraph>
        </Card>
      )}
    </Card>
  );
};

export default ThongKeDoanhThu;

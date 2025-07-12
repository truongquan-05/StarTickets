import { useEffect, useState } from "react";
import { Table, Button, message, Card, Tag, Space, Typography, Input, Tooltip } from "antd";
import { getListDonVe } from "../../../provider/duProvider";
import { useNavigate } from "react-router-dom";
import { SearchOutlined, FileSearchOutlined, MailOutlined, PhoneOutlined, UserOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function DonVeList() {
  const [donVe, setDonVe] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchDonVe();
  }, []);

  const fetchDonVe = async () => {
    setLoading(true);
    try {
      const res = await getListDonVe();
      setDonVe(res);
    } catch (err) {
      message.error("Lỗi khi tải danh sách đơn vé");
    } finally {
      setLoading(false);
    }
  };

  const filteredData = donVe.filter((item: any) => {
    const searchContent = [
      item.nguoi_dung?.ten,
      item.nguoi_dung?.email,
      item.nguoi_dung?.so_dien_thoai,
      item.dat_ve?.lich_chieu?.phim?.ten_phim,
      item.phuong_thuc?.ten
    ].join(" ").toLowerCase();

    return searchContent.includes(searchText.toLowerCase());
  });

  const renderPaymentMethod = (method: string) => {
    const color = method === "Tiền mặt" ? "blue" :
                  method === "Chuyển khoản" ? "green" :
                  method === "Ví điện tử" ? "orange" : "default";
    return <Tag color={color}>{method || "—"}</Tag>;
  };

  const columns = [
    {
      title: "#",
      render: (_: any, __: any, index: number) => index + 1,
      width: 60,
      align: 'center' as const,
    },
    {
      title: "Người mua",
      render: (r: any) => (
        <div>
          <div style={{ fontWeight: 500 }}>
            <UserOutlined style={{ marginRight: 8, color: '#1890ff' }} />
            {r.nguoi_dung?.ten || "—"}
          </div>
        </div>
      ),
      sorter: (a: any, b: any) => (a.nguoi_dung?.ten || "").localeCompare(b.nguoi_dung?.ten || ""),
    },
    {
      title: "Email",
      render: (r: any) => (
        <div>
          <MailOutlined style={{ marginRight: 8, color: '#ff4d4f' }} />
          {r.nguoi_dung?.email || "—"}
        </div>
      ),
      width: 200,
    },
    {
      title: "Điện thoại",
      render: (r: any) => (
        <div>
          <PhoneOutlined style={{ marginRight: 8, color: '#52c41a' }} />
          {r.nguoi_dung?.so_dien_thoai || "—"}
        </div>
      ),
      width: 150,
    },
    {
      title: "Phim",
      render: (r: any) => (
        <Tooltip title={r.dat_ve?.lich_chieu?.phim?.mo_ta || ""}>
          <div>
            <div style={{ fontWeight: 500 }}>{r.dat_ve?.lich_chieu?.phim?.ten_phim || "—"}</div>
            <Text type="secondary">{r.dat_ve?.lich_chieu?.phong_chieu?.ten_phong || "—"}</Text>
          </div>
        </Tooltip>
      ),
      width: 250,
    },
    {
      title: "Rạp",
      render: (r: any) => r.dat_ve?.lich_chieu?.rap?.ten_rap || "",
      width: 150,
    },
    {
      title: "Tổng tiền",
      render: (r: any) => (
        <Text strong style={{ color: '#1890ff' }}>
          {Number(r.dat_ve?.tong_tien || 0).toLocaleString()} đ
        </Text>
      ),
      align: 'right' as const,
      width: 150,
      sorter: (a: any, b: any) => (a.dat_ve?.tong_tien || 0) - (b.dat_ve?.tong_tien || 0),
    },
    {
      title: "Thanh toán",
      render: (r: any) => renderPaymentMethod(r.phuong_thuc?.ten),
      width: 150,
    },
    {
      title: "Thao tác",
      render: (_: any, record: any) => (
        <Button 
          type="primary" 
          icon={<FileSearchOutlined />} 
          onClick={() => navigate(`/admin/don-ve/${record.id}`)}
          size="small"
        >
          Chi tiết
        </Button>
      ),
      width: 120,
      align: 'center' as const,
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card 
        bordered={false}
        title={<Title level={4} style={{ margin: 0 }}>Quản lý đơn vé</Title>}
        extra={
          <Space>
            <Input
              placeholder="Tìm kiếm đơn vé..."
              prefix={<SearchOutlined />}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
              allowClear
            />
            <Button type="primary" onClick={fetchDonVe}>
              Làm mới
            </Button>
          </Space>
        }
      >
        <Table
          rowKey="id"
          dataSource={filteredData}
          columns={columns}
          loading={loading}
          bordered
          size="middle"
          scroll={{ x: 'max-content' }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng cộng ${total} đơn vé`,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
        />
      </Card>
    </div>
  );
}

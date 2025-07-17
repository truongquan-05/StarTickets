// pages/Admin/Banner/BannerList.tsx
import { useEffect, useState } from "react";
import { Table, Button, Switch, message, Image, Card, Space, Popconfirm, Tag, Typography, Flex } from "antd";
import { getListBanners, toggleBanner, deleteBanner } from "../../../provider/duProvider";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const BannerList = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<Record<number, boolean>>({});
  const navigate = useNavigate();

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await getListBanners();
      setBanners(res.data || []);
    } catch (err) {
      message.error("Không thể tải danh sách banner");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleToggle = async (id: number) => {
    try {
      setActionLoading(prev => ({ ...prev, [id]: true }));
      await toggleBanner(id);
      message.success("Cập nhật trạng thái thành công");
      await fetchBanners();
    } catch {
      message.error("Lỗi khi cập nhật trạng thái");
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setActionLoading(prev => ({ ...prev, [id]: true }));
      await deleteBanner(id);
      message.success("Đã xoá banner thành công");
      await fetchBanners();
    } catch {
      message.error("Xoá không thành công");
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 80,
      align: 'center' as const,
      render: (id: number) => <Text strong>#{id}</Text>,
    },
    {
      title: "Hình ảnh",
      width: 200,
      render: (_, record) => (
        <Image
          width={160}
          height={90}
          style={{ borderRadius: 4, objectFit: 'cover' }}
          src={`http://localhost:8000/storage/${record.image_url}`}
          alt="banner"
          fallback="https://via.placeholder.com/160x90?text=No+Image"
          preview={{
            mask: 'Xem chi tiết',
          }}
        />
      ),
    },
    {
      title: "Thông tin",
      render: (_, record) => (
        <Space direction="vertical" size={4}>
          <Text strong>{record.title}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.description || 'Không có mô tả'}
          </Text>
        </Space>
      ),
    },
    {
      title: "Thời gian hiển thị",
      width: 220,
      render: (_, record) => (
        <Space direction="vertical" size={2}>
          <div>
            <Text strong>Từ: </Text>
            <Text>
              {record.start_date ? dayjs(record.start_date).format('DD/MM/YYYY HH:mm') : 'Không xác định'}
            </Text>
          </div>
          <div>
            <Text strong>Đến: </Text>
            <Text>
              {record.end_date ? dayjs(record.end_date).format('DD/MM/YYYY HH:mm') : 'Không xác định'}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Trạng thái",
      width: 120,
      align: 'center' as const,
      render: (_, record) => (
        <Tag color={record.is_active ? 'green' : 'red'}>
          {record.is_active ? 'Đang hoạt động' : 'Ngừng hoạt động'}
        </Tag>
      ),
    },
    {
      title: "Hoạt động",
      width: 100,
      align: 'center' as const,
      render: (_, record) => (
        <Switch
          checked={record.is_active}
          onChange={() => handleToggle(record.id)}
          loading={actionLoading[record.id]}
        />
      ),
    },
    {
      title: "Hành động",
      width: 120,
      align: 'center' as const,
      render: (_, record) => (
        <Flex gap={8} justify="center">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/banner/edit/${record.id}`)}
            style={{ color: '#1890ff' }}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xoá banner này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xoá"
            cancelText="Huỷ"
            placement="left"
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              loading={actionLoading[record.id]}
              style={{ color: '#ff4d4f' }}
            />
          </Popconfirm>
        </Flex>
      ),
    },
  ];

  return (
    <Card
      title={
        <Flex justify="space-between" align="center">
          <Title level={4} style={{ margin: 0 }}>Quản lý Banner</Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => navigate("/admin/banner/create")}
            style={{ borderRadius: 4 }}
          >
            Thêm Banner
          </Button>
        </Flex>
      }
      bordered={false}
      style={{ boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)', borderRadius: 8 }}
      bodyStyle={{ padding: 0 }}
    >
      <Table
        rowKey="id"
        columns={columns}
        dataSource={banners}
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng cộng ${total} banner`,
          style: { padding: '16px 24px' },
        }}
        style={{ borderRadius: 8 }}
        scroll={{ x: 1200 }}
        locale={{
          emptyText: (
            <Space direction="vertical" size={16}>
              <Text>Không có banner nào</Text>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={() => navigate("/admin/banner/create")}
              >
                Thêm banner đầu tiên
              </Button>
            </Space>
          ),
        }}
      />
    </Card>
  );
};

export default BannerList;
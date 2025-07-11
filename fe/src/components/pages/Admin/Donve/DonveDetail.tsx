// pages/Admin/DonVe/DonVeDetail.tsx
import { useEffect, useState } from "react";
import { Descriptions, message, Card, Tag, Typography, Button, Divider, Row, Col } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { getDonVeById } from "../../../provider/duProvider";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  VideoCameraOutlined, 
  ClockCircleOutlined,
  HomeOutlined,
  CreditCardOutlined,
  DollarOutlined,
  ArrowLeftOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;

export default function DonVeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDetail();
  }, []);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const res = await getDonVeById(id!);
      setData(res);
    } catch (err) {
      message.error("Lỗi khi tải chi tiết đơn vé");
    } finally {
      setLoading(false);
    }
  };

  const renderPaymentStatus = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      'thanh_cong': { color: 'green', text: 'Thành công' },
      'cho_xu_ly': { color: 'orange', text: 'Chờ xử lý' },
      'that_bai': { color: 'red', text: 'Thất bại' }
    };
    
    const currentStatus = statusMap[data?.trang_thai_thanh_toan] || { color: 'default', text: 'Không xác định' };
    return <Tag color={currentStatus.color}>{currentStatus.text}</Tag>;
  };

  if (!data && loading) return <Card loading={true} />;

  if (!data) return <p>Không tìm thấy đơn vé</p>;

  return (
    <div style={{ padding: '24px' }}>
      <Button 
        type="link" 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate(-1)}
        style={{ marginBottom: 16 }}
      >
        Quay lại
      </Button>

      <Card
        title={<Title level={4} style={{ margin: 0 }}>Chi tiết đơn vé #{id}</Title>}
        extra={
          <Tag color="#2db7f5" style={{ fontSize: 14, padding: '4px 8px' }}>
            {new Date(data.dat_ve?.thoi_gian_dat).toLocaleString()}
          </Tag>
        }
        bordered={false}
        loading={loading}
      >
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Descriptions
              column={1}
              size="middle"
              labelStyle={{ fontWeight: 600, width: 150 }}
            >
              <Descriptions.Item label={
                <span><UserOutlined style={{ marginRight: 8 }} /> Họ tên</span>
              }>
                <Text strong>{data.nguoi_dung?.ten}</Text>
              </Descriptions.Item>
              <Descriptions.Item label={
                <span><PhoneOutlined style={{ marginRight: 8 }} /> SĐT</span>
              }>
                {data.nguoi_dung?.so_dien_thoai || "—"}
              </Descriptions.Item>
              <Descriptions.Item label={
                <span><MailOutlined style={{ marginRight: 8 }} /> Email</span>
              }>
                {data.nguoi_dung?.email}
              </Descriptions.Item>
            </Descriptions>
          </Col>

          <Col xs={24} md={12}>
            <Descriptions
              column={1}
              size="middle"
              labelStyle={{ fontWeight: 600, width: 150 }}
            >
              <Descriptions.Item label={
                <span><CreditCardOutlined style={{ marginRight: 8 }} /> Thanh toán</span>
              }>
                <Tag color="blue">{data.phuong_thuc?.ten}</Tag> {renderPaymentStatus(data.trang_thai_thanh_toan)}
              </Descriptions.Item>
              <Descriptions.Item label={
                <span><DollarOutlined style={{ marginRight: 8 }} /> Tổng tiền</span>
              }>
                <Text strong type="danger" style={{ fontSize: 16 }}>
                  {Number(data.dat_ve?.tong_tien || 0).toLocaleString()} đ
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Mã giao dịch">
                {data.ma_giao_dich || "—"}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>

        <Divider orientation="left" style={{ margin: '24px 0' }}>
          <VideoCameraOutlined style={{ marginRight: 8 }} />
          Thông tin vé xem phim
        </Divider>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Descriptions
              column={1}
              size="middle"
              labelStyle={{ fontWeight: 600, width: 150 }}
            >
              <Descriptions.Item label={
                <span><VideoCameraOutlined style={{ marginRight: 8 }} /> Phim</span>
              }>
                <Text strong>{data.dat_ve?.lich_chieu?.phim?.ten_phim}</Text>
              </Descriptions.Item>
              <Descriptions.Item label={
                <span><ClockCircleOutlined style={{ marginRight: 8 }} /> Suất chiếu</span>
              }>
                {new Date(data.dat_ve?.lich_chieu?.gio_bat_dau).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Thời lượng">
                {data.dat_ve?.lich_chieu?.phim?.thoi_luong} phút
              </Descriptions.Item>
            </Descriptions>
          </Col>

          <Col xs={24} md={12}>
            <Descriptions
              column={1}
              size="middle"
              labelStyle={{ fontWeight: 600, width: 150 }}
            >
              <Descriptions.Item label={
                <span><HomeOutlined style={{ marginRight: 8 }} /> Rạp</span>
              }>
                {data.dat_ve?.lich_chieu?.rap?.ten_rap}
              </Descriptions.Item>
              <Descriptions.Item label="Phòng chiếu">
                {data.dat_ve?.lich_chieu?.phong_chieu?.ten_phong}
              </Descriptions.Item>
              <Descriptions.Item label="Ghế đã đặt">
                {data.dat_ve?.ghe_da_dat?.map((ghe: string) => (
                  <Tag key={ghe} color="cyan" style={{ marginBottom: 4 }}>{ghe}</Tag>
                ))}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>

        <Divider />

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Button 
            type="primary" 
            onClick={() => window.print()}
            style={{ marginRight: 16 }}
          >
            In đơn vé
          </Button>
          <Button onClick={() => navigate(-1)}>
            Quay lại
          </Button>
        </div>
      </Card>
    </div>
  );
}
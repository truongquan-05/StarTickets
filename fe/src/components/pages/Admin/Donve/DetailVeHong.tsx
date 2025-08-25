// pages/Admin/DonVe/DonVeDetail.tsx
import { useEffect, useState } from "react";
import {
  Descriptions,
  message,
  Card,
  Tag,
  Typography,
  Divider,
  Row,
  Col,
  Button,
  Popconfirm,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { getDonVeById, getDonVeHongById } from "../../../provider/duProvider";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  VideoCameraOutlined,
  HomeOutlined,
  CreditCardOutlined,
  DollarOutlined,
  FileDoneOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import axios from "axios";
const { Title, Text } = Typography;

export default function DetailVeHong() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const BASE_URL = "http://127.0.0.1:8000";
  const navigate = useNavigate();

  useEffect(() => {
    fetchDetail();
  }, []);
  const formatVND = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const handleVe = async (id: any) => {
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/admin/xu-ly-ve/${id}`,
        {
          trang_thai: true,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response) {
        throw new Error("Failed to update print status");
      }
      message.success("Đã xử lý");
    } catch (error) {
      message.error("Lỗi khi xử lý");
    }
  };
  const fetchDetail = async () => {
    setLoading(true);
    try {
      const res = await getDonVeHongById(id!);
      setData(res);
    } catch (err) {
      message.error("Lỗi khi tải chi tiết đơn vé");
    } finally {
      setLoading(false);
    }
  };

  if (!data && loading) return <Card loading={true} />;

  if (!data) return <p>Không tìm thấy đơn vé</p>;

  return (
    <div style={{ padding: "24px" }}>
      <Card
        style={{ minHeight: "70vh" }}
        title={
          <Title level={4} style={{ margin: 0 }}>
            Chi tiết đơn vé #{id}
          </Title>
        }
      >
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Descriptions
              column={1}
              size="middle"
              labelStyle={{ fontWeight: 600, width: 150 }}
            >
              <Descriptions.Item
                label={
                  <span>
                    <UserOutlined style={{ marginRight: 8 }} /> Họ tên
                  </span>
                }
              >
                <Text strong>{data.nguoi_dung?.ten}</Text>
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span>
                    <PhoneOutlined style={{ marginRight: 8 }} /> SĐT
                  </span>
                }
              >
                {data.nguoi_dung?.so_dien_thoai || "—"}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span>
                    <MailOutlined style={{ marginRight: 8 }} /> Email
                  </span>
                }
              >
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
              <Descriptions.Item
                label={
                  <span>
                    <CreditCardOutlined style={{ marginRight: 8 }} /> Thanh toán
                  </span>
                }
              >
                <Tag color="blue">{data.phuong_thuc?.ten}</Tag>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span>
                    <TagsOutlined style={{ marginRight: 8 }} /> Voucher
                  </span>
                }
              >
                <Text strong type="danger" style={{ fontSize: 16 }}>
                  {data.ma_giam_gia_id || "N/A"}
                </Text>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span>
                    <DollarOutlined style={{ marginRight: 8 }} /> Tổng tiền
                  </span>
                }
              >
                <Text
                  strong
                  type="danger"
                  style={{ fontSize: 16, textDecoration: "line-through" }}
                >
                  {Number(data?.tong_tien_goc || 0).toLocaleString()} đ
                </Text>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span>
                    <DollarOutlined style={{ marginRight: 8 }} /> Thanh toán
                  </span>
                }
              >
                <Text strong type="danger" style={{ fontSize: 16 }}>
                  {Number(data.dat_ve?.tong_tien || 0).toLocaleString()} đ
                </Text>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span>
                    <FileDoneOutlined style={{ marginRight: 8 }} /> Mã giao dịch
                  </span>
                }
              >
                {data.ma_giao_dich || "—"}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>

        <Divider orientation="left" style={{ margin: "24px 0" }}>
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
              <Descriptions.Item
                label={
                  <span>
                    <VideoCameraOutlined style={{ marginRight: 8 }} /> Phim
                  </span>
                }
              >
                <Text strong>{data.dat_ve?.lich_chieu?.phim?.ten_phim}</Text>
              </Descriptions.Item>

              <Descriptions.Item label={<span>Suất chiếu</span>}>
                <Text strong>
                  {data.dat_ve?.lich_chieu?.phim?.loai_suat_chieu}
                </Text>
              </Descriptions.Item>

              <Descriptions.Item label={<span>Thời gian</span>}>
                <Text strong>{data.dat_ve?.lich_chieu?.gio_chieu}</Text>
              </Descriptions.Item>

              <Descriptions.Item label={<span>Thời lượng</span>}>
                <Text strong>
                  {data.dat_ve?.lich_chieu?.phim?.thoi_luong} Phút
                </Text>
              </Descriptions.Item>
            </Descriptions>
          </Col>

          <Col xs={24} md={12}>
            <Descriptions
              column={1}
              size="middle"
              labelStyle={{ fontWeight: 600, width: 150 }}
            >
              <Descriptions.Item
                label={
                  <span>
                    <HomeOutlined style={{ marginRight: 8 }} /> Rạp
                  </span>
                }
              >
                {data.dat_ve?.lich_chieu?.phong_chieu?.rap.ten_rap}
              </Descriptions.Item>
              <Descriptions.Item label="Phòng chiếu">
                {data.dat_ve?.lich_chieu?.phong_chieu?.ten_phong}
              </Descriptions.Item>

              <Descriptions.Item label="Ghế đã đặt">
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {data.dat_ve?.dat_ve_chi_tiet?.map((ct: any) => (
                    <Tag
                      key={ct.ghe_dat?.so_ghe}
                      color="cyan"
                      style={{ marginBottom: 4 }}
                    >
                      {ct.ghe_dat?.so_ghe}
                    </Tag>
                  ))}
                </div>
              </Descriptions.Item>

              <Descriptions.Item label="Đồ ăn">
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {data.dat_ve?.don_do_an?.length > 0 ? (
                    data.dat_ve.don_do_an.map((item: any) => (
                      <Tag
                        key={item.id}
                        color="purple"
                        style={{ marginBottom: 4 }}
                      >
                        {item.do_an?.ten_do_an} × {item.so_luong}
                      </Tag>
                    ))
                  ) : (
                    <Text type="secondary">Không có</Text>
                  )}
                </div>
              </Descriptions.Item>

              <Descriptions.Item label="Ghế đã hỏng">
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {data.dat_ve?.dat_ve_chi_tiet
                    ?.filter((ct: any) => !ct.ghe_dat.trang_thai)
                    .map((ct: any) => (
                      <Tag
                        key={ct.ghe_dat?.so_ghe}
                        color="red"
                        style={{
                          marginBottom: 4,
                          padding: "4px 10px",
                          fontWeight: 500,
                          fontSize: 14,
                        }}
                        title={`Giá vé: ${formatVND(ct.gia_ve)}`}
                      >
                        Ghế {ct.ghe_dat?.so_ghe} - {formatVND(ct.gia_ve)}
                      </Tag>
                    ))}

                  {data.dat_ve?.dat_ve_chi_tiet?.filter(
                    (ct: any) => !ct.ghe_dat.trang_thai
                  )?.length === 0 && (
                    <span style={{ color: "gray", fontStyle: "italic" }}>
                      Không có ghế hỏng
                    </span>
                  )}
                </div>
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>

        <Divider />
        <Button style={{ marginLeft: "15px" }} onClick={() => navigate(-1)}>
          Quay lại
        </Button>
        <Popconfirm
          title="Bạn có chắc muốn cập nhật?"
          onConfirm={() => handleVe(id)}
          okText="Cập nhật"
          cancelText="Hủy"
        >
          <Button type="primary" style={{ marginLeft: 16 }}>
            Xử lý
          </Button>
        </Popconfirm>
      </Card>

      {/* Modal */}
    </div>
  );
}

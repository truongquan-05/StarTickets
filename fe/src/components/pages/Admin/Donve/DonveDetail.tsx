// pages/Admin/DonVe/DonVeDetail.tsx
import { useEffect, useState } from "react";
import {
  Descriptions,
  message,
  Card,
  Tag,
  Typography,
  Button,
  Divider,
  Row,
  Col,
  Popconfirm,
} from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { getDonVeById } from "../../../provider/duProvider";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  VideoCameraOutlined,
  HomeOutlined,
  CreditCardOutlined,
  DollarOutlined,
  FileDoneOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { printSingleTicket } from "./printTicket ";
import axios from "axios";

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

  if (!data && loading) return <Card loading={true} />;

  if (!data) return <p>Không tìm thấy đơn vé</p>;

  const handlePrintOrder = () => {
    const listGhe = data.dat_ve?.dat_ve_chi_tiet
      ?.map((ct: any) => ct.ghe_dat?.so_ghe)
      .join(", ");

    const listDoAn = data.dat_ve?.don_do_an
      ?.map((item: any) => `${item.do_an?.ten_do_an} x${item.so_luong}`)
      .join(", ");

    const ticketsToPrint = {
      qr_code_data_url: data.qr_code,
      ma_don_hang: data.ma_giao_dich,
      ghe: listGhe,
      doAn: listDoAn,
      phim: data.dat_ve.lich_chieu.phim?.ten_phim,
      thoigian: data.dat_ve.lich_chieu?.gio_chieu,
      rap: data.dat_ve.lich_chieu.phong_chieu.rap?.ten_rap,
      diaChi: data.dat_ve.lich_chieu.phong_chieu.rap?.dia_chi,
      ten: data.ho_ten,
      tongTien: data.dat_ve.tong_tien,
    };
    if (data.da_quet === 1) {
      message.error("Đơn vé đã được in trước đó");
      return;
    }
    printSingleTicket(ticketsToPrint);
  };
  const updatePrint = async (id: any) => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/handler-qr/${id}`
      );
      if (!response) {
        throw new Error("Failed to update print status");
      }
      message.success("Đã cập nhật trạng thái in thành công");
      fetchDetail();
    } catch (error) {
      message.error("Lỗi khi cập nhật trạng thái in");
    }
  };
  return (
    <div style={{ padding: "24px" }}>
      <Card
        style={{ minHeight: "70vh" }}
        title={
          <Title level={4} style={{ margin: 0 }}>
            Chi tiết đơn vé #{id}
          </Title>
        }
        extra={
          <Popconfirm
            title="Bạn có chắc muốn cập nhật?"
            onConfirm={() => updatePrint(id)}
            okText="Cập nhật"
            cancelText="Hủy"
          >
            <Button
              type="primary"
              style={{ marginRight: 16 }}
              disabled={data?.da_quet === 1}
            >
              {data?.da_quet === 1 ? "Đã in" : "Chưa in"}
            </Button>
          </Popconfirm>
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
                    <DollarOutlined style={{ marginRight: 8 }} /> Tổng tiền
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
                {data.dat_ve?.dat_ve_chi_tiet?.map((ct: any) => (
                  <Tag
                    key={ct.ghe_dat?.so_ghe}
                    color="cyan"
                    style={{ marginBottom: 4 }}
                  >
                    {ct.ghe_dat?.so_ghe}
                  </Tag>
                ))}
              </Descriptions.Item>
              <Descriptions.Item label="Đồ ăn">
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
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>

        <Divider />

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Popconfirm
            title="Bạn có chắc muốn in vé?"
            onConfirm={() => handlePrintOrder()}
            okText="In"
            cancelText="Hủy"
          >
            <Button
              type="primary"
              style={{ marginRight: 16 }}
              icon={<PrinterOutlined />}
            >
              In đơn vé
            </Button>
          </Popconfirm>

          <Button onClick={() => navigate(-1)}>Quay lại</Button>
        </div>
      </Card>
    </div>
  );
}

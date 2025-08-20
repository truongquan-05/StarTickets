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
  Modal,
  Spin,
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
  TagsOutlined,
} from "@ant-design/icons";
import { printInBatches } from "./printTicket ";
import axios from "axios";

const { Title, Text } = Typography;

export default function DonVeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [OpenUpdateDoAn, setOpenUpdateDoAn] = useState(false);
  const BASE_URL = "http://127.0.0.1:8000";

  useEffect(() => {
    fetchDetail();
  }, []);

  const [foods, setFoods] = useState<any[]>([]);
  const [loadingfoods, setLoadingfoods] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<Record<number, number>>({}); // {foodId: quantity}

  useEffect(() => {
    if (!open) return; // chỉ fetch khi modal mở

    const fetchFoods = async () => {
      setLoadingfoods(true);
      try {
        const res = await axios.get(
          `http://localhost:8000/api/do_an-rap/${data.dat_ve?.lich_chieu?.phong_chieu?.rap?.id}`
        );
        setFoods(res.data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoadingfoods(false);
      }
    };

    fetchFoods();
  }, [open, data?.dat_ve?.lich_chieu?.phong_chieu?.rap?.id]);

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

    const GiaDoAn = data.dat_ve?.don_do_an
      ?.map((item: any) => item.do_an?.gia_ban * item.so_luong)
      .reduce((a: number, b: number) => a + b, 0);

    const printedSeats = new Set();
    const listGheDoi: any[] = [];

    data.dat_ve.dat_ve_chi_tiet.forEach((item: any) => {
      if (
        item.ghe_dat.loai_ghe_id === 3 &&
        !printedSeats.has(item.ghe_dat.so_ghe)
      ) {
        for (const element of data.dat_ve.dat_ve_chi_tiet) {
          if (item === element) continue;

          if (item.ghe_dat.hang === element.ghe_dat.hang) {
            const adjacent = item.ghe_dat.cot - element.ghe_dat.cot;
            if (adjacent === 1 || adjacent === -1) {
              printedSeats.add(item.ghe_dat.so_ghe);
              listGheDoi.push(item.ghe_dat.so_ghe);
              break;
            }
          }
        }
      }
    });
    const convertGhe: any[] = [];

    for (let i = 0; i < listGheDoi.length; i += 2) {
      convertGhe.push(listGheDoi[i] + "-" + listGheDoi[i + 1]);
    }
    data.dat_ve.dat_ve_chi_tiet.forEach((item: any) => {
      if (
        item.ghe_dat.loai_ghe_id !== 3 &&
        !printedSeats.has(item.ghe_dat.so_ghe)
      ) {
        convertGhe.push(item.ghe_dat.so_ghe);
      }
    });

    const ticketsToPrint = {
      qr_code_data_url: data.qr_code,
      ma_don_hang: data.ma_giao_dich,
      ghe: listGhe,
      phim: data.dat_ve.lich_chieu.phim?.ten_phim,
      thoigian: data.dat_ve.lich_chieu?.gio_chieu,
      rap: data.dat_ve.lich_chieu.phong_chieu.rap?.ten_rap,
      diaChi: data.dat_ve.lich_chieu.phong_chieu.rap?.dia_chi,
      ten: data.ho_ten,
      tongTien: data.dat_ve.tong_tien,
    };

    var dataPrintSingleTicket = convertGhe.map((item: any) => {
      return {
        ...ticketsToPrint,
        ghe: item,
      };
    });

    var dataDoan = {
      ...ticketsToPrint,
      do_an: listDoAn || null,
      gia_do_an: GiaDoAn || 0,
    };

    if (data.da_quet === 1) {
      message.error("Đơn vé đã được in trước đó");
      return;
    }
    printInBatches(
      dataPrintSingleTicket,
      dataPrintSingleTicket.length + 1,
      dataDoan
    );
  };

  console.log(data);

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

          <Button
            type="primary"
            style={{
              background: "linear-gradient(135deg, #1A0933, #4B1C82)",
              borderRadius: "8px",
              fontWeight: "600",
            }}
            onClick={() => setOpen(true)}
          >
            Thêm Đồ Ăn & Thức Uống
          </Button>
      

          <Button style={{ marginLeft: "15px" }} onClick={() => navigate(-1)}>
            Quay lại
          </Button>
        </div>
      </Card>

      {/* Modal */}

      <Modal
        title={
          <div
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "#333",
              textAlign: "center",
              paddingBottom: "10px",
              borderBottom: "1px solid #e8e8e8",
            }}
          >
            🍽️ Đồ ăn & Thức uống
          </div>
        }
        open={open}
        onCancel={() => setOpen(false)}
        width={1200}
        centered
        bodyStyle={{
          padding: "24px",
          background: "#ffffff",
          minHeight: "500px",
          maxHeight: "70vh",
          overflowY: "auto",
        }}
        footer={[
          <Button
            key="cancel"
            size="large"
            style={{
              borderRadius: "6px",
              height: "40px",
              minWidth: "100px",
            }}
            onClick={() => setOpen(false)}
          >
            Đóng
          </Button>,
          <Button
            key="order"
            type="primary"
            size="large"
            style={{
              borderRadius: "6px",
              height: "40px",
              minWidth: "120px",
              backgroundColor: "#1890ff",
            }}
            onClick={() => {
              const orderItems = Object.entries(cart)
                .map(([do_an_id, so_luong]) => ({
                  do_an_id: parseInt(do_an_id),
                  so_luong,
                  gia_ban:
                    foods.find((f) => f.id === parseInt(do_an_id))?.gia_ban ||
                    0,
                  dat_ve_id: data.dat_ve_id,
                }))
                .filter((item: any) => item?.so_luong > 0);

              if (orderItems.length > 0) {
                Modal.confirm({
                  title: "Xác nhận đặt hàng",
                  content: (
                    <div>
                      Bạn có chắc muốn đặt <b>{orderItems.length}</b> món?{" "}
                      <br />
                      Tổng số lượng:{" "}
                      <b>
                        {orderItems.reduce(
                          (sum: number, item: any) => sum + item.so_luong,
                          0
                        )}
                      </b>
                    </div>
                  ),
                  okText: "Xác nhận",
                  cancelText: "Hủy",
                  onOk: async () => {
                    const orderItems = Object.entries(cart)
                      .map(([do_an_id, so_luong]) => ({
                        do_an_id: parseInt(do_an_id),
                        so_luong,
                        gia_ban:
                          foods.find((f) => f.id === parseInt(do_an_id))
                            ?.gia_ban || 0,
                        dat_ve_id: data.dat_ve_id,
                      }))
                      .filter((item: any) => item?.so_luong > 0);

                    if (orderItems.length === 0) return;

                    try {
                      const token = localStorage.getItem("token");
                      const res = await axios
                        .post(
                          "http://localhost:8000/api/do_an-add",
                          { items: orderItems }, // payload gửi
                          {
                            headers: {
                              Authorization: `Bearer ${token}`,
                              "Content-Type": "application/json",
                            },
                          }
                        )
                        .catch((error) => {
                          message.error(error.response.data.message);
                        });

                      setOpen(false);
                      setCart({});
                    } catch (err: any) {
                      console.error(
                        "Lỗi đặt hàng:",
                        err.response?.data || err.message
                      );
                    }
                  },
                });
              }
            }}
            disabled={Object.values(cart).every((qty) => !qty || qty === 0)}
          >
            Đặt hàng (
            {Object.values(cart)
              .filter((qty) => typeof qty === "number")
              .reduce((sum: number, qty) => sum + ((qty as number) || 0), 0)}
            )
          </Button>,
        ]}
      >
        {loadingfoods ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "300px",
            }}
          >
            <Spin
              size="large"
              tip={
                <span
                  style={{
                    fontSize: "16px",
                    color: "#666",
                    fontWeight: "500",
                    marginTop: "12px",
                  }}
                >
                  Đang tải danh sách...
                </span>
              }
            />
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
              gap: "16px",
              padding: "10px 0",
            }}
          >
            {foods?.map((food) => (
              <div
                key={food.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "20px",
                  background: "#ffffff",
                  borderRadius: "8px",
                  border: "1px solid #e8e8e8",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                  transition: "all 0.2s ease",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0, 0, 0, 0.1)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 2px 8px rgba(0, 0, 0, 0.06)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* Food Info Section */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    marginBottom: "16px",
                  }}
                >
                  {/* Food Image */}
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "8px",
                      overflow: "hidden",
                      marginRight: "16px",
                      flexShrink: 0,
                      background: "#f5f5f5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {food.image ? (
                      <img
                        src={food.image}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          if (e.currentTarget.nextElementSibling) {
                            (
                              e.currentTarget.nextElementSibling as HTMLElement
                            ).style.display = "flex";
                          }
                        }}
                      />
                    ) : null}
                    <div
                      style={{
                        display: food.image ? "none" : "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        height: "100%",
                        fontSize: "32px",
                        color: "#bbb",
                      }}
                    >
                      <img
                        src={`${BASE_URL}/storage/${food.image}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  </div>

                  {/* Food Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3
                      style={{
                        margin: "0 0 8px 0",
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#333",
                        lineHeight: "1.4",
                      }}
                    >
                      {food.ten_do_an}
                    </h3>

                    {food.mo_ta && (
                      <p
                        style={{
                          margin: "0 0 12px 0",
                          fontSize: "13px",
                          color: "#666",
                          lineHeight: "1.4",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {food.mo_ta}
                      </p>
                    )}

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "18px",
                          fontWeight: "600",
                          color: "#ff4d4f",
                        }}
                      >
                        {Number(food.gia_ban).toLocaleString()} đ
                      </span>

                      {food.so_luong_ton > 0 ? (
                        <span
                          style={{
                            fontSize: "11px",
                            padding: "2px 8px",
                            borderRadius: "4px",
                            background: "#f6ffed",
                            color: "#52c41a",
                            border: "1px solid #b7eb8f",
                            fontWeight: "500",
                          }}
                        >
                          Còn {food.so_luong_ton} sản phẩm
                        </span>
                      ) : (
                        <span
                          style={{
                            fontSize: "11px",
                            padding: "2px 8px",
                            borderRadius: "4px",
                            background: "#fff2e8",
                            color: "#fa8c16",
                            border: "1px solid #ffd591",
                            fontWeight: "500",
                          }}
                        >
                          Hết hàng
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Purchase Form */}
                <div
                  style={{
                    padding: "16px",
                    background: "#fafafa",
                    borderRadius: "6px",
                    border: "1px solid #f0f0f0",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#333",
                      }}
                    >
                      Số lượng:
                    </span>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      {/* Decrease Button */}
                      <Button
                        size="small"
                        style={{
                          width: "32px",
                          height: "32px",
                          padding: "0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "4px",
                        }}
                        disabled={!cart[food.id] || cart[food.id] <= 0}
                        onClick={() => {
                          setCart((prev) => ({
                            ...prev,
                            [food.id]: Math.max(0, (prev[food.id] || 0) - 1),
                          }));
                        }}
                      >
                        -
                      </Button>

                      {/* Quantity Display */}
                      <span
                        style={{
                          minWidth: "40px",
                          textAlign: "center",
                          fontSize: "16px",
                          fontWeight: "500",
                          color: "#333",
                        }}
                      >
                        {cart[food.id] || 0}
                      </span>

                      {/* Increase Button */}
                      <Button
                        size="small"
                        style={{
                          width: "32px",
                          height: "32px",
                          padding: "0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "4px",
                        }}
                        disabled={
                          food.so_luong_ton <= 0 ||
                          (cart[food.id] || 0) >= food.so_luong_ton
                        }
                        onClick={() => {
                          setCart((prev) => ({
                            ...prev,
                            [food.id]: (prev[food.id] || 0) + 1,
                          }));
                        }}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  {cart[food.id] > 0 && (
                    <div
                      style={{
                        marginTop: "12px",
                        paddingTop: "12px",
                        borderTop: "1px solid #e8e8e8",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "13px",
                          color: "#666",
                        }}
                      >
                        Tạm tính:
                      </span>
                      <span
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "#ff4d4f",
                        }}
                      >
                        {(
                          Number(food.gia_ban) * cart[food.id]
                        ).toLocaleString()}{" "}
                        đ
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cart Summary */}
        {Object.values(cart).some((qty) => qty > 0) && (
          <div
            style={{
              position: "sticky",
              bottom: "0",
              marginTop: "20px",
              padding: "16px",
              background: "#ffffff",
              borderTop: "2px solid #e8e8e8",
              borderRadius: "6px 6px 0 0",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "16px",
                fontWeight: "600",
              }}
            >
              <span style={{ color: "#333" }}>Tổng cộng:</span>
              <span style={{ color: "#ff4d4f", fontSize: "18px" }}>
                {Object.entries(cart)
                  .reduce((total, [foodId, quantity]) => {
                    const food = foods.find((f) => f.id === parseInt(foodId));
                    return total + (food ? Number(food.gia_ban) * quantity : 0);
                  }, 0)
                  .toLocaleString()}{" "}
                đ
              </span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

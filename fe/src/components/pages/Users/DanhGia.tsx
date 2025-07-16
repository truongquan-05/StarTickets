import React, { useEffect, useState } from "react";
import {
  Card,
  Rate,
  Input,
  Button,
  Typography,
  Space,
  Divider,
  Avatar,
  message,
  Dropdown,
  Menu,
  Progress,
  Row,
  Col,
} from "antd";
import { MoreOutlined, UserOutlined, StarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "./DanhGia.css";
import axios from "axios";

const { TextArea } = Input;
const { Title, Text } = Typography;

interface DanhGia {
  id: number;
  so_sao: number;
  noi_dung: string;
  created_at: string;
  nguoi_dung_id: number;
  phim_id: number;
  nguoi_dung: {
    ten: string;
    anh_dai_dien: string;
  };
}

interface DanhGiaFormProps {
  id: any;
  phim: any;
  onSubmit: (danhGia: { so_sao: number; noi_dung: string }) => void;
  danhSachDanhGia?: DanhGia[];
}

// Component thống kê đánh giá
const RatingStatistics: React.FC<{ reviews: DanhGia[] }> = ({
  reviews = [],
}) => {
  const calculateStats = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let totalStars = 0;

    if (reviews && reviews.length > 0) {
      reviews.forEach((review) => {
        const stars = review.so_sao;
        if (stars >= 1 && stars <= 5) {
          distribution[stars as keyof typeof distribution]++;
          totalStars += stars;
        }
      });
    }

    const averageRating = reviews.length > 0 ? totalStars / reviews.length : 0;

    return {
      totalReviews: reviews.length,
      averageRating: Math.round(averageRating * 10) / 10,
      distribution,
    };
  };

  const stats = calculateStats();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "40px",
        padding: "20px",
        background: "#0c0b1f",
        borderRadius: "4px",
        border: "1px solid #2c2c3a",
      }}
    >
      {/* Phần hiển thị điểm trung bình */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minWidth: "120px",
        }}
      >
        <div
          style={{
            fontSize: "64px",
            fontWeight: "bold",
            color: "#ffffff",
            lineHeight: "1",
          }}
        >
          {stats.averageRating || 0}
        </div>
        <div style={{ marginTop: "8px" }}>
          <Rate
            disabled
            allowHalf
            value={stats.averageRating}
            style={{
              fontSize: "16px",
              color: "#ffd700",
            }}
          />
        </div>
        <div
          style={{
            color: "#888",
            fontSize: "14px",
            marginTop: "4px",
          }}
        >
          ({stats.totalReviews} Đánh giá)
        </div>
      </div>

      {/* Phần hiển thị phân bố đánh giá */}
      <div style={{ flex: 1, minWidth: "300px" }}>
        {[5, 4, 3, 2, 1].map((star) => {
          const count =
            stats.distribution[star as keyof typeof stats.distribution];
          const percentage =
            stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;

          return (
            <div
              key={star}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "8px",
                gap: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  minWidth: "20px",
                }}
              >
                <span style={{ color: "#ffffff", marginRight: "4px" }}>
                  {star}
                </span>
                <span style={{ color: "#ffd700", fontSize: "16px" }}>★</span>
              </div>

              <div style={{ flex: 1 }}>
                <Progress
                  percent={percentage}
                  showInfo={false}
                  strokeColor="#ffd700"
                  trailColor="#2c2c3a"
                  strokeWidth={8}
                  style={{ margin: 0 }}
                />
              </div>

              <div
                style={{
                  color: "#ffffff",
                  minWidth: "20px",
                  textAlign: "right",
                  fontSize: "14px",
                }}
              >
                {count}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Component form đánh giá nhỏ gọn
const QuickRatingForm: React.FC<{
  onRateClick: () => void;
  totalReviews: number;
  averageRating: number;
}> = ({ onRateClick, totalReviews, averageRating }) => {
  return (
    <Card
      className="quick-rating-card"
      style={{
        background: "#0c0b1f",
        borderColor: "#2c2c3a",
        height: "fit-content",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            color: "#ffffff",
            marginBottom: "8px",
          }}
        >
          {averageRating || 0}
        </div>

        <Rate
          disabled
          allowHalf
          value={averageRating}
          style={{
            fontSize: "18px",
            color: "#ffd700",
            marginBottom: "8px",
          }}
        />

        <div
          style={{
            color: "#888",
            fontSize: "14px",
            marginBottom: "16px",
          }}
        >
          {totalReviews} đánh giá của bạn
        </div>

        <Button
          type="primary"
          icon={<StarOutlined />}
          onClick={onRateClick}
          style={{
            width: "100%",
            background: "#ffd700",
            borderColor: "#ffd700",
            color: "#000",
            fontWeight: "100",
            borderRadius: "4px",
            fontFamily: "Anton, sans-serif",
          }}
        >
          Viết Đánh Giá
        </Button>
      </div>
    </Card>
  );
};

const DanhGiaForm: React.FC<DanhGiaFormProps> = ({ id }) => {
  const [soSao, setSoSao] = useState<number>(0);
  const [noiDung, setNoiDung] = useState<string>("");
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [editSoSao, setEditSoSao] = useState<number>(0);
  const [editNoiDung, setEditNoiDung] = useState<string>("");
  const [showRatingForm, setShowRatingForm] = useState<boolean>(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleSubmit = async () => {
    if (!user?.id) {
      message.error("Bạn cần đăng nhập để gửi đánh giá");
      return;
    }

    if ((!soSao || !noiDung.trim()) && editNoiDung == undefined) {
      message.warning("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      setLoadingSubmit(true);
      const token = localStorage.getItem("token");
      const payload = {
        so_sao: isEditing ? editSoSao : soSao,
        noi_dung: isEditing ? editNoiDung : noiDung,
        phim_id: id,
        nguoi_dung_id: user.id,
      };

      if (isEditing && myDanhGia) {
        // ✅ Cập nhật
        await axios.put(
          `http://127.0.0.1:8000/api/danh-gia/${myDanhGia.id}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        message.success("Cập nhật đánh giá thành công");
      } else {
        // ✅ Tạo mới
        await axios.post(`http://127.0.0.1:8000/api/danh-gia`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success("Gửi đánh giá thành công");
      }

      // Chỉ reset khi tạo mới
      if (!isEditing) {
        setSoSao(0);
        setNoiDung("");
        setShowRatingForm(false);
      }

      setIsEditing(false);
      await fetchDanhGia();
      await loadMyDanhGia();
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const [data, setData] = useState<any[]>([]);

  const fetchDanhGia = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/phim/${id}/danh-gia`
      );
      setData(res.data.data || []);
    } catch (err) {
      message.error("Không thể tải đánh giá");
      setData([]);
    }
  };

  useEffect(() => {
    if (id) fetchDanhGia();
  }, [id]);

  const [myDanhGia, setMyDanhGia] = useState<DanhGia | null>(null);

  const fetchMyDanhGia = async (id: number) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://127.0.0.1:8000/api/phim/${id}/danh-gia/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res;
    } catch (err: any) {
      if (err.response?.status === 401) {
        console.error("Chưa đăng nhập hoặc token hết hạn");
      } else {
        console.error("Lỗi khi lấy đánh giá của bạn:", err);
      }
    }
  };

  const loadMyDanhGia = async () => {
    const res = await fetchMyDanhGia(id);
    if (res && res.data) {
      setMyDanhGia(res.data.data);
      setSoSao(res.data.so_sao);
      setNoiDung(res.data.noi_dung);
    } else {
      setMyDanhGia(null);
    }
  };

  useEffect(() => {
    if (id) {
      loadMyDanhGia();
    }
  }, [id]);

  const [isEditing, setIsEditing] = useState(false);

  const handleDeleteDanhGia = async (id: any) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://127.0.0.1:8000/api/danh-gia/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      message.success("Xóa đánh giá thành công");
      await fetchDanhGia();
      await loadMyDanhGia();
    } catch (err) {
      console.error(err);
      message.error("Xóa đánh giá thất bại");
    }
  };

  // Tính toán thống kê để truyền cho QuickRatingForm
  const calculateQuickStats = () => {
    if (!data || data.length === 0) {
      return { totalReviews: 0, averageRating: 0 };
    }

    const totalStars = data.reduce((sum, review) => sum + review.so_sao, 0);
    const averageRating = totalStars / data.length;

    return {
      totalReviews: data.length,
      averageRating: Math.round(averageRating * 10) / 10,
    };
  };

  const quickStats = calculateQuickStats();

  return (
    <div className="boxDanhGia">
      <h3 className="lich-chieu-title">ĐÁNH GIÁ PHIM</h3>
      <Row gutter={[24, 24]}>
        {/* Cột trái - Thống kê và danh sách đánh giá */}
        <Col xs={24} lg={18}>
          {/* Thống kê đánh giá - luôn hiển thị */}
          <RatingStatistics reviews={data} />

          <Card
            className="review-card"
            headStyle={{
              borderBottom: "1px solid #2c2c3a",
              background: "transparent",
            }}
            title={<h3 className="review-title">Bình Luận Phim</h3>}
          >
            <Space
              direction="vertical"
              size="middle"
              className="review-content"
            >
              {/* Form đánh giá - chỉ hiển thị khi showRatingForm = true */}
              {showRatingForm && (
                <div
                  style={{
                    background: "#0c0b1f",
                    border: "1px solid #2c2c3a",
                    padding: "20px",
                    borderRadius: "4px",
                    marginBottom: "20px",
                  }}
                >
                  <h4 className="form-label">Chọn số sao</h4>
                  <Rate
                    value={soSao}
                    onChange={setSoSao}
                    className="star-rating"
                    style={{ marginBottom: "16px" }}
                  />

                  <h4 className="form-label-secondary">Nhập bình luận</h4>
                  <TextArea
                    rows={4}
                    placeholder="Viết cảm nhận của bạn..."
                    value={noiDung}
                    onChange={(e) => setNoiDung(e.target.value)}
                    className="review-textarea"
                    style={{ marginBottom: "16px" }}
                  />

                  <Space>
                    <Button
                      type="primary"
                      onClick={handleSubmit}
                      loading={loadingSubmit}
                      disabled={!soSao || !noiDung?.trim()}
                      className="submit-review-btn"
                    >
                      GỬI
                    </Button>
                    <Button
                      onClick={() => setShowRatingForm(false)}
                      className="cancel-review-btn"
                    >
                      HỦY
                    </Button>
                  </Space>
                </div>
              )}

              <Title level={5} className="section-titlee">
                Bình luận của bạn
              </Title>

              {myDanhGia && myDanhGia && !isEditing && (
                <Card
                  size="small"
                  className="user-review-card"
                  extra={
                    <Dropdown
                      overlay={
                        <Menu>
                          <Menu.Item
                            key="edit"
                            onClick={() => {
                              setIsEditing(true);
                              setEditSoSao(myDanhGia.so_sao);
                              setEditNoiDung(myDanhGia.noi_dung);
                            }}
                          >
                            Sửa đánh giá
                          </Menu.Item>

                          <Menu.Item
                            key="delete"
                            onClick={() => handleDeleteDanhGia(myDanhGia.id)}
                          >
                            Xóa đánh giá
                          </Menu.Item>
                        </Menu>
                      }
                      trigger={["click"]}
                    >
                      <MoreOutlined className="dropdown-icon" />
                    </Dropdown>
                  }
                >
                  <Space align="start">
                    <Avatar
                      src={
                        myDanhGia.nguoi_dung?.anh_dai_dien ??
                        "https://ui-avatars.com/api/?name=User&background=2d2d44&color=ffffff"
                      }
                      icon={<UserOutlined />}
                      size="large"
                    />
                    <div>
                      <Text strong className="section-title">
                        {myDanhGia.nguoi_dung?.ten ??
                          `Người dùng #${myDanhGia.nguoi_dung_id}`}
                      </Text>
                      <div style={{ margin: "4px 0" }}>
                        <Rate
                          disabled
                          value={myDanhGia.so_sao}
                          className="star-rating-disabled"
                        />
                      </div>
                      <Text className="review-text">{myDanhGia.noi_dung}</Text>
                      <Text className="review-date">
                        {dayjs(myDanhGia.created_at).format("DD/MM/YYYY")}
                      </Text>
                    </div>
                  </Space>
                </Card>
              )}

              {myDanhGia && isEditing && (
                <Card size="small" className="edit-form">
                  <Space direction="vertical" className="edit-form-content">
                    <Text className="edit-form-title">Chỉnh sửa đánh giá</Text>

                    <Rate
                      value={editSoSao}
                      onChange={setEditSoSao}
                      className="star-rating-edit"
                    />

                    <TextArea
                      value={editNoiDung}
                      onChange={(e) => setEditNoiDung(e.target.value)}
                      rows={3}
                      className="review-textarea-edit"
                    />

                    <Space>
                      <Button
                        className="submit-review-btn"
                        type="primary"
                        onClick={handleSubmit}
                        loading={loadingSubmit}
                      >
                        Lưu
                      </Button>
                      <Button className="canceledit-review-btn"
                        onClick={() => {
                          setIsEditing(false);
                          setEditSoSao(0);
                          setEditNoiDung("");
                        }}
                      >
                        Hủy
                      </Button>

                      
                    </Space>
                  </Space>
                </Card>
              )}

              <Divider className="divider" />

              <Title level={5} className="section-titlee">
                Tất cả bình luận ({data.length})
              </Title>

              {data.length === 0 ? (
                <Text className="empty-state">Chưa có đánh giá nào.</Text>
              ) : (
                data.map((danhGia: any, index: number) => (
                  <Card key={index} size="small" className="user-review-card">
                    <Space align="start">
                      <Avatar
                        src={danhGia.nguoi_dung?.anh_dai_dien}
                        icon={<UserOutlined />}
                        size="large"
                      />
                      <div>
                        <Text strong className="section-title">
                          {danhGia.nguoi_dung?.ten ??
                            `Người dùng #${danhGia.nguoi_dung_id}`}
                        </Text>
                        <div style={{ margin: "4px 0" }}>
                          <Rate
                            disabled
                            value={danhGia.so_sao}
                            className="star-rating-disabled"
                          />
                        </div>
                        <Text className="review-text">{danhGia.noi_dung}</Text>
                        <Text className="review-date">
                          {dayjs(danhGia.created_at).format("DD/MM/YYYY")}
                        </Text>
                      </div>
                    </Space>
                  </Card>
                ))
              )}
            </Space>
          </Card>
        </Col>

        {/* Cột phải - Ô đánh giá nhanh */}
        <Col xs={24} lg={6}>
          <div style={{ position: "sticky", top: "130px" }}>
            <QuickRatingForm
              onRateClick={() => setShowRatingForm(true)}
              totalReviews={quickStats.totalReviews}
              averageRating={quickStats.averageRating}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default DanhGiaForm;

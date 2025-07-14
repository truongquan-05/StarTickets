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
} from "antd";
import { MoreOutlined, UserOutlined } from "@ant-design/icons";
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

const DanhGiaForm: React.FC<DanhGiaFormProps> = ({ id }) => {
  const [soSao, setSoSao] = useState<number>(0);
  const [noiDung, setNoiDung] = useState<string>("");
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [editSoSao, setEditSoSao] = useState<number>(0);
  const [editNoiDung, setEditNoiDung] = useState<string>("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleSubmit = async () => {
    if (!user?.id) {
      message.error("Bạn cần đăng nhập để gửi đánh giá");
      return;
    }

    if ((!soSao || !noiDung.trim() ) && editNoiDung == undefined) {
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

  const [data, setData] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

  const fetchDanhGia = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/phim/${id}/danh-gia`
      );
      setData(res.data.data);
    } catch (err) {
      message.error("Không thể tải đánh giá");
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

  const handleDeleteDanhGia = async (id:any) => {
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

  return (
    <Card
      style={{
        maxWidth: 1000,
        margin: "0 auto",
        background: "#1b1138",
        border: "1px solid #333",
        borderRadius: 10,
        color: "#fff",
        boxShadow: "0 0 10px rgba(0,0,0,0.4)",
      }}
      headStyle={{
        borderBottom: "1px solid #2c2c3a",
        background: "transparent",
      }}
      bodyStyle={{ padding: 24 }}
      title={
        <Title level={4} style={{ color: "#ffffff", margin: 0 }}>
          Đánh giá phim
        </Title>
      }
    >
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Text style={{ color: "#ffffffff" }}>Chọn số sao</Text>

        <Rate
          value={soSao}
          onChange={setSoSao}
          style={{
            color: "#ffc107",
            fontSize: 22,
          }}
        />

        <Text style={{ color: "#f0f0f0" }}>Nhập đánh giá</Text>

        <TextArea
          rows={4}
          placeholder="Viết cảm nhận của bạn..."
          value={noiDung}
          onChange={(e) => setNoiDung(e.target.value)}
          style={{
            background: "#fff",
            borderColor: "#3c2d60",
            color: "#000",
            resize: "none",
            fontWeight: 500,
            fontSize: 14,
          }}
        />

        <Button
          type="primary"
          onClick={handleSubmit}
          disabled={!soSao || !noiDung?.trim()}
          style={{
            background: "#6c5ce7",
            borderColor: "#6c5ce7",
            color: "#fff",
            fontWeight: 600,
            boxShadow: "0 0 8px #6c5ce777",
          }}
        >
          Gửi đánh giá
        </Button>
        <Title level={5} style={{ color: "#fff" }}>
          Đánh giá của tôi
        </Title>

        {myDanhGia && myDanhGia && !isEditing && (
          <Card
            size="small"
            style={{
              background: "#2b1f4d",
              border: "none",
              marginBottom: 12,
            }}
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
                <MoreOutlined
                  style={{ fontSize: 18, color: "#aaa", cursor: "pointer" }}
                />
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
                <Text strong style={{ color: "#fff" }}>
                  {myDanhGia.nguoi_dung?.ten ??
                    `Người dùng #${myDanhGia.nguoi_dung_id}`}
                </Text>
                <div style={{ margin: "4px 0" }}>
                  <Rate
                    disabled
                    value={myDanhGia.so_sao}
                    style={{ fontSize: 16, color: "#ffc107" }}
                  />
                </div>
                <Text
                  style={{ color: "#ccc", display: "block", marginBottom: 4 }}
                >
                  {myDanhGia.noi_dung}
                </Text>
                <Text style={{ fontSize: 12, color: "#888" }}>
                  {dayjs(myDanhGia.created_at).format("DD/MM/YYYY")}
                </Text>
              </div>
            </Space>
          </Card>
        )}

        { myDanhGia && isEditing && (
          <Card
            size="small"
            style={{
              background: "#2b1f4d",
              border: "none",
              marginBottom: 12,
            }}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              <Text style={{ color: "#fff" }}>Chỉnh sửa đánh giá</Text>

              <Rate
                value={editSoSao}
                onChange={setEditSoSao}
                style={{ fontSize: 20, color: "#ffc107" }}
              />

              <TextArea
                value={editNoiDung}
                onChange={(e) => setEditNoiDung(e.target.value)}
                rows={3}
                style={{
                  background: "#fff",
                  color: "#000",
                  resize: "none",
                  fontWeight: 500,
                }}
              />

              <Space>
                <Button
                  onClick={() => {
                    setIsEditing(false);
                    setEditSoSao(0);
                    setEditNoiDung("");
                  }}
                >
                  Hủy
                </Button>

                <Button type="primary" onClick={handleSubmit}>
                  Lưu
                </Button>
              </Space>
            </Space>
          </Card>
        )}

        <Divider style={{ background: "#333" }} />

        <Title level={5} style={{ color: "#fff" }}>
          Các đánh giá khác
        </Title>

        {data === null && (
          <Text style={{ color: "#999" }}>Chưa có đánh giá nào.</Text>
        )}

        {Array.isArray(data) &&
          data.map((danhGia: any, index: number) => (
            <Card
              key={index}
              size="small"
              style={{
                background: "#2b1f4d",
                border: "none",
                marginBottom: 12,
              }}
            >
              <Space align="start">
                <Avatar
                  src={danhGia.nguoi_dung?.anh_dai_dien}
                  icon={<UserOutlined />}
                  size="large"
                />
                <div>
                  <Text strong style={{ color: "#fff" }}>
                    {danhGia.nguoi_dung?.ten ??
                      `Người dùng #${danhGia.nguoi_dung_id}`}
                  </Text>
                  <div style={{ margin: "4px 0" }}>
                    <Rate
                      disabled
                      value={danhGia.so_sao}
                      style={{ fontSize: 16, color: "#ffc107" }}
                    />
                  </div>
                  <Text
                    style={{ color: "#ccc", display: "block", marginBottom: 4 }}
                  >
                    {danhGia.noi_dung}
                  </Text>
                  <Text style={{ fontSize: 12, color: "#888" }}>
                    {dayjs(danhGia.created_at).format("DD/MM/YYYY")}
                  </Text>
                </div>
              </Space>
            </Card>
          ))}
      </Space>
    </Card>
  );
};

export default DanhGiaForm;

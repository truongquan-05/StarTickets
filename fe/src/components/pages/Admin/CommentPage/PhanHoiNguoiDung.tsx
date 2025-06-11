
import { useState } from "react";
import {
  useListPhanHoiNguoiDung,
  useUpdatePhanHoiNguoiDung,
} from "../../../hook/hungHook";
import { Modal, Button, List, Typography, Space, Card } from "antd";
import {
  MailOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";

interface Feedback {
  id: number;
  ho_ten: string;
  email: string;
  so_dien_thoai: string;
  noi_dung: string;
  trang_thai: number; // 0: chưa đọc, 1: đã đọc
  created_at: string | null;
}

const PhanHoiNguoiDung = () => {
  const { data: feedbackData = [], isError } = useListPhanHoiNguoiDung({});
  const { mutate: updateFeedback } = useUpdatePhanHoiNguoiDung({});

  const [modalVisible, setModalVisible] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<Feedback | null>(null);

  const formatDate = (isoStr: string | null) => {
    if (!isoStr) return "Không rõ";
    const dt = new Date(isoStr);
    return (
      dt.toLocaleDateString("vi-VN") +
      " " +
      dt.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
    );
  };

  const toggleReadStatus = (fb: Feedback) => {
    updateFeedback({
      id: fb.id,
      values: { trang_thai: fb.trang_thai === 1 ? 0 : 1 },
    });
  };

  const openModal = (feedback: Feedback) => {
    setCurrentFeedback(feedback);
    setModalVisible(true);
    if (feedback.trang_thai === 0) {
      toggleReadStatus(feedback);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setCurrentFeedback(null);
  };

  if (isError)
    return (
      <Typography.Text type="danger">
        Lỗi khi tải phản hồi người dùng.
      </Typography.Text>
    );

  return (
    
    <div style={{ padding: "24px", backgroundColor: "#fff", borderRadius: 8, height: "83vh", overflowY: "auto" }}>
      <Typography.Title level={3}>Phản hồi người dùng</Typography.Title>

      {feedbackData.length === 0 ? (
        <Typography.Text type="secondary">
          Không có phản hồi nào.
        </Typography.Text>
      ) : (
        <List
          itemLayout="vertical"
          dataSource={feedbackData}
          renderItem={(item: Feedback) => (
            <Card
              key={item.id}
              style={{
                marginBottom: 16,
                backgroundColor: item.trang_thai === 1 ? "#f6f6f6" : "#ffffff",
                cursor: "pointer",
                borderInlineStart:
                  item.trang_thai === 0
                    ? "4px solid #52c41a"
                    : "4px solid transparent", // Viền trái xanh nếu chưa đọc
              }}
              onClick={() => openModal(item)}
              hoverable
            >
              <Space direction="vertical" style={{ width: "100%" }}>
                <Space
                  style={{ justifyContent: "space-between", width: "100%" }}
                >
                  <Typography.Text strong>{item.ho_ten}</Typography.Text>
                  <Typography.Text type="secondary">
                    {formatDate(item.created_at)}
                  </Typography.Text>
                </Space>

                <Typography.Paragraph ellipsis={{ rows: 2 }}>
                  {item.noi_dung}
                </Typography.Paragraph>

                <Space>
                  <Button
                    icon={
                      item.trang_thai === 1 ? (
                        <EyeInvisibleOutlined />
                      ) : (
                        <EyeOutlined />
                      )
                    }
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleReadStatus(item);
                    }}
                  >
                    {item.trang_thai === 1
                      ? "Đánh dấu chưa đọc"
                      : "Đánh dấu đã đọc"}
                  </Button>
                </Space>
              </Space>
            </Card>
          )}
        />
      )}

      <Modal
        open={modalVisible}
        title={`Phản hồi từ ${currentFeedback?.ho_ten}`}
        onCancel={closeModal}
        footer={[
          <Button key="close" onClick={closeModal}>
            Đóng
          </Button>,
        ]}
      >
        {currentFeedback && (
          <>
            <Typography.Paragraph>
              <MailOutlined /> <strong>Email:</strong> {currentFeedback.email}
            </Typography.Paragraph>
            <Typography.Paragraph>
              📞 <strong>SĐT:</strong> {currentFeedback.so_dien_thoai}
            </Typography.Paragraph>
            <Typography.Paragraph style={{ fontSize: 18 }}>
              📝 {currentFeedback.noi_dung}
            </Typography.Paragraph>
          </>
        )}
      </Modal>
    </div>
  );
};

export default PhanHoiNguoiDung;

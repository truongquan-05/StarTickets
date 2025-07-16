import { useState } from "react";
import { QrReader } from "react-qr-reader";
import axios from "axios";

// Import Ant Design Button, Modal và Icon
import { Button, message, Modal } from "antd";
import { QrcodeOutlined, CloseOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const QRCodeScanner = () => {
  const [data, setData] = useState("");
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [loadingScan, setLoadingScan] = useState(false);
  const [scannedSuccessfully, setScannedSuccessfully] = useState(false);
  const navigate = useNavigate();
  const handleScan = async (result: any) => {
    if (result) {
      const scannedCode = result?.text;
      setData(scannedCode);
      setScannedSuccessfully(true);
      setShowScannerModal(false);
      setLoadingScan(false);
      console.log("Mã QR đã quét:", scannedCode);

      try {
        const response = await axios.get(
          `http://localhost:8000/api/handler-qr/${scannedCode}`
        );

        navigate(`/admin/don-ve/${response.data.id}`)
      } catch (err) {
        message.error("Lỗi khi xử lý mã QR. Vui lòng thử lại.");
      }
    }
  };

  const handleError = (err: any) => {
    console.error("Lỗi truy cập camera:", err);
    message.error("Không thể truy cập camera. Vui lòng kiểm tra quyền.");
    setScannedSuccessfully(false);
    setShowScannerModal(false);
    setLoadingScan(false);
    setData("");
  };

  // Mở modal quét
  const startScanning = () => {
    setData("Đang chờ quét...");
    setScannedSuccessfully(false);
    setShowScannerModal(true);
    setLoadingScan(true);
  };

  const handleModalCancel = () => {
    setShowScannerModal(false);
    setLoadingScan(false);
    if (!scannedSuccessfully) {
      setData("");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <Button
        type="primary"
        size="large"
        onClick={startScanning}
        disabled={showScannerModal} // Vô hiệu hóa nút khi modal đang mở
        icon={!showScannerModal && <QrcodeOutlined />} // Icon chỉ hiển thị khi không phải "Đang mở quét..."
      >
        {showScannerModal ? "Đang mở quét..." : ""}
      </Button>

      <Modal
        title="Quét Mã QR Vé"
        visible={showScannerModal} // Điều khiển hiển thị Modal bằng state
        onCancel={handleModalCancel} // Hàm xử lý khi đóng Modal (bấm ESC, click ngoài, nút X)
        footer={[
          // Footer của Modal (chứa các nút hành động)
          <Button key="stop" danger onClick={handleModalCancel}>
            Dừng Quét
          </Button>,
        ]}
        maskClosable={false} // Không cho phép đóng khi click ra ngoài overlay
        destroyOnClose={true} // RẤT QUAN TRỌNG: Hủy nội dung (QrReader) khi đóng để giải phóng camera
        closeIcon={<CloseOutlined />} // Sử dụng icon đóng của Ant Design
      >
        {/* Nội dung bên trong Modal */}
        <h3>Đặt mã QR vào khung hình</h3>
        {loadingScan && <p>Đang tải camera...</p>}{" "}
        {/* Hiển thị loading khi camera chưa sẵn sàng */}
        <div
          style={{
            border: "1px solid #eee",
            marginTop: "10px",
            overflow: "hidden",
          }}
        >
          <QrReader
            onResult={handleScan}
            onError={handleError}
            constraints={{ facingMode: "user" }} // Chỉ sử dụng camera trước
            scanDelay={500} // Độ trễ giữa các lần quét
            videoContainerStyle={{
              width: "100%",
              height: "auto",
              paddingTop: "100%",
              position: "relative",
            }} // Responsive 1:1 aspect ratio
            videoStyle={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }} // Video fill container
          />
        </div>
      </Modal>
    </div>
  );
};

export default QRCodeScanner;

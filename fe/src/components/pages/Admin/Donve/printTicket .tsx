// src/utils/printUtils.js
import ReactDOM from "react-dom";
import React from "react";

// Component TicketContent (đã cập nhật để xử lý đối tượng tổng hợp)
const TicketContent = React.forwardRef(({ ticketInfo }, ref) => {
  if (!ticketInfo) {
    return null;
  }

  const formatDateTime = (dateTimeString :any) => {
    if (!dateTimeString) return "N/A";
    const date = new Date(dateTimeString);
    return (
      date.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }) +
      " " +
      date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
    );
  };

  const formatCurrency = (amount:any) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(parseFloat(amount));
  };

  return (
    <div
      ref={ref}
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        border: "1px dashed #333",
        maxWidth: "400px",
        margin: "20px auto",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
        pageBreakInside: "avoid",
      }}
      className="ticket-container"
    >
      <h2
        style={{
          textAlign: "center",
          color: "#333",
          borderBottom: "1px solid #eee",
          paddingBottom: "10px",
        }}
      >
        CHI TIẾT ĐƠN VÉ
      </h2>

      <div style={{ marginBottom: "15px" }}>
        {" "}
        <p>
          <strong>Rạp:</strong> {ticketInfo.rap || "N/A"}
        </p>
        <p>
          <strong>Địa chỉ rạp:</strong> {ticketInfo.diaChi || "N/A"}
        </p><p>
          <strong>Mã giao dịch:</strong> {ticketInfo.ma_don_hang || "N/A"}
        </p>
        <p>
          <strong>Khách Hàng:</strong> {ticketInfo.ten || "N/A"}
        </p>
        <p>
          <strong>Phim:</strong> {ticketInfo.phim || "N/A"}
        </p>
        <p>
          <strong>Thời gian:</strong> {formatDateTime(ticketInfo.thoigian)}
        </p>
        <p>
          <strong>Ghế:</strong> {ticketInfo.ghe || "N/A"}
        </p>
        <p>
          <strong>Đồ ăn:</strong> {ticketInfo.doAn || "N/A"}
        </p>
        <p>
          <strong>Tổng tiền:</strong> {formatCurrency(ticketInfo.tongTien)}
        </p>
      </div>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        {ticketInfo.qr_code_data_url && (
          <div
            style={{
              padding: "10px",
              border: "1px solid #ddd",
              display: "inline-block",
            }}
          >
            <img
              src={ticketInfo.qr_code_data_url}
              alt="QR Code"
              style={{ width: 128, height: 128 }}
            />
          </div>
        )}
      </div>
    </div>
  );
});

// Hàm in nhiều vé (giữ nguyên như bạn đã cung cấp)
export const printTicket = (ticketInfoArray:any) => {
  if (!Array.isArray(ticketInfoArray) || ticketInfoArray.length === 0) {
    console.warn("Không có thông tin vé để in.");
    return;
  }

  const printWindow = window.open("", "", "height=600,width=800");
  if (!printWindow) {
    console.error("Không thể mở cửa sổ in. Vui lòng kiểm tra trình duyệt của bạn.");
    return;
  }
  printWindow.document.write("<html><head><title>In Vé</title>");
  printWindow.document.write("<style>");
  printWindow.document.write(`
    @media print {
        body { margin: 0; padding: 0; }
        .ticket-container {
            page-break-after: always;
            margin-bottom: 20px;
        }
        .ticket-container:last-child {
            page-break-after: avoid;
        }
        .no-print {
            display: none !important;
        }
    }
  `);
  printWindow.document.write("</style></head><body>");

  ticketInfoArray.forEach((ticketInfo) => {
    const tempDiv = document.createElement("div");
    ReactDOM.render(
      React.createElement(TicketContent, { ticketInfo: ticketInfo }),
      tempDiv
    );
    printWindow.document.write(tempDiv.innerHTML);
    ReactDOM.unmountComponentAtNode(tempDiv);
  });

  printWindow.document.write("</body></html>");
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};

export const printSingleTicket = (ticketInfo) => {
  if (!ticketInfo) {
    console.warn("Không có thông tin vé để in.");
    return;
  }
  const printWindow = window.open("", "", "height=600,width=800");
  if (!printWindow) {
    console.error("Không thể mở cửa sổ in. Vui lòng kiểm tra trình duyệt của bạn.");
    return;
  }
  printWindow.document.write("<html><head><title>In Vé</title>");
  printWindow.document.write("<style>");
  printWindow.document.write(`
    @media print {
        body { margin: 0; padding: 0; }
        .ticket-container {
            page-break-after: avoid; /* Không ngắt trang sau vé đơn */
            margin-bottom: 20px;
        }
        .no-print {
            display: none !important;
        }
    }
  `);
  printWindow.document.write("</style></head><body>");

  const tempDiv = document.createElement("div");
  ReactDOM.render(
    React.createElement(TicketContent, { ticketInfo: ticketInfo }),
    tempDiv
  );
  printWindow.document.write(tempDiv.innerHTML);
  ReactDOM.unmountComponentAtNode(tempDiv);

  printWindow.document.write("</body></html>");
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};

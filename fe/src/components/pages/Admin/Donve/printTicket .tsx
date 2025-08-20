// src/utils/printUtils.js
import ReactDOM from "react-dom";
import React from "react";

export const formatDateTime = (dateTimeString: any) => {
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
// Component TicketContent (đã cập nhật để xử lý đối tượng tổng hợp)
const TicketContent = React.forwardRef<HTMLDivElement, { ticketInfo: any }>(
  ({ ticketInfo }, ref) => {
    if (!ticketInfo) {
      return null;
    }

    const formatCurrency = (amount: any) => {
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
          fontFamily: "'Arial', sans-serif",
          backgroundColor: "#ffffff",
          padding: "0",
          border: "1px solid #ccc",
          borderRadius: "0",
          maxWidth: "340px",
          margin: "30px auto",
          boxShadow: "0 3px 10px rgba(0, 0, 0, 0.1)",
          position: "relative",
          overflow: "visible",
        }}
      >
        {/* Film strip border top */}
        <div
          style={{
            height: "7px",
            backgroundColor: "#333",
            background: `repeating-linear-gradient(
      to right,
      #333 0px,
      #333 20px,
      #ffffff 20px,
      #ffffff 45px
    )`,
            borderTop: "3px solid #333",
            borderBottom: "3px solid #333",
          }}
        />

        {/* Header */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderBottom: "2px solid #333",
            padding: "15px 20px",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontWeight: "bold",
              fontSize: "18px",
              margin: "0",
              letterSpacing: "2px",
              color: "#333",
            }}
          >
            🎬 CINEMA TICKET
          </h2>
          <div
            style={{
              fontSize: "12px",
              marginTop: "5px",
              color: "#666",
              letterSpacing: "1px",
            }}
          >
            VÉ XEM PHIM
          </div>
        </div>

        {/* Perforated line với hiệu ứng cắt giấy */}
        <div
          style={{
            position: "relative",
            height: "20px",
            background: "#ffffff",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "0",
              right: "0",
              transform: "translateY(-50%)",
              height: "1px",
              background:
                "repeating-linear-gradient(to right, #999 0px, #999 8px, transparent 8px, transparent 16px)",
            }}
          />

          {/* Circles tạo hiệu ứng cắt giấy */}
          <div
            style={{
              position: "absolute",
              left: "-10px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "20px",
              height: "20px",
              backgroundColor: "#f5f5f5",
              borderRadius: "50%",
              border: "1px solid #ccc",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: "-10px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "20px",
              height: "20px",
              backgroundColor: "#f5f5f5",
              borderRadius: "50%",
              border: "1px solid #ccc",
            }}
          />
        </div>

        {/* Main content */}
        <div
          style={{
            padding: "20px",
            backgroundColor: "#ffffff",
            color: "#333",
          }}
        >
          <div
            style={{
              display: "grid",
              gap: "12px",
              fontSize: "14px",
              lineHeight: "1.5",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontWeight: "600", color: "#666" }}>RẠP:</span>
              <span
                style={{
                  fontWeight: "bold",
                  color: "#333",
                  textAlign: "right",
                  flex: "1",
                  marginLeft: "15px",
                }}
              >
                {ticketInfo.rap || "N/A"}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontWeight: "600", color: "#666" }}>ĐỊA CHỈ:</span>
              <span
                style={{
                  color: "#333",
                  textAlign: "right",
                  flex: "1",
                  marginLeft: "15px",
                }}
              >
                {ticketInfo.diaChi || "N/A"}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontWeight: "600", color: "#666" }}>MÃ VÉ:</span>
              <span
                style={{
                  fontWeight: "bold",
                  color: "#333",
                  textAlign: "right",
                  flex: "1",
                  marginLeft: "15px",
                  fontFamily: "monospace",
                }}
              >
                {ticketInfo.ma_don_hang || "N/A"}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontWeight: "600", color: "#666" }}>
                KHÁCH HÀNG:
              </span>
              <span
                style={{
                  fontWeight: "bold",
                  color: "#333",
                  textAlign: "right",
                  flex: "1",
                  marginLeft: "15px",
                }}
              >
                {ticketInfo.ten || "N/A"}
              </span>
            </div>

            {/* Dotted divider */}
            <div
              style={{
                borderTop: "1px dotted #999",
                margin: "15px 0",
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontWeight: "600", color: "#666" }}>PHIM:</span>
              <span
                style={{
                  fontWeight: "bold",
                  color: "#333",
                  textAlign: "right",
                  flex: "1",
                  marginLeft: "15px",
                }}
              >
                {ticketInfo.phim || "N/A"}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontWeight: "600", color: "#666" }}>
                THỜI GIAN:
              </span>
              <span
                style={{
                  fontWeight: "bold",
                  color: "#333",
                  textAlign: "right",
                  flex: "1",
                  marginLeft: "15px",
                }}
              >
                {formatDateTime(ticketInfo.thoigian)}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontWeight: "600", color: "#666" }}>GHẾ:</span>
              <span
                style={{
                  fontWeight: "bold",
                  color: "#333",
                  border: "1px solid #333",
                  padding: "3px 8px",
                  borderRadius: "3px",
                  fontSize: "12px",
                  backgroundColor: "#f8f8f8",
                }}
              >
                {ticketInfo.ghe
                  ? ticketInfo.ghe.includes("-")
                    ? `${ticketInfo.ghe} (ĐÔI)`
                    : `${ticketInfo.ghe}`
                  : "N/A"}
              </span>
            </div>

            {ticketInfo.doAn && ticketInfo.doAn !== "Không có" && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontWeight: "600", color: "#666" }}>COMBO:</span>
                <span
                  style={{
                    color: "#333",
                    textAlign: "right",
                    flex: "1",
                    marginLeft: "15px",
                  }}
                >
                  {ticketInfo.doAn}
                </span>
              </div>
            )}

            {/* Solid divider */}
            <div
              style={{
                borderTop: "2px solid #333",
                margin: "15px 0 10px 0",
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#f8f8f8",
                padding: "12px",
                border: "1px solid #ddd",
                marginTop: "8px",
              }}
            >
              <span
                style={{ fontWeight: "bold", color: "#333", fontSize: "16px" }}
              >
                TỔNG TIỀN:
              </span>
              <span
                style={{
                  fontWeight: "bold",
                  color: "#333",
                  fontSize: "18px",
                }}
              >
                {formatCurrency(ticketInfo.tongTien)}
              </span>
            </div>
          </div>

          {/* QR Code */}
          {ticketInfo.qr_code_data_url && (
            <div
              style={{
                marginTop: "20px",
                textAlign: "center",
                borderTop: "1px dotted #999",
                paddingTop: "15px",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  border: "2px solid #333",
                  padding: "8px",
                  backgroundColor: "#fff",
                }}
              >
                <img
                  src={ticketInfo.qr_code_data_url}
                  alt="QR Code"
                  style={{ width: 80, height: 80, display: "block" }}
                />
              </div>
              <p
                style={{
                  fontSize: "11px",
                  color: "#666",
                  marginTop: "8px",
                  fontWeight: "500",
                }}
              >
                QUÉT MÃ ĐỂ XÁC THỰC
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            backgroundColor: "#f8f8f8",
            borderTop: "1px solid #ddd",
            padding: "12px 20px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              margin: "0",
              color: "#666",
              fontStyle: "italic",
            }}
          >
            Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!
          </p>
        </div>

        {/* Film strip border bottom */}
        <div
          style={{
            height: "7px",
            backgroundColor: "#333",
            background: `repeating-linear-gradient(
      to right,
      #333 0px,
      #333 20px,
      #ffffff 20px,
      #ffffff 45px
    )`,
            borderTop: "3px solid #333",
            borderBottom: "3px solid #333",
          }}
        />

        {/* Film strip side borders */}
        <div
          style={{
            position: "absolute",
            left: "-3px",
            top: "0",
            bottom: "0",
            width: "10px",
            backgroundColor: "#333",
            background: `repeating-linear-gradient(
      to bottom,
      #333 0px,
      #333 15px,
      #ffffff 15px,
      #ffffff 40px
    )`,
            borderLeft: "3px solid #333",
            borderRight: "3px solid #333",
          }}
        />

        <div
          style={{
            position: "absolute",
            right: "-3px",
            top: "0",
            bottom: "0",
            width: "10px",
            backgroundColor: "#333",
            background: `repeating-linear-gradient(
      to bottom,
      #333 0px,
      #333 15px,
      #ffffff 15px,
      #ffffff 40px
    )`,
            borderLeft: "3px solid #333",
            borderRight: "3px solid #333",
          }}
        />
      </div>
    );
  }
);

export const formatCurrencyv2 = (amount: any) => {
  if (!amount) return "N/A";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(parseFloat(amount));
};
const FoodTicketContent = ({ foodInfo }: any) => (
  <div
    style={{
      fontFamily: "'Arial', sans-serif",
      backgroundColor: "#ffffff",
      padding: "0",
      border: "1px solid #ccc",
      borderRadius: "0",
      maxWidth: "340px",
      margin: "30px auto",
      boxShadow: "0 3px 10px rgba(0, 0, 0, 0.1)",
      position: "relative",
      overflow: "visible",
    }}
  >
    <div
      style={{
        height: "7px",
        backgroundColor: "#333",
        background: `repeating-linear-gradient(
      to right,
      #333 0px,
      #333 20px,
      #ffffff 20px,
      #ffffff 45px
    )`,
        borderTop: "3px solid #333",
        borderBottom: "3px solid #333",
      }}
    />

    {/* Header */}
    <div
      style={{
        backgroundColor: "#ffffff",
        borderBottom: "2px solid #333",
        padding: "15px 20px",
        textAlign: "center",
      }}
    >
      <h2
        style={{
          fontWeight: "bold",
          fontSize: "18px",
          margin: "0",
          letterSpacing: "2px",
          color: "#333",
        }}
      >
        🎬 CINEMA TICKET
      </h2>
      <div
        style={{
          fontSize: "12px",
          marginTop: "5px",
          color: "#666",
          letterSpacing: "1px",
        }}
      >
        VÉ ĐỒ ĂN $ THỨC UỐNG
      </div>
    </div>

    <div
      style={{
        position: "relative",
        height: "20px",
        background: "#ffffff",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "0",
          right: "0",
          transform: "translateY(-50%)",
          height: "1px",
          background:
            "repeating-linear-gradient(to right, #999 0px, #999 8px, transparent 8px, transparent 16px)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: "-10px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "20px",
          height: "20px",
          backgroundColor: "#f5f5f5",
          borderRadius: "50%",
          border: "1px solid #ccc",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: "-10px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "20px",
          height: "20px",
          backgroundColor: "#f5f5f5",
          borderRadius: "50%",
          border: "1px solid #ccc",
        }}
      />
    </div>

    <div
      style={{
        padding: "20px",
        backgroundColor: "#ffffff",
        color: "#333",
      }}
    >
      <div
        style={{
          display: "grid",
          gap: "12px",
          fontSize: "14px",
          lineHeight: "1.5",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontWeight: "600", color: "#666" }}>RẠP:</span>
          <span
            style={{
              fontWeight: "bold",
              color: "#333",
              textAlign: "right",
              flex: "1",
              marginLeft: "15px",
            }}
          >
            {foodInfo?.rap || "N/A"}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontWeight: "600", color: "#666" }}>ĐỊA CHỈ:</span>
          <span
            style={{
              color: "#333",
              textAlign: "right",
              flex: "1",
              marginLeft: "15px",
            }}
          >
            {foodInfo?.diaChi || "N/A"}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontWeight: "600", color: "#666" }}>MÃ VÉ:</span>
          <span
            style={{
              fontWeight: "bold",
              color: "#333",
              textAlign: "right",
              flex: "1",
              marginLeft: "15px",
              fontFamily: "monospace",
            }}
          >
            {foodInfo?.ma_don_hang || "N/A"}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontWeight: "600", color: "#666" }}>KHÁCH HÀNG:</span>
          <span
            style={{
              fontWeight: "bold",
              color: "#333",
              textAlign: "right",
              flex: "1",
              marginLeft: "15px",
            }}
          >
            {foodInfo?.ten || "N/A"}
          </span>
        </div>

        {/* Dotted divider */}
        <div
          style={{
            borderTop: "1px dotted #999",
            margin: "15px 0",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontWeight: "600", color: "#666" }}>PHIM:</span>
          <span
            style={{
              fontWeight: "bold",
              color: "#333",
              textAlign: "right",
              flex: "1",
              marginLeft: "15px",
            }}
          >
            {foodInfo?.phim || "N/A"}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontWeight: "600", color: "#666" }}>THỜI GIAN:</span>
          <span
            style={{
              fontWeight: "bold",
              color: "#333",
              textAlign: "right",
              flex: "1",
              marginLeft: "15px",
            }}
          >
            {formatDateTime(foodInfo?.thoigian)}
          </span>
        </div>

        {foodInfo?.do_an && foodInfo?.do_an !== "Không có" && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              margin: "8px 0",
              padding: "8px 12px",
              border: "1px solid #ddd",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #fdfbfb, #ebedee)",
              transition: "all 0.3s ease",
              fontSize: "14px",
              fontWeight: "500",
              color: "#222",
            }}
          >
            <span style={{ fontWeight: "600", color: "#444" }}>
              🥤 Đồ ăn & Thức uống:
            </span>
            <span style={{ textAlign: "right", flex: "1", marginLeft: "12px" }}>
              {foodInfo.do_an}
            </span>
          </div>
        )}

        {/* Solid divider */}
        <div
          style={{
            borderTop: "2px solid #333",
            margin: "15px 0 10px 0",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#f8f8f8",
            padding: "12px",
            border: "1px solid #ddd",
            marginTop: "8px",
          }}
        >
          <span style={{ fontWeight: "bold", color: "#333", fontSize: "16px" }}>
            TỔNG TIỀN ĐỒ ĂN:
          </span>
          <span
            style={{
              fontWeight: "bold",
              color: "#333",
              fontSize: "18px",
            }}
          >
            {formatCurrencyv2(foodInfo?.gia_do_an)}
          </span>
        </div>
      </div>

      {/* QR Code */}
      {foodInfo?.qr_code_data_url && (
        <div
          style={{
            marginTop: "20px",
            textAlign: "center",
            borderTop: "1px dotted #999",
            paddingTop: "15px",
          }}
        >
          <div
            style={{
              display: "inline-block",
              border: "2px solid #333",
              padding: "8px",
              backgroundColor: "#fff",
            }}
          >
            <img
              src={foodInfo.qr_code_data_url}
              alt="QR Code"
              style={{ width: 80, height: 80, display: "block" }}
            />
          </div>
          <p
            style={{
              fontSize: "11px",
              color: "#666",
              marginTop: "8px",
              fontWeight: "500",
            }}
          >
            QUÉT MÃ ĐỂ XÁC THỰC
          </p>
        </div>
      )}
    </div>

    {/* Footer */}
    <div
      style={{
        backgroundColor: "#f8f8f8",
        borderTop: "1px solid #ddd",
        padding: "12px 20px",
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontSize: "11px",
          margin: "0",
          color: "#666",
          fontStyle: "italic",
        }}
      >
        Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!
      </p>
    </div>

    {/* Film strip border bottom */}
    <div
      style={{
        height: "7px",
        backgroundColor: "#333",
        background: `repeating-linear-gradient(
      to right,
      #333 0px,
      #333 20px,
      #ffffff 20px,
      #ffffff 45px
    )`,
        borderTop: "3px solid #333",
        borderBottom: "3px solid #333",
      }}
    />

    {/* Film strip side borders */}
    <div
      style={{
        position: "absolute",
        left: "-3px",
        top: "0",
        bottom: "0",
        width: "10px",
        backgroundColor: "#333",
        background: `repeating-linear-gradient(
      to bottom,
      #333 0px,
      #333 15px,
      #ffffff 15px,
      #ffffff 40px
    )`,
        borderLeft: "3px solid #333",
        borderRight: "3px solid #333",
      }}
    />

    <div
      style={{
        position: "absolute",
        right: "-3px",
        top: "0",
        bottom: "0",
        width: "10px",
        backgroundColor: "#333",
        background: `repeating-linear-gradient(
      to bottom,
      #333 0px,
      #333 15px,
      #ffffff 15px,
      #ffffff 40px
    )`,
        borderLeft: "3px solid #333",
        borderRight: "3px solid #333",
      }}
    />
  </div>
);

// Hàm in nhiều vé (giữ nguyên như bạn đã cung cấp)
export const printTicket = (ticketInfoArray: any, foodInfo: any) => {
  if (!Array.isArray(ticketInfoArray) || ticketInfoArray.length === 0) {
    console.warn("Không có thông tin vé để in.");
    return;
  }

  const printWindow = window.open("", "", "height=600,width=800");
  if (!printWindow) {
    console.error(
      "Không thể mở cửa sổ in. Vui lòng kiểm tra trình duyệt của bạn."
    );
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

  if(foodInfo.do_an){
    const tempDiv2 = document.createElement("div");
  ReactDOM.render(<FoodTicketContent foodInfo={foodInfo} />, tempDiv2);
  printWindow.document.write(tempDiv2.innerHTML);
  ReactDOM.unmountComponentAtNode(tempDiv2);
  }
  

  printWindow.document.write("</body></html>");
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};

export const printInBatches = (
  ticketArray: any[],
  batchSize: number,
  foodInfo: any = null
) => {
  for (let i = 0; i < ticketArray.length; i += batchSize) {
    const group = ticketArray.slice(i, i + batchSize);
    printTicket(group, foodInfo);
  }
};

export const printSingleTicket = (ticketInfo: any) => {
  if (!ticketInfo) {
    console.warn("Không có thông tin vé để in.");
    return;
  }
  const printWindow = window.open("", "", "height=600,width=800");
  if (!printWindow) {
    console.error(
      "Không thể mở cửa sổ in. Vui lòng kiểm tra trình duyệt của bạn."
    );
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

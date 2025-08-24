import { useEffect, useState } from "react";
import {
  Table,
  Button,
  message,
  Card,
  Tag,
  Space,
  Typography,
  Input,
  Dropdown,
  MenuProps,
  Modal,
} from "antd";
import type { ColumnType } from "antd/es/table";
import { getListDonVe } from "../../../provider/duProvider";
import { useNavigate } from "react-router-dom";
import {
  SearchOutlined,
  FileSearchOutlined,
  DownloadOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { DatePicker } from "antd";
import QRCodeScanner from "./QuetQR";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "./DonVeStyle.css";

const { Title, Text } = Typography;

export default function DonVeList() {
  const [donVe, setDonVe] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const { RangePicker } = DatePicker;

  useEffect(() => {
    fetchDonVe();
  }, []);

  const fetchDonVe = async () => {
    setLoading(true);
    try {
      const res = await getListDonVe();
      setDonVe(res);
    } catch (err) {
      message.error("Lỗi khi tải danh sách đơn vé");
    } finally {
      setLoading(false);
    }
  };

  // Hàm xuất Excel
  const exportToExcel = (from: any, to: any) => {
    
    try {
      const dataForExcel = filteredData
        .filter((i: any) => {
          if (from) {
            return (
              dayjs(i.created_at).format("YYYY-MM-DD") >=
                dayjs(from).format("YYYY-MM-DD") &&
              dayjs(i.created_at).format("YYYY-MM-DD") <=
                dayjs(to).format("YYYY-MM-DD")
            );
          }
          return i;
        })
        .map((item: any, index: number) => ({
          STT: index + 1,
          "Mã đơn hàng": item.ma_giao_dich || "—",
          Email: item.nguoi_dung?.email || "—",
          "Tên phim": item.dat_ve?.lich_chieu?.phim?.ten_phim || "—",
          "Rạp chiếu":
            item.dat_ve?.lich_chieu?.phong_chieu?.rap.ten_rap || "CGV Vincom",
          "Ngày đặt": dayjs(item.created_at).format("DD/MM/YYYY"),
          "Phương thức thanh toán": item.phuong_thuc?.ten || "—",
          "Tổng tiền (VNĐ)": Number(
            item.dat_ve?.tong_tien || 0
          ).toLocaleString(),
        }));

      const ws = XLSX.utils.json_to_sheet(dataForExcel);

      // Tự động điều chỉnh độ rộng cột
      const wscols = [
        { wch: 5 }, // STT
        { wch: 15 }, // Mã đơn hàng
        { wch: 25 }, // Email
        { wch: 30 }, // Tên phim
        { wch: 20 }, // Rạp chiếu
        { wch: 12 }, // Ngày đặt
        { wch: 18 }, // Phương thức thanh toán
        { wch: 15 }, // Tổng tiền
      ];
      ws["!cols"] = wscols;

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Danh sách đơn vé");

      const fileName = `DanhSachDonVe_${dayjs().format(
        "DDMMYYYY_HHmmss"
      )}.xlsx`;
      XLSX.writeFile(wb, fileName);

      message.success("Xuất Excel thành công!");
    } catch (error) {
      console.error("Lỗi xuất Excel:", error);
      message.error("Có lỗi xảy ra khi xuất Excel");
    }
  };

  // Hàm xuất PDF (phiên bản cải tiến)
  const exportToPDF = (from:any, to:any) => {
    
    try {
      const doc = new jsPDF("landscape");

      // Tiêu đề
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("DANH SÁCH ĐƠN VÉ", 140, 20, { align: "center" });

      // Thông tin xuất file
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Ngày xuất: ${dayjs().format("DD/MM/YYYY HH:mm:ss")}`, 14, 30);
      doc.text(
        `Tổng số: ${
          filteredData.filter((i: any) => {
            if (from) {
              return (
                dayjs(i.created_at).format("YYYY-MM-DD") >=
                  dayjs(from).format("YYYY-MM-DD") &&
                dayjs(i.created_at).format("YYYY-MM-DD") <=
                  dayjs(to).format("YYYY-MM-DD")
              );
            }
            return i;
          }).length
        } đơn vé`,
        14,
        35
      );

      // Vẽ đường kẻ phân cách
      doc.line(14, 40, 283, 40);

      // Thiết lập vị trí cột
      const cols = {
        stt: 14,
        maGD: 30,
        email: 65,
        phim: 130,
        rap: 190,
        ngay: 230,
        tien: 260,
      };

      let yPosition = 50;
      const pageHeight = doc.internal.pageSize.height;
      const lineHeight = 7;

      // Header bảng
      doc.setFontSize(9);
      doc.setFont(undefined, "bold");

      // Vẽ background cho header
      doc.setFillColor(240, 240, 240);
      doc.rect(14, yPosition - 5, 269, 8, "F");

      doc.text("STT", cols.stt, yPosition);
      doc.text("Mã giao dịch", cols.maGD, yPosition);
      doc.text("Email", cols.email, yPosition);
      doc.text("Tên phim", cols.phim, yPosition);
      doc.text("Rạp chiếu", cols.rap, yPosition);
      doc.text("Ngày đặt", cols.ngay, yPosition);
      doc.text("Tổng tiền", cols.tien, yPosition);

      // Đường kẻ dưới header
      yPosition += 3;
      doc.line(14, yPosition, 283, yPosition);
      yPosition += 5;

      // Dữ liệu bảng
      doc.setFont(undefined, "normal");
      doc.setFontSize(8);

      filteredData.filter((i: any) => {
            if (from) {
              return (
                dayjs(i.created_at).format("YYYY-MM-DD") >=
                  dayjs(from).format("YYYY-MM-DD") &&
                dayjs(i.created_at).format("YYYY-MM-DD") <=
                  dayjs(to).format("YYYY-MM-DD")
              );
            }
            return i;
          }).forEach((item: any, index: number) => {
        // Kiểm tra nếu cần trang mới
        if (yPosition > pageHeight - 30) {
          doc.addPage();
          yPosition = 30;

          // Vẽ lại header trên trang mới
          doc.setFont("helvetica", "bold");
          doc.setFontSize(9);
          doc.setFillColor(240, 240, 240);
          doc.rect(14, yPosition - 5, 269, 8, "F");

          doc.text("STT", cols.stt, yPosition);
          doc.text("Mã giao dịch", cols.maGD, yPosition);
          doc.text("Email", cols.email, yPosition);
          doc.text("Tên phim", cols.phim, yPosition);
          doc.text("Rạp chiếu", cols.rap, yPosition);
          doc.text("Ngày đặt", cols.ngay, yPosition);
          doc.text("Tổng tiền", cols.tien, yPosition);

          yPosition += 3;
          doc.line(14, yPosition, 283, yPosition);
          yPosition += 5;

          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);
        }

        // Vẽ background xen kẽ cho các dòng
        if (index % 2 === 0) {
          doc.setFillColor(250, 250, 250);
          doc.rect(14, yPosition - 4, 269, 6, "F");
        }

        // Dữ liệu từng cột
        doc.text(String(index + 1), cols.stt + 3, yPosition, {
          align: "center",
        });
        doc.text(
          (item.ma_giao_dich || "—").substring(0, 15),
          cols.maGD,
          yPosition
        );

        // Cắt email nếu quá dài
        const email = item.nguoi_dung?.email || "—";
        const shortEmail =
          email.length > 25 ? email.substring(0, 22) + "..." : email;
        doc.text(shortEmail, cols.email, yPosition);

        // Cắt tên phim nếu quá dài
        const tenPhim = item.dat_ve?.lich_chieu?.phim?.ten_phim || "—";
        const shortPhim =
          tenPhim.length > 20 ? tenPhim.substring(0, 17) + "..." : tenPhim;
        doc.text(shortPhim, cols.phim, yPosition);

        // Tên rạp
        const tenRap =
          item.dat_ve?.lich_chieu?.phong_chieu?.rap?.ten_rap || "CGV Vincom";
        const shortRap =
          tenRap.length > 15 ? tenRap.substring(0, 12) + "..." : tenRap;
        doc.text(shortRap, cols.rap, yPosition);

        // Ngày đặt
        doc.text(
          dayjs(item.created_at).format("DD/MM/YYYY"),
          cols.ngay,
          yPosition
        );

        // Tổng tiền (căn phải)
        const tongTien =
          Number(item.dat_ve?.tong_tien || 0).toLocaleString() + " đ";
        doc.text(tongTien, cols.tien + 20, yPosition, { align: "right" });

        yPosition += lineHeight;
      });

      // Đường kẻ cuối bảng
      doc.line(14, yPosition, 283, yPosition);

      // Thông tin tổng kết
      yPosition += 10;
      doc.setFont(undefined, "bold");
      doc.setFontSize(10);
      const tongDoanhThu = filteredData.reduce(
        (sum: number, item: any) => sum + Number(item.dat_ve?.tong_tien || 0),
        0
      );
      doc.text(
        `Tổng doanh thu: ${tongDoanhThu.toLocaleString()} đ`,
        cols.tien + 20,
        yPosition,
        { align: "right" }
      );

      // Lưu file
      const fileName = `DanhSachDonVe_${dayjs().format("DDMMYYYY_HHmmss")}.pdf`;
      doc.save(fileName);

      message.success("Xuất PDF thành công!");
    } catch (error) {
      console.error("Lỗi xuất PDF:", error);
      message.error("Có lỗi xảy ra khi xuất PDF");
    }
  };

  const [open, setOpen] = useState(false);
  const [openPdf, setOpenPdf] = useState(false);
  const [date, setDate] = useState<any>(null);

  // Menu dropdown cho nút xuất
  const exportMenuItems: MenuProps["items"] = [
    {
      key: "excel",
      label: "Xuất Excel",
      icon: <FileExcelOutlined style={{ color: "#10b981" }} />,
      onClick: () => setOpen(true), // mở modal
    },
    {
      key: "pdf",
      label: "Xuất PDF",
      icon: <FilePdfOutlined style={{ color: "#ef4444" }} />,
      onClick: () => setOpenPdf(true), // mở modal
    },
  ];

  const getColumnSearchProps = (dataIndex: string): ColumnType<any> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: {
      setSelectedKeys: (selectedKeys: React.Key[]) => void;
      selectedKeys: React.Key[];
      confirm: () => void;
      clearFilters?: () => void;
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Tìm theo ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => confirm()}
          style={{ marginBottom: 8, display: "block" }}
        />
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Tìm
          </Button>
          <Button
            onClick={() => {
              clearFilters?.();
              confirm();
            }}
            size="small"
            style={{ width: 90 }}
          >
            Xóa
          </Button>
        </div>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      (record.dat_ve?.lich_chieu?.phim?.ten_phim || "")
        .toLowerCase()
        .includes((value as string).toLowerCase()),
  });

  const filteredData = donVe.filter((item: any) => {
    const searchContent = [item.ma_giao_dich].join(" ").toLowerCase();

    return searchContent.includes(searchText.toLowerCase());
  });

  const renderPaymentMethod = (method: string) => {
    const color =
      method === "Tiền mặt"
        ? "blue"
        : method === "Chuyển khoản"
        ? "green"
        : method === "Ví điện tử"
        ? "orange"
        : "default";
    return <Tag color={color}>{method || "—"}</Tag>;
  };

  const columns = [
    {
      title: "#",
      render: (_: any, __: any, index: number) => index + 1,
      width: 60,
      align: "center" as const,
    },
    {
      title: "Mã ĐH",
      width: 120,
      render: (r: any) => (
        <div>
          <div style={{ fontWeight: 500 }}>{r.ma_giao_dich || "—"}</div>
        </div>
      ),
      sorter: (a: any, b: any) =>
        (a.ma_giao_dich || "").localeCompare(b.ma_giao_dich || ""),
    },
    {
      title: "Email",
      render: (r: any) => <div>{r.nguoi_dung?.email || "—"}</div>,
      width: 200,
    },
    {
      title: "Phim",
      render: (r: any) => (
        <div style={{ fontWeight: 500 }}>
          {r.dat_ve?.lich_chieu?.phim?.ten_phim || "—"}
        </div>
      ),
      ...getColumnSearchProps("phim"),
      width: 250,
    },
    {
      title: "Rạp",
      render: (r: any) =>
        r.dat_ve?.lich_chieu?.phong_chieu?.rap.ten_rap || "CGV Vincom",
      width: 150,
    },
    {
      title: "Ngày đặt",
      dataIndex: "created_at",
      width: 160,
      render: (text: string) => dayjs(text).format("DD/MM/YYYY"),
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }: {
        setSelectedKeys: (selectedKeys: React.Key[]) => void;
        selectedKeys: React.Key[];
        confirm: (param?: { closeDropdown: boolean }) => void;
        clearFilters?: () => void;
      }) => (
        <div style={{ padding: 8 }}>
          <DatePicker
            value={selectedKeys[0] ? dayjs(String(selectedKeys[0])) : null}
            onChange={(date) => {
              setSelectedKeys(date ? [date.format("YYYY-MM-DD")] : []);
              confirm({ closeDropdown: true });
            }}
            style={{ width: 188 }}
          />
          <div
            style={{
              marginTop: 8,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button
              onClick={() => {
                clearFilters?.();
                confirm();
              }}
              size="small"
              style={{ width: 88 }}
            >
              Xoá lọc
            </Button>
            <Button
              type="primary"
              onClick={() => confirm()}
              size="small"
              style={{ width: 88 }}
            >
              Lọc
            </Button>
          </div>
        </div>
      ),
      filterIcon: (filtered: boolean) => (
        <span style={{ color: filtered ? "#1890ff" : undefined }}>📅</span>
      ),
      onFilter: (value: any, record: any) => {
        const recordDate = dayjs(record.created_at).format("YYYY-MM-DD");
        return recordDate === value;
      },
    },
    {
      title: "Thanh toán",
      render: (r: any) => renderPaymentMethod(r.phuong_thuc?.ten),
      width: 120,
    },
    {
      title: "Tổng tiền",
      render: (r: any) => (
        <Text strong style={{ color: "#1890ff" }}>
          {Number(r.dat_ve?.tong_tien || 0).toLocaleString()} đ
        </Text>
      ),
      align: "right" as const,
      width: 150,
      sorter: (a: any, b: any) =>
        (a.dat_ve?.tong_tien || 0) - (b.dat_ve?.tong_tien || 0),
    },
    {
      title: "Thao tác",
      render: (_: any, record: any) => (
        <Button
          type="primary"
          icon={<FileSearchOutlined />}
          onClick={() => navigate(`/admin/don-ve/${record.id}`)}
          size="small"
        >
          Chi tiết
        </Button>
      ),
      width: 120,
      align: "center" as const,
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Card
        style={{ minHeight: "70vh" }}
        bordered={false}
        title={
          <Title level={4} style={{ margin: 0 }}>
            Quản lý đơn vé
          </Title>
        }
        extra={
          <Space>
            <QRCodeScanner />
            <Input
              placeholder="Mã đơn hàng...."
              prefix={<SearchOutlined />}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
              allowClear
            />
            <Dropdown menu={{ items: exportMenuItems }} placement="bottomRight">
              <Button type="default" icon={<DownloadOutlined />}>
                Xuất dữ liệu
              </Button>
            </Dropdown>
            <Button type="primary" onClick={fetchDonVe}>
              Làm mới
            </Button>
          </Space>
        }
      >
        <Table
          rowKey="id"
          dataSource={filteredData}
          columns={columns}
          loading={loading}
          bordered
          size="middle"
          scroll={{ x: "1200px" }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng cộng ${total} đơn vé`,
            pageSizeOptions: ["10", "20", "50", "100"],
          }}
        />
        <Modal
          title="Chọn khoảng thời gian xuất Excel"
          open={open}
          onOk={() => {
            const from = date?.[0] || null;
            const to = date?.[1] || null;
            exportToExcel(from, to);
            setOpen(false);
          }}
          onCancel={() => setOpen(false)}
        >
          <RangePicker
            onChange={(dates) => setDate(dates)}
            style={{ width: "100%" }}
          />
        </Modal>
        <Modal
          title="Chọn khoảng thời gian xuất Pdf"
          open={openPdf}
          onOk={() => {
            const from = date?.[0] || null;
            const to = date?.[1] || null;
            exportToPDF(from, to);
            setOpenPdf(false);
          }}
          onCancel={() => setOpenPdf(false)}
        >
          <RangePicker
            onChange={(dates) => setDate(dates)}
            style={{ width: "100%" }}
          />
        </Modal>
      </Card>
    </div>
  );
}

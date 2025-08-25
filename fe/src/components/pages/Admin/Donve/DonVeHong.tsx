import { useEffect, useRef, useState } from "react";
import {
  Table,
  Button,
  message,
  Card,
  Tag,
  Space,
  Typography,
  Input,

  InputRef,
} from "antd";
import type { ColumnType } from "antd/es/table";
import { getListDonVeHong } from "../../../provider/duProvider";
import { useNavigate } from "react-router-dom";
import {
  SearchOutlined,
  FileSearchOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { DatePicker } from "antd";
import QRCodeScanner from "./QuetQR";

import "./DonVeStyle.css";

const { Title, Text } = Typography;

export default function DonVeListHong() {
  const [donVe, setDonVe] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchDonVe();
  }, []);

  const fetchDonVe = async () => {
    setLoading(true);
    try {
      const res = await getListDonVeHong();
      setDonVe(res);
    } catch (err) {
      message.error("Lỗi khi tải danh sách đơn vé");
    } finally {
      setLoading(false);
    }
  };
  const searchInput = useRef<InputRef>(null);

console.log(fetchDonVe);


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
      render: (r: any) => <div>{r?.email || "—"}</div>,
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
      width: 150,
      render: (r: any) => r.dat_ve?.lich_chieu?.phong_chieu?.rap.ten_rap || "",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys = [],
        confirm,
        clearFilters,
      }: {
        setSelectedKeys: (selectedKeys: React.Key[]) => void;
        selectedKeys: React.Key[];
        confirm: (param?: { closeDropdown: boolean }) => void;
        clearFilters?: () => void;
      }) => (
        <div
          style={{
            padding: 8,
            background: "#fff",
            borderRadius: 6,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          <Input
            ref={searchInput}
            placeholder="Nhập tên rạp"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm?.()}
            style={{ marginBottom: 8, display: "block" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              size="small"
              onClick={() => confirm?.()}
              style={{ width: 90 }}
            >
              Tìm
            </Button>
            <Button
              size="small"
              onClick={() => clearFilters?.()}
              style={{ width: 90 }}
            >
              Xóa
            </Button>
          </div>
        </div>
      ),
      onFilter: (value:any, record:any) =>
        record.dat_ve?.lich_chieu?.phong_chieu?.rap.ten_rap
          ?.toLowerCase()
          .includes((value as string).toLowerCase()),
      filterIcon: (filtered:any) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
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
          onClick={() => navigate(`/admin/don-ve-hong/${record.id}`)}
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
            Quản lý vé có ghế hỏng
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
    

      </Card>
    </div>
  );
}

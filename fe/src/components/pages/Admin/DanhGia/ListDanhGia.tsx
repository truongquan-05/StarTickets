import React, { useEffect, useState } from "react";
import {
  Table,
  // Typography,
  Space,
  Rate,
  Button,
  Modal,
  Select,
  Card,
} from "antd";
import axios from "axios";
import type { ColumnsType } from "antd/es/table";
import { FilterOutlined, SearchOutlined } from "@ant-design/icons";

// const { Title } = Typography;
const { Option } = Select;

interface NguoiDung {
  id: number;
  ten: string;
  email: string;
}

interface Phim {
  id: number;
  ten_phim: string;
  anh_poster: string | null;
}

interface DanhGia {
  id: number;
  nguoi_dung_id: number;
  phim_id: number;
  so_sao: number;
  noi_dung: string;
  created_at: string | null;
  nguoi_dung: NguoiDung;
  phim: Phim;
}

const ListDanhGia: React.FC = () => {
  const [data, setData] = useState<DanhGia[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDanhGia, setSelectedDanhGia] = useState<DanhGia | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [soSaoFilter, setSoSaoFilter] = useState<number | null>(null);
  const [phimOptions, setPhimOptions] = useState<Phim[]>([]);
  const [selectedPhimId, setSelectedPhimId] = useState<number | null>(null);

  useEffect(() => {
    fetchDanhGia();
    fetchPhimList();
  }, []);

  const fetchDanhGia = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://127.0.0.1:8000/api/admin/danh-gia",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setData(response.data.data);
    } catch (error) {
      console.error("Lỗi khi tải đánh giá:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPhimList = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/phim", {});
      setPhimOptions(response.data.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách phim:", error);
    }
  };
  const handleViewDetail = (record: DanhGia) => {
    setSelectedDanhGia(record);
    setModalVisible(true);
  };

  const filteredData = data.filter((item) => {
    if (soSaoFilter !== null && item.so_sao !== soSaoFilter) return false;
    if (selectedPhimId !== null && item.phim.id !== selectedPhimId)
      return false;
    return true;
  });

  const columns: ColumnsType<DanhGia> = [
    {
      title: "Mã",
      dataIndex: "id",
      key: "id",
      width: 80,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Tài khoản đánh giá",
      dataIndex: "nguoi_dung",
      key: "nguoi_dung",
      width: 280,
      render: (nguoi_dung: NguoiDung) => (
        <Space direction="vertical" size={0}>
          <strong>{nguoi_dung.ten}</strong>
          <span style={{ fontSize: 12, color: "#999" }}>
            {nguoi_dung.email}
          </span>
        </Space>
      ),
    },
    {
      title: "Phim được đánh giá",
      width: 280,
      dataIndex: "phim",
      key: "phim",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Select
            showSearch
            placeholder="Chọn hoặc nhập tên phim"
            style={{ width: 200 }}
            value={selectedKeys[0]}
            onChange={(value) => setSelectedKeys(value ? [value] : [])}
            filterOption={(input, option) =>
              option
                ? option.label.toLowerCase().includes(input.toLowerCase())
                : false
            }
            options={phimOptions.map((phim) => ({
              label: phim.ten_phim,
              value: phim.id,
            }))}
            allowClear
          />
          <div style={{ marginTop: 8, textAlign: "right" }}>
            <Button
              type="primary"
              size="small"
              style={{ marginRight: 8 }}
              onClick={() => confirm()}
            >
              Lọc
            </Button>
            <Button
              size="small"
              onClick={() => {
                clearFilters?.();
                confirm();
              }}
            >
              Xóa
            </Button>
          </div>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      onFilter: (value, record) => record.phim?.id === value,
      render: (phim: Phim) => (
        <Space>
          <span style={{ fontWeight: 500 }}>{phim?.ten_phim || "—"}</span>
        </Space>
      ),
    },
    {
      title: "Số sao",
      dataIndex: "so_sao",
      key: "so_sao",
      width: 160,
      render: (so_sao: number) => <Rate disabled defaultValue={so_sao} />,
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Select
            placeholder="Chọn sao"
            style={{ width: 120 }}
            value={selectedKeys[0]}
            onChange={(value) => setSelectedKeys(value ? [value] : [])}
            allowClear
          >
            {[1, 2, 3, 4, 5].map((sao) => (
              <Option key={sao} value={sao}>
                {sao} sao
              </Option>
            ))}
          </Select>
          <div style={{ marginTop: 8, textAlign: "right" }}>
            <Button
              type="primary"
              size="small"
              style={{ marginRight: 8 }}
              onClick={() => confirm()}
            >
              Lọc
            </Button>
            <Button
              size="small"
              onClick={() => {
                clearFilters?.();
                confirm();
              }}
            >
              Xóa
            </Button>
          </div>
        </div>
      ),

      filterIcon: (filtered) => (
        <FilterOutlined  style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      onFilter: (value, record) => record.so_sao === value,
    },
    {
      title: "Nội dung",
      width: 300,
      dataIndex: "noi_dung",
      key: "noi_dung",
      render: (text: string) => (
        <div
          style={{
            maxWidth: 300,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={text}
        >
          {text}
        </div>
      ),
    },

    {
      title: "Hành động",
      key: "actions",
      render: (_: any, record: DanhGia) => (
        <Button type="link" onClick={() => handleViewDetail(record)}>
          Xem chi tiết
        </Button>
      ),
      width: 120,
    },
  ];

  return (
    <Card
      title="Danh sách đánh giá"
      bordered={true}
      style={{
        margin: 10,
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        background: "#fff",
        height: "95%",
      }}
    >
      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={filteredData}
        pagination={false}
        bordered
      />

      <Modal
        title="Chi tiết đánh giá"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        {selectedDanhGia && (
          <div>
            <p>
              <strong>Mã:</strong> {selectedDanhGia.id}
            </p>
            <p>
              <strong>Người dùng:</strong> {selectedDanhGia.nguoi_dung.ten}
            </p>
            <p>
              <strong>Email:</strong> {selectedDanhGia.nguoi_dung.email}
            </p>
            <p>
              <strong>Phim:</strong> {selectedDanhGia.phim.ten_phim}
            </p>
            <p>
              <strong>Số sao:</strong>{" "}
              <Rate disabled defaultValue={selectedDanhGia.so_sao} />
            </p>
            <p>
              <strong>Nội dung:</strong> {selectedDanhGia.noi_dung}
            </p>
            <p>
              <strong>Thời gian đánh giá:</strong>{" "}
              {selectedDanhGia.created_at || "Không có"}
            </p>
          </div>
        )}
      </Modal>
    </Card>
  );
};

export default ListDanhGia;

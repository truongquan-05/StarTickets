import React, { useEffect, useState } from 'react';
import {
  Table,
  Typography,
  Space,
  Rate,
  Button,
  Modal,
  Select,
  Image,
  Card,
} from 'antd';
import axios from 'axios';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;
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
      const response = await axios.get('http://127.0.0.1:8000/api/admin/danh-gia', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setData(response.data.data);
    } catch (error) {
      console.error('Lỗi khi tải đánh giá:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPhimList = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/phim', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setPhimOptions(response.data.data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách phim:', error);
    }
  };

  const handleViewDetail = (record: DanhGia) => {
    setSelectedDanhGia(record);
    setModalVisible(true);
  };

  const filteredData = data.filter((item) => {
    if (soSaoFilter !== null && item.so_sao !== soSaoFilter) return false;
    if (selectedPhimId !== null && item.phim.id !== selectedPhimId) return false;
    return true;
  });

  const columns: ColumnsType<DanhGia> = [
    {
      title: 'Mã',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Tài khoản đánh giá',
      dataIndex: 'nguoi_dung',
      key: 'nguoi_dung',
      render: (nguoi_dung: NguoiDung) => (
        <Space direction="vertical" size={0}>
          <strong>{nguoi_dung.ten}</strong>
          <span style={{ fontSize: 12, color: '#999' }}>{nguoi_dung.email}</span>
        </Space>
      ),
    },
    {
      title: (
        <Space direction="vertical">
          <span>Phim được đánh giá</span>
          <Select
            placeholder="Chọn phim"
            allowClear
            size="small"
            style={{ width: '100%' }}
            onChange={(value) => setSelectedPhimId(value)}
          >
            {phimOptions.map((phim) => (
              <Option key={phim.id} value={phim.id}>
                {phim.ten_phim}
              </Option>
            ))}
          </Select>
        </Space>
      ),
      dataIndex: 'phim',
      key: 'phim',
      render: (phim: Phim) => (
        <Space>
          {phim.anh_poster && (
            <Image
              src={phim.anh_poster}
              alt={phim.ten_phim}
              width={40}
              height={60}
              style={{ objectFit: 'cover', borderRadius: 4 }}
              preview={false}
            />
          )}
          <span>{phim.ten_phim}</span>
        </Space>
      ),
    },
    {
      title: (
        <Space direction="vertical">
          <span>Số sao</span>
          <Select
            placeholder="Chọn sao"
            allowClear
            size="small"
            style={{ width: '100%' }}
            onChange={(value) => setSoSaoFilter(value)}
          >
            {[1, 2, 3, 4, 5].map((sao) => (
              <Option key={sao} value={sao}>
                {sao} sao
              </Option>
            ))}
          </Select>
        </Space>
      ),
      dataIndex: 'so_sao',
      key: 'so_sao',
      render: (so_sao: number) => <Rate disabled defaultValue={so_sao} />,
      width: 160,
    },
    {
  title: 'Nội dung',
  dataIndex: 'noi_dung',
  key: 'noi_dung',
  render: (text: string) => (
    <div
      style={{
        maxWidth: 300,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
      title={text}
    >
      {text}
    </div>
  ),
},

    {
      title: 'Hành động',
      key: 'actions',
      render: (_: any, record: DanhGia) => (
        <Button type="link" onClick={() => handleViewDetail(record)}>
          Xem chi tiết
        </Button>
      ),
      width: 120,
    },
  ];

  return (
      <Card title="Danh sách rạp" bordered={true} style={{ margin: 10, boxShadow: '0 4px 8px rgba(0,0,0,0.1)',background: "#fff", height: "95%"  }}>
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
            <p><strong>Mã:</strong> {selectedDanhGia.id}</p>
            <p><strong>Người dùng:</strong> {selectedDanhGia.nguoi_dung.ten}</p>
            <p><strong>Email:</strong> {selectedDanhGia.nguoi_dung.email}</p>
            <p><strong>Phim:</strong> {selectedDanhGia.phim.ten_phim}</p>
            <p><strong>Số sao:</strong> <Rate disabled defaultValue={selectedDanhGia.so_sao} /></p>
            <p><strong>Nội dung:</strong> {selectedDanhGia.noi_dung}</p>
            <p><strong>Thời gian đánh giá:</strong> {selectedDanhGia.created_at || 'Không có'}</p>
          </div>
        )}
      </Modal>
      </Card>
  );
};

export default ListDanhGia;

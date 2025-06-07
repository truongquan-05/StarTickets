import { useEffect, useState } from "react";
import { Table, Button, Space, Popconfirm, Input, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

const LichChieu = () => {
  const [genres, setGenres] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showDeleted, setShowDeleted] = useState(false);

  // Fetch genres
  const fetchGenres = async () => {
    const res = await axios.get("http://127.0.0.1:8000/api/the_loai");
    const allGenres = res.data.data;
    const filtered = showDeleted
      ? allGenres.filter((g: any) => g.isDeleted)
      : allGenres.filter((g: any) => !g.isDeleted);
    setGenres(filtered);
  };

  useEffect(() => {
    fetchGenres();
  }, [showDeleted]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      message.warning("Tên thể loại không được để trống!");
      return;
    }

    if (editingId !== null) {
      await axios.put(`http://127.0.0.1:8000/api/the_loai/${editingId}`, { ten_the_loai:name });
      message.success("Cập nhật thành công!");
    } else {
      await axios.post("http://127.0.0.1:8000/api/the_loai", {
        ten_the_loai : name,
        isDeleted: false,
      });
      message.success("Thêm thể loại thành công!");
    }

    setName("");
    setEditingId(null);
    fetchGenres();
  };

  const handleEdit = (genre: any) => {
    setEditingId(genre.id);
    setName(genre.ten_the_loai);
  };

  const handleDelete = async (id: number) => {
  try {
    await axios.delete(`http://127.0.0.1:8000/api/the_loai/soft-delete/${id}`);
    message.success("Xóa mềm thành công!");
    fetchGenres();
  } catch (err: any) {
    console.error("Lỗi xóa mềm:", err.response?.data || err.message);
    message.error("Xóa mềm thất bại!");
  }
};


  const handleRestore = async (id: number) => {
  try {
    await axios.post(`http://127.0.0.1:8000/api/the_loai/restore/${id}`);
    message.success("Khôi phục thành công!");
    fetchGenres();
  } catch (err: any) {
    console.error("Lỗi khôi phục:", err.response?.data || err.message);
    message.error("Khôi phục thất bại!");
  }
};


  const handlePermanentDelete = async (id: number) => {
  try {
    await axios.delete(`http://127.0.0.1:8000/api/the_loai/delete/${id}`);
    message.success("Đã xóa vĩnh viễn!");
    fetchGenres();
  } catch (err: any) {
    console.error("Lỗi xóa vĩnh viễn:", err.response?.data || err.message);
    message.error("Xóa thất bại!");
  }
};


  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên thể loại",
      dataIndex: "ten_the_loai",
      key: "name",
    },
    {
      title: "Hành động",
      key: "action",
      align: "center" as const,
      render: (_: any, record: any) => (
        <Space>
          {!record.isDeleted ? (
            <>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
              />
              <Popconfirm
                title="Bạn chắc chắn muốn xóa?"
                okText="Yes"
                cancelText="No"
                onConfirm={() => handleDelete(record.id)}
              >
                <Button danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </>
          ) : (
            <>
              <Button type="dashed" onClick={() => handleRestore(record.id)}>
                Khôi phục
              </Button>
              <Popconfirm
                title="Xóa vĩnh viễn bản ghi này?"
                okText="Xóa"
                cancelText="Hủy"
                onConfirm={() => handlePermanentDelete(record.id)}
              >
                <Button danger>Xóa</Button>
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>{editingId !== null ? "Sửa thể loại" : "Thêm thể loại"}</h2>
      <Space>
        <Input
          placeholder="Tên thể loại"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button type="primary" onClick={handleSubmit}>
          {editingId !== null ? "Cập nhật" : "Thêm mới"}
        </Button>
        {editingId !== null && (
          <Button onClick={() => { setEditingId(null); setName(""); }}>
            Hủy
          </Button>
        )}
      </Space>

      <Space style={{ marginTop: 16, marginLeft: 30 }}>
        <label>
          <input
            type="checkbox"
            checked={showDeleted}
            onChange={(e) => setShowDeleted(e.target.checked)}
          />
          {" "}Hiển thị thể loại đã xóa
        </label>
      </Space>

      <div style={{ marginTop: 24 }}>
        <Table
          rowKey="id"
          dataSource={genres}
          columns={columns}
          bordered
          pagination={{ pageSize: 5 }}
          locale={{ emptyText: "Không có thể loại nào." }}
        />
      </div>
    </div>
  );
};

export default LichChieu;

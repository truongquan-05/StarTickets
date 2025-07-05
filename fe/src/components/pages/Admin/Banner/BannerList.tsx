// pages/Admin/Banner/BannerList.tsx
import { useEffect, useState } from "react";
import { Table, Switch, Button, Modal, message } from "antd";
import { useNavigate } from "react-router-dom";
import {
  getListBanners,
  getDeleteBanner,
  getToggleBanner,
} from "../../../provider/duProvider";

export default function BannerList() {
  const [banners, setBanners] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const data = await getListBanners({});
    setBanners(data);
  };

  const handleToggle = async (id: number) => {
    await getToggleBanner({ id });
    fetchData();
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: "Xác nhận xoá banner?",
      onOk: async () => {
        await getDeleteBanner({ id });
        message.success("Đã xoá banner");
        fetchData();
      },
    });
  };

  const columns = [
    {
      title: "#",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Hình ảnh",
      dataIndex: "images",
      render: (imgs: string[]) => (
        <div style={{ display: "flex", gap: 8 }}>
          {imgs.map((img, i) => (
            <img
              key={i}
              src={img}
              alt="banner"
              style={{ width: 100, height: 60, objectFit: "cover" }}
            />
          ))}
        </div>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "mo_ta",
    },
    {
      title: "Hoạt động",
      dataIndex: "is_active",
      render: (val: boolean, record: any) => (
        <Switch checked={val} onChange={() => handleToggle(record.id)} />
      ),
    },
    {
      title: "Action",
      render: (_: any, record: any) => (
        <Button danger onClick={() => handleDelete(record.id)}>
          Xoá
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h2>Danh sách banner</h2>
      <Button
        type="primary"
        onClick={() => navigate("/admin/banner/create")}
        style={{ marginBottom: 16 }}
      >
        + Tạo slide show
      </Button>
      <Table columns={columns} dataSource={banners} rowKey="id" />
    </div>
  );
}

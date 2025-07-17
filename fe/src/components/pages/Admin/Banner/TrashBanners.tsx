import { useEffect, useState } from "react";
import {
  Table,
  Button,
  message,
  Popconfirm,
  Card,
  Space,
  Tag,
  Typography,
} from "antd";
import {
  getListTrashBanners,
  restoreBanner,
  forceDeleteBanner,
} from "../../../provider/duProvider";
import moment from "moment";

const TrashBanners = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getListTrashBanners();
      setData(res.data);
    } catch (err) {
      message.error("Lỗi khi tải danh sách banner đã xoá");
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id: number) => {
    try {
      await restoreBanner(id);
      message.success("Khôi phục thành công");
      fetchData();
    } catch {
      message.error("Khôi phục thất bại");
    }
  };

  const handleForceDelete = async (id: number) => {
    try {
      await forceDeleteBanner(id);
      message.success("Xoá vĩnh viễn thành công");
      fetchData();
    } catch {
      message.error("Xoá vĩnh viễn thất bại");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 70,
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
    },
    {
      title: "Link",
      dataIndex: "link_url",
      render: (text: string) => (
        <Typography.Link href={text} target="_blank">
          {text}
        </Typography.Link>
      ),
    },
    {
      title: "Ngày hiển thị",
      render: (record: any) =>
        `${moment(record.start_date).format("DD/MM/YYYY")} - ${moment(
          record.end_date
        ).format("DD/MM/YYYY")}`,
    },
    {
      title: "Trạng thái",
      dataIndex: "is_active",
      render: (val: boolean) =>
        val ? <Tag color="green">Hoạt động</Tag> : <Tag color="red">Ẩn</Tag>,
    },
    {
      title: "Thao tác",
      render: (_: any, record: any) => (
        <Space>
          <Button onClick={() => handleRestore(record.id)}>Khôi phục</Button>
          <Popconfirm
            title="Bạn có chắc muốn xoá vĩnh viễn?"
            onConfirm={() => handleForceDelete(record.id)}
            okText="Xoá"
            cancelText="Huỷ"
          >
            <Button danger>Xoá vĩnh viễn</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Danh sách Banner đã xoá">
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{ pageSize: 5 }}
      />
    </Card>
  );
};

export default TrashBanners;

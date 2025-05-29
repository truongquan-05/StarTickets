import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  message,
  Space,
  Button,
  Popconfirm,
  Table,
} from "antd";
import { Link } from "react-router-dom";
import { useDeleteCinema, useListCinema } from "../../hook/cinema";

const ListCinema = () => {
  const { data, isLoading } = useListCinema({ resource: "cinemas" });
  const { mutate } = useDeleteCinema({ resource: "cinemas" });

  const columns = [
    {
      title: "Mã rạp",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên rạp",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center" as const,
      render: (_: any, record: any) => (
        <Space>
          <Link to={`/cinemas/edit/${record.id}`}>
            <Button type="primary" icon={<EditOutlined />} />
          </Link>
          <Popconfirm
            title="Bạn có chắc muốn xóa rạp này không?"
            okText="Đồng ý"
            cancelText="Hủy"
            onConfirm={() => {
              mutate(record.id);
              message.success("Đã xóa rạp: " + record.name);
            }}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      dataSource={data}
      columns={columns}
      loading={isLoading}
      bordered
      pagination={{ pageSize: 12 }}
      locale={{ emptyText: "Không tìm thấy rạp chiếu nào." }}
    />
  );
};

export default ListCinema;


import { Link, useNavigate } from "react-router-dom";
import { useDelete, useList } from "../../hook";
import { Button, Popconfirm, Space, Table } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

interface Genre {
  id: number;
  name: string;
}

const List = () => {
  const navigate = useNavigate();
  const genres = useList({
    resource: "genres",
  }).data;

  const deleteTest = useDelete({
    resource: "genres",
  });

  const handleDelete = async (id: number) => {
    deleteTest.mutate(id);
  };
  const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'name',
    dataIndex: 'name',
    key: 'name',
  },
      {
      title: "Action",
      key: "action",
      align: "center" as const, // dùng 'as const' để tránh lỗi kiểu align
      render: (_: any, record: any) => {
        return (
          <Space>
            <Link to={`/movies/genres/edit/${record.id}`}>
              <Button type="primary" icon={<EditOutlined />} />
            </Link>
            <Popconfirm
              title="Are you sure to delete this genre?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => {
                handleDelete(record.id);
                
              }}
            >
              <Button danger icon={<DeleteOutlined />}>
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
];
return (
    <Table
      rowKey="id"
      dataSource={genres}
      columns={columns}
      bordered
      pagination={{ pageSize: 5 }}
      locale={{ emptyText: "No products found." }}
    />
  );

};


export default List;

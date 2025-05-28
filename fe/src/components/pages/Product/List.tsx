import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  message,
  Typography,
  Space,
  Button,
  Popconfirm,
  Table,
  Image,
} from "antd";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDelete, useList } from "../../hook";
const List = () => {
  const { data, isLoading } = useList({ resource: "movies" });
  const {mutate} = useDelete({
    resource:"movies"
  })
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Poster",
      dataIndex: "poster",
      key: "poster",
      render: (src: any) => <Image src={src} width={80} height={80} />,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "Genre",
      dataIndex: "genre",
      key: "genre",
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
    },
    {
      title: "Action",
      key: "action",
      align: "center" as const, // dùng 'as const' để tránh lỗi kiểu align
      render: (_: any, record: any) => {
        return (
          <Space>
            <Link to={`/movies/edit/${record.id}`}>
              <Button type="primary" icon={<EditOutlined />} />
            </Link>
            <Popconfirm
              title="Are you sure to delete this movie?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => {
                mutate(record.id);
                message.success("Deleted movie : " + record.title);
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
      dataSource={data}
      columns={columns}
      loading={isLoading}
      bordered
      pagination={{ pageSize: 5 }}
      locale={{ emptyText: "No products found." }}
    />
  );
};

export default List;

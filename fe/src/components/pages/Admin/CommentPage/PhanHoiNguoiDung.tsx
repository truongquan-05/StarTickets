import React from "react";
import {
  useListPhanHoiNguoiDung,
  useUpdatePhanHoiNguoiDung,
} from "../../../hook/hungHook";
import {
  Table,
  Card,
  Button,
  message,
  Space,
} from "antd";
import {
  CheckOutlined,
  CheckCircleTwoTone,
  CloseCircleTwoTone,
} from "@ant-design/icons";

const PhanHoiNguoiDung = () => {
  const { data, refetch } = useListPhanHoiNguoiDung({ resource: "phan_hoi" });
  const dataSource = data?.data || [];

  const { mutate: updatePhanHoiNguoiDung } = useUpdatePhanHoiNguoiDung({
    resource: "phan_hoi",
  });

  // 👉 Hàm xử lý đánh dấu đã đọc
  const handleMarkAsRead = (record: any) => {
    updatePhanHoiNguoiDung(
      {
        id: record.id,
        values: { ...record, trang_thai: true },
      },
      {
        onSuccess: () => {
          message.success("Đã đánh dấu là đã đọc");
          refetch?.(); // làm mới lại bảng
        },
        onError: () => {
          message.error("Đánh dấu thất bại");
        },
      }
    );
  };

  const columns = [
    {
      title: "Họ Tên",
      dataIndex: "ho_ten",
      key: "ho_ten",
      align: "center" as const,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center" as const,
    },
    {
      title: "Số Điện Thoại",
      dataIndex: "so_dien_thoai",
      key: "so_dien_thoai",
      align: "center" as const,
    },
    {
      title: "Nội Dung",
      dataIndex: "noi_dung",
      key: "noi_dung",
      align: "center" as const,
    },
    {
      title: "Trạng Thái",
      dataIndex: "trang_thai",
      key: "trang_thai",
      align: "center" as const,
      render: (trang_thai: boolean) =>
        trang_thai ? (
          <span style={{ color: "green", fontWeight: 600 }}>
            <CheckCircleTwoTone twoToneColor="#52c41a" /> Đã đọc
          </span>
        ) : (
          <span style={{ color: "red", fontWeight: 600 }}>
            <CloseCircleTwoTone twoToneColor="#f5222d" /> Chưa đọc
          </span>
        ),
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center" as const,
      render: (_: any, record: any) =>
        !record.trang_thai && (
          <Space size="middle">
            <Button
              type="primary"
              shape="round"
              icon={<CheckOutlined />}
              title="Đánh dấu đã đọc"
              onClick={() => handleMarkAsRead(record)}
            >
              Đã đọc
            </Button>
          </Space>
        ),
    },
  ];

  // Style nội trang
  const styles = {
    card: {
      margin: "20px",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    },
    tableHeader: {
      backgroundColor: "#001529",
      color: "#fff",
      fontWeight: "600",
      textAlign: "center",
    },
    tableCell: {
      textAlign: "center",
      fontSize: "15px",
      padding: "12px 8px",
    },
  };

  const tableComponents = {
    header: {
      cell: (props: any) => (
        <th {...props} style={{ ...styles.tableHeader, ...props.style }}>
          {props.children}
        </th>
      ),
    },
    body: {
      cell: (props: any) => (
        <td {...props} style={{ ...styles.tableCell, ...props.style }}>
          {props.children}
        </td>
      ),
    },
  };

  return (
    <Card title="Phản Hồi Người Dùng" style={styles.card}>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey="id"
        bordered
        pagination={{ pageSize: 10 }}
        components={tableComponents}
      />
    </Card>
  );
};

export default PhanHoiNguoiDung;

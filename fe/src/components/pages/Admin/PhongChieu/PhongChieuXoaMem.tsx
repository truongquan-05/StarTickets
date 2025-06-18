import React, { useMemo } from "react";
import { Table, Button, Space, message, Popconfirm } from "antd";
import type { ColumnsType } from "antd/es/table";
import { IPhongChieu } from "../interface/phongchieu";
import {
  useListTrashPhongChieu,
  useRestorePhongChieu,
  useDestroyPhongChieu,
} from "../../../hook/hungHook";
import { useQuery } from "@tanstack/react-query";
import { getListCinemas } from "../../../provider/hungProvider";
import { ReloadOutlined } from "@ant-design/icons";

interface IRap {
  id: number;
  ten_rap: string;
}

const PhongChieuXoaMem = () => {
  const { data: trashDataRaw, isLoading } = useListTrashPhongChieu({
    resource: "phong_chieu",
  });

  const { mutate: restorePhongChieu } = useRestorePhongChieu({
    resource: "phong_chieu",
  });

  const { mutate: destroyPhongChieu } = useDestroyPhongChieu({
    resource: "phong_chieu",
  });

  const phongChieuData = Array.isArray(trashDataRaw?.data)
    ? trashDataRaw.data
    : [];

  const { data: rapDataRaw } = useQuery({
    queryKey: ["rap"],
    queryFn: () =>
      getListCinemas({ resource: "rap" }).then((res) => res.data),
  });

  const rapData = Array.isArray(rapDataRaw) ? rapDataRaw : [];

  const rapMap = useMemo(() => {
    const map = new Map<number, string>();
    rapData.forEach((r: IRap) => map.set(r.id, r.ten_rap));
    return map;
  }, [rapData]);

  const columns: ColumnsType<IPhongChieu> = [
    {
      title: "STT",
      key: "index",
      render: (_text, _record, index) => index + 1,
      width: 60,
      align: "center",
    },
    {
      title: "Tên Rạp",
      dataIndex: "rap_id",
      key: "rap_id",
      align: "center",
      render: (rap_id: number) => rapMap.get(rap_id) || "",
    },
    {
      title: "Tên Phòng",
      dataIndex: "ten_phong",
      key: "ten_phong",
    },
    {
      title: "Hàng Thường",
      dataIndex: "hang_thuong",
      key: "hang_thuong",
      align: "center",
    },
    {
      title: "Hàng VIP",
      dataIndex: "hang_vip",
      key: "hang_vip",
      align: "center",
    },
    {
      title: "Hàng Đôi",
      dataIndex: "hang_doi",
      key: "hang_doi",
      align: "center",
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      render: (_text, record) => (
        <Space>
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={() =>
              restorePhongChieu(record.id, {
                onSuccess: () => {
                  message.success("Khôi phục thành công!");
                },
                onError: () => {
                  message.error("Khôi phục thất bại!");
                },
              })
            }
          >
            Khôi phục
          </Button>

          <Popconfirm
            title="Bạn có chắc muốn xoá vĩnh viễn phòng chiếu này không?"
            okText="Xoá vĩnh viễn"
            cancelText="Huỷ"
            onConfirm={() =>
              destroyPhongChieu(record.id, {
                onSuccess: () => {
                  message.success("Xoá vĩnh viễn thành công!");
                },
                onError: () => {
                  message.error("Xoá thất bại!");
                },
              })
            }
          >
            <Button danger>Xoá vĩnh viễn</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ marginBottom: 16 }}>Danh sách phòng chiếu đã xoá </h2>
      <Table
        dataSource={phongChieuData}
        columns={columns}
        rowKey={(record) => record.id}
        loading={isLoading}
        pagination={{ pageSize: 10 }}
        bordered
      />
    </div>
  );
};

export default PhongChieuXoaMem;

import {
  Card,
  Table,
  Typography,
  Button,
  Space,
  Popconfirm,
  message,
  Image,
  Tag,
  Modal,
} from "antd";
import {
  ReloadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import { useDeleteForeverMovie, useListTrashMovies, useRestoreMovies, useSoftDeleteMovies } from "../../../hook/hungHook";
import { IMovies } from "../interface/movies";
import moment from "moment";
import { Link } from "react-router-dom";

const { Text, Title } = Typography;

const TrashMovies = () => {
  const BASE_URL = "http://127.0.0.1:8000";

  const { data, isLoading, refetch } = useListTrashMovies({ resource: "phim" });
  const dataSource: IMovies[] = data?.data || [];

  const { mutate: restoreMovie } = useRestoreMovies({ resource: "phim" });
  const { mutate: softDeleteMovie } = useSoftDeleteMovies({ resource: "phim" });
  const { mutate: deleteForever } = useDeleteForeverMovie({ resource: "phim" });

  const handleRestore = (id: number) => {
    restoreMovie(id, {
      onError: () => {
        message.error("Khôi phục thất bại");
      },
    });
  };

  const handleSoftDelete = (id: number) => {
    softDeleteMovie(id, {
      onSuccess: () => {
        message.success("Xóa vĩnh viễn phim thành công");
        refetch();
      },
      onError: () => {
        message.error("Xóa thất bại");
      },
    });
  };

  const columns = [
    {
      title: "#ID",
      dataIndex: "id",
      key: "id",
      width: 70,
      sorter: (a: IMovies, b: IMovies) => a.id - b.id,
      fixed: "left",
    },
    {
      title: "Poster",
      dataIndex: "anh_poster",
      key: "anh_poster",
      width: 210,
      render: (text: string) => (
        <Image
          src={`${BASE_URL}/storage/${text}`}
          width={220}
          height={280}
          style={{ objectFit: "cover", borderRadius: 4 }}
          fallback="https://via.placeholder.com/100x140?text=No+Image"
          preview={false}
        />
      ),
    },
    {
      title: "Thông tin phim",
      dataIndex: "ten_phim",
      key: "info",
      width: 380,
      render: (_: any, record: IMovies) => (
        <div>
          <Text strong style={{ fontSize: 16 }}>
            <Link to={`/admin/movies/detail/${record.id}`}>
              🎬 {record.ten_phim}
            </Link>
          </Text>

          <div>
            <Text>
              <b>Loại suất chiếu:</b> {record.loai_suat_chieu}
            </Text>
          </div>

          <div>
            <Text>
              <b>Quốc gia:</b> {record.quoc_gia}
            </Text>
          </div>

          <div>
            <Text>
              <b>Thể loại:</b>{" "}
              {(() => {
                try {
                  const genres = JSON.parse(
                    typeof record.the_loai_id === "string"
                      ? record.the_loai_id
                      : JSON.stringify(record.the_loai_id || [])
                  );
                  return genres?.length ? (
                    genres.map((item: any, index: number) => (
                      <Tag
                        key={index}
                        color="geekblue"
                        style={{
                          fontWeight: 600,
                          padding: "4px 12px",
                          borderRadius: 6,
                          marginBottom: 4,
                        }}
                      >
                        {item.ten_the_loai}
                      </Tag>
                    ))
                  ) : (
                    <span>Không có dữ liệu</span>
                  );
                } catch {
                  return <span>Không có dữ liệu</span>;
                }
              })()}
            </Text>
          </div>

          <div>
            <Text>
              <b>Thời lượng:</b> {record.thoi_luong} phút
            </Text>
          </div>

          <div>
            <Text>
              <b>Ngày chiếu:</b>{" "}
              {record.ngay_cong_chieu
                ? moment(record.ngay_cong_chieu).format("DD/MM/YYYY")
                : "Chưa cập nhật"}
            </Text>
          </div>

          <div style={{ marginTop: 4 }}>
            <a href={record.trailer} target="_blank" rel="noreferrer">
              🎬 Xem Trailer
            </a>
          </div>
        </div>
      ),
    },
    {
      title: "Giới hạn tuổi",
      dataIndex: "do_tuoi_gioi_han",
      key: "do_tuoi_gioi_han",
      width: 100,
      sorter: (a: IMovies, b: IMovies) =>
        a.do_tuoi_gioi_han - b.do_tuoi_gioi_han,
      render: (age: number) => (age > 0 ? `${age}+` : "Tất cả"),
    },
    {
      title: "Tình trạng",
      dataIndex: "trang_thai_phim",
      key: "trang_thai_phim",
      width: 110,
      render: (text: string) => (
        <Text
          style={{
            color:
              text === "Đang chiếu"
                ? "green"
                : text === "Sắp chiếu"
                ? "orange"
                : "gray",
            fontWeight: "bold",
          }}
        >
          {text}
        </Text>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: 160,
      fixed: "right",
      render: (_: any, record: IMovies) => (
        <Space>
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            size="small"
            onClick={() => handleRestore(record.id)}
          >
            Khôi phục
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa vĩnh viễn không?"
            onConfirm={() => handleSoftDelete(record.id)}
          >
<Button
  icon={<DeleteOutlined />}
  danger
  size="small"
  onClick={() => deleteForever(record.id)}
>
  Xóa vĩnh viễn
</Button>

          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card style={{ margin: 16 }}>
      <Title level={3}>📦 Danh sách phim đã xóa mềm</Title>
      <Table
        loading={isLoading}
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        scroll={{ x: 1200 }}
        pagination={{ pageSize: 6 }}
      />
    </Card>
  );
};

export default TrashMovies;

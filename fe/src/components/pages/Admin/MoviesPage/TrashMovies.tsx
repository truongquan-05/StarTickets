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
import { ReloadOutlined, DeleteOutlined } from "@ant-design/icons";

import {
  useDeleteForeverMovie,
  useListTrashMovies,
  useRestoreMovies,
  useSoftDeleteMovies,
} from "../../../hook/hungHook";
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
        width: 520,
        render: (_: any, record: IMovies) => (
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <Text strong style={{ fontSize: 16 }}>
              <Link to={`/admin/movies/detail/${record.id}`}>
                🎬 {record.ten_phim}
              </Link>
            </Text>
            <Text>
              <span style={{ marginRight: "35px" }}>
                {" "}
                <b>Quốc gia:</b>
              </span>{" "}
              {record.quoc_gia}
            </Text>
  
            <Text>
              <b style={{ marginRight: "23px" }}>Thời lượng:</b>{" "}
              {record.thoi_luong} phút
            </Text>
            <Text>
              <b style={{ marginRight: "21px" }}>Ngày chiếu:</b>{" "}
              {record.ngay_cong_chieu
                ? moment(record.ngay_cong_chieu).format("DD/MM/YYYY")
                : "Chưa cập nhật"}
            </Text>
            <Text>
              <b style={{ marginRight: "5px" }}>Ngày kết thúc:</b>{" "}
              {record.ngay_ket_thuc
                ? moment(record.ngay_ket_thuc).format("DD/MM/YYYY")
                : "Chưa cập nhật"}
            </Text>
            <Text>
              <b style={{ marginRight: "42px" }}>Thể loại:</b>{" "}
              {(() => {
                try {
                  const theLoaiAray = JSON.parse(
                    typeof record.the_loai_id === "string"
                      ? record.the_loai_id
                      : JSON.stringify(record.the_loai_id || [])
                  );
                  return Array.isArray(theLoaiAray) && theLoaiAray.length > 0 ? (
                    theLoaiAray.map((item: any, index: number) => (
                      <Tag
                        key={index}
                        color="geekblue"
                        style={{
                          fontWeight: 600,
                          padding: "2px 8px",
                          borderRadius: 4,
                          marginRight: 4,
                          marginBottom: 4,
                          display: "inline-block",
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
            <Text>
              <b style={{ marginRight: "15px" }}>Chuyên ngữ:</b>{" "}
              {(() => {
                try {
                  const chuyenNguArray = JSON.parse(
                    typeof record.chuyen_ngu === "string"
                      ? record.chuyen_ngu
                      : JSON.stringify(record.chuyen_ngu || [])
                  );
                  return Array.isArray(chuyenNguArray) &&
                    chuyenNguArray.length > 0 ? (
                    chuyenNguArray.map((item: any, index: number) => (
                      <Tag
                        key={index}
                        color="volcano"
                        style={{
                          fontWeight: 600,
                          padding: "2px 8px",
                          borderRadius: 4,
                          marginRight: 4,
                          marginBottom: 4,
                          display: "inline-block",
                        }}
                      >
                        {item.the_loai}
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
  
            {record.trailer && (
              <div style={{ marginTop: 4 }}>
                <a href={record.trailer} target="_blank" rel="noreferrer">
                  Xem Trailer
                </a>
              </div>
            )}
          </div>
        ),
      },

    {
      title: "Hành động",
      key: "action",
      width: 160,
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
        pagination={{ pageSize: 6 }}
      />
    </Card>
  );
};

export default TrashMovies;

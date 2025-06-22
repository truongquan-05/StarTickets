import {
  Typography,
  Descriptions,
  Card,
  Button,
  Space,
  Spin,
  Tag,
  Row,
  Col,
  Image,
} from "antd";
import { useParams } from "react-router-dom";
import moment from "moment";
import { useMovieDetail } from "../../../hook/hungHook";
import { IMovies } from "../interface/movies";

const { Title, Paragraph, Text } = Typography;

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useMovieDetail(id);
   const BASE_URL = "http://127.0.0.1:8000";

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "50px 0" }}>
        <Spin size="large" tip="Đang tải phim..." />
      </div>
    );
  }

  const movie: IMovies = data;
  if (!movie) return <div>Không tìm thấy phim</div>;

  let chuyenNguArray: any[] = [];
  try {
    chuyenNguArray = JSON.parse(
      typeof movie.chuyen_ngu === "string"
        ? movie.chuyen_ngu
        : JSON.stringify(movie.chuyen_ngu || [])
    );
  } catch {}

  return (
    <Card style={{ maxWidth: 1500, margin: "0 auto", padding: 24 }}>
      <Row gutter={24}>
        <Col span={8}>
          <Image
            src={`${BASE_URL}/storage/${movie.anh_poster}`}
            alt={movie.ten_phim}
            width={"100%"}
            height={400}
            style={{ objectFit: "cover", borderRadius: 8 }}
            fallback="https://via.placeholder.com/240x360?text=No+Image"
          />
        </Col>

        <Col span={16}>
          <Title level={2}>{movie.ten_phim}</Title>

          <Descriptions
            column={1}
            bordered
            size="middle"
            style={{ marginTop: 12 }}
            labelStyle={{ fontWeight: 600, width: 180 }}
          >
            <Descriptions.Item label="Ngôn ngữ">{movie.ngon_ngu}</Descriptions.Item>
            <Descriptions.Item label="Quốc gia">{movie.quoc_gia}</Descriptions.Item>
            <Descriptions.Item label="Thể loại">
              {movie.the_loai?.ten_the_loai || "Không xác định"}
            </Descriptions.Item>
            <Descriptions.Item label="Thời lượng">
              {movie.thoi_luong} phút
            </Descriptions.Item>
            <Descriptions.Item label="Loại suất chiếu">{movie.loai_suat_chieu}</Descriptions.Item>
            <Descriptions.Item label="Ngày công chiếu">
              {movie.ngay_cong_chieu
                ? moment(movie.ngay_cong_chieu).format("DD/MM/YYYY")
                : "Chưa cập nhật"}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày kết thúc">
              {movie.ngay_ket_thuc
                ? moment(movie.ngay_ket_thuc).format("DD/MM/YYYY")
                : "Chưa cập nhật"}
            </Descriptions.Item>
            <Descriptions.Item label="Độ tuổi giới hạn">
              {movie.do_tuoi_gioi_han > 0 ? `${movie.do_tuoi_gioi_han}+` : "Tất cả"}
            </Descriptions.Item>
            <Descriptions.Item label="Chuyên ngữ">
              {chuyenNguArray.length > 0 ? (
                chuyenNguArray.map((item) => (
                  <Tag
                    key={item.id}
                    color="geekblue"
                    style={{
                      fontWeight: 600,
                      padding: "4px 12px",
                      borderRadius: 6,
                      marginBottom: 4,
                    }}
                  >
                    {item.the_loai}
                  </Tag>
                ))
              ) : (
                <Text type="secondary">Không có chuyên ngữ</Text>
              )}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>

      <div style={{ marginTop: 32 }}>
        <Title level={4}>Mô tả phim</Title>
        <div
          style={{
            padding: 16,
            background: "#fafafa",
            borderRadius: 6,
            border: "1px solid #eee",
          }}
        >
          <Paragraph style={{ whiteSpace: "pre-line" }}>
           <div dangerouslySetInnerHTML={{ __html: movie.mo_ta || "<p>Không có mô tả</p>" }} />
          </Paragraph>
        </div>
      </div>

      <Space style={{ marginTop: 24 }}>
        <Button
          type="primary"
          href={movie.trailer || "#"}
          target="_blank"
          rel="noopener noreferrer"
          disabled={!movie.trailer}
        >
          Xem Trailer
        </Button>
      </Space>
    </Card>
  );
};

export default MovieDetail;
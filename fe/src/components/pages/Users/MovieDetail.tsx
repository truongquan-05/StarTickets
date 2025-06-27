// MovieDetailUser.tsx
import React, { useEffect, useState } from "react";
import { Button, Spin, Image, Modal } from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { getMovieDetail } from "../../provider/duProvider";
import {
  useListLichChieu,
  useListPhongChieu,
  useListCinemas,
  useListGhe,
} from "../../hook/hungHook";
import "./Home.css";
import { ILichChieu } from "../Admin/interface/lichchieu";
import { IPhongChieu } from "../Admin/interface/phongchieu";
import LichChieuDatVe from "./DatVe/LichChieuDatve";
import SoDoGhe from "../Admin/PhongChieu/SoDoGhe";

interface IRap {
  id: number;
  ten_rap: string;
}

// Hàm helper chuyển URL YouTube thường sang embed
function convertYouTubeUrlToEmbed(url: string) {
  if (!url) return "";
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2]
    ? `https://www.youtube.com/embed/${match[2]}?autoplay=1`
    : url; // nếu không phải youtube thì giữ nguyên url
}

const MovieDetailUser = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<any>(null);
  const [loadingMovie, setLoadingMovie] = useState(true);
  const [selectedPhong, setSelectedPhong] = useState<IPhongChieu | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { data: lichChieuList = [], isLoading: loadingLichChieu } =
    useListLichChieu({ resource: "lich_chieu" });
  const phongQuery = useListPhongChieu({ resource: "phong_chieu" });
  const rapQuery = useListCinemas({ resource: "rap" });

  const phongList = phongQuery.data?.data || [];
  const rapList = rapQuery.data || [];

  const {
    data: danhSachGhe = [],
    isLoading: isLoadingGhe,
    isError: isErrorGhe,
  } = useListGhe({ resource: "ghe", phong_id: selectedPhong?.id });

  const BASE_URL = "http://127.0.0.1:8000";

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const data = await getMovieDetail(id!);
        setMovie(data);
      } catch (error) {
        console.error("Lỗi lấy chi tiết phim:", error);
      } finally {
        setLoadingMovie(false);
      }
    };
    fetchMovie();
  }, [id]);

  if (
    loadingMovie ||
    loadingLichChieu ||
    phongQuery.isLoading ||
    rapQuery.isLoading
  )
    return <Spin />;

  if (!movie) return <p>Không tìm thấy phim</p>;

  const filteredLichChieu = (lichChieuList as ILichChieu[]).filter(
    (lc) => lc.phim_id === movie.id
  );

  const groupLichChieuByRap = () => {
    const grouped: { [rapId: number]: ILichChieu[] } = {};
    filteredLichChieu.forEach((lichChieu) => {
      const phong = phongList.find(
        (p: IPhongChieu) => p.id === lichChieu.phong_id
      );
      if (!phong) return;
      const rapId = phong.rap_id;
      if (!grouped[rapId]) grouped[rapId] = [];
      grouped[rapId].push(lichChieu);
    });
    return grouped;
  };

  const groupedLichChieu = groupLichChieuByRap();
  const tenRap =
    rapList.find((rap: IRap) => rap.id === selectedPhong?.rap_id)?.ten_rap ||
    "Chưa xác định";

  const handleShowModal = () => {
    setIsModalVisible(true);
  };
  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="movie-detail-wrapper">
      <div className="movie-detail-container">
        <div className="movie-poster">
          <Image
            src={`${BASE_URL}/storage/${movie.anh_poster}`}
            alt={movie.ten_phim}
            width={"100%"}
            height={400}
            style={{ objectFit: "cover", borderRadius: 8 }}
            fallback="https://via.placeholder.com/240x360?text=No+Image"
          />
        </div>

        <div className="movie-content">
          <h1>{movie.ten_phim}</h1>
          <ul className="movie-attributes">
            <li>
              <span>🎬 Thể loại:</span>{" "}
              {movie.the_loai?.ten_the_loai || "Đang cập nhật"}
            </li>
            <li>
              <span>⏱ Thời lượng:</span> {movie.thoi_luong}'
            </li>
            <li>
              <span>💿 Định dạng:</span> 2D
            </li>
            <li>
              <span>🌐 Ngôn ngữ:</span> {movie.ngon_ngu}
            </li>
          </ul>
          <div className="movie-age-warning">🔞 {movie.do_tuoi_gioi_han}</div>
          <div className="movie-section">
            <h3>MÔ TẢ</h3>
            <p>{movie.mo_ta}</p>
          </div>
          <Button
            icon={<PlayCircleOutlined />}
            size="large"
            onClick={handleShowModal}
          >
            Xem Trailer
          </Button>
        </div>
      </div>

      {/* Modal trailer video */}
      <Modal
        title={`Trailer - ${movie.ten_phim}`}
        visible={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={800}
        bodyStyle={{ padding: 0, height: 450 }}
        destroyOnClose
        centered
      >
        {movie.trailer ? (
          <iframe
            width="100%"
            height="100%"
            src={isModalVisible ? convertYouTubeUrlToEmbed(movie.trailer) : ""}
            title="Trailer"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <p style={{ padding: 20, textAlign: "center" }}>Không có trailer</p>
        )}
      </Modal>

      <h3
        style={{
          textAlign: "center",
          marginBottom: 20,
          marginTop: 50,
          fontSize: 30,
        }}
      >
        LỊCH CHIẾU
      </h3>

      <LichChieuDatVe
        groupedLichChieu={groupedLichChieu}
        rapList={rapList}
        onLichChieuClick={(lichChieu) => {
          const phong = phongList.find(
            (p: IPhongChieu) => p.id === lichChieu.phong_id
          );
          if (phong) setSelectedPhong(phong);
        }}
      />

      {selectedPhong && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            padding: 20,
            flexDirection: "column",
            backgroundColor: "#6a1b9a",
            width: 600,
            margin: "auto",
            paddingTop: 50,
            marginTop: 30,
            borderRadius: 8,
          }}
        >
          <h3 style={{ margin: "auto", fontSize: 25 }}>
            Chọn ghế: {selectedPhong.ten_phong} - {tenRap}
          </h3>
          <div className="sodoghe" style={{ margin: "auto", paddingTop: 30 }}>
            <SoDoGhe
              phongId={selectedPhong.id}
              loaiSoDo={selectedPhong.loai_so_do}
              danhSachGhe={danhSachGhe}
              isLoadingGhe={isLoadingGhe}
              isErrorGhe={isErrorGhe}
              trangThaiPhong={3}
            />
            <div
              className="chuthich"
              style={{
                display: "flex",
                justifyContent: "space-between",
                maxWidth: 600,
                margin: "0 auto",
                fontWeight: "600",
                fontSize: 18,
                userSelect: "none",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  flex: 1,
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    backgroundColor: "black",
                    borderRadius: 6,
                  }}
                />
                <span>Ghế thường</span>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  flex: 1,
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    backgroundColor: "red",
                    borderRadius: 6,
                  }}
                />
                <span>Ghế VIP</span>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  flex: 1,
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    backgroundColor: "blue",
                    borderRadius: 6,
                  }}
                />
                <span>Ghế đôi</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetailUser;

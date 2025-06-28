// MovieDetailUser.tsx
import React, { useEffect, useState } from "react";
import { Button, Spin, Image, Modal, message } from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { getMovieDetail } from "../../provider/duProvider";
import {
  useListLichChieu,
  useListPhongChieu,
  useListCinemas,
  useListGhe,
  useListCheckGhe,
  useUpdateCheckGhe,
} from "../../hook/hungHook";
import "./Home.css";
import { ILichChieu } from "../Admin/interface/lichchieu";
import { IPhongChieu } from "../Admin/interface/phongchieu";
import LichChieuDatVe from "./DatVe/LichChieuDatve";
import SoDoGhe from "../Admin/PhongChieu/SoDoGhe";
import { IGhe } from "../Admin/interface/ghe";

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

// Hàm kiểm tra ghế cách quãng
function checkGapSeats(selectedSeats: string[]): boolean {
  if (selectedSeats.length <= 1) return false;

  // Map hàng => mảng số ghế đã chọn
  const rowMap: Record<string, number[]> = {};

  selectedSeats.forEach((seat) => {
    const row = seat[0];
    const col = parseInt(seat.slice(1), 10);
    if (!rowMap[row]) rowMap[row] = [];
    rowMap[row].push(col);
  });

  // Kiểm tra cách quãng trong từng hàng
  for (const row in rowMap) {
    const cols = rowMap[row].sort((a, b) => a - b);
    for (let i = 0; i < cols.length - 1; i++) {
      if (cols[i + 1] - cols[i] > 1) {
        return true; // có ghế cách quãng
      }
    }
  }

  return false; // không cách quãng
}

const MovieDetailUser = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<any>(null);
  const [loadingMovie, setLoadingMovie] = useState(true);
  const [selectedPhong, setSelectedPhong] = useState<IPhongChieu | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedLichChieuId, setSelectedLichChieuId] = useState<number | null>(
    null
  );
  const { mutate: updateCheckGhe } = useUpdateCheckGhe({
    resource: "check_ghe",
  });

  // State quản lý danh sách ghế đã chọn (so_ghe)
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  // State báo có ghế cách quãng
  const [hasGap, setHasGap] = useState(false);

  const { data: checkGheList = [], isLoading: loadingCheckGhe } =
    useListCheckGhe({
      id: selectedLichChieuId ?? undefined,
    });

  useEffect(() => {
    if (selectedLichChieuId && checkGheList) {
      console.log("Dữ liệu check ghế:", checkGheList);
    }
  }, [selectedLichChieuId, checkGheList]);

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

  // Theo dõi selectedSeats để kiểm tra ghế cách quãng
  useEffect(() => {
    const gap = checkGapSeats(selectedSeats);
    setHasGap(gap);
    if (gap) {
      message.warning(
        "Bạn đang chọn ghế cách quãng, vui lòng chọn ghế liền nhau!"
      );
    }
  }, [selectedSeats]);

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

  // Xử lí click mua ghế, cập nhật trạng thái và selectedSeats
  const handleClickCheckGhe = (gheId: number, currentTrangThai: string) => {
    // 1️⃣ Tìm thông tin ghế hiện tại
    const ghe = danhSachGhe.find((g: IGhe) => g.id === gheId);
    if (!ghe) return;

    // 2️⃣ Xác định trạng thái mới
    let newTrangThai = "trong";
    if (currentTrangThai === "trong") newTrangThai = "dang_dat";
    else if (currentTrangThai === "dang_dat") newTrangThai = "trong";

    // 3️⃣ Tính danh sách ghế sẽ được chọn sau khi click
    let newSelectedSeats: string[] = [];

    if (newTrangThai === "dang_dat") {
      // thêm ghế này vào danh sách nếu chưa có
      newSelectedSeats = selectedSeats.includes(ghe.so_ghe)
        ? [...selectedSeats]
        : [...selectedSeats, ghe.so_ghe];
    } else {
      // bỏ ghế này khỏi danh sách
      newSelectedSeats = selectedSeats.filter((s) => s !== ghe.so_ghe);
    }

    /* ------------------------------------------------------------------ */
    /* 4️⃣ RÀNG BUỘC A. KHÔNG CHO CHỌN GHẾ CÁCH QUÃNG                     */
    /* ------------------------------------------------------------------ */
    if (newTrangThai === "dang_dat" && checkGapSeats(newSelectedSeats)) {
      message.error(
        "Không được chọn ghế cách quãng! Vui lòng chọn ghế liền kề."
      );
      return; // chặn chọn ghế
    }

    /* ------------------------------------------------------------------ */
    /* 5️⃣ RÀNG BUỘC B. KHÔNG CHỌN GHẾ KẾ RÌA NẾU GHẾ RÌA CHƯA CHỌN       */
    /* ------------------------------------------------------------------ */
    if (newTrangThai === "dang_dat") {
      const row = ghe.so_ghe[0]; // B
      const number = parseInt(ghe.so_ghe.slice(1)); // 2

      // Tìm số cột nhỏ nhất (min) và lớn nhất (max) trong hàng hiện tại
      const colsInRow = danhSachGhe
        .filter((g: IGhe) => g.so_ghe[0] === row)
        .map((g: IGhe) => parseInt(g.so_ghe.slice(1)))
        .sort((a: any, b: any) => a - b);
      const min = colsInRow[0]; // ví dụ 1
      const max = colsInRow[colsInRow.length - 1]; // ví dụ 12

      const seatLeft = `${row}${min}`; // rìa trái (B1)
      const seatRight = `${row}${max}`; // rìa phải (B12)

      const isLeftEdgeNeighbor = number === min + 1; // B2
      const isRightEdgeNeighbor = number === max - 1; // B11

      const edgeLeftSelected = newSelectedSeats.includes(seatLeft);
      const edgeRightSelected = newSelectedSeats.includes(seatRight);

      if (
        (isLeftEdgeNeighbor && !edgeLeftSelected) ||
        (isRightEdgeNeighbor && !edgeRightSelected)
      ) {
        message.warning(
          "Không được chọn ghế cạnh rìa khi ghế rìa chưa được chọn!"
        );
        return; // chặn chọn ghế
      }
    }

    /* ------------------------------------------------------------------ */
    /* 6️⃣ HỢP LỆ → CẬP NHẬT STATE VÀ GỌI API                             */
    /* ------------------------------------------------------------------ */
    setSelectedSeats(newSelectedSeats);
    updateCheckGhe({
      id: gheId,
      values: { trang_thai: newTrangThai },
    });
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
          setSelectedLichChieuId(lichChieu.id);

          // Reset danh sách ghế đã chọn khi đổi lịch chiếu mới
          setSelectedSeats([]);
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
              danhSachCheckGhe={checkGheList}
              onClickCheckGhe={handleClickCheckGhe}
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
      {selectedSeats.length > 0 && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "#0b0b2e",
            color: "white",
            padding: "12px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 1000,
            fontSize: 16,
            fontWeight: 500,
          }}
        >
          {/* Thông tin phim và rạp */}
          {/* Nhóm trái của footer */}
          <div style={{ display: "flex", gap: 40 }}>
            {/* Cột 1: Tên phim và phòng */}
            <div>
              <div style={{ fontWeight: "bold" }}>
                {movie.ten_phim?.toUpperCase()}
              </div>
              <div style={{ fontSize: 14, opacity: 0.8 }}>
                {selectedPhong?.ten_phong} - {tenRap}
              </div>
            </div>

            {/* Cột 2: Ghế đã chọn */}
            <div style={{ alignSelf: "center", fontSize: 16 }}>
              Ghế: {selectedSeats.join(", ")}
            </div>
          </div>

          {/* Tổng tiền và thời gian giữ vé */}
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div
              style={{
                backgroundColor: "yellow",
                color: "#000",
                padding: "6px 12px",
                borderRadius: 4,
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              ⏰ 05:00
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 14 }}>Tạm tính</div>
              <div style={{ color: "#00FFB0", fontSize: 18 }}>
                {selectedSeats.length * 75000} VNĐ
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetailUser;

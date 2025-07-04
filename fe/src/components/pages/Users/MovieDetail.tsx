// MovieDetailUser.tsx
import React, { useCallback, useEffect, useState, useRef } from "react"; // <-- Import useRef
import { Button, Spin, Image, Modal, message } from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
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
import { ICheckGhe } from "../Admin/interface/checkghe";
import { useBookingTimer } from "./DatVe/useBookingTimer";

interface IRap {
  id: number;
  ten_rap: string;
}
interface SelectedSeatWithPrice {
  so_ghe: string;
  loai_ghe: string;
  gia: number;
}
function convertYouTubeUrlToEmbed(url: string) {
  if (!url) return "";
  const regExp =
    /^.*(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([a-zA-Z0-9_-]{11})(?:(?:\?|&).*)?$/;
  const match = url.match(regExp);
  return match && match[1]
    ? `https://www.youtube.com/embed/${match[1]}?autoplay=1`
    : url;
}
function checkGapSeats(selectedSeats: string[]): boolean {
  if (selectedSeats.length <= 1) return false;
  const rowMap: Record<string, number[]> = {};
  selectedSeats.forEach((seat) => {
    const row = seat[0];
    const col = parseInt(seat.slice(1), 10);
    if (!rowMap[row]) rowMap[row] = [];
    rowMap[row].push(col);
  });
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
  const TIMEOUT_MINUTES = 5;
  const { id } = useParams();
  const [modalVisible, setModalVisible] = useState(false);
  const [movie, setMovie] = useState<any>(null);
  const [loadingMovie, setLoadingMovie] = useState(true);
  const [selectedPhong, setSelectedPhong] = useState<IPhongChieu | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedLichChieuId, setSelectedLichChieuId] = useState<number | null>(
    null
  );
  const [selectedLichChieu, setSelectedLichChieu] = useState<ILichChieu | null>(
    null
  );
  const { mutate: updateCheckGhe } = useUpdateCheckGhe({
    resource: "check_ghe",
  });
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [displaySelectedSeats, setDisplaySelectedSeats] = useState<
    SelectedSeatWithPrice[]
  >([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [hasGap, setHasGap] = useState(false);
  const { data: checkGheList = [], isLoading: loadingCheckGhe } =
    useListCheckGhe({
      id: selectedLichChieuId ?? undefined,
    });
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
  const navigate = useNavigate();
  // 1. Tạo Refs để lưu trữ giá trị state/data mới nhất
  const selectedSeatsRef = useRef<string[]>([]);
  const selectedLichChieuIdRef = useRef<number | null>(null);
  const danhSachGheRef = useRef<IGhe[]>([]);
  const checkGheListRef = useRef<ICheckGhe[]>([]);
   useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      const selectedSeats = sessionStorage.getItem("selectedSeats");
      if (selectedSeats && selectedSeats.length > 0) {
        event.preventDefault();
        event.returnValue = ""; // Bắt buộc có để hiện cảnh báo trên Chrome
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    // 2. Khi trang được load lại, kiểm tra ghế trong sessionStorage
    const selectedSeatsOnLoad = sessionStorage.getItem("selectedSeats");
    if (selectedSeatsOnLoad && selectedSeatsOnLoad.length > 0) {
      // Đẩy về trang chủ nếu có ghế chưa thanh toán
      navigate("/", { replace: true });
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [navigate]);
  useEffect(() => {
    selectedSeatsRef.current = selectedSeats;
  }, [selectedSeats]);

  useEffect(() => {
    selectedLichChieuIdRef.current = selectedLichChieuId;
  }, [selectedLichChieuId]);

  useEffect(() => {
    danhSachGheRef.current = danhSachGhe;
  }, [danhSachGhe]);

  useEffect(() => {
    checkGheListRef.current = checkGheList;
  }, [checkGheList]);
  const releaseSeatsApiCore = useCallback(
    async (seatsToProcess: string[], lichChieuIdToProcess: number | null) => {
      if (!lichChieuIdToProcess || seatsToProcess.length === 0) {
        return;
      }
      const currentDanhSachGhe = danhSachGheRef.current;
      const currentCheckGheList = checkGheListRef.current;
      for (const seatNumber of seatsToProcess) {
        const ghe = currentDanhSachGhe.find(
          (g: IGhe) => g.so_ghe === seatNumber
        );
        if (ghe) {
          const correspondingCheckGhe = currentCheckGheList.find(
            (item) =>
              item.ghe_id === ghe.id &&
              item.lich_chieu_id === lichChieuIdToProcess
          );
          if (
            correspondingCheckGhe &&
            correspondingCheckGhe.trang_thai === "dang_dat"
          ) {
            updateCheckGhe({
              id: correspondingCheckGhe.id,
              values: { trang_thai: "trong" },
              lichChieuId: lichChieuIdToProcess,
            });
          }
        }
      }
    },
    [updateCheckGhe]
  ); // Dependencies của hàm core: chỉ là mutation function
  const releaseOccupiedSeatsForUI = useCallback(async () => {
    await releaseSeatsApiCore([...selectedSeats], selectedLichChieuId);
    setSelectedSeats([]);
    setDisplaySelectedSeats([]);
    setTotalPrice(0);
  }, [selectedSeats, selectedLichChieuId, releaseSeatsApiCore]); // Dependencies
  const releaseOccupiedSeatsOnUnmount = useCallback(async () => {
    await releaseSeatsApiCore(
      selectedSeatsRef.current,
      selectedLichChieuIdRef.current
    );
  }, [releaseSeatsApiCore]); // Dependencies: chỉ là hàm core API
  
  const { clearTimer, remainingTime } = useBookingTimer({
    selectedSeatsCount: selectedSeats.length,
    selectedLichChieuId: selectedLichChieuId,
    onTimerEndCallback: releaseOccupiedSeatsForUI, // <-- Đã đổi sang hàm mới
    timeoutMinutes: TIMEOUT_MINUTES,
  });
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };
  useEffect(() => {
    if (selectedLichChieuId !== null && lichChieuList.length > 0) {
      const foundLichChieu = (lichChieuList as ILichChieu[]).find(
        (lc) => lc.id === selectedLichChieuId
      );
      setSelectedLichChieu(foundLichChieu || null);
      if (foundLichChieu) {
      } else {
        console.warn(
          `Không tìm thấy lịch chiếu với ID: ${selectedLichChieuId} trong danh sách.`
        );
      }
    } else {
      setSelectedLichChieu(null);
    }
  }, [selectedLichChieuId, lichChieuList]);

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

  useEffect(() => {
    if (selectedSeats.length > 0 && danhSachGhe.length > 0) {
      const seatsToCheckForGaps = selectedSeats.filter((seatNumber) => {
        const ghe = danhSachGhe.find((g: IGhe) => g.so_ghe === seatNumber);
        return ghe && (ghe.loai_ghe_id === 1 || ghe.loai_ghe_id === 2);
      });

      const gap = checkGapSeats(seatsToCheckForGaps);
      setHasGap(gap);
      if (gap) {
        message.warning(
          "Bạn đang chọn ghế cách quãng, vui lòng chọn ghế liền nhau!"
        );
      }
    } else {
      setHasGap(false);
    }
  }, [selectedSeats, danhSachGhe]);

  useEffect(() => {
    if (selectedLichChieuId !== null && lichChieuList.length > 0) {
      const foundLichChieu = (lichChieuList as ILichChieu[]).find(
        (lc) => lc.id === selectedLichChieuId
      );
      if (foundLichChieu && selectedLichChieu?.id !== foundLichChieu.id) {
        setSelectedLichChieu(foundLichChieu);
      } else if (!foundLichChieu && selectedLichChieu !== null) {
        setSelectedLichChieu(null);
      }
    } else {
      if (selectedLichChieu !== null) {
        setSelectedLichChieu(null);
      }
    }
  }, [selectedLichChieuId, lichChieuList, selectedLichChieu]); // Thêm selectedLichChieu vào dependencies để tránh loop

  useEffect(() => {
    if (
      !selectedLichChieu ||
      !selectedLichChieu.gia_ve ||
      selectedSeats.length === 0 ||
      danhSachGhe.length === 0
    ) {
      if (totalPrice !== 0) {
        setTotalPrice(0);
      }
      if (displaySelectedSeats.length > 0) {
        setDisplaySelectedSeats([]);
      }
      return;
    }
    let currentTotalPrice = 0;
    const seatsToCalculateDisplay: SelectedSeatWithPrice[] = [];
    selectedSeats.forEach((seatNumber) => {
      const ghe = danhSachGhe.find((g: IGhe) => g.so_ghe === seatNumber);

      if (ghe) {
        const loaiGheIdCuaGhe = ghe.loai_ghe_id;
        const giaVeItem = selectedLichChieu.gia_ve.find(
          (gv) => gv.pivot.loai_ghe_id === loaiGheIdCuaGhe
        );
        let price = 0;
        let tenLoaiGhe = "Không xác định";
        if (giaVeItem) {
          price = parseFloat(giaVeItem.pivot.gia_ve);
          tenLoaiGhe = giaVeItem.ten_loai_ghe;
        } else {
          console.warn(
            `Không tìm thấy giá cho loai_ghe_id: ${loaiGheIdCuaGhe} trong lịch chiếu ID ${selectedLichChieu.id}.`
          );
        }
        currentTotalPrice += price;
        seatsToCalculateDisplay.push({
          so_ghe: ghe.so_ghe,
          loai_ghe: tenLoaiGhe,
          gia: price,
        });
      }
    });
    if (totalPrice !== currentTotalPrice) {
      setTotalPrice(currentTotalPrice);
    }
    if (
      JSON.stringify(displaySelectedSeats) !==
      JSON.stringify(seatsToCalculateDisplay)
    ) {
      setDisplaySelectedSeats(seatsToCalculateDisplay);
    }
  }, [
    selectedSeats,
    selectedLichChieu,
    danhSachGhe,
    totalPrice,
    displaySelectedSeats,
  ]);
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (
        selectedSeatsRef.current.length > 0 &&
        selectedLichChieuIdRef.current !== null
      ) {
        const data = {
          lich_chieu_id: selectedLichChieuIdRef.current,
          ghe_so: selectedSeatsRef.current,
        };
        const blob = new Blob([JSON.stringify(data)], {
          type: "application/json",
        });
        try {
          navigator.sendBeacon(`${BASE_URL}/api/release-seats-on-exit`, blob);
        } catch (error) {}
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload); // Loại bỏ listener để tránh rò rỉ bộ nhớ
      releaseOccupiedSeatsOnUnmount();
    };
  }, [releaseOccupiedSeatsOnUnmount]); // <-- Dependency duy nhất là hàm cleanup cụ thể này
  useEffect(() => {
    if (selectedSeats.length > 0) {
      sessionStorage.setItem("selectedSeats", JSON.stringify(selectedSeats));
    } else {
      sessionStorage.removeItem("selectedSeats");
    }
  }, [selectedSeats]);
  if (
    loadingMovie ||
    loadingLichChieu ||
    phongQuery.isLoading ||
    rapQuery.isLoading ||
    loadingCheckGhe || // Thêm loadingCheckGhe
    isLoadingGhe // Thêm isLoadingGhe
  )
    return <Spin />;
  if (!movie) return <p>Không tìm thấy phim</p>;
  const handleThanhToanClick = () => {
    const user = localStorage.getItem("user");
    if (!user) {
      alert("Vui lòng đăng nhập trước khi thanh toán.");
      navigate("/login");
      return;
    }

    if (!selectedLichChieuId || selectedSeats.length === 0) {
      alert("Vui lòng chọn ghế trước khi thanh toán.");
      return;
    }

    clearTimer();

    navigate("/check-out", {
      state: {
        lichChieuId: selectedLichChieuId,
        selectedSeats,
        totalPrice,
      },
    });
  };
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
  const handleClickCheckGhe = (gheId: number, currentTrangThai: string) => {
    if (!selectedLichChieuId) {
      message.warning("Vui lòng chọn lịch chiếu trước khi chọn ghế!");
      return;
    }
    // 1️⃣ Tìm thông tin ghế vật lý hiện tại
    const ghe = danhSachGhe.find((g: IGhe) => g.id === gheId);
    if (!ghe) {
      console.error("Không tìm thấy thông tin ghế vật lý với ID:", gheId);
      return;
    }
    let seatsToToggle: IGhe[] = [ghe]; // Bắt đầu với ghế được click
    if (ghe.loai_ghe_id === 3) {
      const row = ghe.so_ghe[0];
      const col = parseInt(ghe.so_ghe.slice(1), 10);
      const partnerCol = col % 2 === 0 ? col - 1 : col + 1;
      const partnerSeatNumber = `${row}${partnerCol}`;
      const partnerGhe = danhSachGhe.find(
        (g: IGhe) => g.so_ghe === partnerSeatNumber && g.loai_ghe_id === 3
      );

      if (partnerGhe) {
        seatsToToggle.push(partnerGhe);
      } else {
        message.warning("Không tìm thấy ghế đôi còn lại.");
        return; // Ngăn chặn việc chọn nếu ghế đối tác bị thiếu
      }
    }

    let newTrangThai: string;
    // Kiểm tra xem bất kỳ ghế nào trong danh sách `seatsToToggle` có trạng thái 'da_ban' hay không
    const anySeatSold = seatsToToggle.some((st) => {
      const correspondingCheckGhe = (checkGheList as ICheckGhe[]).find(
        (item) =>
          item.ghe_id === st.id && item.lich_chieu_id === selectedLichChieuId
      );
      return (
        correspondingCheckGhe && correspondingCheckGhe.trang_thai === "da_ban"
      );
    });

    if (anySeatSold) {
      message.info("Một hoặc cả hai ghế đã được bán và không thể chọn.");
      return;
    }

    // Xác định trạng thái mới dựa trên trạng thái hiện tại của ghế được click
    if (currentTrangThai === "trong") {
      newTrangThai = "dang_dat";
    } else if (currentTrangThai === "dang_dat") {
      newTrangThai = "trong";
    } else {
      // Nếu là 'da_ban' hoặc trạng thái khác không thể click, không làm gì
      message.info("Ghế này đã được bán hoặc không thể chọn.");
      return;
    }

    // 3️⃣ Tính danh sách ghế sẽ được chọn sau khi click (dùng `ghe.so_ghe`)
    let newSelectedSeats: string[] = [...selectedSeats]; // Bắt đầu với danh sách hiện tại
    const seatsToToggleNumbers = seatsToToggle.map((st) => st.so_ghe);

    if (newTrangThai === "dang_dat") {
      // Thêm tất cả các ghế trong cặp nếu chúng chưa được chọn
      seatsToToggleNumbers.forEach((seatNum) => {
        if (!newSelectedSeats.includes(seatNum)) {
          newSelectedSeats.push(seatNum);
        }
      });
    } else {
      // newTrangThai === "trong" - Loại bỏ tất cả các ghế trong cặp
      newSelectedSeats = newSelectedSeats.filter(
        (s) => !seatsToToggleNumbers.includes(s)
      );
    }

    /* ------------------------------------------------------------------ */
    /* 4️⃣ RÀNG BUỘC A. KHÔNG CHO CHỌN GHẾ CÁCH QUÃNG                     */
    /* Chỉ áp dụng cho loai_ghe_id 1 và 2                               */
    /* ------------------------------------------------------------------ */
    const seatsForGapCheck = newSelectedSeats.filter((seatNumber) => {
      const seatObj = danhSachGhe.find((g: IGhe) => g.so_ghe === seatNumber);
      return (
        seatObj && (seatObj.loai_ghe_id === 1 || seatObj.loai_ghe_id === 2)
      );
    });

    if (newTrangThai === "dang_dat" && checkGapSeats(seatsForGapCheck)) {
      message.error(
        "Không được chọn ghế cách quãng đối với ghế thường và VIP! Vui lòng chọn ghế liền kề."
      );
      return;
    }

    /* ------------------------------------------------------------------ */
    /* 5️⃣ RÀNG BUỘC B. KHÔNG CHỌN GHẾ KẾ RÌA NẾU GHẾ RÌA CHƯA CHỌN       */
    /* Chỉ áp dụng cho loai_ghe_id 1 và 2                               */
    /* ------------------------------------------------------------------ */
    if (
      newTrangThai === "dang_dat" &&
      (ghe.loai_ghe_id === 1 || ghe.loai_ghe_id === 2)
    ) {
      const row = ghe.so_ghe[0];
      const number = parseInt(ghe.so_ghe.slice(1));

      const colsInRow = danhSachGhe
        .filter(
          (g: IGhe) =>
            g.so_ghe[0] === row && (g.loai_ghe_id === 1 || g.loai_ghe_id === 2)
        )
        .map((g: IGhe) => parseInt(g.so_ghe.slice(1)))
        .sort((a: any, b: any) => a - b);

      if (colsInRow.length > 0) {
        const min = colsInRow[0];
        const max = colsInRow[colsInRow.length - 1];

        const seatLeft = `${row}${min}`;
        const seatRight = `${row}${max}`;

        const isLeftEdgeNeighbor = number === min + 1;
        const isRightEdgeNeighbor = number === max - 1;

        const edgeLeftSelected = newSelectedSeats.includes(seatLeft);
        const edgeRightSelected = newSelectedSeats.includes(seatRight);

        if (
          (isLeftEdgeNeighbor && !edgeLeftSelected) ||
          (isRightEdgeNeighbor && !edgeRightSelected)
        ) {
          message.warning(
            "Không được chọn ghế cạnh rìa khi ghế rìa chưa được chọn (áp dụng cho ghế thường và VIP)!"
          );
          return;
        }
      }
    }

    /* ------------------------------------------------------------------ */
    /* 6️⃣ HỢP LỆ → CẬP NHẬT STATE VÀ GỌI API                             */
    /* ------------------------------------------------------------------ */
    setSelectedSeats(newSelectedSeats); // Cập nhật state với danh sách ghế đã chọn mới

    // Cập nhật tất cả các bản ghi check_ghe bị ảnh hưởng (cho ghế thường/VIP/đôi)
    seatsToToggle.forEach((st) => {
      const correspondingCheckGhe = (checkGheList as ICheckGhe[]).find(
        (item) =>
          item.ghe_id === st.id && item.lich_chieu_id === selectedLichChieuId
      );
      if (correspondingCheckGhe) {
        updateCheckGhe({
          id: correspondingCheckGhe.id,
          values: { trang_thai: newTrangThai },
          lichChieuId: selectedLichChieuId,
        });
      }
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
      <Modal
        title={`Trailer - ${movie.ten_phim}`}
        open={isModalVisible}
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
          if (selectedLichChieuId !== lichChieu.id) {
            // Chỉ giải phóng nếu thực sự là lịch chiếu mới
            releaseOccupiedSeatsForUI(); // <-- Đã đổi sang hàm mới
            clearTimer(); // Reset timer của lịch chiếu cũ
          }
          const phong = phongList.find(
            (p: IPhongChieu) => p.id === lichChieu.phong_id
          );
          if (phong) setSelectedPhong(phong);
          setSelectedLichChieuId(lichChieu.id);
          setSelectedSeats([]);
          setDisplaySelectedSeats([]);
          setTotalPrice(0);
        }}
        selectedLichChieuId={selectedLichChieuId}
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
          <div style={{ display: "flex", gap: 40 }}>
            <div>
              <div style={{ fontWeight: "bold" }}>
                {movie.ten_phim?.toUpperCase()}
              </div>
              <div style={{ fontSize: 14, opacity: 0.8 }}>
                {selectedPhong?.ten_phong} - {tenRap}
              </div>
            </div>
            <div style={{ alignSelf: "center", fontSize: 16 }}>
              Ghế: {selectedSeats.join(", ")}
            </div>
          </div>
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
              {selectedSeats.length > 0
                ? `⏰ ${formatTime(remainingTime)}`
                : `⏰ ${formatTime(TIMEOUT_MINUTES * 60)}`}
            </div>
            <div style={{ textAlign: "right" }}>
              <button
                onClick={handleThanhToanClick}
                style={{
                  padding: "6px 12px",
                  fontSize: 16,
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  opacity: selectedSeats.length > 0 ? 1 : 0.6,
                }}
                disabled={selectedSeats.length === 0 || hasGap}
              >
                Thanh toán {totalPrice.toLocaleString("vi-VN")} VNĐ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetailUser;

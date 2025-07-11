// MovieDetailUser.tsx
import React, { useCallback, useEffect, useState, useRef } from "react";
import { Button, Spin, Image, Modal, message } from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getMovieDetail } from "../../provider/duProvider";
import {
  useListLichChieu,
  useListPhongChieu,
  useListCinemas,
  useListGhe,
  useListCheckGhe,
  useUpdateCheckGhe,
  useCreateDatVe,
} from "../../hook/hungHook";
import "./Home.css";
import { ILichChieu } from "../Admin/interface/lichchieu";
import { IPhongChieu } from "../Admin/interface/phongchieu";
import LichChieuDatVe from "./DatVe/LichChieuDatve";
import SoDoGhe from "../Admin/PhongChieu/SoDoGhe";
import { IGhe } from "../Admin/interface/ghe";
import { ICheckGhe } from "../Admin/interface/checkghe";
import { useBookingTimer } from "./DatVe/useBookingTimer";
import { IDatVeChiTietPayload } from "../Admin/interface/datve";

interface IRap {
  id: number;
  ten_rap: string;
}
interface SelectedSeatWithPrice {
  ghe_id: number;
  so_ghe: string;
  loai_ghe: string;
  gia: number;
}

// Hàm chuyển đổi URL YouTube sang định dạng nhúng
function convertYouTubeUrlToEmbed(url: string) {
  if (!url) return "";
  const regExp =
    /^.*(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([a-zA-Z0-9_-]{11})(?:(?:\?|&).*)?$/;
  const match = url.match(regExp);
  return match && match[1]
    ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` // Sửa lại URL nhúng cho đúng chuẩn YouTube
    : url;
}

// Hàm kiểm tra ghế cách quãng
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
        return true; // Có ghế cách quãng
      }
    }
  }
  return false; // Không cách quãng
}

const MovieDetailUser = () => {
  const TIMEOUT_MINUTES = 5;
  const location = useLocation();
  const previousPathnameRef = useRef<string>(location.pathname);
  const { id } = useParams();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
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
  const { mutate: createDatVe } = useCreateDatVe({ resource: "dat_ve" });
  const {
    data: danhSachGhe = [],
    isLoading: isLoadingGhe,
    isError: isErrorGhe,
  } = useListGhe({ resource: "ghe", phong_id: selectedPhong?.id });
  const BASE_URL = "http://127.0.0.1:8000";
  const navigate = useNavigate();

  // Refs để lưu trữ giá trị state/data mới nhất cho các hàm callback ổn định
  const selectedSeatsRef = useRef<string[]>([]);
  const selectedLichChieuIdRef = useRef<number | null>(null);
  const danhSachGheRef = useRef<IGhe[]>([]);
  const checkGheListRef = useRef<ICheckGhe[]>([]);

  // Cập nhật refs mỗi khi state thay đổi
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

  // Hàm core để giải phóng ghế trên API
  const releaseSeatsApiCore = useCallback(
    async (seatsToProcess: string[], lichChieuIdToProcess: number | null) => {
      if (!lichChieuIdToProcess || seatsToProcess.length === 0) {
        return;
      }
      const currentDanhSachGhe = danhSachGheRef.current;
      const currentCheckGheList = checkGheListRef.current;

      console.log(
        `[releaseSeatsApiCore] Releasing seats for LC ID: ${lichChieuIdToProcess}, Seats: ${seatsToProcess.join(
          ", "
        )}`
      );

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
            console.log(`- Released seat: ${seatNumber}`);
          }
        }
      }
    },
    [updateCheckGhe]
  );

  // Hàm giải phóng ghế và reset UI (dùng cho timeout hoặc chuyển lịch chiếu)
  const releaseOccupiedSeatsForUI = useCallback(async () => {
    console.log("[releaseOccupiedSeatsForUI] Releasing seats for UI reset.");
    await releaseSeatsApiCore(
      selectedSeatsRef.current,
      selectedLichChieuIdRef.current
    );
    setSelectedSeats([]);
    setDisplaySelectedSeats([]);
    setTotalPrice(0);
    sessionStorage.removeItem("selectedSeats");
    sessionStorage.removeItem("selectedLichChieuId");
  }, [releaseSeatsApiCore]); // Dependencies: chỉ cần releaseSeatsApiCore

  // Hook quản lý timer đặt vé
  const { clearTimer, remainingTime } = useBookingTimer({
    selectedSeatsCount: selectedSeats.length,
    selectedLichChieuId: selectedLichChieuId,
    onTimerEndCallback: releaseOccupiedSeatsForUI,
    timeoutMinutes: TIMEOUT_MINUTES,
  });

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };
  // THÊM KHỐI useEffect NÀY
  useEffect(() => {
    const currentPathname = location.pathname;
    const prevPathname = previousPathnameRef.current;
    const currentCameFromThanhToan = sessionStorage.getItem(
      "justNavigatedFromThanhToan"
    );

    // Chỉ thực hiện hành động nếu đường dẫn đã thay đổi VÀ không phải là đang đi tới trang thanh toán
    // và có ghế đang được chọn
    if (
      currentPathname !== prevPathname && // Đảm bảo URL đã thực sự thay đổi
      currentCameFromThanhToan !== "true" && // Không phải đang đi tới trang thanh toán
      selectedSeatsRef.current.length > 0 && // Có ghế đang chọn
      selectedLichChieuIdRef.current !== null // Có lịch chiếu đã chọn
    ) {
      console.log(
        "[Route Change] User navigating away from MovieDetailUser (internal SPA). Releasing seats."
      );
      (async () => {
        await releaseSeatsApiCore(
          selectedSeatsRef.current,
          selectedLichChieuIdRef.current
        );
        // Sau khi giải phóng, xóa dữ liệu ghế khỏi sessionStorage và reset state cục bộ
        sessionStorage.removeItem("selectedSeats");
        sessionStorage.removeItem("selectedLichChieuId");
        setSelectedSeats([]);
        setDisplaySelectedSeats([]);
        setTotalPrice(0);
        clearTimer();
        message.info("Ghế đã chọn đã được giải phóng do chuyển trang.");
      })();
    }

    // Cập nhật ref với pathname hiện tại cho lần render tiếp theo
    previousPathnameRef.current = currentPathname;

    // Luôn đặt lại cờ thanh toán sau khi kiểm tra để tránh chặn các lần chuyển trang sau
    // Điều này xử lý trường hợp người dùng nhấn nút back từ trang thanh toán
    if (currentCameFromThanhToan === "true") {
      sessionStorage.removeItem("justNavigatedFromThanhToan");
    }
    // Đảm bảo cờ luôn được thiết lập là 'false' nếu không phải đang chuyển đến thanh toán
    // Điều này cần được đặt sau khi kiểm tra `currentCameFromThanhToan === "true"`
    // để tránh ghi đè cờ khi nó vừa được đặt thành true trước navigate.
    if (!location.pathname.includes("/thanh-toan")) {
      // Nếu không phải trang thanh toán
      sessionStorage.setItem("justNavigatedFromThanhToan", "false");
    }
  }, [
    location.pathname, // Dependency chính: theo dõi thay đổi đường dẫn
    releaseSeatsApiCore,
    clearTimer,
    selectedSeats.length, // Để có thể kiểm tra selectedSeatsRef.current.length
    selectedLichChieuId, // Để có thể kiểm tra selectedLichChieuIdRef.current
  ]);
  // --- Logic xử lý giải phóng ghế khi điều hướng/tải lại/đóng tab ---
  useEffect(() => {
    // 1. Logic xử lý khi component mount (tải trang hoặc quay lại bằng nút back/forward trình duyệt)
    const storedSelectedSeats = sessionStorage.getItem("selectedSeats");
    const storedLichChieuId = sessionStorage.getItem("selectedLichChieuId");
    const cameFromThanhToan = sessionStorage.getItem(
      "justNavigatedFromThanhToan"
    );

    // Nếu vừa quay lại từ trang thanh toán (qua navigate của react-router-dom)
    // Hoặc tải lại trang check-out sau khi thanh toán thành công
    // KHÔNG giải phóng ghế. Ghế đã được "bán" hoặc sẽ được xử lý ở trang thanh toán.
    if (cameFromThanhToan === "true") {
      console.log("[Mount] Vừa từ thanh toán quay lại, KHÔNG giải phóng ghế.");
      sessionStorage.removeItem("justNavigatedFromThanhToan"); // Xóa cờ ngay sau khi kiểm tra
    } else if (storedSelectedSeats && storedLichChieuId) {
      // Nếu có ghế trong sessionStorage VÀ KHÔNG phải từ thanh toán quay lại
      // Điều này có nghĩa là người dùng đã đóng trình duyệt, tải lại trang, hoặc điều hướng ra khỏi SPA
      // mà không hoàn tất thanh toán.
      console.log(
        "[Mount] Ghế chưa thanh toán còn trong sessionStorage, tiến hành giải phóng."
      );
      const seatsToRelease = JSON.parse(storedSelectedSeats);
      const lichChieuIdToRelease = parseInt(storedLichChieuId, 10);

      // Gọi API giải phóng ghế ngay lập tức
      (async () => {
        await releaseSeatsApiCore(seatsToRelease, lichChieuIdToRelease);
        message.info("Ghế đã chọn của phiên trước đã được giải phóng.");
        // Sau khi giải phóng, xóa dữ liệu ghế khỏi sessionStorage
        sessionStorage.removeItem("selectedSeats");
        sessionStorage.removeItem("selectedLichChieuId");
        // Reset state cục bộ
        setSelectedSeats([]);
        setDisplaySelectedSeats([]);
        setTotalPrice(0);
        clearTimer();
      })();
    } else {
      console.log(
        "[Mount] Không có ghế trong sessionStorage hoặc đã được thanh toán."
      );
    }

    // 2. Logic xử lý khi component unmount (người dùng rời khỏi trang chi tiết phim)
    const handleUnmount = async () => {
      // Kiểm tra lại cờ `justNavigatedFromThanhToan` bằng cách đọc trực tiếp từ sessionStorage
      // (Vì đây là hàm cleanup, nó có thể chạy sau khi navigate đã được gọi và cờ đã được set)
      const currentCameFromThanhToan = sessionStorage.getItem(
        "justNavigatedFromThanhToan"
      );

      // Nếu KHÔNG phải đang trong quá trình thanh toán và có ghế đang được chọn
      // (tức là người dùng điều hướng nội bộ SPA sang một trang khác KHÔNG phải /check-out)
      if (
        currentCameFromThanhToan !== "true" &&
        selectedSeatsRef.current.length > 0 &&
        selectedLichChieuIdRef.current !== null
      ) {
        console.log(
          "[Unmount] Component unmounting (điều hướng trong SPA không phải checkout), giải phóng ghế."
        );
        await releaseSeatsApiCore(
          selectedSeatsRef.current,
          selectedLichChieuIdRef.current
        );
        sessionStorage.removeItem("selectedSeats");
        sessionStorage.removeItem("selectedLichChieuId");
      } else {
        console.log(
          "[Unmount] Không giải phóng ghế (đã thanh toán hoặc không có ghế được chọn)."
        );
      }
      // Đảm bảo cờ luôn được reset về 'false' khi rời trang, trừ khi đó là chuyển sang trang thanh toán.
      // Dòng này cần đặt cẩn thận để không ghi đè cờ 'true' khi navigate.
      // Tốt nhất là nó sẽ được xử lý ở đầu useEffect (khi mount) hoặc trong handleThanhToanClick
    };

    // 3. Logic xử lý khi người dùng đóng tab/trình duyệt hoặc tải lại trang
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      const currentCameFromThanhToan = sessionStorage.getItem(
        "justNavigatedFromThanhToan"
      );

      if (currentCameFromThanhToan === "true") {
        console.log(
          "[beforeunload] Vừa chuyển từ thanh toán, không giải phóng ghế."
        );
        return; // Không làm gì nếu đang trong quá trình chuyển hướng đến trang thanh toán
      }

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
          console.log("[beforeunload] Sending beacon to release seats.");
          navigator.sendBeacon(`${BASE_URL}/api/release-seats-on-exit`, blob);
        } catch (error) {
          console.error("sendBeacon error:", error);
        }
        // Hiển thị cảnh báo cho người dùng
        event.preventDefault();
        event.returnValue = "";
      }
      // Dù có gửi beacon hay không, nếu không phải từ thanh toán, reset cờ
      sessionStorage.setItem("justNavigatedFromThanhToan", "false");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Lưu trạng thái ghế vào sessionStorage mỗi khi selectedSeats hoặc selectedLichChieuId thay đổi
    if (selectedSeats.length > 0 && selectedLichChieuId !== null) {
      sessionStorage.setItem("selectedSeats", JSON.stringify(selectedSeats));
      sessionStorage.setItem(
        "selectedLichChieuId",
        String(selectedLichChieuId)
      );
    } else {
      sessionStorage.removeItem("selectedSeats");
      sessionStorage.removeItem("selectedLichChieuId");
    }

    // Hàm cleanup chạy khi component unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      handleUnmount(); // Gọi hàm xử lý unmount trong SPA
    };
  }, [
    id,
    location.pathname,
    releaseSeatsApiCore,
    clearTimer,
    selectedSeats,
    selectedLichChieuId,
  ]); // Thêm selectedSeats và selectedLichChieuId để re-run khi thay đổi

  useEffect(() => {
    if (selectedLichChieuId !== null && lichChieuList.length > 0) {
      const foundLichChieu = (lichChieuList as ILichChieu[]).find(
        (lc) => lc.id === selectedLichChieuId
      );
      setSelectedLichChieu(foundLichChieu || null);
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
          ghe_id: ghe.id,
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

  if (
    loadingMovie ||
    loadingLichChieu ||
    phongQuery.isLoading ||
    rapQuery.isLoading ||
    loadingCheckGhe ||
    isLoadingGhe
  )
    return <Spin />;
  if (!movie) return <p>Không tìm thấy phim</p>;

  // --- Logic xử lý thanh toán ---
  const handleThanhToanClick = () => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;

    if (!user) {
      message.warning("Vui lòng đăng nhập trước khi thanh toán.");
      navigate("/login");
      return;
    }

    if (!selectedLichChieuId || selectedSeats.length === 0) {
      message.warning("Vui lòng chọn ghế trước khi thanh toán.");
      return;
    }

    if (displaySelectedSeats.length !== selectedSeats.length) {
      message.error("Lỗi dữ liệu ghế hoặc giá vé. Vui lòng thử lại.");
      return;
    }

    clearTimer(); // Dừng bộ đếm thời gian
    setIsProcessingPayment(true); // Đặt cờ đang xử lý thanh toán

    // Rất quan trọng: Thiết lập cờ này TRƯỚC KHI navigate
    sessionStorage.setItem("justNavigatedFromThanhToan", "true");

    const dat_ve_chi_tiet: IDatVeChiTietPayload[] = displaySelectedSeats.map(
      (seatInfo) => ({
        ghe_id: seatInfo.ghe_id,
        gia_ve: seatInfo.gia,
      })
    );

    const payload = {
      dat_ve: [
        {
          lich_chieu_id: selectedLichChieuId,
          nguoi_dung_id: user.id,
          tong_tien: Number(totalPrice),
        },
      ],
      dat_ve_chi_tiet: dat_ve_chi_tiet,
    };

    console.log("Dữ liệu gửi đi:", payload);

    createDatVe(payload, {
      onSuccess: (response) => {
        message.success("Đặt vé thành công!");
        // Xóa thông tin ghế đã chọn khỏi sessionStorage sau khi đã đặt vé thành công
        sessionStorage.removeItem("selectedSeats");
        sessionStorage.removeItem("selectedLichChieuId");
        // Cờ justNavigatedFromThanhToan đã được set true trước navigate, sẽ được xóa ở trang check-out hoặc khi quay lại
        navigate("/check-out", {
          state: { bookingData: response.data },
        });
        setIsProcessingPayment(false);
      },
      onError: (error) => {
        message.error(
          "Thanh toán thất bại: " + (error.message || "Lỗi không xác định")
        );
        setIsProcessingPayment(false);
        // Nếu thanh toán thất bại, quan trọng là đặt lại cờ để cho phép giải phóng ghế nếu người dùng thoát
        sessionStorage.setItem("justNavigatedFromThanhToan", "false");
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
    /* 4️⃣ RÀNG BUỘC A. KHÔNG CHO CHỌN GHẾ CÁCH QUÃNG                    */
    /* Chỉ áp dụng cho loai_ghe_id 1 và 2                                */
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
    /* 5️⃣ RÀNG BUỘC B. KHÔNG CHỌN GHẾ KẾ RÌA NẾU GHẾ RÌA CHƯA CHỌN        */
    /* Chỉ áp dụng cho loai_ghe_id 1 và 2                                */
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
    /* 6️⃣ HỢP LỆ → CẬP NHẬT STATE VÀ GỌI API                            */
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
            releaseOccupiedSeatsForUI();
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
                disabled={
                  selectedSeats.length === 0 || hasGap || isProcessingPayment
                }
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

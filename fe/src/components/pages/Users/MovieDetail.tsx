// MovieDetailUser.tsx
import { useCallback, useEffect, useState, useRef } from "react";
import { Button, Spin, Image, Modal, message } from "antd";
import {
  ClockCircleOutlined,
  FieldTimeOutlined,
  GlobalOutlined,
  PlayCircleOutlined,
  TagOutlined,
  UsergroupDeleteOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
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
import "./MovieDetailUser.css";
import { ILichChieu } from "../Admin/interface/lichchieu";
import { IPhongChieu } from "../Admin/interface/phongchieu";
import LichChieuDatVe from "./DatVe/LichChieuDatve";
import SoDoGhe from "../Admin/PhongChieu/SoDoGhe";
import { IGhe } from "../Admin/interface/ghe";
import { ICheckGhe } from "../Admin/interface/checkghe";
import { useBookingTimer } from "./DatVe/useBookingTimer";
import { IDatVeChiTietPayload } from "../Admin/interface/datve";
import { useBackConfirm } from "../../hook/useConfirmBack";
import { SelectedFoodItem } from "./DatVe/DonDoAn";
import FoodSelectionDisplay from "./DatVe/DonDoAn";
import DuongCongManHinh from "./DuongCongManHinh";
import DanhGiaForm from "./DanhGia";

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

const MovieDetailUser = () => {
  const TIMEOUT_MINUTES = 500;
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
  const [selectedFoods, setSelectedFoods] = useState<SelectedFoodItem[]>([]);
  const { mutate: updateCheckGhe } = useUpdateCheckGhe({
    resource: "check_ghe",
  });
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [displaySelectedSeats, setDisplaySelectedSeats] = useState<
    SelectedSeatWithPrice[]
  >([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  // const [hasGap, setHasGap] = useState(false);
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
  const handleFoodQuantityChange = (updatedFoodItem: SelectedFoodItem) => {
    setSelectedFoods((prevFoods) => {
      const existingFoodIndex = prevFoods.findIndex(
        (item) => item.id === updatedFoodItem.id
      );

      // Nếu số lượng mới <= 0, nghĩa là người dùng muốn xóa món ăn hoặc giảm về 0
      if (updatedFoodItem.quantity <= 0) {
        if (existingFoodIndex > -1) {
          // Nếu món ăn tồn tại trong danh sách, xóa nó đi
          const newFoods = [...prevFoods];
          newFoods.splice(existingFoodIndex, 1);
          return newFoods;
        }
        return prevFoods; // Không làm gì nếu không tìm thấy món ăn và số lượng <= 0
      } else {
        // Nếu số lượng mới > 0
        if (existingFoodIndex > -1) {
          // Nếu món ăn đã tồn tại, cập nhật số lượng của nó
          const newFoods = [...prevFoods];
          newFoods[existingFoodIndex] = updatedFoodItem;
          return newFoods;
        } else {
          // Nếu món ăn chưa tồn tại, thêm nó vào danh sách
          return [...prevFoods, updatedFoodItem];
        }
      }
    });
  };
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
  useEffect(() => {}, [checkGheList]);
  // Hàm core để giải phóng ghế trên API
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
              values: { trang_thai: "trong", nguoi_dung_id: null }, // Giải phóng ghế
              lichChieuId: lichChieuIdToProcess,
            });
          }
        }
      }
    },
    [updateCheckGhe]
  );

  // Hàm giải phóng ghế và reset UI (dùng cho timeout hoặc chuyển lịch chiếu)
  const releaseOccupiedSeatsForUI = useCallback(async () => {
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

  const selectedCheckGhe = checkGheList.filter(
    (item: any) =>
      selectedSeats.includes(item.ghe.so_ghe) &&
      item.lich_chieu_id === selectedLichChieuId &&
      item.trang_thai === "dang_dat"
  );

  //-------XỬ LÝ LOAD TRANG-------------
  useBackConfirm(selectedCheckGhe);

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
    if (
      !selectedLichChieu ||
      !selectedLichChieu.gia_ve ||
      (selectedSeats.length === 0 && selectedFoods.length === 0) ||
      danhSachGhe.length === 0
    ) {
      if (totalPrice !== 0) setTotalPrice(0);
      if (displaySelectedSeats.length > 0) setDisplaySelectedSeats([]);
      return;
    }

    let currentTotalPrice = 0;
    const seatsToCalculateDisplay: SelectedSeatWithPrice[] = [];

    selectedSeats.forEach((seatNumber) => {
      const ghe = danhSachGhe.find((g: IGhe) => g.so_ghe === seatNumber);

      if (!ghe) return;

      const loaiGheIdCuaGhe = ghe.loai_ghe_id;
      const giaVeItem = selectedLichChieu.gia_ve.find(
        (gv) => gv.pivot.loai_ghe_id === loaiGheIdCuaGhe
      );

      let price = 0;
      let tenLoaiGhe = "Không xác định";

      if (giaVeItem) {
        price = parseFloat(giaVeItem.pivot.gia_ve);
        tenLoaiGhe = giaVeItem.ten_loai_ghe;

        // Nếu ghế đôi thì chia đôi giá
        if (
          loaiGheIdCuaGhe === 3 ||
          tenLoaiGhe.toLowerCase() === "đôi" ||
          tenLoaiGhe.toLowerCase() === "doi"
        ) {
          price = price / 2;
        }
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
    });

    // Tính tổng tiền đồ ăn
    const foodTotalPrice = selectedFoods.reduce((sum, foodItem) => {
      return sum + foodItem.gia_ban * foodItem.quantity;
    }, 0);

    currentTotalPrice += foodTotalPrice;

    // Cập nhật totalPrice nếu thay đổi
    if (totalPrice !== currentTotalPrice) {
      setTotalPrice(currentTotalPrice);
    }

    // Cập nhật displaySelectedSeats nếu thay đổi
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
    selectedFoods,
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

    // Chỉnh sửa điều kiện kiểm tra để bao gồm cả đồ ăn
    if (selectedLichChieuId === null && selectedFoods.length === 0) {
      message.warning("Vui lòng chọn ghế hoặc đồ ăn trước khi thanh toán.");
      return;
    }

    // Nếu không có ghế nào được chọn nhưng có đồ ăn, thì vẫn cho phép thanh toán đồ ăn
    if (selectedSeats.length === 0 && selectedFoods.length === 0) {
      message.warning("Vui lòng chọn ghế hoặc đồ ăn trước khi thanh toán.");
      return;
    }

    clearTimer(); // Dừng bộ đếm thời gian
    setIsProcessingPayment(true); // Đặt cờ đang xử lý thanh toán

    // Rất quan trọng: Thiết lập cờ này TRƯỚC KHI navigate
    sessionStorage.setItem("justNavigatedFromThanhToan", "true");

    const dat_ve_chi_tiet: IDatVeChiTietPayload[] = displaySelectedSeats.map(
      (seatInfo) => ({
        ghe_id: seatInfo.ghe_id,
        gia_ve: seatInfo.gia, // Đảm bảo rằng seatInfo.gia đã được định nghĩa và có giá trị đúng
      })
    );

    // CHUẨN BỊ DỮ LIỆU ĐỒ ĂN TỪ selectedFoods STATE
    const don_do_an_payload = selectedFoods.map((foodItem) => ({
      do_an_id: foodItem.id, // ID của món ăn
      so_luong: foodItem.quantity, // Số lượng món ăn
      gia_ban: foodItem.gia_ban, // Giá bán của món ăn (đảm bảo foodItem.gia_ban có trong SelectedFoodItem)
    }));

    const payload = {
      dat_ve: [
        {
          lich_chieu_id: selectedLichChieuId, // Có thể null nếu chỉ đặt đồ ăn, backend cần xử lý
          nguoi_dung_id: user.id,
          tong_tien: Number(totalPrice),
        },
      ],
      dat_ve_chi_tiet: dat_ve_chi_tiet,
      don_do_an: don_do_an_payload, // <-- ĐÃ THÊM DỮ LIỆU ĐỒ ĂN VÀO ĐÂY!
    };

    createDatVe(payload, {
      onSuccess: (response) => {
        message.success("Đặt vé thành công!");
        // Xóa thông tin ghế đã chọn khỏi sessionStorage sau khi đã đặt vé thành công
        sessionStorage.removeItem("selectedSeats");
        sessionStorage.removeItem("selectedLichChieuId");
        setSelectedFoods([]); // RẤT QUAN TRỌNG: reset state đồ ăn sau khi đặt thành công
        // Cờ justNavigatedFromThanhToan đã được set true trước navigate, sẽ được xóa ở trang check-out hoặc khi quay lại
        navigate("/check-out", {
          state: { bookingData: response.data },
        });
        setIsProcessingPayment(false);
      },
      onError: (error) => {
        console.error("Lỗi thanh toán:", error); // Log lỗi chi tiết để debug
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
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    if (!user) {
      message.error("Bạn chưa đăng nhập!");
      return;
    }

    const ghe = danhSachGhe.find((g: any) => g.id === gheId);

    if (!ghe) return;

    let seatsToToggle: IGhe[] = [ghe];

    if (ghe.loai_ghe_id === 3) {
      const row = ghe.so_ghe[0];
      const col = parseInt(ghe.so_ghe.slice(1));
      const pairCol = col % 2 === 0 ? col - 1 : col + 1;
      const pairSoGhe = `${row}${pairCol}`;
      const pair = danhSachGhe.find(
        (g: any) => g.so_ghe === pairSoGhe && g.loai_ghe_id === 3
      );
      if (!pair) {
        message.warning("Không tìm thấy ghế đôi còn lại.");
        return;
      }
      seatsToToggle.push(pair);
    }

    const anySeatSold = seatsToToggle.some((st) =>
      checkGheList.some(
        (item: any) =>
          item.ghe_id === st.id &&
          item.lich_chieu_id === selectedLichChieuId &&
          item.trang_thai === "da_dat"
      )
    );
    if (anySeatSold) {
      message.info("Một hoặc cả hai ghế đã được bán.");
      return;
    }

    const newTrangThai =
      currentTrangThai === "trong"
        ? "dang_dat"
        : currentTrangThai === "dang_dat"
        ? "trong"
        : "";

    if (!newTrangThai) return;

    let newSelectedSeats = [...selectedSeats];
    const toggleSoGhe = seatsToToggle.map((s) => s.so_ghe);

    if (newTrangThai === "dang_dat") {
      toggleSoGhe.forEach((s) => {
        if (!newSelectedSeats.includes(s)) newSelectedSeats.push(s);
      });
    } else {
      newSelectedSeats = newSelectedSeats.filter(
        (s) => !toggleSoGhe.includes(s)
      );
    }

    const getTrangThai = (soGhe: string): string => {
      if (newSelectedSeats.includes(soGhe)) return "dang_dat";
      const inDb = checkGheList.find(
        (x: any) =>
          x.ghe.so_ghe === soGhe && x.lich_chieu_id === selectedLichChieuId
      );
      return inDb?.trang_thai || "trong";
    };

    if (
      newTrangThai === "dang_dat" &&
      (ghe.loai_ghe_id === 1 || ghe.loai_ghe_id === 2)
    ) {
      const row = ghe.so_ghe[0];
      const num = parseInt(ghe.so_ghe.slice(1));

      const rowSeats = danhSachGhe
        .filter(
          (g: any) =>
            g.so_ghe[0] === row && (g.loai_ghe_id === 1 || g.loai_ghe_id === 2)
        )
        .sort(
          (a: any, b: any) =>
            parseInt(a.so_ghe.slice(1)) - parseInt(b.so_ghe.slice(1))
        );

      const min = parseInt(rowSeats[0].so_ghe.slice(1));
      const max = parseInt(rowSeats[rowSeats.length - 1].so_ghe.slice(1));

      const isSecondFromLeft = num === min + 1;
      const isSecondFromRight = num === max - 1;

      const ghe3FromLeft = `${row}${min + 2}`;
      const ghe3FromRight = `${row}${max - 2}`;
      const tGhe3Left = getTrangThai(ghe3FromLeft);
      const tGhe3Right = getTrangThai(ghe3FromRight);

      if (isSecondFromLeft && tGhe3Left !== "da_dat") {
        const ghe1 = `${row}${min}`;
        const ghe3 = `${row}${min + 2}`;
        const t1 = getTrangThai(ghe1);
        const t3 = getTrangThai(ghe3);
        if (t1 === "trong" && !(t3 === "dang_dat" || t3 === "da_dat")) {
          message.warning("Không được để lại 1 ghế trống đơn lẻ ở đầu hàng!");
          return;
        }
      }

      if (isSecondFromRight && tGhe3Right !== "da_dat") {
        const ghe1 = `${row}${max}`;
        const ghe3 = `${row}${max - 2}`;
        const t1 = getTrangThai(ghe1);
        const t3 = getTrangThai(ghe3);
        if (t1 === "trong" && !(t3 === "dang_dat" || t3 === "da_dat")) {
          message.warning("Không được để lại 1 ghế trống đơn lẻ ở cuối hàng!");
          return;
        }
      }

      // ❌ THÊM TRƯỜNG HỢP: A3 đã mua, A4-A6 đều trống, cấm chọn A5
      const gheIndex = rowSeats.findIndex((g: any) => g.id === ghe.id);
      const prev2 = rowSeats[gheIndex - 2];
      const prev1 = rowSeats[gheIndex - 1];
      const next1 = rowSeats[gheIndex + 1];

      if (
        prev2 &&
        prev1 &&
        next1 &&
        getTrangThai(prev2.so_ghe) === "da_dat" &&
        getTrangThai(prev1.so_ghe) === "trong" &&
        getTrangThai(ghe.so_ghe) === "trong" &&
        getTrangThai(next1.so_ghe) === "trong"
      ) {
        message.warning(
          "Không được chọn ghế nếu phía trước đã bán và kèm 2 ghế trống liên tiếp."
        );
        return;
      }
    }

    const row = ghe.so_ghe[0];
    const rowSeats = danhSachGhe
      .filter(
        (g: any) =>
          g.so_ghe[0] === row && (g.loai_ghe_id === 1 || g.loai_ghe_id === 2)
      )
      .sort(
        (a: any, b: any) =>
          parseInt(a.so_ghe.slice(1)) - parseInt(b.so_ghe.slice(1))
      );
    const gheIndex = rowSeats.findIndex((g: any) => g.id === ghe.id);
    const prev = rowSeats[gheIndex - 1];
    const next = rowSeats[gheIndex + 1];

    const tPrev = prev ? getTrangThai(prev.so_ghe) : null;
    const tNext = next ? getTrangThai(next.so_ghe) : null;

    // ❌ Trường hợp không được huỷ: [da_dat][dang_dat-1][dang_dat-2]
    if (
      tPrev === "da_dat" &&
      tNext === "dang_dat" &&
      toggleSoGhe.includes(ghe.so_ghe)
    ) {
      message.warning(
        "Không thể huỷ ghế đang chọn vì sẽ để ghế đã bán kẹp giữa ghế đang chọn!"
      );
      return;
    }
    const emptySeats = rowSeats.filter(
      (g: any) => getTrangThai(g.so_ghe) === "trong"
    );

    if (emptySeats.length > 2) {
      const hasFloatingMiddle = rowSeats.some((g: any, i: number) => {
        const cur = g;
        const prev = rowSeats[i - 1];
        const next = rowSeats[i + 1];

        if (!prev || !next) return false;

        const tPrev = getTrangThai(prev.so_ghe);
        const tCur = getTrangThai(cur.so_ghe);
        const tNext = getTrangThai(next.so_ghe);

        if (tPrev === "dang_dat" && tNext === "dang_dat" && tCur === "trong") {
          const tPrev2 =
            i - 2 >= 0 ? getTrangThai(rowSeats[i - 2].so_ghe) : null;
          const tNext2 =
            i + 2 < rowSeats.length
              ? getTrangThai(rowSeats[i + 2].so_ghe)
              : null;

          if (
            (!tPrev2 || tPrev2 === "trong") &&
            (!tNext2 || tNext2 === "trong")
          ) {
            return true;
          }
        }
        return false;
      });

      if (hasFloatingMiddle) {
        message.warning(
          "Không được để 1 ghế trống bị kẹp giữa 2 ghế chọn, xung quanh cũng trống."
        );
        return;
      }
    }
    const isInvalidSoldGapSelectedGap = rowSeats.some((g: any, i: number) => {
      const g1 = g;
      const g2 = rowSeats[i + 1];
      const g3 = rowSeats[i + 2];
      const g4 = rowSeats[i + 3];

      if (!g1 || !g2 || !g3 || !g4) return false;

      const t1 = getTrangThai(g1.so_ghe);
      const t2 = getTrangThai(g2.so_ghe);
      const t3 = getTrangThai(g3.so_ghe);
      const t4 = getTrangThai(g4.so_ghe);

      const caseLeftToRight =
        t1 === "da_dat" &&
        t2 === "trong" &&
        t3 === "dang_dat" &&
        t4 === "trong";

      const caseRightToLeft =
        t1 === "trong" &&
        t2 === "dang_dat" &&
        t3 === "trong" &&
        t4 === "da_dat";

      return caseLeftToRight || caseRightToLeft;
    });

    if (isInvalidSoldGapSelectedGap) {
      message.warning("Không được để ghế đã mua - trống - đang mua - trống.");
      return;
    }
    const isGapBetweenDangDat = rowSeats.some((g: any, i: number) => {
      const t1 = getTrangThai(rowSeats[i]?.so_ghe);
      const t2 = getTrangThai(rowSeats[i + 1]?.so_ghe);
      const t3 = getTrangThai(rowSeats[i + 2]?.so_ghe);
      const t4 = getTrangThai(rowSeats[i + 3]?.so_ghe);

      return (
        t1 === "dang_dat" &&
        t2 === "dang_dat" &&
        t3 === "trong" &&
        t4 === "dang_dat"
      );
    });

    if (isGapBetweenDangDat) {
      message.warning("Không được để trống ghế giữa các ghế đang đặt.");
      return;
    }
    if (newTrangThai === "trong") {
      const isMiddleUnselect = rowSeats.some((g: any, i: number) => {
        const prev = rowSeats[i - 1];
        const next = rowSeats[i + 1];

        if (!prev || !next) return false;

        const tPrev = getTrangThai(prev.so_ghe);
        const tCur = g.so_ghe;
        const tNext = getTrangThai(next.so_ghe);

        // Nếu ghế hiện tại là ghế đang bỏ chọn và bị kẹp giữa 2 ghế đang giữ
        return (
          toggleSoGhe.includes(tCur) &&
          tPrev === "dang_dat" &&
          tNext === "dang_dat"
        );
      });

      if (isMiddleUnselect) {
        message.warning("Không thể hủy ghế ở giữa 2 ghế đang chọn!");
        return;
      }
    }
    setSelectedSeats(newSelectedSeats);
    // THÊM ĐOẠN NÀY NGAY SAU setSelectedSeats(newSelectedSeats);
    if (newSelectedSeats.length === 0) {
      setSelectedFoods([]); // Reset selectedFoods nếu không còn ghế nào được chọn
    }
    // KẾT THÚC ĐOẠN THÊM

    seatsToToggle.forEach((gheToggle) => {
      const found = checkGheList.find(
        (x: any) =>
          x.ghe_id === gheToggle.id && x.lich_chieu_id === selectedLichChieuId
      );
      if (found) {
        updateCheckGhe({
          id: found.id,
          values: { trang_thai: newTrangThai, nguoi_dung_id: user?.id || null },
          lichChieuId: selectedLichChieuId,
        });
      }
    });
  };

  return (
    <div className="movie-detail-wrapper">
      <div className="movie-detail-container">
        <div className="movie-poster" style={{ position: "sticky", top: "130px" }}>
          <Image
            src={`${BASE_URL}/storage/${movie.anh_poster}`}
            alt={movie.ten_phim}
            width={"100%"}
            style={{ objectFit: "cover" }}
            fallback="https://via.placeholder.com/240x360?text=No+Image"
            className="movie-poster-img"
          />
        </div>

        <div className="movie-content">
          <h1>{movie.ten_phim.toUpperCase()}</h1>
          <ul className="movie-attributes">
            <li>
              <span>
                <TagOutlined />
              </span>
              {movie.the_loai_id
                ? JSON.parse(movie.the_loai_id)
                    .map((genre: any) => genre.ten_the_loai)
                    .join(", ")
                : movie.the_loai
                ? movie.the_loai.join(", ")
                : "Chưa cập nhật"}
            </li>
            <li>
              <span>
                <FieldTimeOutlined />
              </span>
              {movie.thoi_luong}'
            </li>

            <li>
              <span>
                <VideoCameraOutlined />
              </span>{" "}
              2D
            </li>
            <li>
              <span>
                <GlobalOutlined />
              </span>{" "}
              {movie.ngon_ngu}
            </li>
            <li>
              <span>
                <UsergroupDeleteOutlined />
              </span>{" "}
              <div className="movie-age-warning">
                Phim dành cho độ tuổi từ đủ {movie.do_tuoi_gioi_han} tuổi trở
                lên ({movie.do_tuoi_gioi_han}+)
              </div>
            </li>
          </ul>
          <div className="movie-section">
            <h3>MÔ TẢ</h3>
            <div
              style={{ color: "white" }}
              dangerouslySetInnerHTML={{ __html: movie.mo_ta }}
            />
          </div>
          <button className="play-button-detail" onClick={handleShowModal}>
            <PlayCircleOutlined
              style={{ fontSize: "18px", marginRight: "5px" }}
            />
            <span> Xem Trailer</span>
          </button>
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
        style={{
          fontFamily: "Anton, sans-serif",
          fontWeight: 100,
          fontSize: 50,
          borderRadius: 4,
        }}
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
      <h3 className="lich-chieu-title">LỊCH CHIẾU</h3>
      <LichChieuDatVe
        groupedLichChieu={groupedLichChieu}
        rapList={rapList}
        onLichChieuClick={(lichChieu) => {
          if (selectedLichChieuId !== lichChieu.id) {
            releaseOccupiedSeatsForUI();
            clearTimer();
          }
          const phong = phongList.find(
            (p: IPhongChieu) => p.id === lichChieu.phong_id
          );
          if (phong) setSelectedPhong(phong);
          setSelectedLichChieuId(lichChieu.id);
          setSelectedSeats([]);
          setDisplaySelectedSeats([]);
          setTotalPrice(0);
          setSelectedFoods([]); // Reset foods when changing lich chieu
        }}
        selectedLichChieuId={selectedLichChieuId}
      />
      {selectedPhong && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxWidth: 1200,
            marginTop: 110,
            boxSizing: "border-box",
          }}
        >
          <h3 className="selected-seats-title">
            Chọn ghế: {selectedPhong.ten_phong} - {tenRap}
          </h3>

          {/* Màn hình cong */}
          <div style={{ position: "relative", width: "100%", marginTop: 20 }}>
            <DuongCongManHinh />
          </div>

          {/* Sơ đồ ghế */}
          <div
            style={{
              width: "100%",
              maxWidth: 650,
              marginTop: 30,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              className="sodoghe"
              style={{
                paddingTop: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
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

              {/* Chú thích ghế */}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly", // giãn đều các chú thích
              flexWrap: "wrap", // nếu chật thì xuống dòng
              userSelect: "none",
              marginTop: 30,
              width: "100%",
              maxWidth: "1200px", // tránh dãn quá rộng
              marginInline: "auto",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              {/* Ghế chọn */}
              <div
                style={{
                  width: "40px",
                  height: "29px",
                  backgroundColor: "yellow",
                  borderRadius: "8px",
                  border: "none",
                  opacity: 1,
                  visibility: "visible",
                  pointerEvents: "auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  userSelect: "none",
                  margin: "3px 0",
                  position: "relative",
                }}
              ></div>

              {/* Chữ "Ghế thường" */}
              <span
                style={{
                  fontSize: "15px",
                  fontWeight: 500,
                  color: "#fff",
                  userSelect: "none",
                }}
              >
                Ghế Chọn
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              {/* Ghế chọn */}
              <div
                style={{
                  width: "40px",
                  height: "29px",
                  backgroundColor: "#302c4c",
                  borderRadius: "8px",
                  border: "none",
                  opacity: 1,
                  visibility: "visible",
                  pointerEvents: "auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  userSelect: "none",
                  margin: "3px 0",
                  position: "relative",
                }}
              ></div>

              {/* Chữ "Ghế thường" */}
              <span
                style={{
                  fontSize: "15px",
                  fontWeight: 500,
                  color: "#fff",
                  userSelect: "none",
                }}
              >
                Ghế Đã Đặt
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              {/* Ghế thường */}
              <div
                style={{
                  width: "40px",
                  height: "29px",
                  backgroundColor: "#ccc",
                  borderRadius: "8px",
                  border: "1px solid black",
                  opacity: 1,
                  visibility: "visible",
                  pointerEvents: "auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  userSelect: "none",
                  margin: "3px 0",
                  position: "relative",
                }}
              ></div>

              {/* Chữ "Ghế thường" */}
              <span
                style={{
                  fontSize: "15px",
                  fontWeight: 500,
                  color: "#fff",
                  userSelect: "none",
                }}
              >
                Ghế Thường
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              {/* Ghế VIP */}
              <div
                style={{
                  width: "40px",
                  height: "29px",
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  border: "3px solid blue",
                  opacity: 1,
                  visibility: "visible",
                  pointerEvents: "auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  userSelect: "none",
                  margin: "3px 0",
                  position: "relative",
                }}
              ></div>

              {/* Chữ "Ghế vip" */}
              <span
                style={{
                  fontSize: "15px",
                  fontWeight: 500,
                  color: "#fff",
                  userSelect: "none",
                }}
              >
                Ghế Vip
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              {/* Ghế đôi */}
              <div
                style={{
                  width: "70px",
                  height: "30px",
                  backgroundColor: "transparent",
                  border: "none",
                  display: "flex",
                  position: "relative",
                  margin: "5px 0",
                  opacity: 1,
                  userSelect: "none",
                  alignItems: "center",
                  padding: "0px",
                }}
              >
                <div
                  style={{
                    width: "50%",
                    height: "100%",
                    backgroundColor: "#fff",
                    borderTop: "1.5px solid black",
                    borderBottom: "1.5px solid black",
                    borderLeft: "1.5px solid black",
                    borderRight: "none",
                    borderRadius: "5px",
                    boxSizing: "border-box",
                  }}
                />
                <div
                  style={{
                    width: "50%",
                    height: "100%",
                    backgroundColor: "#fff",
                    borderTop: "1.5px solid black",
                    borderBottom: "1.5px solid black",
                    borderRight: "1.5px solid black",
                    borderLeft: "none",
                    borderRadius: "5px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Chữ "Ghế đôi" */}
              <span
                style={{
                  fontSize: "15px",
                  fontWeight: 500,
                  color: "#fff",
                  userSelect: "none",
                }}
              >
                Ghế Đôi
              </span>
            </div>
          </div>
          {/* Hiển thị đồ ăn */}

          {/* Đồ ăn bên dưới (nếu có ghế) */}

          <div className="food-selection-area">
            <h3 className="lich-chieu-title">CHỌN ĐỒ ĂN KÈM</h3>
            <div className="food-selection-container">
              {/* Danh sách đồ ăn bên trái */}
              <div className="food-list-section">
                <h4 className="food-list-title">Danh sách món ăn</h4>

                <div className="food-list-scroll">
                  <FoodSelectionDisplay
                    onFoodQuantityChange={handleFoodQuantityChange}
                  />
                </div>
              </div>

              {/* Đồ ăn đã chọn bên phải */}
              <div className="selected-foods-section">
                <h4 className="selected-foods-title">
                  Đồ ăn đã chọn ({selectedFoods.length})
                </h4>

                {selectedFoods.length === 0 ? (
                  <div className="empty-selection-message">
                    Chưa có món ăn nào được chọn
                  </div>
                ) : (
                  <>
                    <div className="selected-foods-scroll">
                      <div className="selected-foods-list">
                        {selectedFoods.map((food, index) => (
                          <div key={food.id} className="selected-food-item">
                            <div className="selected-food-info">
                              <div className="selected-food-name">
                                {food.ten_do_an}
                              </div>
                              <div className="selected-food-quantity">
                                <span>Số lượng:</span>
                                <span className="quantity-badge">
                                  {food.quantity}
                                </span>
                              </div>
                            </div>

                            <div className="selected-food-price">
                              {(food.gia_ban * food.quantity).toLocaleString()}{" "}
                              VNĐ
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tổng tiền */}
                    <div className="total-section">
                      <span className="total-label">Tổng cộng:</span>
                      <span className="total-amount">
                        {selectedFoods
                          .reduce(
                            (total, food) =>
                              total + food.gia_ban * food.quantity,
                            0
                          )
                          .toLocaleString()}{" "}
                        VNĐ
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          {/* Kết thúc phần đồ ăn */}
        </div>
      )}

      {/* PHẦN ĐÁNH GIÁ PHIM */}
      <div>
        <DanhGiaForm
          id={movie.id}
          phim={movie}
          onSubmit={() => {
            message.success("Đánh giá đã được gửi!");
          }}
        />
      </div>
      {/* PHẦN FOOTER CỐ ĐỊNH Ở DƯỚI CÙNG */}
      {(selectedSeats.length > 0 || selectedFoods.length > 0) && ( // Footer hiển thị nếu có ghế HOẶC đồ ăn
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "#0c0b1f",
            color: "white",
            padding: "12px 10%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 1000,
            fontSize: 16,
            fontWeight: 500,
            height: 100,
            borderTop: "1px solid #333",
          }}
        >
          <div style={{ display: "flex", gap: 40 }}>
            <div>
              <div
                style={{
                  fontWeight: "100",
                  fontFamily: "Anton",
                  fontSize: 25,
                  marginBottom: 10,
                }}
              >
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
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                backgroundColor: "yellow", // vàng đất giống hình
                color: "#000",
                padding: "15px 10px",
                borderRadius: 4,
                fontWeight: 600,
                fontSize: 10,
                display: "inline-block",
              }}
            >
              <div style={{ marginBottom: 5, gap: 0, fontSize: 13 }}>
                <span>Thời gian giữ vé:</span>
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: "100",
                  letterSpacing: 1,
                  fontFamily: "Anton, sans-serif",
                }}
              >
                {selectedSeats.length > 0
                  ? formatTime(remainingTime)
                  : formatTime(TIMEOUT_MINUTES * 60)}
              </div>
            </div>
            <div style={{ textAlign: "left" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12,
                  fontWeight: 600,
                }}
              >
                <span style={{ color: "#aaa", fontSize: 16, marginRight: 60 }}>
                  Tạm tính
                </span>
                <span style={{ fontSize: 16, color: "#ffff" }}>
                  {totalPrice.toLocaleString("vi-VN")} VNĐ
                </span>
              </div>

              <button
                className="btn-dat-ve"
                onClick={handleThanhToanClick}
                style={{
                  width: "100%",
                  fontFamily: "Anton, sans-serif",
                  padding: "10px 16px",
                  fontSize: 15,
                  backgroundColor: "yellow",
                  fontWeight: "100",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                  opacity:
                    selectedSeats.length > 0 || selectedFoods.length > 0
                      ? 1
                      : 0.6,
                  textTransform: "uppercase",
                }}
                disabled={
                  (selectedSeats.length === 0 && selectedFoods.length === 0) ||
                  isProcessingPayment
                }
              >
                <span>Đặt vé</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetailUser;

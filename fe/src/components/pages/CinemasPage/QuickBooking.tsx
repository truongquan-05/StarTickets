import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { getRaps, getTheLoais } from "../../provider/duProvider";
import type { Rap, TheLoai } from "../../types/Uses";
import "./QuickBooking.css";

const QuickBooking = () => {
  const [raps, setRaps] = useState<Rap[]>([]);
  const [theLoais, setTheLoais] = useState<TheLoai[]>([]);
  const [selectedRap, setSelectedRap] = useState<number | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const [rapsOpen, setRapsOpen] = useState(false);
  const [genresOpen, setGenresOpen] = useState(false);

  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Lấy dữ liệu rạp và thể loại
  useEffect(() => {
    getRaps()
      .then((data) => Array.isArray(data) && setRaps(data))
      .catch(() => alert("Không thể lấy danh sách rạp"));

    getTheLoais()
      .then((data) => Array.isArray(data) && setTheLoais(data))
      .catch(() => alert("Không thể lấy danh sách thể loại"));
  }, []);

  const handleSubmit = () => {
    if (!selectedRap || !selectedDate) {
      alert("Vui lòng chọn rạp và ngày chiếu");
      return;
    }

    const searchParams = new URLSearchParams();
    searchParams.append("rap_id", selectedRap.toString());
    selectedGenres.forEach((id) => searchParams.append("the_loai_id", id.toString()));
    searchParams.append("ngay_cong_chieu", selectedDate);

    navigate(`/tim-kiem-phim?${searchParams.toString()}`);
  };

  const handleCheckboxChange = (id: number) => {
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Bắt click ra ngoài để đóng dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setRapsOpen(false);
        setGenresOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="quick-booking-wrapper" ref={wrapperRef}>
      <div className="quick-booking-inner">
        <h2 className="quick-booking-title">LỌC PHIM</h2>
        <div className="quick-booking-form">

          {/* Chọn rạp */}
          <div className="quick-booking-item select-wrapper">
            <div
              className="custom-select-display"
              onClick={(e) => {
                e.stopPropagation();
                setRapsOpen((prev) => !prev);
                setGenresOpen(false); // đóng thể loại nếu mở
              }}
            >
              {selectedRap ? raps.find((r) => r.id === selectedRap)?.ten_rap : "Chọn rạp"}
            </div>
            {rapsOpen && (
              <ul className="custom-select-options" onClick={(e) => e.stopPropagation()}>
                {raps.map((rap) => (
                  <li
                    key={rap.id}
                    className={`custom-select-option ${selectedRap === rap.id ? "selected" : ""}`}
                    onClick={() => {
                      setSelectedRap(rap.id);
                      setRapsOpen(false);
                    }}
                  >
                    {rap.ten_rap}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Chọn thể loại */}
          <div className="quick-booking-item genres-wrapper">
            <div
              className="genres-toggle"
              onClick={(e) => {
                e.stopPropagation();
                setGenresOpen((prev) => !prev);
                setRapsOpen(false); // đóng rạp nếu mở
              }}
            >
              {selectedGenres.length > 0 ? `Đã chọn ${selectedGenres.length} thể loại` : "Chọn Thể loại"}
            </div>
            {genresOpen && (
              <div className="genres-options" onClick={(e) => e.stopPropagation()}>
                {theLoais.map((tl) => (
                  <label key={tl.id} className="genre-item custom-checkbox">
                    <input
                      type="checkbox"
                      value={tl.id}
                      checked={selectedGenres.includes(tl.id)}
                      onChange={() => handleCheckboxChange(tl.id)}
                    />
                    <span className="checkmark"></span>
                    <span>{tl.ten_the_loai}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Ngày chiếu */}
          <div className="quick-booking-item date-wrapper">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={dayjs().format("YYYY-MM-DD")}
              onClick={() => {
                setRapsOpen(false);
                setGenresOpen(false);
              }}
            />
          </div>

          {/* Nút đặt */}
          <div className="quick-booking-item button-wrapper">
            <button className="btn-submit" onClick={handleSubmit}>
              <span>TÌM NGAY</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default QuickBooking;

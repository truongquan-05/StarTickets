import { useEffect, useState } from "react";
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
  const [genresOpen, setGenresOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    getRaps()
      .then((data) => {
        if (Array.isArray(data)) setRaps(data);
        else alert("Dữ liệu rạp không hợp lệ");
      })
      .catch(() => alert("Không thể lấy danh sách rạp"));

    getTheLoais()
      .then((data) => {
        if (Array.isArray(data)) setTheLoais(data);
        else alert("Dữ liệu thể loại không hợp lệ");
      })
      .catch(() => alert("Không thể lấy danh sách thể loại"));
  }, []);

  const handleSubmit = () => {
    if (!selectedRap || !selectedDate) {
      alert("Vui lòng chọn rạp và ngày chiếu");
      return;
    }

    const query = {
      rap_id: selectedRap,
      the_loai_id: selectedGenres,
      ngay_cong_chieu: selectedDate,
    };

    const searchParams = new URLSearchParams();
    searchParams.append("rap_id", query.rap_id.toString());

    if (query.the_loai_id.length > 0) {
      query.the_loai_id.forEach((id) =>
        searchParams.append("the_loai_id[]", id.toString())
      );
    }

    searchParams.append("ngay_cong_chieu", query.ngay_cong_chieu);
    navigate(`/tim-kiem-phim?${searchParams.toString()}`);
  };

  const handleCheckboxChange = (id: number) => {
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  
  const [rapsOpen, setRapsOpen] = useState(false);

  return (
    <div className="quick-booking-wrapper">
      <div className="quick-booking-inner">
        <h2 className="quick-booking-title">LỌC PHIM</h2>
        <div className="quick-booking-form">
          {/* Chọn rạp */}
          <div className="quick-booking-item select-wrapper">
            <div
              className="custom-select-display"
              onClick={() => setRapsOpen((prev) => !prev)}
            >
              {selectedRap
                ? raps.find((r) => r.id === selectedRap)?.ten_rap
                : "Chọn rạp"}
            </div>

            {rapsOpen && (
              <ul className="custom-select-options">
                {raps.map((rap) => (
                  <li
                    key={rap.id}
                    className={`custom-select-option ${
                      selectedRap === rap.id ? "selected" : ""
                    }`}
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
              onClick={() => setGenresOpen(!genresOpen)}
            >
              {selectedGenres.length > 0
                ? `Đã chọn ${selectedGenres.length} thể loại`
                : "Chọn Thể loại"}
            </div>
            {genresOpen && (
              <div className="genres-options">
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

import { useEffect, useState } from "react";
import { Select, Button, DatePicker, message, Checkbox } from "antd";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { getRaps, getTheLoais } from "../../provider/duProvider";
import type { Rap, TheLoai } from "../../types/Uses";
import { DownOutlined } from "@ant-design/icons";

const { Option } = Select;

const QuickBooking = () => {
  const [raps, setRaps] = useState<Rap[]>([]);
  const [theLoais, setTheLoais] = useState<TheLoai[]>([]);
  const [selectedRap, setSelectedRap] = useState<number | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [genresOpen, setGenresOpen] = useState(false);


  const navigate = useNavigate();

  useEffect(() => {
    getRaps()
      .then((data) => {
        if (Array.isArray(data)) setRaps(data);
        else message.error("Dữ liệu rạp không hợp lệ");
      })
      .catch((err) => {
        console.error("Lỗi khi lấy rạp:", err);
        message.error("Không thể lấy danh sách rạp");
      });

    getTheLoais()
      .then((data) => {
        if (Array.isArray(data)) setTheLoais(data);
        else message.error("Dữ liệu thể loại không hợp lệ");
      })
      .catch((err) => {
        console.error("Lỗi khi lấy thể loại:", err);
        message.error("Không thể lấy danh sách thể loại");
      });
  }, []);

  const handleSubmit = () => {
    if (!selectedRap || !selectedDate) {
      message.warning("Vui lòng chọn rạp và ngày chiếu");
      return;
    }

    const query = {
      rap_id: selectedRap,
      the_loai_id: selectedGenres,
      ngay_cong_chieu: dayjs(selectedDate).format("YYYY-MM-DD"),
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

  return (
    <div className="quick-booking-wrapper">
      <div className="quick-booking-title">ĐẶT VÉ NHANH</div>

      <div className="quick-booking-form">
        <Select
          placeholder="1. Chọn Rạp"
          value={selectedRap || undefined}
          onChange={setSelectedRap}
          style={{ width: 160 }}
        >
          {Array.isArray(raps) &&
            raps.map((rap) => (
              <Option key={rap.id} value={rap.id}>
                {rap.ten_rap}
              </Option>
            ))}
        </Select>

 <div style={{ marginTop: 6 }}>
  <div
    onClick={() => setGenresOpen(!genresOpen)}
    style={{
      width: "100%",
      maxWidth: 420,
      padding: "10px 30px",
      border: "1px solid #aaa",
      borderRadius: 8,
      backgroundColor: "#fff",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      boxShadow: genresOpen ? "0 0 0 2px #1890ff inset" : "none",
      transition: "all 0.2s",
    }}
  >
    <span style={{ color: selectedGenres.length > 0 ? "#000" : "#999" }}>
      {selectedGenres.length > 0
        ? `Đã chọn ${selectedGenres.length} thể loại`
        : "2. Chọn Thể loại"}
    </span>
    <DownOutlined style={{ fontSize: 14 }} />
  </div>

  {genresOpen && (
    <div
      style={{
        marginTop: 8,
        padding: 12,
        backgroundColor: "#f9f9f9",
        border: "1px solid #ddd",
        borderRadius: 8,
        maxHeight: 240,
        overflowY: "auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
      }}
    >
      <Checkbox.Group
        value={selectedGenres}
        onChange={(values) => setSelectedGenres(values as number[])}
      >
        {theLoais.map((tl) => (
          <Checkbox
            key={tl.id}
            value={tl.id}
            style={{
              backgroundColor: selectedGenres.includes(tl.id)
                ? "#1890ff"
                : "#fff",
              color: selectedGenres.includes(tl.id) ? "#fff" : "#333",
              padding: "6px 10px",
              borderRadius: "16px",
              border: "1px solid #ccc",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {tl.ten_the_loai}
          </Checkbox>
        ))}
      </Checkbox.Group>
    </div>
  )}
</div>





        <DatePicker
          placeholder="3. Chọn Ngày"
          value={selectedDate}
          onChange={setSelectedDate}
          style={{ width: 160 }}
        />

        <Button type="primary" onClick={handleSubmit}>
          ĐẶT NGAY
        </Button>
      </div>
    </div>
  );
};

export default QuickBooking;

// ===== FILE: pages/CinemasPage/QuickBooking.tsx =====
import { useEffect, useState } from "react";
import { Select, Button, DatePicker } from "antd";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { getRaps, getTheLoais } from "../../provider/duProvider";
import type { Rap, TheLoai } from "../../types/Uses";

const { Option } = Select;

const QuickBooking = () => {
  const [raps, setRaps] = useState<Rap[]>([]);
  const [theLoais, setTheLoais] = useState<TheLoai[]>([]);
  const [selectedRap, setSelectedRap] = useState<number | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [selectedDate, setSelectedDate] = useState<any>(null);

  const navigate = useNavigate();

  useEffect(() => {
    getRaps().then(setRaps);
    getTheLoais().then(setTheLoais);
  }, []);

  const handleSubmit = () => {
    const query = {
      rap_id: selectedRap,
      the_loai_id: selectedGenres,
      ngay_cong_chieu: selectedDate ? dayjs(selectedDate).format("YYYY-MM-DD") : undefined,
    };

    const searchParams = new URLSearchParams();
    if (query.rap_id) searchParams.append("rap_id", query.rap_id.toString());
    if (query.the_loai_id && query.the_loai_id.length > 0) {
      query.the_loai_id.forEach((id: number) => searchParams.append("the_loai_id[]", id.toString()));
    }
    if (query.ngay_cong_chieu) searchParams.append("ngay_cong_chieu", query.ngay_cong_chieu);

    navigate(`/tim-kiem-phim?${searchParams.toString()}`);
  };

 return (
  <div className="quick-booking-wrapper">
  <div className="quick-booking-title">ĐẶT VÉ NHANH</div>

  <div className="quick-booking-form">
    <Select placeholder="1. Chọn Rạp" value={selectedRap || undefined} onChange={setSelectedRap} style={{ width: 160 }}>
      {raps.map((rap) => (
        <Option key={rap.id} value={rap.id}>{rap.ten_rap}</Option>
      ))}
    </Select>

    <Select
      mode="multiple"
      placeholder="2. Chọn Thể loại"
      value={selectedGenres}
      onChange={setSelectedGenres}
      style={{ width: 180 }}
    >
      {theLoais.map((tl) => (
        <Option key={tl.id} value={tl.id}>{tl.ten_the_loai}</Option>
      ))}
    </Select>

    <DatePicker placeholder="3. Chọn Ngày" value={selectedDate} onChange={setSelectedDate} style={{ width: 160 }} />

    <Button type="primary" onClick={handleSubmit}>ĐẶT NGAY</Button>
  </div>
</div>

);

};

export default QuickBooking;

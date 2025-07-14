import { useState } from "react";
import axios from "axios";

const ContactForm = () => {
  const [hoTen, setHoTen] = useState("");
  const [email, setEmail] = useState("");
  const [soDienThoai, setSoDienThoai] = useState("");
  const [thongTin, setThongTin] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!hoTen.trim()) newErrors.hoTen = "Vui lòng nhập họ tên";
    if (!email.trim()) newErrors.email = "Vui lòng nhập email";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Email không hợp lệ";
    if (!soDienThoai.trim())
      newErrors.soDienThoai = "Vui lòng nhập số điện thoại";
    if (!thongTin.trim())
      newErrors.thongTin = "Vui lòng nhập nội dung phản ánh";

    return newErrors;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      await axios.post("http://localhost:8000/api/phan_hoi", {
        ho_ten: hoTen,
        email,
        so_dien_thoai: soDienThoai,
        noi_dung: thongTin,
      });

      alert("Gửi phản hồi thành công!");
      setHoTen("");
      setEmail("");
      setSoDienThoai("");
      setThongTin("");
    } catch (error: any) {
      alert("Gửi thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "8px 12px",
    marginBottom: "4px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    backgroundColor: "white",
    color: "black",
  };

  const labelStyle = {
    color: "white",
    marginBottom: "6px",
    display: "block",
    fontSize: "14px",
  };

  const errorStyle = {
    color: "yellow",
    fontSize: "12px",
    marginBottom: "12px",
  };

  const textareaStyle = {
    ...inputStyle,
    resize: "none" as const,
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: "0 auto" }}>
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Họ và tên</label>
        <input
          type="text"
          value={hoTen}
          onChange={(e) => setHoTen(e.target.value)}
          placeholder="Họ và tên"
          style={inputStyle}
        />
        {errors.hoTen && <div style={errorStyle}>{errors.hoTen}</div>}
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          style={inputStyle}
        />
        {errors.email && <div style={errorStyle}>{errors.email}</div>}
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Số điện thoại</label>
        <input
          type="text"
          value={soDienThoai}
          onChange={(e) => setSoDienThoai(e.target.value)}
          placeholder="Số điện thoại"
          style={inputStyle}
        />
        {errors.soDienThoai && (
          <div style={errorStyle}>{errors.soDienThoai}</div>
        )}
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Nội dung phản ánh</label>
        <textarea
          value={thongTin}
          onChange={(e) => setThongTin(e.target.value)}
          placeholder="Thông tin liên hệ hoặc phản ánh"
          rows={6}
          style={textareaStyle}
        />
        {errors.thongTin && <div style={errorStyle}>{errors.thongTin}</div>}
      </div>

      <button type="submit" className="contact-btn" disabled={loading}>
        <span>{loading ? "Đang gửi..." : "Gửi ngay"}</span>
      </button>
    </form>
  );
};

export default ContactForm;

import React from "react";
import "./ListVoucher.css";
import { useListVouchers } from "../../hook/thinhHook";
import { IVoucher } from "../Admin/interface/vouchers";
import dayjs from "dayjs";
import { CopyOutlined } from "@ant-design/icons";

const ListVoucher = () => {
  const { data } = useListVouchers({ resource: "ma_giam_gia" });
  const dataSource = data?.data ?? [];

  // Lọc voucher chỉ lấy những cái đang kích hoạt
  const activeVouchers = dataSource.filter(
    (voucher: IVoucher) => voucher.trang_thai === "KÍCH HOẠT"
  );

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="voucher-container">
      {activeVouchers.map((voucher: IVoucher, index: number) => (
        <div
          key={voucher.id}
          className={`voucher-item ${index % 2 === 1 ? "reverse" : ""}`}
        >
          <div className="voucher-content">
            <h2 className="voucher-title">{voucher.ma}</h2>
            <div className="voucher-description">
              <p>
                <strong>Giảm:</strong> {voucher.phan_tram_giam}% (tối đa{" "}
                {new Intl.NumberFormat("vi-VN").format(voucher.giam_toi_da)} ₫)
              </p>
              <p>
                <strong>Đơn tối thiểu:</strong>{" "}
                {new Intl.NumberFormat("vi-VN").format(
                  voucher.gia_tri_don_hang_toi_thieu
                )}{" "}
                ₫
              </p>
              <p>
                <strong>Thời gian áp dụng:</strong>{" "}
                {dayjs(voucher.ngay_bat_dau).format("DD/MM/YYYY")} -{" "}
                {dayjs(voucher.ngay_ket_thuc).format("DD/MM/YYYY")}
              </p>
              <p>
                <strong>Lượt dùng:</strong> {voucher.so_lan_da_su_dung} /{" "}
                {voucher.so_lan_su_dung}
              </p>
              <p>
                <strong>Trạng thái:</strong>{" "}
                <span className="voucher-status kich-hoat">
                  {voucher.trang_thai}
                </span>
              </p>
            </div>

            <button
              className="voucher-button"
              onClick={() => handleCopy(voucher.ma)}
            >
              <CopyOutlined style={{ marginRight: 8 }} />SAO CHÉP MÃ
            </button>
          </div>

          <div className="voucher-image-wrapper">
            <img
              src={voucher.image}
              alt={voucher.ma}
              className="voucher-image"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListVoucher;

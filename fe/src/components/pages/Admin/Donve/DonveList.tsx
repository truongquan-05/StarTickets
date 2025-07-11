// pages/Admin/DonVe/DonVeList.tsx
import { useEffect, useState } from "react";
import { Table, Button, message } from "antd";
import { getListDonVe, } from "../../../provider/duProvider";
import { useNavigate } from "react-router-dom";

export default function DonVeList() {
  const [donVe, setDonVe] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDonVe();
  }, []);

  const fetchDonVe = async () => {
    try {
      const res = await getListDonVe();
      setDonVe(res);
    } catch (err) {
      message.error("Lỗi khi tải danh sách");
    }
  };
const columns = [
  {
    title: "#",
    render: (_: any, __: any, index: number) => index + 1,
  },
  {
    title: "Người mua",
    render: (r: any) => r.nguoi_dung?.ten || "—",
  },
  {
    title: "Email",
    render: (r: any) => r.nguoi_dung?.email || "—", // nếu bạn có sdt thì thay vào
  },
   {
    title: "Sđt",
    render: (r: any) => r.nguoi_dung?.so_dien_thoai || "", // nếu bạn có sdt thì thay vào
  },
  {
    title: "Phim",
    render: (r: any) => r.dat_ve?.lich_chieu?.phim?.ten_phim || "—",
  },
  {
    title: "Rạp",
    render: (r: any) => r.dat_ve?.lich_chieu?.phim?.rap?.ten_rap || "CGV Vincom", // nếu có thêm quan hệ phim -> rap
  },
  {
    title: "Tổng tiền",
    render: (r: any) =>
      Number(r.dat_ve?.tong_tien || 0).toLocaleString() + " đ",
  },
  {
    title: "Hình thức thanh toán",
    render: (r: any) => r.phuong_thuc?.ten || "—",
  },
  {
    title: "Chi tiết",
    render: (_: any, record: any) => (
      <Button type="link" onClick={() => navigate(`/admin/don-ve/${record.id}`)}>
        Xem
      </Button>
    ),
  },
];


  return (
    <div>
      <h2>Quản lý đơn vé</h2>
      <Table
  rowKey="id"
  dataSource={Array.isArray(donVe) ? donVe : []}
  columns={columns}
/>

    </div>
  );
}

import React from "react";
import "./Dashboard.css";
import { useDoanhThuNam, useDoanhThuPhim, useTongQuan } from "../../hook/hungHook";
import { IDoanhThu } from "./interface/doanhthu";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const MainContent = () => {
  const { data: dataTongQuan } = useTongQuan({ resource: "tong-quan" });
  const dataTongQuanSource = dataTongQuan as IDoanhThu | undefined;

  const { data: dataDoanhThuNam } = useDoanhThuNam({
    resource: "doanh-thu-nam",
  });
  const dataDoanhThuNamSource = dataDoanhThuNam?.data as Record<
    string,
    string | number
  > | undefined;

  const doanhThuData = Object.entries(dataDoanhThuNamSource || {}).map(
    ([thang, value]) => ({
      thang,
      doanhThu: Number(value),
    })
  );
  const {data:dataDoanhThuPhim} = useDoanhThuPhim({resource:"doanh-thu-phim"});
  const dataDoanhThuPhimSource = dataDoanhThuPhim?.data as any | undefined;
  
  

  const formatNumber = (num?: number) =>
    num?.toLocaleString("vi-VN") ?? "--";

  return (
    <div className="main-content">
      <section className="stats-cards">
        <div className="card">
          <h4>DOANH THU</h4>
          <p className="value">
            {formatNumber(dataTongQuanSource?.tongDoanhThuNay)} ₫
          </p>
          <p className="compare">
            so với tháng trước:{" "}
            {dataTongQuanSource?.DoanhThuVsThangtruoc ?? "--"}
          </p>
        </div>
        <div className="card">
          <h4>HÓA ĐƠN</h4>
          <p className="value">
            {formatNumber(dataTongQuanSource?.veThangNay)}
          </p>
          <p className="compare">
            so với tháng trước: {dataTongQuanSource?.VeVsThangtruoc ?? "--"}
          </p>
        </div>
        <div className="card">
          <h4>KHÁCH HÀNG MỚI</h4>
          <p className="value">
            {formatNumber(dataTongQuanSource?.NguoiDungThangNay)}
          </p>
          <p className="compare">
            so với tháng trước:{" "}
            {dataTongQuanSource?.NguoiDungVsThangtruoc ?? "--"}
          </p>
        </div>
        <div className="card">
          <h4>DOANH THU ĐỒ ĂN</h4>
          <p className="value">
            {formatNumber(dataTongQuanSource?.doAnThangNay)} ₫
          </p>
          <p className="compare">
            so với tháng trước:{" "}
            {dataTongQuanSource?.DoAnVsThangtruoc ?? "--"}
          </p>
        </div>
      </section>

      {/* Biểu đồ doanh thu chiếm toàn bộ chiều rộng */}
      <section className="charts-section full-width-chart">
        <div className="chart chart-line full-chart">
          <h4 style={{ textAlign: "center" }}>Doanh thu theo thời gian</h4>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={doanhThuData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="thang" />
              <YAxis tickFormatter={(value) => `${value / 1000}K`} />
              <Tooltip
                formatter={(value: number) =>
                  `${value.toLocaleString("vi-VN")} ₫`
                }
              />
              <Line
                type="monotone"
                dataKey="doanhThu"
                stroke="#8884d8"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

       <section className="top-movies">
        <h3>Top Phim Có Doanh Thu Cao Nhất</h3>
        <div className="movies-list">
          {dataDoanhThuPhimSource?.map((item:any, index:number) => (
            <div key={index} className={`movie-card color-${index % 6}`}>
              <h4>{item?.phim?.ten_phim ?? "Không rõ"}</h4>
              <p>Doanh thu: {formatNumber(item?.doanh_thu)} ₫</p>
              <p>{item?.so_luong ?? 0} vé</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MainContent;

import "./Dashboard.css";
import {
  useDoanhThuNam,
  useDoanhThuPhim,
  useTongQuan,
} from "../../hook/hungHook";
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
import { FallOutlined, RiseOutlined } from "@ant-design/icons";

const MainContent = () => {
  const { data: dataTongQuan } = useTongQuan({ resource: "tong-quan" });
  const dataTongQuanSource = dataTongQuan as IDoanhThu;
  const BASE_URL = "http://127.0.0.1:8000";
  const { data: dataDoanhThuNam } = useDoanhThuNam({
    resource: "doanh-thu-nam",
  });
  const dataDoanhThuNamSource = dataDoanhThuNam?.data as
    | Record<string, string | number>
    | undefined;

  const doanhThuData = Object.entries(dataDoanhThuNamSource || {}).map(
    ([thang, value]) => ({
      thang,
      doanhThu: Number(value),
    })
  );
  const { data: dataDoanhThuPhim } = useDoanhThuPhim({
    resource: "doanh-thu-phim",
  });
  const dataDoanhThuPhimSource = dataDoanhThuPhim?.data as any | undefined;

  const formatNumber = (num?: number) => num?.toLocaleString("vi-VN") ?? "--";

  return (
    <div className="main-content">
      <section className="stats-cards">
        <div className="card">
          <h4>DOANH THU</h4>
          <p className="value">
            {formatNumber(dataTongQuanSource?.tongDoanhThuNay)} ₫
          </p>
          <p
            className="compare"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            So với tháng trước{" "}
            <>
              {parseFloat(
                String(dataTongQuanSource?.DoanhThuVsThangtruoc ?? "0")
              ) > 0 ? (
                <span style={{ color: "orange" }}>
                  <RiseOutlined />{" "}
                  {dataTongQuanSource?.DoanhThuVsThangtruoc ?? "--"}
                </span>
              ) : (
                <span style={{ color: "red" }}>
                  <FallOutlined />{" "}
                  {dataTongQuanSource?.DoanhThuVsThangtruoc ?? "--"}
                </span>
              )}
            </>
          </p>
        </div>
        <div className="card">
          <h4>ĐƠN VÉ</h4>
          <p className="value">
            {formatNumber(dataTongQuanSource?.veThangNay)}
          </p>
          <p
            className="compare"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            So với tháng trước
            <>
              {parseFloat(String(dataTongQuanSource?.VeVsThangtruoc ?? "0")) >
              0 ? (
                <span style={{ color: "orange" }}>
                  <RiseOutlined /> {dataTongQuanSource?.VeVsThangtruoc ?? "--"}
                </span>
              ) : (
                <span style={{ color: "red" }}>
                  <FallOutlined /> {dataTongQuanSource?.VeVsThangtruoc ?? "--"}
                </span>
              )}
            </>
          </p>
        </div>
        <div className="card">
          <h4>KHÁCH HÀNG MỚI</h4>
          <p className="value">
            {formatNumber(dataTongQuanSource?.NguoiDungThangNay)}
          </p>
          <p
            className="compare"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            So với tháng trước{" "}
            <>
              {parseFloat(
                String(dataTongQuanSource?.NguoiDungVsThangtruoc ?? "0")
              ) > 0 ? (
                <span style={{ color: "orange" }}>
                  <RiseOutlined />{" "}
                  {dataTongQuanSource?.NguoiDungVsThangtruoc ?? "--"}
                </span>
              ) : (
                <span style={{ color: "red" }}>
                  <FallOutlined />{" "}
                  {dataTongQuanSource?.NguoiDungVsThangtruoc ?? "--"}
                </span>
              )}
            </>
          </p>
        </div>
        <div className="card">
          <h4>ĐỒ ĂN BÁN RA</h4>
          <p className="value">
            {formatNumber(dataTongQuanSource?.doAnThangNay)}
          </p>
          <p
            className="compare"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            So với tháng trước{" "}
            <>
              {parseFloat(String(dataTongQuanSource?.DoAnVsThangtruoc ?? "0")) >
              0 ? (
                <span style={{ color: "orange" }}>
                  <RiseOutlined />{" "}
                  {dataTongQuanSource?.DoAnVsThangtruoc ?? "--"}
                </span>
              ) : (
                <span style={{ color: "red" }}>
                  <FallOutlined />{" "}
                  {dataTongQuanSource?.DoAnVsThangtruoc ?? "--"}
                </span>
              )}
            </>
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

      <section className="top-movies-dashboard">
        <h3 className="dashboard-title">🎬 Top 5 Phim Có Doanh Thu Cao Nhất</h3>
        <div className="movie-cards-grid">
          {dataDoanhThuPhimSource
            ?.slice(0, 5)
            .map((item: any, index: number) => (
              <div className="movie-card-dashboard" key={index}>
                <div className="movie-card-header">
                  <span className="movie-rank-badge">#{index + 1}</span>
                  <h4 className="movie-name">
                    {item?.phim?.ten_phim ?? "Không rõ"}
                  </h4>
                </div>
                <div className="movie-content">
                  <img
                    className="movie-poster"
                    src={`${BASE_URL}/storage/${item?.phim?.anh_poster}`}
                    alt="poster"
                  />
                  <div className="movie-details">
                    <p className="movie-revenue">
                      Doanh thu:{" "}
                      <strong>{formatNumber(item?.doanh_thu)} ₫</strong>
                    </p>
                    <p className="movie-tickets">
                      Số vé: <strong>{item?.so_luong ?? 0}</strong>
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
};

export default MainContent;

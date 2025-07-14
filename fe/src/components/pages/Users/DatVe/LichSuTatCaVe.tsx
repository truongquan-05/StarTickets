import React, { useMemo } from 'react';
import { Table, Spin } from 'antd';
import { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import {
  useListLichSuDonHang,
  useListDatVe,
  useListLichChieu,
  useListMovies,
  useListPhongChieu,
  useListCinemas,
} from '../../../hook/hungHook';
import { ILichSuDatVe } from '../../Admin/interface/lichsudatve';
import { IDatVe } from '../../Admin/interface/datve';
import { ILichChieu } from '../../Admin/interface/lichchieu';
import { IMovies } from '../../Admin/interface/movies';
import { IPhongChieu } from '../../Admin/interface/phongchieu';
import { ICinemas } from '../../Admin/interface/cinemas';

const LichSuTatCaVe = () => {
  const { data: lichSu, isLoading: loadingLichSu } = useListLichSuDonHang({ resource: 'lich-su-mua-hang' });
  const { data: datVes, isLoading: loadingDatVe } = useListDatVe({ resource: 'dat_ve' });
  const { data: lichChieus, isLoading: loadingLichChieu } = useListLichChieu({ resource: 'lich_chieu' });
  const { data: movies, isLoading: loadingPhim } = useListMovies({ resource: 'phim' });
  const { data: phongs, isLoading: loadingPhong } = useListPhongChieu({ resource: 'phong_chieu' });
  const { data: raps, isLoading: loadingRap } = useListCinemas({ resource: 'rap' });

  const BASE_URL = import.meta.env.VITE_API_URL;

  const mergedData = useMemo(() => {
    if (!lichSu || !datVes || !lichChieus || !movies || !phongs || !raps) return [];

    return lichSu.data.map((don:ILichSuDatVe) => {
      const datVe = datVes.find((d:IDatVe) => d.id === don.dat_ve_id);
      const lichChieu = datVe ? lichChieus.find((lc:ILichChieu) => lc.id === datVe.lich_chieu_id) : null;
      const phim = lichChieu ? movies.find((p:IMovies) => p.id === lichChieu.phim_id) : null;
      const phong = lichChieu ? phongs.find((ph:IPhongChieu) => ph.id === lichChieu.phong_id) : null;
      const rap = phong ? raps.find((r:ICinemas) => r.id === phong.rap_id) : null;

      return {
        id: don.id,
        ma_giao_dich: don.ma_giao_dich,
        created_at: don.created_at,
        tong_tien: datVe?.tong_tien || 0,
        phim,
        ten_phim: phim?.ten_phim || '',
        anh_poster: phim?.anh_poster || '',
        ten_rap: rap?.ten_rap || 'Không rõ',
        diem: 0,
      };
    });
  }, [lichSu, datVes, lichChieus, movies, phongs, raps]);

  const columns: ColumnsType<any> = [
    {
      title: 'Mã đơn',
      dataIndex: 'ma_giao_dich',
      key: 'ma_giao_dich',
    },
    {
      title: 'Hoạt động',
      key: 'hoat_dong',
      render: (_, record) => {
        return record.anh_poster ? (
          <div style={{ textAlign: 'center' }}>
            <img
              src={`${BASE_URL}/storage/${record.anh_poster}`}
              alt={record.ten_phim}
              style={{ width: 80, height: 120, objectFit: 'cover', borderRadius: 4 }}
            />
            <div style={{ marginTop: 4, color: 'white' }}>{record.ten_phim}</div>
          </div>
        ) : (
          <span>Không có ảnh</span>
        );
      },
    },
    {
      title: 'Chi nhánh',
      key: 'chi_nhanh',
      render: (_, record) => record.ten_rap,
    },
    {
      title: 'Ngày',
      key: 'ngay',
      render: (_, record) => moment(record.created_at).format('DD/MM/YYYY'),
    },
    {
      title: 'Tổng cộng',
      key: 'tong_cong',
      render: (_, record) =>
        record.tong_tien?.toLocaleString('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }) || '0 đ',
    },
    {
      title: 'Điểm',
      key: 'diem',
      render: (_, record) => record.diem || 0,
    },
  ];

  return (
    <div>
      <h2 style={{ color: 'white', fontWeight: 'bold', fontSize: 24, marginBottom: 16 }}>
        LỊCH SỬ MUA HÀNG
      </h2>

      {loadingLichSu || loadingDatVe || loadingLichChieu || loadingPhim || loadingPhong || loadingRap ? (
        <div style={{ textAlign: 'center', padding: 50 }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={mergedData}
          rowKey="id"
          pagination={false}
          style={{ backgroundColor: '#002147', color: 'white' }}
        />
      )}
    </div>
  );
};

export default LichSuTatCaVe;

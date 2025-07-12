import React from 'react';
import { useSearchParams } from 'react-router-dom';

const CheckDatVe = () => {
  const [searchParams] = useSearchParams();

  const error = searchParams.get('error');
  const datVeId = searchParams.get('dat_ve_id');
  const maGiaoDich = searchParams.get('ma_giao_dich');

  const containerStyle = {
    minHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(180deg, #12112B 0%, #1E1B45 80%)',
    color: 'white',
    textAlign: 'center',
    padding: '2rem',
    fontFamily: "'Roboto', sans-serif",
  };

  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: '700',
    marginBottom: '1rem',
    letterSpacing: '1.5px',
  };

  const messageStyle = {
    fontSize: '1.1rem',
    lineHeight: '1.6',
    maxWidth: '500px',
    margin: '0 auto',
  };

  if (error) {
    return (
      <div>
        <div style={titleStyle}>GIAO DỊCH THẤT BẠI</div>
        <div style={messageStyle}>
          Giao dịch không thành công, vui lòng kiểm tra lại thông tin thanh toán của bạn
          <br />
          Xin chân thành cảm ơn!
        </div>
      </div>
    );
  }

  if (datVeId && maGiaoDich) {
    return (
      <div>
        <div style={{ ...titleStyle, color: '#FFD700' /* vàng nổi bật */ }}>
          MUA VÉ HOÀN TẤT
        </div>
        <div style={messageStyle}>
          Cảm ơn bạn đã mua vé.
          <br />
          Mã vé: <strong>#{datVeId}</strong>
          <br />
          Mã giao dịch: <strong>{maGiaoDich}</strong>
          <br />
          Vui lòng kiểm tra email để nhận vé và thông tin chi tiết.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={titleStyle}>KHÔNG CÓ DỮ LIỆU ĐẶT VÉ</div>
      <div style={messageStyle}>
        Vui lòng thực hiện đặt vé để xem thông báo ở đây.
      </div>
    </div>
  );
};

export default CheckDatVe;

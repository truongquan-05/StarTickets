import { Layout } from 'antd';

const { Footer } = Layout;

const FooterAdmin = () => {
  return (
    <Footer
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 24px',
        height: 50,
        fontSize: 16,
        fontWeight: 600,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        background: '#fff',
        boxShadow: '0 -1px 4px rgba(0,0,0,0.1)', // thêm bóng nhẹ chân footer
      }}
    >
      <div style={{ flex: '1 1 auto', textAlign: 'left', minWidth: 150 }}>
        ©{new Date().getFullYear()} Copyright 2025 © StarTicket.
      </div>
      <div style={{ flex: '1 1 auto', textAlign: 'right', minWidth: 150 }}>
        All rights reserved. Hand crafted & made by Thinh
      </div>
    </Footer>
  );
};

export default FooterAdmin;

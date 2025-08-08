import React from 'react'
import ContactForm from './PhanHoiKhachHang'

const GopY = () => {
  return (
    <div className="contact-section">
        <div className="contact-left">
          <p>LIÊN HỆ VỚI CHÚNG TÔI</p>
          <div className="social-icon fb-icon">
            <a href="https://www.facebook.com/hthinh575">
              <img
                src="https://cinestar.com.vn/assets/images/ct-1.webp"
                alt="facebook"
              />
              <span>FACEBOOK</span>
            </a>
          </div>
          <div className="social-icon zl-icon">
            <a href="#">
              <span>ZALO CHAT</span>
              <img
                src="https://cinestar.com.vn/assets/images/ct-2.webp"
                alt="ZALO CHAT"
              />
            </a>
          </div>
        </div>

        <div className="contact-right">
          <h2>THÔNG TIN LIÊN HỆ</h2>
          <p>
            <img src="https://cinestar.com.vn/assets/images/ct-1.svg" alt="" />
            cskh@movigo.com
          </p>
          <p>
            <img src="https://cinestar.com.vn/assets/images/ct-2.svg" alt="" />
            1900.0085
          </p>
          <p>
            <img src="https://cinestar.com.vn/assets/images/ct-3.svg" alt="" />
            135 Hai Bà Trưng, phường Bến Nghé, Quận 1, TP.HCM
          </p>
          <ContactForm />
        </div>
      </div>
  )
}

export default GopY
import { useEffect, useState } from "react";
import { getPublicBanners } from "../../../provider/duProvider";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "./HomeBanner.css";

type Banner = {
  id: number;
  title: string;
  image_url: string;
  link_url: string;
};

const HomeBanner = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getPublicBanners()
      .then((res) => {
        setBanners(res.data || res);
      })
      .catch(() => {
        setBanners([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return null;
  }

  if (!banners.length) {
    return (
      <div className="default-banner">
      </div>
    );
  }

  return (
    <section className="hero-banner">
      <Swiper
        modules={[Autoplay, Navigation, Pagination, EffectFade]}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop={true}
        navigation={{
          nextEl: ".hero-swiper-button-next",
          prevEl: ".hero-swiper-button-prev",
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
          renderBullet: (index, className) => {
            return `<span class="${className}">
              <svg viewBox="0 0 12 12"><circle cx="6" cy="6" r="6"></circle></svg>
            </span>`;
          },
        }}
        effect="fade"
        speed={1000}
        className="hero-swiper"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div className="banner-item">
              <a href={banner.link_url || "#"} className="banner-link">
                <img
                  src={`http://127.0.0.1:8000/storage/${banner.image_url}`}
                  alt={banner.title}
                  className="banner-image"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = "/default-banner.jpg";
                    e.currentTarget.alt = "Default banner";
                  }}
                />
              </a>
            </div>
          </SwiperSlide>
        ))}

        <div className="hero-swiper-button-next">
          <svg viewBox="0 0 24 24">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
          </svg>
        </div>
        <div className="hero-swiper-button-prev">
          <svg viewBox="0 0 24 24">
            <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/>
          </svg>
        </div>
      </Swiper>
    </section>
  );
};

export default HomeBanner;

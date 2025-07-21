import { useEffect, useState, useRef } from "react";
import { Carousel, CarouselRef } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { getPublicBanners } from "../../../provider/duProvider";
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
  const carouselRef = useRef<CarouselRef>(null);

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

  const handlePrev = () => {
    carouselRef.current?.prev();
  };

  const handleNext = () => {
    carouselRef.current?.next();
  };

  if (isLoading) {
    return (
      <div className="hero-banner">
        <div className="banner-loading">
          <div className="loading-gradient"></div>
        </div>
      </div>
    );
  }

  if (!banners.length) {
    return (
      <div className="hero-banner">

      </div>
    );
  }

  return (
    <section className="hero-banner">
      <div className="hero-carousel-wrapper">
        <Carousel
          ref={carouselRef}
          autoplay
          autoplaySpeed={6000}
          speed={1000}
          dots={{
            className: "hero-carousel-dots"
          }}
          className="hero-carousel"
        >
          {banners.map((banner) => (
            <div key={banner.id} className="banner-item">
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
          ))}
        </Carousel>
        
        {/* Custom Navigation Arrows */}
        <div className="hero-carousel-button-prev" onClick={handlePrev}>
          <LeftOutlined />
        </div>
        <div className="hero-carousel-button-next" onClick={handleNext}>
          <RightOutlined />
        </div>
      </div>
    </section>
  );
};

export default HomeBanner;
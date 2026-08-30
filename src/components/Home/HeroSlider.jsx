import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "./style.css";

const slides = [
  {
    id: 1,
    subtitle: "Introducing the new",
    title: "Microsoft Xbox",
    description:
      "Experience next-level gaming with powerful performance, stunning graphics, and immersive gameplay.",
    button: "Shop Now",
    image: "/images/hero/xbox.png",
    className: "slide-xbox",
  },
  {
    id: 2,
    subtitle: "Upgrade your style",
    title: "Premium Headphones",
    description:
      "Enjoy crystal-clear sound and powerful bass with our latest collection of wireless headphones.",
    button: "Shop Audio",
    image: "/images/hero/headphones.png",
    className: "slide-headphones",
  },
  {
    id: 3,
    subtitle: "Smart technology",
    title: "Latest Smart Watches",
    description:
      "Stay connected, track your activity, and manage your day with the latest smart watches.",
    button: "Discover Now",
    image: "/images/hero/watch.png",
    className: "slide-watch",
  },
  {
    id: 4,
    subtitle: "Power & Performance",
    title: "Modern Laptops",
    description:
      "Powerful laptops designed for work, entertainment, creativity, and everything in between.",
    button: "Explore Laptops",
    image: "/images/hero/laptop.png",
    className: "slide-laptop",
  },
  {
    id: 5,
    subtitle: "Best deals this week",
    title: "Smartphones",
    description:
      "Discover the latest smartphones with powerful cameras, fast performance, and beautiful displays.",
    button: "Shop Phones",
    image: "/images/hero/phone.png",
    className: "slide-phone",
  },
];

const HeroSlider = () => {
  return (
    <section className="hero-slider">
      <Swiper
        pagination={{
          dynamicBullets: true,
          clickable: true,
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        speed={800}
        modules={[Pagination, Autoplay]}
        className="mySwiper"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className={`hero-slide ${slide.className}`}>
              
              <div className="hero-content">
                <span className="hero-subtitle">
                  {slide.subtitle}
                </span>

                <h1 className="hero-title">
                  {slide.title}
                </h1>

                <p className="hero-description">
                  {slide.description}
                </p>

                <Link to="/products" className="hero-button">
                  {slide.button}
                </Link>
              </div>

              <div className="hero-image">
                <img
                  src={slide.image}
                  alt={slide.title}
                />
              </div>

            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HeroSlider;
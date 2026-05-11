import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import PostCard from "./PostCard";

import "swiper/css";
import "swiper/css/pagination";

export default function PostsSlider({ posts }) {
  return (
<div className="relative mt-2 pb-2">
      {/* Custom Pagination Styling */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .trending-swiper .swiper-pagination {
            bottom: -8px !important;
          }

          .trending-swiper .swiper-pagination-bullet {
            width: 14px;
            height: 4px;
            border-radius: 4px;
            background: #cbd5f5;
            opacity: 1;
            transition: all 0.3s ease;
            margin: 0 4px !important;
          }

          @media (min-width: 768px) {
            .trending-swiper .swiper-pagination-bullet {
              width: 20px;
              margin: 0 5px !important;
            }
          }

          .trending-swiper .swiper-pagination-bullet-active {
            background: #1e293b;
            width: 22px;
          }

          @media (min-width: 768px) {
            .trending-swiper .swiper-pagination-bullet-active {
              width: 28px;
            }
          }
        `,
        }}
      />

      <Swiper
        modules={[Pagination]}
        pagination={{ clickable: true }}
        grabCursor={true}
        breakpoints={{
     320: {
  slidesPerView: 1,
  spaceBetween: 16,
},
480: {
  slidesPerView: 1,
  spaceBetween: 16,
},
          640: {
            slidesPerView: 2,
            spaceBetween: 18,
          },
          768: {
            slidesPerView: 2.3,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 24,
          },
        }}
className="trending-swiper px-[2px]"      >
        {posts.map((post) => (
          <SwiperSlide key={post.id} className="py-2">
            <PostCard post={post} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
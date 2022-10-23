/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unknown-property */
import { RenderIf } from "/components/elements/RenderIf";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper";
import { HiX } from "react-icons/hi";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { GuideItem } from "./GuideItem";

const guideItems = [
  {
    title: "Recognition",
    imageSrc: "/guide/recognition.svg",
    description: "Fitur ini akan mengenali <b>gerakan tangan</b> Anda",
  },
  {
    title: "Translator",
    imageSrc: "/guide/translator-hand.svg",
    description: "Mengubah dari <b>teks menjadi bahasa isyarat</b>",
  },
  {
    title: "Translator",
    imageSrc: "/guide/translator-mic.svg",
    description: "Atau hanya dengan <b>mengatakan secara lisan</b>",
  },
  {
    title: "Dictionary",
    imageSrc: "/guide/dictionary.svg",
    description: "Temukan <b>kosakata</b> dalam kamus bahasa isyarat",
  },
];

export function Guide({ isOpen, setIsOpen }) {
  return (
    <>
      <RenderIf when={isOpen}>
        <div className="h-screen-no-header absolute top-0 left-0 w-full p-4 flex items-center isolate z-50">
          <div
            onClick={null}
            className="bg-white shadow-md pt-8 pb-4 rounded-[20px] w-full mx-auto max-w-[500px] h-fit z-20 relative"
          >
            <style global jsx>{`
              .swiper-horizontal > .swiper-pagination-bullets,
              .swiper-pagination-bullets.swiper-pagination-horizontal,
              .swiper-pagination-custom,
              .swiper-pagination-fraction {
                bottom: 10px;
                left: 0;
                width: 100%;
              }

              .swiper-pagination {
                position: relative;
                margin-top: 20px;
              }

              .swiper-pagination-bullet {
                height: 8px;
                width: 8px;
                background: #d9d9d9;
                opacity: 1;
              }

              .swiper-pagination-bullet-active {
                background: #ff9d00;
              }
            `}</style>
            <Swiper
              spaceBetween={50}
              pagination={{
                clickable: false,
              }}
              modules={[Autoplay, Pagination]}
              loop={true}
              autoplay={{
                delay: 2500,
                disableOnInteraction: true,
              }}
              grabCursor={true}
            >
              {guideItems.map((guide, index) => (
                <SwiperSlide key={index}>
                  <GuideItem
                    title={guide.title}
                    imageSrc={guide.imageSrc}
                    description={guide.description}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* close button */}
            <div role="button" onClick={() => setIsOpen(false)}>
              <div className="absolute top-0 right-0 p-3 bg-grad-dana rounded-full translate-x-[20%] -translate-y-[20%]">
                <HiX className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          {/* backdrop */}
          <div
            onClick={() => setIsOpen(false)}
            className="w-full h-screen fixed left-0 top-0 z-10 bg-gray-600 opacity-20 backdrop-blur-lg"
          ></div>
        </div>
      </RenderIf>
    </>
  );
}

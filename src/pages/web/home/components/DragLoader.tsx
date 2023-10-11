// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'

// import required modules
import { Pagination } from 'swiper/modules'

const DragLoader = () => {
  return (
    <div className='drag__story'>
      <Swiper
        slidesPerView={1}
        spaceBetween={10}
        pagination={{
          dynamicBullets: true
        }}
        breakpoints={{
          320: {
            slidesPerView: 3,
            spaceBetween: 15
          },
          375: {
            slidesPerView: 3.3,
            spaceBetween: 15
          },
          768: {
            slidesPerView: 6.5,
            spaceBetween: 50
          },
          810: {
            slidesPerView: 3.5,
            spaceBetween: 20
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 25
          },
          1366: {
            slidesPerView: 5.3,
            spaceBetween: 25
          }
        }}
        modules={[Pagination]}
        className='mySwiper drag__story--slider'
      >
        <SwiperSlide className='story__slider--item'>
          <div className='box2'>
            <div className='gallery-drag'>
              <div className='skeleton4'></div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide className='story__slider--item'>
          <div className='box2'>
            <div className='gallery-drag'>
              <div className='skeleton4'></div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide className='story__slider--item'>
          <div className='box2'>
            <div className='gallery-drag'>
              <div className='skeleton4'></div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide className='story__slider--item'>
          <div className='box2'>
            <div className='gallery-drag'>
              <div className='skeleton4'></div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide className='story__slider--item'>
          <div className='box2'>
            <div className='gallery-drag'>
              <div className='skeleton4'></div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide className='story__slider--item'>
          <div className='box2'>
            <div className='gallery-drag'>
              <div className='skeleton4'></div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide className='story__slider--item'>
          <div className='box2'>
            <div className='gallery-drag'>
              <div className='skeleton4'></div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide className='story__slider--item'>
          <div className='box2'>
            <div className='gallery-drag'>
              <div className='skeleton4'></div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  )
}

export default DragLoader

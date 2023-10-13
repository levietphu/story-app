import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import '../styles/carousel.scss'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'

// import required modules
// import { Pagination, Autoplay } from 'swiper'
import { Pagination, Autoplay } from 'swiper/modules'
import { NotificationFilled } from '@ant-design/icons'

const GalleryCarousel = ({ banners, loaderHome, notifications }: any) => {
  return (
    <>
      <div className='carousel mb-20'>
        {!loaderHome ? (
          <>
            <Swiper
              pagination={{
                dynamicBullets: true
              }}
              modules={[Autoplay, Pagination]}
              className='mySwiper carousel__annimation'
              autoplay={{
                delay: 2500,
                disableOnInteraction: false
              }}
              loop={true}
            >
              {banners.map((value: any) => {
                return (
                  <SwiperSlide className='carousel-item' key={value.id}>
                    <Link to={`/${value.slugtruyen}`} target='_'>
                      <img src={`${import.meta.env.REACT_APP_UPLOADS}${value?.image}`} alt='webtruyen' />
                    </Link>
                  </SwiperSlide>
                )
              })}
            </Swiper>
          </>
        ) : (
          <div className='box2' style={{ width: '100%' }}>
            <div className='gallery'>
              <div className='skeleton4'></div>
            </div>
          </div>
        )}
      </div>
      <div className='notification mb-20'>
        <div className='notification__bell'>
          <NotificationFilled rev={undefined} />
        </div>
        <Swiper
          modules={[Autoplay]}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false
          }}
          loop={true}
          className='mySwiper notification__slider'
        >
          {!loaderHome &&
            notifications.map((noti: any, index: number) => {
              return (
                <SwiperSlide className='notification__item' key={index}>
                  <p>
                    {noti.type === 2 ? (
                      <>
                        {' '}
                        <b>{noti.user.name}</b> đã ủng hộ <b>{noti.coin_donate} xu</b> cho truyện{' '}
                        <b>{noti.story.name}</b>
                      </>
                    ) : (
                      <>
                        <b>{noti.user.name}</b> đã bình luận trong truyện <b>{noti.story.name}</b>
                      </>
                    )}
                  </p>
                </SwiperSlide>
              )
            })}
        </Swiper>
      </div>
    </>
  )
}

export default GalleryCarousel

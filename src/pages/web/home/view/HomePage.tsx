import '../styles/home.scss'
import MainLayout from '../../layout/view/MainLayout'
import GalleryCarousel from '../components/GalleryCarousel'
import Search from '../components/Search'
import DragStory from '../components/DragStory'
import NewUpdateStory from '../components/NewUpdateStory'
import FullStory from '../components/FullStory'
import { useEffect, useState } from 'react'
import PopupFull from '../components/PopupFull'
import DragLoader from '../components/DragLoader'
import { Modal } from 'antd'
import { Link } from 'react-router-dom'
import callApi from '~/ultis/callApi'

const HomePage = () => {
  const [dataHome, setDataHome] = useState<any>()
  const [loaderHome, setLoaderHome] = useState<boolean>(true)
  const [checkPopupHome, setCheckPopupHome] = useState<boolean>(true)
  const [open, setOpen] = useState(false)

  const getHome = async () => {
    await callApi('get', '', 'home').then((res: any) => {
      setDataHome(res.data.data.items)
      setLoaderHome(false)
    })
  }

  useEffect(() => {
    getHome()
    document.title = 'Truyện dịch online - Đọc truyện dịch mới nhất | Tiên Vực'
  }, [])

  useEffect(() => {
    if (checkPopupHome) {
      showModal()
    } else {
      handleCancel()
    }
  }, [checkPopupHome])

  const showModal = () => {
    setOpen(true)
  }

  const handleOk = () => {
    setTimeout(() => {
      setOpen(false)
    }, 2000)
  }

  const handleCancel = () => {
    setOpen(false)
  }

  return (
    <>
      <MainLayout>
        <GalleryCarousel loaderHome={loaderHome} banners={dataHome?.banners} notifications={dataHome?.notifications} />
        <Search />
        <div className='story'>
          <p className='text-title'>Truyện đề cử</p>
          {!loaderHome && dataHome.recommendedStory ? <DragStory data={dataHome.recommendedStory} /> : <DragLoader />}
        </div>
        <div className='story'>
          <p className='text-title'>Truyện yêu thích mỗi tuần</p>
          {!loaderHome ? <DragStory data={dataHome.truyenhot_sort_week} /> : <DragLoader />}
        </div>
        <div className='story'>
          <p className='text-title'>Bảng xếp hạng truyện vip</p>
          {!loaderHome ? <DragStory data={dataHome.rankVip} vip={1} /> : <DragLoader />}
        </div>
        <div className='story'>
          <p className='text-title'>Truyện hot mới ra lò</p>
          {!loaderHome ? <DragStory data={dataHome.hotStory} /> : <DragLoader />}
        </div>
        <div className='main__content'>
          <div className='story__newupdate'>
            <h2>
              <Link className='a-h1' to='/danh-sach/truyen-moi'>
                Truyện mới cập nhật
              </Link>
            </h2>
            <NewUpdateStory data={dataHome && dataHome.newUpdateStory} />
          </div>
          <div className='story__full'>
            <h2>
              <Link className='a-h1' to='/danh-sach/truyen-full'>
                Truyện đã Full
              </Link>
            </h2>
            <FullStory data={dataHome && dataHome.fullStory} />
          </div>
        </div>
      </MainLayout>{' '}
      <Modal open={open} onOk={handleOk} onCancel={handleCancel} width={650}>
        <PopupFull setCheckPopupHome={setCheckPopupHome} />
      </Modal>
    </>
  )
}

export default HomePage

import { useContext, useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useParams } from 'react-router-dom'
import { Modal } from 'antd'
import { AuthContext } from '~/context/AuthContextProvider'
import ModalReLogin from '../components/ModalReLogin'
import Props from '~/ultis/typeChildren'
import { useAppSelector } from '~/store/hookStore'

const MainLayout = ({ children }: Props) => {
  const params = useParams()
  const { reLogin }: any = useContext(AuthContext)
  const [open, setOpen] = useState(false)

  const {
    setting,
    layout: { dataLayout, loading }
  } = useAppSelector((state) => state.common)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (reLogin) {
      showModal()
    } else {
      handleCancel()
    }
  }, [reLogin])

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
      <header>
        <Header cates={!loading && dataLayout.cates} logo={!loading && dataLayout.logo_header} />
      </header>
      <main
        className={`${
          setting.theme === 'dark' && params.slugchapter
            ? 'dark'
            : setting.theme === 'book' && params.slugchapter
            ? 'book'
            : ''
        }`}
      >
        <div className='screen-85'>{children}</div>
      </main>
      {!params.slugchapter && (
        <footer className='center'>
          <Footer
            catalog={!loading && dataLayout.khau_hieu}
            logo={!loading && dataLayout.logo_footer}
            link_apple={!loading && dataLayout.link_apple}
            link_androi={!loading && dataLayout.link_androi}
          />
        </footer>
      )}
      <Modal open={open} onOk={handleOk} onCancel={handleCancel}>
        <ModalReLogin />
      </Modal>
    </>
  )
}

export default MainLayout

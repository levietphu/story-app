import Sidebar from '../components/Sidebar'
import '../styles/layout-cms.scss'
import { useEffect } from 'react'
import Props from '~/ultis/typeChildren'
import Header from '../../../web/layout/components/Header'
import { useContext, useState, useCallback } from 'react'
import { AuthContext } from '~/context/AuthContextProvider'
import axios from 'axios'
import { useAppSelector } from '~/store/hookStore'

const LayoutCms = ({ children }: Props) => {
  const [notifications, setNotifications] = useState<any>()
  const [noti_count, setNotiCount] = useState<number>(0)

  const { dataLayout, loading } = useAppSelector((state) => state.common.layout)
  const { user }: any = useContext(AuthContext)

  const getNotification = useCallback(async (page = 1) => {
    await axios.get(`${import.meta.env.REACT_APP_API}notification?id_user=${user.user.id}&page=${page}`).then((res) => {
      setNotifications(res.data.noti_loadcents)
      setNotiCount(res.data.noti_count)
    })
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
    getNotification()
  }, [])

  return (
    <div className='container'>
      <header>
        <Header
          cates={!loading && dataLayout.cates}
          logo={!loading && dataLayout.logo_header}
          notifications={notifications}
          noti_count={noti_count}
          getNotification={getNotification}
        />
      </header>
      <Sidebar />
      <div className='main-layout-cms'>{children}</div>
    </div>
  )
}

export default LayoutCms

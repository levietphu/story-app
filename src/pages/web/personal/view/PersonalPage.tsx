import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { AuthContext } from '~/context/AuthContextProvider'
import MainLayout from '../../layout/view/MainLayout'
import '../styles/personal.scss'
import { useContext, useEffect } from 'react'
import coinImage from '~/assets/coin.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookmark } from '@fortawesome/free-regular-svg-icons'
import { faCoins, faMoneyBill } from '@fortawesome/free-solid-svg-icons'

const PersonalPage = () => {
  const { pathname } = useLocation()
  const { user, getUser, loaderUser, setCheckLogin }: any = useContext(AuthContext)

  useEffect(() => {
    if (loaderUser === 'user') {
      getUser()
    }
    setCheckLogin(true)
    document.title = 'Truyện dịch online - Đọc truyện dịch mới nhất | Tiên Vực'
  }, [])

  return (
    <>
      <MainLayout>
        {user && (
          <div className='personal'>
            <div className='personal__left'>
              <div className='name__person'>
                <h3>{user.user.name}</h3>
                <div style={{ marginTop: '10px' }}>
                  <div className='image__coin'>
                    <div>
                      <img src={coinImage} alt='webtruyen' />
                    </div>
                    <span>{user.user.coin} xu</span>
                  </div>
                </div>
              </div>
              <div className='personal__left--list'>
                <NavLink
                  className={
                    !pathname.includes('vipbuy') && !pathname.includes('coin')
                      ? 'personal__item active__personal'
                      : 'personal__item'
                  }
                  to='/account'
                >
                  <div className='center' style={{ marginRight: '10px' }}>
                    <FontAwesomeIcon className='icon-i' icon={faBookmark} />
                  </div>
                  <span>tủ sách</span>
                </NavLink>
                <NavLink
                  className={pathname.includes('vipbuy') ? 'personal__item active__personal' : 'personal__item'}
                  to='/account/vipbuy'
                >
                  <div className='center' style={{ marginRight: '10px' }}>
                    <FontAwesomeIcon className='icon-i' icon={faMoneyBill} />
                  </div>
                  <span>truyện vip đã mua</span>
                </NavLink>
                <NavLink
                  className={pathname.includes('coin') ? 'personal__item active__personal' : 'personal__item'}
                  to='/account/coin'
                >
                  <div className='center' style={{ marginRight: '10px' }}>
                    <FontAwesomeIcon className='icon-i' icon={faCoins} />
                  </div>
                  <span>nạp xu</span>
                </NavLink>
              </div>
            </div>
            <div className='personal__right'>
              <div className='bookcase'>
                <h1>
                  {pathname.includes('vipbuy')
                    ? 'Truyện vip đã mua'
                    : pathname.includes('coin')
                    ? 'Nạp xu'
                    : 'Tủ sách của bạn'}
                </h1>
              </div>
              <Outlet />
            </div>
          </div>
        )}
      </MainLayout>
    </>
  )
}

export default PersonalPage

import '../styles/footer.scss'
import androi from '~/assets/google-play-badge.0dbdf26.png'
import ios from '~/assets/app-store-badge.fba0f3f.png'
import { memo } from 'react'
import logoFooter from '~/assets/logo-footer.png'
import { Link } from 'react-router-dom'

const Footer = memo(({ catalog, logo, link_apple, link_androi }: any) => {
  return (
    <div className='footer'>
      <div className='footer__logo center'>
        <img src={logo ? `${import.meta.env.REACT_APP_UPLOADS}Config${logo?.value}` : logoFooter} alt='webtruyen' />
        <span>tiên vực</span>
      </div>
      <p>{catalog?.value}</p>
      <div className='footer__download center'>
        <a href={link_androi.value} className='mr-5' title='link download androi'>
          <img src={androi} alt='webtruyen' />
        </a>
        <a href={link_apple?.value} title='link download ios'>
          <img src={ios} alt='webtruyen' />
        </a>
      </div>
      <div className='center mt-20 footer__support'>
        <Link to='/support' className='mr-20' title='support'>
          liên hệ hỗ trợ
        </Link>
        <Link to='/regulation' title='quy định'>
          quy định và chính sách
        </Link>
      </div>
    </div>
  )
})

export default Footer

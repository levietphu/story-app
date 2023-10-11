import macos from '~/assets/mascot-02.235fd60.png'
import '../styles/modal-relogin.scss'
import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'

const ModalReLogin = () => {
  const navigate = useNavigate()

  return (
    <div className='relogin'>
      <div className='center'>
        <img src={macos} alt='webtruyen' width='300px' />
      </div>
      <h3>Phiên đăng nhập của bạn đã hết</h3>
      <h3>Vui lòng đăng nhập lại</h3>
      <Button className='button-relogin' size='large' onClick={() => navigate('/login')}>
        Đăng nhập
      </Button>
    </div>
  )
}

export default ModalReLogin

import MainLayout from '../../layout/view/MainLayout'
import '../styles/notfound.scss'
import notFound from '~/assets/notfound.png'
import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <MainLayout>
      <div>
        <div className='center'>
          <img className='image-not-found' src={notFound} alt='not found' />
        </div>

        <div className='center'>
          <h1 style={{ textAlign: 'center' }}>Trang này không tồn tại hoặc đã bị xóa</h1>
        </div>
        <div className='center'>
          <Button size='large' type='primary' onClick={() => navigate('/')}>
            Về trang chủ
          </Button>
        </div>
      </div>
    </MainLayout>
  )
}

export default NotFound

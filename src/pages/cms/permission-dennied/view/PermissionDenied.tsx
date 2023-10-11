import { useNavigate } from 'react-router-dom'
import error403 from '~/assets/error-403.jpg'
import '../styles/permission-denied.scss'
import { Button } from 'antd'

const PermissionDenied = () => {
  const navigate = useNavigate()

  return (
    <div className='per-denied center'>
      <div>
        <div className='center'>
          <img src={error403} alt='webtruyen' />
        </div>
        <div>
          <p style={{ textAlign: 'center', fontSize: '28px', color: '#357376' }}>We are Sorry...</p>
          <p style={{ textAlign: 'center', color: '#357376' }}>
            The page you're trying to access has restricted access.
          </p>
          <p style={{ textAlign: 'center', color: '#357376' }}>Please refer to your system administrator</p>
          <div className='center'>
            <Button
              size='large'
              type='primary'
              style={{
                marginTop: '10px',
                background: '#357376',
                textTransform: 'uppercase'
              }}
              onClick={() => navigate('/')}
            >
              về trang chủ
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PermissionDenied

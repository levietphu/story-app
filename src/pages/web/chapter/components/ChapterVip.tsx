import { useContext, memo } from 'react'
import axios from 'axios'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../../../../context/AuthContextProvider'

const ChapterVip = ({ coin, setError, callApi }: any) => {
  const { user }: any = useContext(AuthContext)

  const params = useParams()
  const navigate = useNavigate()

  const callApiBuy = async () => {
    await axios
      .post(`${import.meta.env.REACT_APP_API}buy_chapter`, {
        id_user: user.user.id,
        slug_story: params.slugstory,
        slug: params.slugchapter
      })
      .then((res) => {
        if (res.data.success) {
          callApi(user.user.id, 1)
        } else if (!res.data.success && res.data.status === 400) {
          setError(res.data.data.hasMores)
        }
      })
      .catch(() => {
        setError('Lỗi hệ thống')
      })
  }

  return (
    <div className='box__vip'>
      <div className='chapter-vip'>
        <div className='content__check'>
          <h1>Chương Vip</h1>
          <p>Đây là chương VIP - Bạn cần mua bằng XU để có thể tiếp tục đọc truyện!</p>
          <p style={{ fontSize: '1.5rem' }}>
            Giá: <span style={{ textTransform: 'uppercase' }}>{coin} xu</span>
          </p>
        </div>
        <div className='buy__chapter center'>
          <button className='btn-chapter' onClick={() => (user ? callApiBuy() : navigate('/login'))}>
            Mua Chương này
          </button>
          <Link to={`${user ? '/account/coin' : '/login'}`} className='btn-coin'>
            Nạp xu
          </Link>
        </div>
        <div className='qa-buy center' onClick={() => navigate(`/${params.slugstory}/?buy=true`)}>
          <button>Bạn muốn mua hết các chương VIP?</button>
        </div>
      </div>
    </div>
  )
}

export default memo(ChapterVip)

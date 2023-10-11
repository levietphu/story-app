import '../styles/modal-story.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoins } from '@fortawesome/free-solid-svg-icons'
import { Button, Input } from 'antd'
import { memo, useContext, useState } from 'react'
import { AuthContext } from '../../../../context/AuthContextProvider'
import { Link } from 'react-router-dom'
import axios from 'axios'

const { TextArea } = Input

const ModalDonate = ({ getDonate, id_truyen, setIsModalDonateOpen, setShowMessageDonate }: any) => {
  const { user }: any = useContext(AuthContext)
  const [dataDonate, setDataDonate] = useState<any>({
    coin_donate: 10,
    message: ''
  })
  const [remainingCoins, setRemainingCoins] = useState<string>('')
  const [errorTextDonate, setErrorTextDonate] = useState<string>('')

  const postDonate = async () => {
    await axios({
      method: 'POST',
      url: `${import.meta.env.REACT_APP_API}add_donate`,
      headers: {
        accept: 'application/json'
      },
      data: {
        coin_donate: dataDonate.coin_donate,
        message: dataDonate.message,
        id_truyen: id_truyen,
        id_user: user.user.id
      }
    })
      .then((res) => {
        getDonate()
        handleCancel()
        setRemainingCoins(res.data.remaining_coins)
        setShowMessageDonate('Cảm ơn bạn đã ủng hộ dịch giả')
      })
      .catch((err) => {
        err.response.status === 400 && setErrorTextDonate(err.response.data.message)
      })
  }

  const handleCancel = () => {
    setDataDonate({ coin_donate: 10, message: '' })
    setIsModalDonateOpen(false)
    setErrorTextDonate('')
  }

  return (
    <div className='modal-donate'>
      {user ? (
        <>
          <div className='alert-modal'>
            <span>
              Bạn đang có <FontAwesomeIcon style={{ margin: '0 5px' }} icon={faCoins} />{' '}
              {remainingCoins ? remainingCoins : user.user.coin}
              <strong> XU</strong>.{user.user.coin <= 0 && <Link to='/account/coin'>Nạp thêm</Link>}
            </span>
          </div>
          {errorTextDonate && (
            <div className='errorModal'>
              <p>{errorTextDonate}</p>
            </div>
          )}
          <div className='content-modal'>
            <div className='main-content-modal'>
              <div className='coin-donate'>
                <p>Số XU bạn muốn ủng hộ</p>
                <Input
                  type='number'
                  min={dataDonate.coin_donate}
                  value={dataDonate.coin_donate}
                  onChange={(e) =>
                    setDataDonate({
                      ...dataDonate,
                      coin_donate: e.target.value
                    })
                  }
                />
              </div>
              <div className='message-donate'>
                <p>Lời nhắn</p>
                <TextArea
                  rows={6}
                  value={dataDonate.message}
                  onChange={(e) => setDataDonate({ ...dataDonate, message: e.target.value })}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className='change-login'>
          <span>
            Bạn cần <Link to='/login'>Đăng nhập</Link> để có thể ủng hộ truyện
          </span>
        </div>
      )}

      <div className='button-modal'>
        <Button size='large' onClick={handleCancel}>
          Hủy
        </Button>
        <Button className='donate-button' size='large' onClick={user && postDonate}>
          Ủng hộ
        </Button>
      </div>
    </div>
  )
}

export default memo(ModalDonate)

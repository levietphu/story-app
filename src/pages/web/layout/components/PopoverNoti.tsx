import { faCoins } from '@fortawesome/free-solid-svg-icons'
import '../styles/popover-noti.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Moment from 'react-moment'
import axios from 'axios'
import { memo } from 'react'

const PopoverNoti = memo(({ notifications, getNotification }: any) => {
  const changeIsRead = async (id: number) => {
    await axios.post(`${import.meta.env.REACT_APP_API}change_is_read`, { id }).then(() => getNotification())
  }

  return (
    <div className='popover-noti'>
      <div className='popover-noti-header'>Thông báo</div>
      <div className='popover-noti-list'>
        {notifications &&
          notifications.data.map((value: any, index: number) => {
            return (
              <div
                className='noti-item'
                key={index}
                style={{
                  background: `${value.is_read === 1 ? 'white' : '#e0dede'}`
                }}
                onClick={() => value.is_read === 0 && changeIsRead(value.id_repcipients)}
              >
                <div className='noti-item-left center'>
                  <FontAwesomeIcon className='icon-noti' icon={faCoins} />
                </div>
                <div className='noti-item-right'>
                  <span>
                    <Moment format='DD-MM-YYYY' locale='vi'>
                      {value.created_at}
                    </Moment>
                  </span>
                  <p>
                    <b>
                      {value.user_loadcent.name} đã tạo lệnh nạp tiền với số tiền {value.transition.money}k
                    </b>
                  </p>
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
})

export default PopoverNoti

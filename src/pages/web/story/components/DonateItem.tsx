import Moment from 'react-moment'
import { memo } from 'react'

const DonateItem = ({ value, index, coin }: any) => {
  return (
    <div className='center__chapter--item' key={index} style={{ cursor: 'default' }}>
      <div className='center__chapter--left'>
        <p>
          <span className='number__chapter' style={{ textTransform: 'unset' }}>
            {value.name_user_donate}
          </span>
        </p>
        <p className='name__chapter'> {value.message}</p>
        <i>
          <span style={{ fontSize: '14px' }}>
            <Moment fromNow locale='vi'>
              {value.created_at}
            </Moment>
          </span>
        </i>
      </div>

      <span className='coin_donate center'>
        <strong style={{ marginRight: '5px', fontSize: '24px' }}>{value.coin_donate}</strong>
        <img width={20} src={coin} alt='webtruyen' />
      </span>
    </div>
  )
}

export default memo(DonateItem)

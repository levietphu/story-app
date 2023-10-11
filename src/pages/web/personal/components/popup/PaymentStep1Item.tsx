import { useState } from 'react'
import coin from '~/assets/coin.svg'
import { Button } from 'antd'

const PaymentStep1Item = ({ item, note, setIsModal, setInfoItem, transitionCode }: any) => {
  const [key, setKey] = useState<number>(0)
  return (
    <>
      <div className='step-1'>
        <p style={{ fontSize: '18px', marginBottom: '5px' }}>Chọn số tiền muốn nạp</p>
        <div className='coins'>
          {item.loadcents.map((item: any, index: number) => {
            return (
              <div
                className={`coin-item ${key === index ? 'active-coin-item' : ''}`}
                onClick={() => setKey(index)}
                key={index}
              >
                <div className='top center'>
                  <div className={!item.bonus ? 'center' : ''}>
                    <div className='center'>
                      {new Intl.NumberFormat().format(item.coins)}
                      <img src={coin} width={18} alt='webtruyen' />
                    </div>{' '}
                    {item.bonus && <p style={{ color: '#ffb01e' }}>+{item.bonus}</p>}
                  </div>
                </div>
                <div className='bottom center'>
                  <div className=''>{item.value}k đ</div>
                </div>
              </div>
            )
          })}
        </div>
        {note && <p style={{ margin: '10px 0' }}>Lưu ý: {note}</p>}
        <div className='footer-modal'>
          <Button className='cancel' size='large' onClick={() => setIsModal(false)}>
            Hủy bỏ
          </Button>
          <Button
            className='continue'
            size='large'
            onClick={() =>
              setInfoItem({
                ...item,
                value: item.loadcents[key].value,
                coin: item.loadcents[key].coins,
                bonus: item.loadcents[key].bonus,
                transitionCode: transitionCode
              })
            }
          >
            Tiếp tục
          </Button>
        </div>
      </div>
    </>
  )
}

export default PaymentStep1Item

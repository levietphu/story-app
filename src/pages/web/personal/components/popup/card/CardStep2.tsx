import { Button } from 'antd'
import '../../../styles/card-step2.scss'
import { ChangeEvent, useContext, useState } from 'react'
import { AuthContext } from '~/context/AuthContextProvider'
import callApi from '~/ultis/callApi'

const CardStep2 = ({ cardInfo, setCardInfoItem, setCheckSuccess }: any) => {
  const [checkInputSerial, setCheckInputSerial] = useState<boolean>(false)
  const [checkInputCode, setCheckInputCode] = useState<boolean>(false)
  const [card, setCard] = useState<any>({
    serial: '',
    code_card: ''
  })

  const { user }: any = useContext(AuthContext)

  const addTransaction = async (data: any) => {
    await callApi('post', data, 'create_transaction').then(() => setCheckSuccess(true))
  }

  const createTransaction = () => {
    addTransaction({
      transaction_code: cardInfo.transitionCode,
      content: 'Nộp thẻ cào ' + cardInfo.value + 'k ' + cardInfo.name_bank,
      coin_number: cardInfo.coin + (cardInfo.bonus ? cardInfo.bonus : 0),
      money: cardInfo.value,
      id_user: user.user.id,
      id_bankinfo: cardInfo.id,
      serial: card.serial,
      code_card: card.code_card
    })
  }

  return (
    <div className='card-step2'>
      <div className='card-input'>
        <div style={{ marginBottom: '10px' }}>
          <input
            className={checkInputSerial ? 'card-input-active' : ''}
            type='text'
            name='serial'
            value={card.serial}
            placeholder='Số seri'
            onClick={() => setCheckInputSerial(!checkInputSerial)}
            onBlur={() => setCheckInputSerial(false)}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setCard({ ...card, serial: e.target.value })}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            className={checkInputCode ? 'card-input-active' : ''}
            type='text'
            name='code_card'
            value={card.code_card}
            placeholder='Mã thẻ cào'
            onClick={() => setCheckInputCode(!checkInputCode)}
            onBlur={() => setCheckInputCode(false)}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setCard({ ...card, code_card: e.target.value })}
          />
        </div>
      </div>
      <div style={{ paddingBottom: '10px', fontSize: '1rem' }}>
        <span>Lưu ý: {cardInfo.note}</span>
      </div>
      <div className='footer-modal'>
        <Button className='cancel' size='large' onClick={() => setCardInfoItem('')}>
          Quay lại
        </Button>
        <Button
          className='continue'
          size='large'
          disabled={card.code_card && card.serial ? false : true}
          onClick={createTransaction}
        >
          Hoàn thành
        </Button>
      </div>
    </div>
  )
}

export default CardStep2

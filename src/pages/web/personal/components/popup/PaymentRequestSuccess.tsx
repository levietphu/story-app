import '../../styles/payment-request.scss'
import { CheckCircleFilled } from '@ant-design/icons'
import { Button } from 'antd'

type PaymentRequestSuccessProps = {
  setIsModal: (value: boolean) => void
  setCheckSuccess: (value: boolean) => void
  setInfoItem: (value: any) => void
}

const PaymentRequestSuccess: React.FC<PaymentRequestSuccessProps> = ({ setIsModal, setCheckSuccess, setInfoItem }) => {
  return (
    <div className='content-request'>
      <CheckCircleFilled className='icon-check center' rev={undefined} />
      <div className='center text-success'>Đã gửi yêu cầu nạp thành công!</div>
      <div className='center text-handle'>Hệ thống sẽ tự động xử lý giao dịch của bạn trong khoảng 3-5 phút.</div>
      <div className='btn-agree'>
        <Button
          className='agree'
          size='large'
          onClick={() => {
            setCheckSuccess(false)
            setIsModal(false)
            setInfoItem('')
          }}
        >
          Đồng ý
        </Button>
      </div>
    </div>
  )
}

export default PaymentRequestSuccess

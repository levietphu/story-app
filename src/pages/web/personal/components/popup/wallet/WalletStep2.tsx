import { ChangeEvent } from 'react'
import { Button, Image, Spin } from 'antd'
import '../../../styles/bank-step2.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import coin from '~/assets/coin.svg'
import { AuthContext } from '~/context/AuthContextProvider'
import { useContext, useState } from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import callApi from '~/ultis/callApi'

type WalletStep2Props = {
  walletInfo: any
  setWalletInfoItem: (value: any) => void
  handleCopy: (value: any) => void
  showCopy: boolean
  setCheckSuccess: (value: boolean) => void
}

const WalletStep2: React.FC<WalletStep2Props> = ({
  walletInfo,
  setWalletInfoItem,
  handleCopy,
  showCopy,
  setCheckSuccess
}) => {
  const { user }: any = useContext(AuthContext)
  const [walletFile, setWalletFile] = useState<File | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const antIcon = <LoadingOutlined rev={undefined} style={{ fontSize: 24 }} spin />

  const handleSuccess = async (data: any) => {
    setLoading(true)
    await callApi('post', data, 'create_transaction').then(() => {
      setCheckSuccess(true)
      setLoading(false)
    })
  }
  const createTransaction = () => {
    const data = new FormData()
    if (walletFile) {
      data.append('transaction_code', walletInfo.transitionCode)
      data.append('content', 'Nộp ' + walletInfo.value + 'k ' + walletInfo.name_bank)
      data.append('coin_number', walletInfo.coin + (walletInfo.bonus ? walletInfo.bonus : 0))
      data.append('money', walletInfo.value)
      data.append('id_user', user.user.id)
      data.append('id_bankinfo', walletInfo.id)
      data.append('image', walletFile)
      handleSuccess(data)
    }
  }

  return (
    <div className='step2'>
      <div className='content-modal'>
        <div className='info-step1'>
          <span style={{ fontSize: '1rem' }}>
            <strong>Bước 1.</strong> <span>Thực hiện thanh toán theo thông tin bên dưới</span>
          </span>
          {walletInfo.qr_code && (
            <div className='qrcode'>
              <div className='center' style={{ margin: '10px 0' }}>
                <Image
                  src={import.meta.env.REACT_APP_UPLOADS + 'BankInfo/' + walletInfo.qr_code}
                  width={200}
                  alt='webtruyen'
                />
              </div>
            </div>
          )}

          <div className='info-payment mt-10'>
            <p>Chủ tài khoản</p>
            <p onClick={handleCopy} style={{ cursor: 'pointer' }}>
              {walletInfo.owner}
              <FontAwesomeIcon style={{ marginLeft: '5px' }} icon={faCopy} />
            </p>
          </div>
          <div className='info-payment'>
            <p>{walletInfo.stk ? 'Số điện thoại' : 'Địa chỉ Email'}</p>
            <p onClick={handleCopy} style={{ cursor: 'pointer' }}>
              {walletInfo.stk ? walletInfo.stk : walletInfo.email}
              <FontAwesomeIcon style={{ marginLeft: '5px' }} icon={faCopy} />
            </p>
          </div>
          <div className='info-payment'>
            <p>Số tiền cần chuyển</p>
            <div style={{ cursor: 'pointer' }}>
              <span onClick={handleCopy}>{walletInfo.value}</span>,000 đ
              <FontAwesomeIcon style={{ marginLeft: '5px' }} icon={faCopy} />
            </div>
          </div>
          <div className='info-payment'>
            <p>Nội dung chuyển khoản</p>
            <p onClick={handleCopy} style={{ cursor: 'pointer' }}>
              {user.user.name}
              <FontAwesomeIcon style={{ marginLeft: '5px' }} icon={faCopy} />
            </p>
          </div>
          <div className='info-payment'>
            <p>Số xu nhận được</p>
            <p>
              {walletInfo.coin + (walletInfo.bonus ? walletInfo.bonus : 0)}{' '}
              <img src={coin} alt='webtruyen' width={20} height={20} />
            </p>
          </div>
        </div>
        <span style={{ fontSize: '1rem' }}>
          <strong>Bước 2.</strong> Tải lên ảnh chụp màn hình hóa đơn chuyển khoản/thanh toán của bạn
        </span>
        <div>
          <label htmlFor='wallet'>Kéo thả hoặc bấm vào đây để chọn ảnh...</label>
          <input
            id='wallet'
            type='file'
            accept='image/png,image/gif,image/jpeg'
            onChange={(e: ChangeEvent<HTMLInputElement>) => e.target.files && setWalletFile(e.target.files[0])}
          />
          {walletFile && (
            <div className='center'>
              <Image src={URL.createObjectURL(walletFile)} width={200} height={50} alt='webtruyen' />
            </div>
          )}
        </div>
        <p style={{ fontSize: '1rem', marginTop: '10px' }}>
          <i>Lưu ý: {walletInfo.note}</i>{' '}
        </p>
      </div>
      <div className='footer-modal'>
        <Button className='cancel' size='large' onClick={() => setWalletInfoItem('')}>
          Quay lại
        </Button>
        <Button className='continue' size='large' disabled={walletFile ? false : true} onClick={createTransaction}>
          {!loading ? 'Hoàn thành' : <Spin indicator={antIcon} />}
        </Button>
      </div>
      <span className='copy' style={{ top: `${showCopy ? '30%' : '-1000px'}` }}>
        Đã sao chép!
      </span>
    </div>
  )
}

export default WalletStep2

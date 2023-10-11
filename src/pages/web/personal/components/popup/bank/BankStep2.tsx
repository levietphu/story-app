import { Button, Image, Spin } from 'antd'
import '../../../styles/bank-step2.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import coin from '~/assets/coin.svg'
import { useContext, useState } from 'react'
import { AuthContext } from '~/context/AuthContextProvider'
import { LoadingOutlined } from '@ant-design/icons'
import callApi from '~/ultis/callApi'

const BankStep2 = ({ bankInfo, setBankInfoItem, handleCopy, showCopy, setCheckSuccess }: any) => {
  const [loading, setLoading] = useState(false)

  const { user }: any = useContext(AuthContext)

  const antIcon = <LoadingOutlined rev={undefined} style={{ fontSize: 24 }} spin />

  const transferredMoney = () => {
    setCheckSuccess(true)
    addTransaction({
      transaction_code: bankInfo.transitionCode,
      content: 'Nộp ' + bankInfo.value + 'k ' + bankInfo.name_bank,
      coin_number: bankInfo.coin + (bankInfo.bonus ? bankInfo.bonus : 0),
      money: bankInfo.value,
      id_user: user.user.id,
      id_bankinfo: bankInfo.id
    })
  }

  const addTransaction = async (data: any) => {
    await callApi('post', data, 'create_transaction').then(() => {
      setCheckSuccess(true)
      setLoading(false)
    })
  }

  return (
    <div className='step2'>
      <div className='content-modal'>
        <div className='info-step1'>
          <span style={{ fontSize: '1rem' }}>
            <strong>Bước 1.</strong> <span>Thực hiện thanh toán theo thông tin bên dưới</span>
          </span>
          <div className='info-payment mt-10'>
            <p>Chủ tài khoản</p>
            <p onClick={handleCopy} style={{ cursor: 'pointer' }}>
              {bankInfo.owner}
              <FontAwesomeIcon style={{ marginLeft: '5px' }} icon={faCopy} />
            </p>
          </div>
          <div className='info-payment'>
            <p>Số tài khoản</p>
            <p onClick={handleCopy} style={{ cursor: 'pointer' }}>
              {bankInfo.stk}
              <FontAwesomeIcon style={{ marginLeft: '5px' }} icon={faCopy} />
            </p>
          </div>
          <div className='info-payment'>
            <p>Số tiền cần chuyển</p>
            <div onClick={handleCopy} style={{ cursor: 'pointer' }}>
              <span>{bankInfo.value},000 đ</span>
              <FontAwesomeIcon style={{ marginLeft: '5px' }} icon={faCopy} />
            </div>
          </div>
          <div className='info-payment'>
            <p>Nội dung chuyển khoản</p>
            <p onClick={handleCopy} style={{ cursor: 'pointer' }}>
              {bankInfo.transitionCode}
              <FontAwesomeIcon style={{ marginLeft: '5px' }} icon={faCopy} />
            </p>
          </div>
          <div className='info-payment'>
            <p>Số xu nhận được</p>
            <p>
              {bankInfo.coin + (bankInfo.bonus ? bankInfo.bonus : 0)}{' '}
              <img src={coin} alt='webtruyen' width={20} height={20} />
            </p>
          </div>
          {bankInfo.qr_code && (
            <div className='qrcode'>
              <p style={{ textAlign: 'center' }}>
                <i>Hoặc sử dụng app ngân hàng của bạn để quét mã QR thanh toán</i>
              </p>
              <div className='center' style={{ margin: '10px 0' }}>
                <Image
                  src={`${import.meta.env.REACT_APP_UPLOADS}BankInfo/${bankInfo.qr_code}`}
                  width={200}
                  alt='webtruyen'
                />
              </div>
            </div>
          )}
        </div>
        <span style={{ fontSize: '1rem' }}>
          <strong>Bước 2.</strong>Sau khi chuyển khoản thành công, bấm nút <strong>Tôi đã chuyển khoản</strong> để xác
          nhận.
        </span>
        <p style={{ fontSize: '1rem', marginTop: '10px' }}>
          <i>
            Lưu ý: Nhập chính xác NỘI DUNG chuyển khoản là <strong>{bankInfo.transitionCode}</strong> để hệ thống có thể
            cộng XU cho tài khoản của bạn. Nếu nhập sai, XU có thể sẽ bị cộng nhầm sang tài khoản khác! Mỗi mã sẽ chỉ
            tồn tại trong 10 phút, bạn cần sử dụng hình thức chuyển khoản nhanh 247 để hệ thống kịp thời ghi nhận.
          </i>{' '}
        </p>
      </div>
      <div className='footer-modal'>
        <Button className='cancel' size='large' onClick={() => setBankInfoItem('')}>
          Quay lại
        </Button>
        <Button className='continue' size='large' onClick={transferredMoney}>
          {!loading ? 'Tôi đã chuyển khoản' : <Spin indicator={antIcon} />}
        </Button>
      </div>
      <span className='copy' style={{ top: `${showCopy ? '30%' : '-1000px'}` }}>
        Đã sao chép!
      </span>
    </div>
  )
}

export default BankStep2

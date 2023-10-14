import '../styles/modal-story.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoins } from '@fortawesome/free-solid-svg-icons'
import { Button, Input, Form } from 'antd'
import { memo, useContext, useState } from 'react'
import { AuthContext } from '~/context/AuthContextProvider'
import { Link } from 'react-router-dom'
import axios from 'axios'
import callApi from '~/ultis/callApi'

type FieldType = {
  toChapter: number
  fromChapter: number
}

type ModalChapterVipProps = {
  story: any
  setIsModalChapterVipOpen: (value: boolean) => void
  setShowMessage: (value: string) => void
  setSearchParams: (value: string) => void
  searchParams: any
}

const ModalChapterVip: React.FC<ModalChapterVipProps> = memo(
  ({ story, setIsModalChapterVipOpen, setShowMessage, setSearchParams, searchParams }) => {
    const { user }: any = useContext(AuthContext)
    const [remainingCoin, setRemainingCoin] = useState<number>()
    const [errorText, setErrorText] = useState<string>('')
    const [dataRes, setDataRes] = useState<any>()
    const [testPass, setTestPass] = useState(false)
    const [dataBuyChapterClick, setDataBuyChapterClick] = useState<any>()

    const [form] = Form.useForm()

    const callApiBuyMany = async (values: any) => {
      await axios({
        method: 'post',
        url: `${import.meta.env.REACT_APP_API}check_price`,
        headers: {
          'Content-Type': 'application/json'
        },
        data: values
      })
        .then((res) => {
          setDataRes(res.data.data)
          setErrorText('')
          setTestPass(res.data.success)
        })
        .catch((err) => {
          setErrorText(err.response.data.message)
          setDataRes(undefined)
        })
    }

    const paymentConfirm = () => {
      callApi('post', dataBuyChapterClick, 'buy_many_chapters').then((res: any) => {
        handleCancel()
        setRemainingCoin(res.data.remaining_coins)
        setShowMessage('Mua chương vip thành công')
      })
    }

    const onFinish = (values: any) => {
      values.id_user = user.user.id
      values.id_truyen = story.id
      setDataBuyChapterClick(values)
      callApiBuyMany(values)
    }

    const handleCancel = () => {
      setIsModalChapterVipOpen(false)
      user && form.resetFields()
      setErrorText('')
      setDataRes(undefined)
      setTestPass(false)
      if (searchParams.get('buy')) {
        setSearchParams('')
      }
    }

    return (
      <div className='modal-donate'>
        {user ? (
          <>
            <div className='alert-modal'>
              <span>
                Bạn đang có {remainingCoin ? remainingCoin : user.user.coin}
                <FontAwesomeIcon style={{ margin: '0 5px' }} icon={faCoins} />
                <strong>XU</strong>.{user.user.coin <= 0 && <Link to='/account/coin'>Nạp thêm</Link>}
              </span>
            </div>
            {errorText && (
              <div className='errorModal'>
                <p>{errorText}</p>
              </div>
            )}

            <div className='content-modal'>
              <Form name='basic' layout='vertical' onFinish={onFinish} form={form}>
                <Form.Item<FieldType>
                  label='Mua từ chương'
                  name='toChapter'
                  rules={[{ required: true, message: 'Vui lòng điền vào trường này!' }]}
                >
                  <Input type='number' min={1} />
                </Form.Item>

                <Form.Item<FieldType>
                  label='đến chương'
                  name='fromChapter'
                  rules={[{ required: true, message: 'Vui lòng điền vào trường này!' }]}
                >
                  <Input type='number' max={story.total_chapter} />
                </Form.Item>
                <p style={{ fontSize: '12px', marginBottom: '10px' }}>
                  * Hệ thống sẽ tự loại trừ các chương không phải VIP và các chương bạn đã mua lẻ trước đó. Nếu bạn thấy
                  số lượng chương không trùng khớp, hãy báo cho Admin tại Fanpage Thánh Thiên Tiên Vực để Admin kịp thời
                  xử lý nhé!
                </p>
                <Form.Item>
                  <Button type='primary' htmlType='submit'>
                    Kiểm tra
                  </Button>
                </Form.Item>
              </Form>
            </div>
            {dataRes && (
              <div className='test-number-chapter line'>
                <div className='fix-fontsize'>
                  <p>Các chương sẽ mua:</p>
                  <span className='to-from-chapter'>
                    {dataRes.toChapter} -{dataRes.fromChapter}
                  </span>
                </div>
                <div className='flex-between fix-fontsize'>
                  <p>Tổng:</p>
                  <span>
                    <strong>{dataRes.totalChapter} Chương</strong>
                  </span>
                </div>
                <div className='flex-between fix-fontsize'>
                  <p>Giá:</p>
                  <span>
                    <strong>{dataRes.totalCoin} Xu</strong>
                  </span>
                </div>
                <div className='flex-between fix-fontsize'>
                  <p>Giảm giá:</p>
                  <span>
                    <strong>{dataRes.sale} Xu</strong>
                  </span>
                </div>

                <p
                  style={{
                    fontSize: '12px',
                    textAlign: 'right',
                    paddingBottom: '10px'
                  }}
                >
                  {dataRes.discount_percent ? (
                    <>
                      Giảm {dataRes.sale} XU ({dataRes.discount_percent}%) khi mua từ {dataRes.discount_chapter} chương
                    </>
                  ) : (
                    <>Không được giảm giá</>
                  )}
                </p>
                <div className='flex-between fix-fontsize line'>
                  <p>Thanh toán:</p>
                  <span>
                    <strong>{dataRes.payment} Xu</strong>
                  </span>
                </div>
                <p
                  style={{
                    fontSize: '12px',
                    color: `${testPass ? 'green' : 'red'}`,
                    textAlign: 'right',
                    paddingBottom: '20px'
                  }}
                >
                  {dataRes.message}
                </p>
              </div>
            )}
          </>
        ) : (
          <div className='change-login'>
            <span>
              Bạn cần <Link to='/login'>Đăng nhập</Link> để có thể mua chương VIP
            </span>
          </div>
        )}

        <div className='button-modal'>
          <Button size='large' onClick={handleCancel}>
            Hủy Bỏ
          </Button>
          {testPass && (
            <Button className='donate-button' size='large' onClick={paymentConfirm}>
              Xác nhận thanh toán
            </Button>
          )}
        </div>
      </div>
    )
  }
)

export default ModalChapterVip

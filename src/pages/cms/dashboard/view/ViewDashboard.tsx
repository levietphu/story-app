import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '~/context/AuthContextProvider'
import { Card, Row, Col, Table, Select, Alert, Spin, Pagination } from 'antd'
import '../styles/dashboard.scss'
import { ColumnsType } from 'antd/es/table'
import { withdrawMoneyModel } from '../model/withdrawMoneyModel'
import { checkAdmin } from '~/ultis/checkPer'

const ViewDashboard = () => {
  const [data, setData] = useState<any>()
  const [dataStory, setDataStory] = useState<any>()
  const [loader, setLoader] = useState<boolean>(true)
  const [message, setMessage] = useState<string>('')

  const { user }: any = useContext(AuthContext)

  const getApiDashboard = async () => {
    await axios({
      method: 'get',
      url: `${import.meta.env.REACT_APP_API}cms/dashboard?id_user=${user.user.id}`,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      setData(res.data.dashboard)
      setLoader(false)
    })
  }

  const getStoryDashboard = async (page = 1) => {
    await axios({
      method: 'get',
      url: `${import.meta.env.REACT_APP_API}cms/get_story_dashboard?id_user=${user.user.id}&page=${page}`,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      setDataStory(res.data.story_user)
    })
  }

  const acceptWithdrawMoney = (id: number, status: number) => {
    axios({
      method: 'post',
      url: `${import.meta.env.REACT_APP_API}cms/accept_withdraw_money`,
      data: {
        id,
        status
      },
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      getApiDashboard()
      setMessage(res.data.message)
    })
  }

  useEffect(() => {
    getApiDashboard()
    getStoryDashboard()
  }, [])

  const columns: ColumnsType<withdrawMoneyModel> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render(value, record, index) {
        return <a>{index + 1}</a>
      }
    },
    {
      title: 'Người tạo',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Mã giao dịch',
      dataIndex: 'transaction_code',
      key: 'transaction_code'
    },
    {
      title: 'Số xu',
      dataIndex: 'coin',
      key: 'coin'
    },
    {
      title: 'Số tiền',
      dataIndex: 'money',
      key: 'money'
    },

    {
      title: 'Tên NH',
      dataIndex: 'name_bank',
      key: 'name_bank'
    },
    {
      title: 'Stk',
      dataIndex: 'stk',
      key: 'stk'
    },
    {
      title: 'Chủ tk',
      dataIndex: 'owner_account',
      key: 'owner_account'
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (value) => {
        return (
          <Select
            defaultValue={value.status}
            onChange={(key) => acceptWithdrawMoney(value.id, key)}
            options={[
              { value: 0, label: 'Chờ duyệt' },
              { value: 1, label: 'Không được duyệt' },
              { value: 2, label: 'Thành công' }
            ]}
            disabled={value.status !== 0}
          />
        )
      }
    }
  ]

  useEffect(() => {
    if (message) {
      const id = setTimeout(() => setMessage(''), 2000)
      return () => clearTimeout(id)
    }
  }, [message])

  return (
    <div style={{ paddingTop: '40px' }}>
      <Row gutter={[16, 16]}>
        <Col sm={24} xs={24} md={8} lg={6} xxl={6}>
          <Card>
            <h3 className='text-h3'>Doanh thu hôm nay</h3>
            <div className='today'>{!loader ? data.revenue.today : <Spin />} XU</div>
            <div>Tháng này: {!loader ? data.revenue.month : <Spin />} XU</div>
            <div>Tháng trước: {!loader ? data.revenue.last_month : <Spin />} XU</div>
          </Card>
        </Col>
        <Col sm={24} xs={24} md={8} lg={6} xxl={6}>
          <Card>
            <h3 className='text-h3'>Mua chương</h3>
            <div className='today'>{!loader ? data.buy_chapter.today : <Spin />} chương</div>
            <div>Tháng này: {!loader ? data.buy_chapter.month : <Spin />} chương</div>
            <div>Tháng trước: {!loader ? data.buy_chapter.last_month : <Spin />} chương</div>
          </Card>
        </Col>
        <Col sm={24} xs={24} md={8} lg={6} xxl={6}>
          <Card>
            <h3 className='text-h3'>Ủng hộ</h3>
            <div className='today'>{!loader ? data.donate.today : <Spin />} XU</div>
            <div>Tháng này: {!loader ? data.donate.month : <Spin />} XU</div>
            <div>Tháng trước: {!loader ? data.donate.last_month : <Spin />} XU</div>
          </Card>
        </Col>
        <Col sm={24} xs={24} md={8} lg={6} xxl={6}>
          <Card>
            <h3 className='text-h3'>Đã rút</h3>
            <div className='today'>{!loader ? data.withdraw_money_success : <Spin />} lần</div>
            <div>Đang chờ duyệt: {!loader ? data.withdraw_money_waiting : <Spin />} </div>
            <div style={{ visibility: 'hidden' }}>tháng này</div>
          </Card>
        </Col>
        <Col sm={24} xs={24} md={12} lg={12} xxl={12}>
          <Card>
            <h3 className='text-h3'>Tổng: {!loader ? data.total_story : <Spin />} truyện (Đã được trả tiền)</h3>
            <div className='dashboard-story'>
              {dataStory &&
                dataStory.data.map((item: any, index: number) => {
                  return (
                    <div className='dashboard-story-item' key={index}>
                      <img
                        width={50}
                        height={80}
                        src={`${import.meta.env.REACT_APP_UPLOADS}${item.image}`}
                        alt='webtruyen'
                      />
                      <div className='text-story'>
                        <h4>{item.name}</h4>
                        <p>Tác giả: {item.name_author}</p>
                        <p>Dịch giả: {item.name_trans}</p>
                      </div>
                    </div>
                  )
                })}
              {dataStory && (
                <Pagination
                  current={dataStory.current_page}
                  defaultCurrent={1}
                  total={dataStory.total}
                  onChange={(page: any) => getStoryDashboard(page)}
                  pageSize={dataStory.per_page}
                />
              )}
            </div>
          </Card>
        </Col>
      </Row>
      {checkAdmin(user.role, 43) && (
        <>
          {message && <Alert message={message} type='success' />}
          <h3 className='text-h3'>Thống kê các giao dịch rút tiền</h3>
          <Table
            columns={columns}
            dataSource={!loader && data.all_withdraw_money}
            rowKey={(record) => record.id}
            scroll={{ x: 0 }}
          />
        </>
      )}
    </div>
  )
}

export default ViewDashboard

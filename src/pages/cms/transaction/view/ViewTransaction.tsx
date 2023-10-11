import { DataType } from '../model/transactionModel'
import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '~/context/AuthContextProvider'
import { Card, Select, Image, Button, Alert } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'

const ViewTransaction = () => {
  const [data, setData] = useState<any[]>()
  const [message, setMessage] = useState<string>('')
  const [success, setSuccess] = useState<boolean>(false)

  const { user }: any = useContext(AuthContext)

  const getApiTransaction = async () => {
    await axios({
      method: 'get',
      url: `${import.meta.env.REACT_APP_API}cms/transaction/index`,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      setData(res.data.transaction.filter((item: any) => item.id_user_bank === user.user.id))
    })
  }

  const changeStatusPayment = (id_transaction: number, status: string, coin_number: number) => {
    axios({
      method: 'post',
      url: `${import.meta.env.REACT_APP_API}cms/change_status_payment`,
      data: {
        id_transaction,
        coin_number,
        status
      },
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      getApiTransaction()
      setMessage(res.data.message)
      setSuccess(res.data.success)
    })
  }

  useEffect(() => {
    getApiTransaction()
  }, [])

  useEffect(() => {
    if (message) {
      const id = setTimeout(() => setMessage(''), 2000)
      return () => clearTimeout(id)
    }
  }, [message])

  const columns: ColumnsType<DataType> = [
    {
      title: 'Stt',
      dataIndex: 'id',
      key: 'id',
      render(value, record, index) {
        return <a>{index + 1}</a>
      }
    },
    {
      title: 'Mã giao dịch',
      dataIndex: 'transaction_code',
      key: 'transaction_code'
    },
    {
      title: 'Số xu',
      dataIndex: 'coin_number',
      key: 'coin_number'
    },
    {
      title: 'Số tiền',
      dataIndex: 'money',
      key: 'money'
    },
    {
      title: 'Ảnh chuyển khoản',
      dataIndex: 'image',
      key: 'image',
      render: (value) => {
        return <>{value && <Image src={`${import.meta.env.REACT_APP_UPLOADS}Transaction/${value}`} width={100} />}</>
      }
    },
    {
      title: 'User payment',
      dataIndex: 'name_user_payment',
      key: 'name_user_payment'
    },
    {
      title: 'Kiểu payment',
      dataIndex: 'type_bank',
      key: 'type_bank',
      render: (value) => {
        return (
          <>
            <Button
              size='small'
              style={{
                background: `${value === 0 ? 'orange' : value === 1 ? 'red' : 'green'}`,
                color: 'white'
              }}
            >
              {value === 0 ? 'Ngân hàng' : value === 1 ? 'Ví' : 'Thẻ cào'}
            </Button>
          </>
        )
      }
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (value) => {
        return (
          <Select
            defaultValue={value.status}
            onChange={(key) => changeStatusPayment(value.id, key, value.coin_number)}
            options={[
              { value: 0, label: 'Chờ duyệt' },
              { value: 1, label: 'Lỗi nạp' },
              { value: 2, label: 'Thành công' }
            ]}
            disabled={value.status !== 0}
          />
        )
      }
    }
  ]

  return (
    <div>
      <Card>
        <h3>Các giao dịch trong ngày(Theo thông tin thanh toán của từng admin)</h3>
        {message && <Alert message={message} type={success ? 'success' : 'error'} />}
        <Table columns={columns} dataSource={data} rowKey={(record) => record.id} scroll={{ x: 0 }} />
      </Card>
    </div>
  )
}

export default ViewTransaction

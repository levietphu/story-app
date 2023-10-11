import { Card, Button, Table, Alert, Row, Col, Form, Input, Modal, Select, Image, Tooltip } from 'antd'
import '../styles/view-bankinfo.scss'
import type { ColumnsType } from 'antd/es/table'
import { createBankInfo, deleteBankInfo, getBankInfo, updateBankInfo } from '../api'
import { useContext, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { EditOutlined } from '@ant-design/icons'
import { faTrash, faPlus, faEye } from '@fortawesome/free-solid-svg-icons'
import { changeToSlug } from '~/ultis/changeToSlug'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '~/context/AuthContextProvider'

interface DataType {
  id: number
  name_bank: string
  owner: string
  image: string
  qr_code: string
  stk: number
  type: number
}

const ViewBankInfo: React.FC = () => {
  const [dataBankInfo, setDataBankInfo] = useState<any>()
  const [open, setOpen] = useState(false)
  const [errorBankInfo, setErrorBankInfo] = useState<any>()
  const [alert, setAlert] = useState('')
  const [idBankInfo, setIdBankInfo] = useState<any>()
  const [image, setImage] = useState<any>()
  const [qrCode, setQrCode] = useState<any>()

  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { user }: any = useContext(AuthContext)

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
      title: 'Tên Ngân hàng/ví',
      dataIndex: 'name_bank',
      key: 'name_bank'
    },
    {
      title: 'Chủ tài khoản',
      dataIndex: 'owner',
      key: 'owner'
    },
    {
      title: 'Số tài khoản/sdt',
      dataIndex: 'stk',
      key: 'stk'
    },
    {
      title: 'Ảnh Ngân hàng/ví',
      dataIndex: 'image',
      key: 'image',
      render(value) {
        return <Image width={50} src={`${import.meta.env.REACT_APP_UPLOADS}BankInfo/${value}`} preview={false} />
      }
    },
    {
      title: 'QR code',
      dataIndex: 'qr_code',
      key: 'qr_code',
      render(value) {
        return (
          <Image
            width={50}
            src={value ? import.meta.env.REACT_APP_UPLOADS + 'BankInfo/' + value : ''}
            preview={false}
          />
        )
      }
    },
    {
      title: 'Kiểu',
      key: 'type',
      dataIndex: 'type',
      render: (_, record) => {
        return (
          <Button size='small' type='primary'>
            {record.type === 1 ? 'Ví' : record.type === 0 ? 'Ngân hàng' : 'Thẻ cào'}
          </Button>
        )
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (value) => (
        <>
          {user.user.id === value.id_user ? (
            <>
              <Tooltip title='View nạp xu' color={'blue'}>
                <Button
                  style={{ marginRight: '5px' }}
                  size='middle'
                  type='primary'
                  onClick={() => navigate(`/dashboard/loadcent/${value.id}/view`)}
                >
                  <FontAwesomeIcon icon={faEye} />
                </Button>
              </Tooltip>
              <Tooltip title='Sửa BankInfo' color={'blue'}>
                <Button size='middle' type='primary' onClick={() => showModal(value)}>
                  <EditOutlined rev={undefined} />
                </Button>
              </Tooltip>
              <Tooltip title='Xóa BankInfo' color={'red'}>
                <Button
                  size='middle'
                  danger
                  type='primary'
                  style={{ marginLeft: '5px' }}
                  onClick={() => {
                    if (
                      // eslint-disable-next-line no-restricted-globals
                      confirm(`Bạn có muốn xóa BankInfo ${value.name_bank} này không`) === true
                    ) {
                      destroyBankInfo(value.id)
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </Tooltip>
            </>
          ) : (
            <div>Không có quyền</div>
          )}
        </>
      )
    }
  ]

  useEffect(() => {
    getBankInfo()
      .then((res: any) => {
        setDataBankInfo(res.data.bank_info)
      })
      .catch((err: any) => console.log(err))
  }, [])

  useEffect(() => {
    if (alert) {
      const a = setTimeout(() => {
        setAlert('')
      }, 3000)
      return () => clearTimeout(a)
    }
  }, [alert])

  const showModal = (values: any) => {
    setOpen(true)
    if (values) {
      form.setFieldsValue({
        name_bank: values.name_bank,
        slug: values.slug,
        stk: values.stk,
        owner: values.owner,
        email: values.email,
        note: values.note ? values.note : '',
        type: values.type
      })
      setImage(values.image)
      setQrCode(values.qr_code)
      setIdBankInfo(values.id)
    }
  }

  const handleOk = () => {
    setTimeout(() => {
      setOpen(false)
    }, 2000)
  }

  const handleCancel = () => {
    setOpen(false)
    form.resetFields()
    setErrorBankInfo('')
    setIdBankInfo('')
    setQrCode('')
    setImage('')
  }

  // Thêm mới BankInfo
  const postBankInfo = async (values: any) => {
    await createBankInfo(values)
      .then((res: any) => {
        setAlert(res.data.message)
        handleCancel()
        getBankInfo().then((res: any) => {
          setDataBankInfo(res.data.bank_info)
        })
      })
      .catch((err) => {
        err.response.status === 422 && setErrorBankInfo(err.response.data.errors)
        console.log(err)
      })
  }

  // Cập nhật BankInfo
  const changeBankInfo = async (values: any) => {
    await updateBankInfo(idBankInfo, values)
      .then((res) => {
        setAlert(res.data.message)
        handleCancel()
        getBankInfo().then((res: any) => {
          setDataBankInfo(res.data.bank_info)
        })
      })
      .catch((err) => {
        err.response.status === 422 && setErrorBankInfo(err.response.data.errors)
        console.log(err)
      })
  }

  //Xóa BankInfo
  const destroyBankInfo = async (id: number) => {
    await deleteBankInfo(id)
      .then((res) => {
        setAlert(res.data.message)
        getBankInfo().then((res: any) => {
          setDataBankInfo(res.data.bank_info)
        })
      })
      .catch((err) => console.log(err))
  }

  const saveBankInfo = (values: any) => {
    const data = new FormData()
    data.append('image', image)
    data.append('qr_code', qrCode ? qrCode : '')
    data.append('name_bank', values.name_bank)
    data.append('slug', values.slug)
    data.append('type', values.type)
    data.append('stk', values.stk)
    data.append('owner', values.owner)
    data.append('email', values.email ? values.email : '')
    data.append('note', values.note)
    data.append('id_user', user.user.id)
    if (!idBankInfo) {
      postBankInfo(data)
    } else {
      data.append('id', idBankInfo)
      data.append('_method', 'put')
      changeBankInfo(data)
    }
  }

  const handleChange = (changedValues: any, allValues: any) => {
    if (changedValues.owner) {
      allValues.owner = changedValues.owner.toUpperCase()
      form.setFieldsValue({
        owner: changedValues.owner.toUpperCase()
      })
    }
    if (changedValues.name_bank) {
      allValues.slug = changeToSlug(changedValues.name_bank)
      form.setFieldsValue({
        slug: changeToSlug(changedValues.name_bank)
      })
    }
    if (changedValues.name_bank === '') {
      form.setFieldsValue({
        slug: ''
      })
    }
  }

  return (
    <>
      <div className='top-main'>
        <p>Danh sách BankInfo</p>
        <div className='top-main__right'>
          <a href=''>BankInfo</a> / <span>Danh sách BankInfo</span>
        </div>
      </div>
      <Card>
        <Tooltip title='Thêm BankInfo' color={'blue'}>
          <Button
            type='primary'
            onClick={() => {
              showModal('')
            }}
            style={{ marginBottom: '20px' }}
          >
            <FontAwesomeIcon icon={faPlus} />
          </Button>
          {alert && (
            <Alert message={alert} type='success' closable style={{ marginBottom: '20px', fontSize: '24px' }} />
          )}
        </Tooltip>

        <Modal
          title={`${idBankInfo ? 'Sửa BankInfo' : 'Thêm mới BankInfo'}`}
          open={open}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Form
            name='wrap'
            labelCol={{ flex: '110px' }}
            labelAlign='left'
            labelWrap
            wrapperCol={{ flex: 1 }}
            colon={false}
            style={{ maxWidth: 600 }}
            form={form}
            onFinish={saveBankInfo}
            onValuesChange={handleChange}
            initialValues={{ type: 0, note: '' }}
          >
            <Form.Item
              label='Tên bank'
              name='name_bank'
              rules={[
                {
                  required: true,
                  message: 'Tên bank không được bỏ trống'
                }
              ]}
            >
              <Input type='text' name='name_bank' />
            </Form.Item>
            <Row className='error'>
              <Col md={6}>
                <div></div>
              </Col>
              <Col md={18}>
                {errorBankInfo &&
                  errorBankInfo.name_bank &&
                  errorBankInfo.name_bank.map((item: any, index: number) => {
                    return (
                      <p key={index} style={{ color: 'red' }}>
                        {item}
                      </p>
                    )
                  })}
              </Col>
            </Row>
            <Form.Item
              label='Slug'
              name='slug'
              rules={[
                {
                  required: true,
                  message: 'slug không được bỏ trống'
                }
              ]}
            >
              <Input type='text' name='slug' disabled />
            </Form.Item>
            <Row className='error'>
              <Col md={6}>
                <div></div>
              </Col>
              <Col md={18}>
                {errorBankInfo &&
                  errorBankInfo.slug &&
                  errorBankInfo.slug.map((item: any, index: number) => {
                    return (
                      <p key={index} style={{ color: 'red' }}>
                        {item}
                      </p>
                    )
                  })}
              </Col>
            </Row>
            <Form.Item label='Email' name='email'>
              <Input type='text' name='email' />
            </Form.Item>

            <Form.Item label='Số tài khoản' name='stk'>
              <Input type='number' name='stk' />
            </Form.Item>

            <Form.Item
              label='Tên tài khoản'
              name='owner'
              rules={[
                {
                  required: true,
                  message: 'Tên tài khoản không được bỏ trống'
                }
              ]}
            >
              <Input type='text' name='owner' placeholder='viết hoa' />
            </Form.Item>
            <Row className='error'>
              <Col md={6}>
                <div></div>
              </Col>
              <Col md={18}>
                {errorBankInfo &&
                  errorBankInfo.owner &&
                  errorBankInfo.owner.map((item: any, index: number) => {
                    return (
                      <p key={index} style={{ color: 'red' }}>
                        {item}
                      </p>
                    )
                  })}
              </Col>
            </Row>
            <Form.Item label='Ảnh ngân hàng' name='image'>
              <Input
                type='file'
                name='image'
                accept='image/png, image/gif, image/jpeg'
                value={image}
                onChange={(e: any) => setImage(e.target.files[0])}
              />
            </Form.Item>
            <Row>
              <Col md={6}></Col>
              <Col md={6}>
                <Image
                  width={50}
                  src={
                    image && typeof image !== 'string'
                      ? URL.createObjectURL(image)
                      : image && typeof image === 'string'
                      ? import.meta.env.REACT_APP_UPLOADS + 'BankInfo/' + image
                      : ''
                  }
                  preview={false}
                />
              </Col>
            </Row>
            <Row className='error'>
              <Col md={6}>
                <div></div>
              </Col>
              <Col md={18}>
                {errorBankInfo &&
                  errorBankInfo.image &&
                  errorBankInfo.image.map((item: any, index: number) => {
                    return (
                      <p key={index} style={{ color: 'red' }}>
                        {item}
                      </p>
                    )
                  })}
              </Col>
            </Row>
            <Form.Item label='QR code' name='qr_code'>
              <Input
                type='file'
                name='qr_code'
                accept='image/png, image/gif, image/jpeg'
                value={qrCode}
                onChange={(e: any) => setQrCode(e.target.files[0])}
              />
            </Form.Item>
            <Row>
              <Col md={6}></Col>
              <Col md={6}>
                <Image
                  width={50}
                  src={
                    qrCode && typeof qrCode !== 'string'
                      ? URL.createObjectURL(qrCode)
                      : qrCode && typeof qrCode === 'string'
                      ? import.meta.env.REACT_APP_UPLOADS + 'BankInfo/' + qrCode
                      : ''
                  }
                  preview={false}
                />
              </Col>
            </Row>
            <Row className='error'>
              <Col md={6}>
                <div></div>
              </Col>
              <Col md={18}>
                {errorBankInfo &&
                  errorBankInfo.qr_code &&
                  errorBankInfo.qr_code.map((item: any, index: number) => {
                    return (
                      <p key={index} style={{ color: 'red' }}>
                        {item}
                      </p>
                    )
                  })}
              </Col>
            </Row>
            <Form.Item label='Chú ý' name='note'>
              <textarea name='note' rows={4} style={{ width: '100%' }}></textarea>
            </Form.Item>
            <Form.Item label='Dạng tài khoản' name='type'>
              <Select
                options={[
                  { value: 1, label: 'Ví' },
                  { value: 0, label: 'Ngân hàng' },
                  { value: 2, label: 'Thẻ cào' }
                ]}
              />
            </Form.Item>
            <Row className='error'>
              <Col md={6}>
                <div></div>
              </Col>
              <Col md={18}>
                {errorBankInfo &&
                  errorBankInfo.type &&
                  errorBankInfo.type.map((item: any, index: number) => {
                    return (
                      <p key={index} style={{ color: 'red' }}>
                        {item}
                      </p>
                    )
                  })}
              </Col>
            </Row>
            <div className='submit-button'>
              <Button type='primary' htmlType='submit' style={{ marginRight: '10px' }}>
                Lưu
              </Button>
              <Button type='primary' danger onClick={handleCancel}>
                Hủy
              </Button>
            </div>
          </Form>
        </Modal>

        <Table columns={columns} dataSource={dataBankInfo} rowKey={(record) => record.id} scroll={{ x: 0 }} />
      </Card>
    </>
  )
}

export default ViewBankInfo

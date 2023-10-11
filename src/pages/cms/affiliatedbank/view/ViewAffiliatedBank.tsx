import { Card, Button, Table, Alert, Row, Col, Form, Input, Modal, Image, Tooltip } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { createAffiliatedBank, getAffiliatedBank } from '../api'
import { useContext, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { changeToSlug } from '~/ultis/changeToSlug'
import { AuthContext } from '~/context/AuthContextProvider'
import { AffiliatedBankType } from '../model/affiliatedBankModel'

const ViewAffiliatedBank: React.FC = () => {
  const [dataAffiliatedBank, setDataAffiliatedBank] = useState<any>()
  const [open, setOpen] = useState(false)
  const [errorAffiliatedBank, setErrorAffiliatedBank] = useState<any>()
  const [alert, setAlert] = useState('')
  const [image, setImage] = useState<any>()

  const { user }: any = useContext(AuthContext)

  const [form] = Form.useForm()

  const columns: ColumnsType<AffiliatedBankType> = [
    {
      title: 'Stt',
      dataIndex: 'id',
      key: 'id',
      render(_value, _record, index) {
        return <a>{index + 1}</a>
      }
    },
    {
      title: 'Tên Ngân hàng',
      dataIndex: 'name_bank',
      key: 'name_bank'
    },
    {
      title: 'Chủ tài khoản',
      dataIndex: 'owner_account',
      key: 'owner_account'
    },
    {
      title: 'Số tài khoản',
      dataIndex: 'stk',
      key: 'stk'
    },
    {
      title: 'Ảnh Ngân hàng/ví',
      dataIndex: 'image',
      key: 'image',
      render(value) {
        return <Image width={50} src={`${import.meta.env.REACT_APP_UPLOADS}AffiliatedBank/${value}`} preview={false} />
      }
    }
  ]

  useEffect(() => {
    getAffiliatedBank(user.user.id)
      .then((res: any) => {
        setDataAffiliatedBank(res.data.affiliated_banks)
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

  const showModal = () => {
    setOpen(true)
  }

  const handleOk = () => {
    setTimeout(() => {
      setOpen(false)
    }, 2000)
  }

  const handleCancel = () => {
    setOpen(false)
    form.resetFields()
    setErrorAffiliatedBank('')
    setImage('')
  }

  // Thêm mới AffiliatedBank
  const postAffiliatedBank = async (values: any) => {
    await createAffiliatedBank(values)
      .then((res: any) => {
        setAlert(res.data.message)
        handleCancel()
        getAffiliatedBank(user.user.id).then((res: any) => {
          setDataAffiliatedBank(res.data.affiliated_banks)
        })
      })
      .catch((err) => {
        err.response.status === 422 && setErrorAffiliatedBank(err.response.data.errors)
        console.log(err)
      })
  }

  const saveAffiliatedBank = (values: any) => {
    const data = new FormData()
    data.append('image', image)
    data.append('name_bank', values.name_bank)
    data.append('slug', values.slug)
    data.append('stk', values.stk)
    data.append('owner_account', values.owner_account)
    data.append('id_user', user.user.id)
    postAffiliatedBank(data)
  }

  const handleChange = (changedValues: any, allValues: any) => {
    if (changedValues.owner_account) {
      allValues.owner_account = changedValues.owner_account.toUpperCase()
      form.setFieldsValue({
        owner_account: changedValues.owner_account.toUpperCase()
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
        <p>Danh sách Ngân hàng</p>
        <div className='top-main__right'>
          <a href=''>Ngân hàng</a> / <span>Danh sách Ngân hàng</span>
        </div>
      </div>
      <Card>
        <Tooltip title='Thêm Ngân hàng' color={'blue'}>
          <Button
            type='primary'
            onClick={() => {
              showModal()
            }}
            style={{ marginBottom: '20px' }}
          >
            <FontAwesomeIcon icon={faPlus} />
          </Button>
          {alert && (
            <Alert message={alert} type='success' closable style={{ marginBottom: '20px', fontSize: '24px' }} />
          )}
        </Tooltip>

        <Modal title='Thêm Ngân hàng liên kết' open={open} onOk={handleOk} onCancel={handleCancel}>
          <Form
            name='wrap'
            labelCol={{ flex: '110px' }}
            labelAlign='left'
            labelWrap
            wrapperCol={{ flex: 1 }}
            colon={false}
            style={{ maxWidth: 600 }}
            form={form}
            onFinish={saveAffiliatedBank}
            onValuesChange={handleChange}
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
                {errorAffiliatedBank &&
                  errorAffiliatedBank.name_bank &&
                  errorAffiliatedBank.name_bank.map((item: any, index: number) => {
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
                {errorAffiliatedBank &&
                  errorAffiliatedBank.slug &&
                  errorAffiliatedBank.slug.map((item: any, index: number) => {
                    return (
                      <p key={index} style={{ color: 'red' }}>
                        {item}
                      </p>
                    )
                  })}
              </Col>
            </Row>

            <Form.Item
              label='Số tài khoản'
              name='stk'
              rules={[
                {
                  required: true,
                  message: 'Số tài khoản không được bỏ trống'
                }
              ]}
            >
              <Input type='number' name='stk' />
            </Form.Item>
            <Row className='error'>
              <Col md={6}>
                <div></div>
              </Col>
              <Col md={18}>
                {errorAffiliatedBank &&
                  errorAffiliatedBank.stk &&
                  errorAffiliatedBank.stk.map((item: any, index: number) => {
                    return (
                      <p key={index} style={{ color: 'red' }}>
                        {item}
                      </p>
                    )
                  })}
              </Col>
            </Row>

            <Form.Item
              label='Tên tài khoản'
              name='owner_account'
              rules={[
                {
                  required: true,
                  message: 'Tên tài khoản không được bỏ trống'
                }
              ]}
            >
              <Input type='text' name='owner_account' placeholder='viết hoa' />
            </Form.Item>
            <Row className='error'>
              <Col md={6}>
                <div></div>
              </Col>
              <Col md={18}>
                {errorAffiliatedBank &&
                  errorAffiliatedBank.owner_account &&
                  errorAffiliatedBank.owner_account.map((item: any, index: number) => {
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
                      ? import.meta.env.REACT_APP_UPLOADS + 'AffiliatedBank/' + image
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
                {errorAffiliatedBank &&
                  errorAffiliatedBank.image &&
                  errorAffiliatedBank.image.map((item: any, index: number) => {
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

        <Table columns={columns} dataSource={dataAffiliatedBank} rowKey={(record) => record.id} scroll={{ x: 0 }} />
      </Card>
    </>
  )
}

export default ViewAffiliatedBank

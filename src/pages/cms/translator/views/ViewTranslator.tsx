import { Card, Button, Table, Alert, Row, Col, Form, Input, Modal, Select, Tooltip } from 'antd'
import '../styles/view-translator.scss'
import type { ColumnsType } from 'antd/es/table'
import { createTranslator, deleteTranslator, getTranslator, updateTranslator } from '../api'
import { useEffect, useState, useContext } from 'react'
import { changeToSlug } from '~/ultis/changeToSlug'
import { AuthContext } from '~/context/AuthContextProvider'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { EditOutlined } from '@ant-design/icons'
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'

interface DataType {
  id: number
  name: string
  name_user_add: string
  status: number
}

const ViewTranslator: React.FC = () => {
  const [dataTranslator, setDataTranslator] = useState<any>()
  const [open, setOpen] = useState(false)
  const [errorTranslator, setErrorTranslator] = useState<any>()
  const [alert, setAlert] = useState('')
  const [idTranslator, setIdTranslator] = useState<any>()

  const [form] = Form.useForm()
  const { user }: any = useContext(AuthContext)

  const columns: ColumnsType<DataType> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render(_value, _record, index) {
        return <a>{index + 1}</a>
      }
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Người thêm',
      dataIndex: 'name_user_add',
      key: 'name_user_add'
    },
    {
      title: 'Trạng thái',
      key: 'status',
      dataIndex: 'status',
      render: (_, record) => {
        return (
          <Button size='small' type='primary' danger={record.status === 0}>
            {record.status === 1 ? 'Publish' : 'Unpublish'}
          </Button>
        )
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (value) => (
        <>
          <Tooltip title='Sửa dịch giả' color={'blue'}>
            <Button size='middle' type='primary' onClick={() => showModal(value)}>
              <EditOutlined rev={undefined} />
            </Button>
          </Tooltip>
          <Tooltip title='Xóa dịch giả' color={'red'}>
            <Button
              size='middle'
              danger
              type='primary'
              style={{
                marginLeft: '5px'
              }}
              onClick={() => {
                if (
                  // eslint-disable-next-line no-restricted-globals
                  confirm(`Bạn có muốn xóa dịch giả ${value.name} này không`) === true
                ) {
                  destroyTranslator(value.id)
                }
              }}
            >
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </Tooltip>
        </>
      )
    }
  ]

  useEffect(() => {
    getTranslator()
      .then((res: any) => {
        setDataTranslator(res.data.trans)
      })
      .catch((err) => console.log(err))
  }, [])

  useEffect(() => {
    if (alert) {
      const a = setTimeout(() => {
        setAlert('')
      }, 3000)
      return () => clearTimeout(a)
    }
  }, [alert])

  const showModal = (value: any) => {
    setOpen(true)
    if (value) {
      form.setFieldsValue({
        name: value.name,
        slug: value.slug,
        status: value.status
      })
      setIdTranslator(value.id)
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
    setErrorTranslator('')
    setIdTranslator('')
  }

  // Thêm mới Dịch giả
  const postTranslator = async (values: any) => {
    values.id_user = user.user.id
    await createTranslator(values)
      .then((res: any) => {
        setAlert(res.data.message)
        handleCancel()
        getTranslator().then((res: any) => {
          setDataTranslator(res.data.trans)
        })
      })
      .catch((err) => {
        err.response.status === 422 && setErrorTranslator(err.response.data.errors)
        console.log(err)
      })
  }

  // Cập nhật Dịch giả
  const changeTranslator = async (values: any) => {
    values.id = idTranslator
    await updateTranslator(idTranslator, values)
      .then((res) => {
        setAlert(res.data.message)
        handleCancel()
        getTranslator().then((res: any) => {
          setDataTranslator(res.data.trans)
        })
      })
      .catch((err) => {
        err.response.status === 422 && setErrorTranslator(err.response.data.errors)
        console.log(err)
      })
  }

  //Xóa Dịch giả
  const destroyTranslator = async (id: number) => {
    await deleteTranslator(id)
      .then((res) => {
        setAlert(res.data.message)
        getTranslator().then((res: any) => {
          setDataTranslator(res.data.trans)
        })
      })
      .catch((err) => console.log(err))
  }

  const saveTranslator = (values: any) => {
    if (!idTranslator) {
      postTranslator(values)
    } else {
      changeTranslator(values)
    }
  }

  const handleChange = (changedValues: any, allValues: any) => {
    if (changedValues.name) {
      allValues.slug = changeToSlug(changedValues.name)
      form.setFieldsValue({
        slug: changeToSlug(changedValues.name)
      })
    }
    if (changedValues.name === '') {
      form.setFieldsValue({
        slug: ''
      })
    }
  }

  return (
    <>
      <div className='top-main'>
        <p>Danh sách Dịch giả</p>
        <div className='top-main__right'>
          <a href=''>Dịch giả</a> / <span>Danh sách Dịch giả</span>
        </div>
      </div>
      <Card>
        <Tooltip title='Thêm dịch giả' color={'blue'}>
          <Button type='primary' onClick={() => showModal('')} style={{ marginBottom: '20px' }}>
            <FontAwesomeIcon icon={faPlus} />
          </Button>
          {alert && (
            <Alert message={alert} type='success' closable style={{ marginBottom: '20px', fontSize: '24px' }} />
          )}
        </Tooltip>

        <Modal
          title={`${idTranslator ? 'Sửa dịch giả' : 'Thêm mới dịch giả'}`}
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
            initialValues={{ name: '', slug: '', status: 1 }}
            form={form}
            onFinish={saveTranslator}
            onValuesChange={handleChange}
          >
            <Form.Item
              label='Tên dịch giả'
              name='name'
              rules={[
                {
                  required: true,
                  message: 'Tên dịch giả không được bỏ trống'
                },
                {
                  max: 255,
                  message: 'Tên dịch giả không được quá 255 ký tự'
                }
              ]}
            >
              <Input type='text' name='name' />
            </Form.Item>
            <Row className='error'>
              <Col md={6}>
                <div></div>
              </Col>
              <Col md={18}>
                {errorTranslator &&
                  errorTranslator.name &&
                  errorTranslator.name.map((item: any, index: number) => {
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
                { required: true, message: 'slug không được bỏ trống' },
                { max: 255, message: 'slug không được quá 255 ký tự' }
              ]}
            >
              <Input type='text' name='slug' disabled />
            </Form.Item>

            <Row className='error'>
              <Col md={6}>
                <div></div>
              </Col>
              <Col md={18}>
                {errorTranslator &&
                  errorTranslator.slug &&
                  errorTranslator.slug.map((item: any, index: number) => {
                    return (
                      <p key={index} style={{ color: 'red' }}>
                        {item}
                      </p>
                    )
                  })}
              </Col>
            </Row>
            <Form.Item label='Trạng thái' name='status'>
              <Select
                options={[
                  { value: 1, label: 'Publish' },
                  { value: 0, label: 'Unpublish' }
                ]}
              />
            </Form.Item>
            <Row className='error'>
              <Col md={6}>
                <div></div>
              </Col>
              <Col md={18}>
                {errorTranslator &&
                  errorTranslator.status &&
                  errorTranslator.status.map((item: any, index: number) => {
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

        <Table columns={columns} dataSource={dataTranslator} rowKey={(record) => record.id} scroll={{ x: 0 }} />
      </Card>
    </>
  )
}

export default ViewTranslator

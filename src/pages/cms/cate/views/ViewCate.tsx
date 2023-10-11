import { Card, Button, Table, Alert, Row, Col, Form, Input, Modal, Select, Tooltip } from 'antd'
import '../styles/view-cate.scss'
import type { ColumnsType } from 'antd/es/table'
import { createCate, deleteCate, getCate, updateCate } from '../api'
import { useEffect, useState } from 'react'
import { changeToSlug } from '~/ultis/changeToSlug'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { EditOutlined } from '@ant-design/icons'
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'

interface DataType {
  id: number
  name: string
  status: number
}

const ViewCate: React.FC = () => {
  const [dataCate, setDataCate] = useState<any>()
  const [open, setOpen] = useState(false)
  const [errorCate, setErrorCate] = useState<any>()
  const [alert, setAlert] = useState('')
  const [idCate, setIdCate] = useState<any>()

  const [form] = Form.useForm()

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
      title: 'Trạng thái',
      key: 'status',
      dataIndex: 'status',
      render: (_, record) => {
        return (
          <Button size='small' type='primary' danger={record.status !== 1}>
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
          <Tooltip title='Sửa thể loại' color={'blue'}>
            <Button size='middle' type='primary' style={{ marginRight: '5px' }} onClick={() => showModal(value)}>
              <EditOutlined rev={undefined} />
            </Button>
          </Tooltip>
          <Tooltip title='Xóa thể loại' color={'red'}>
            <Button
              size='middle'
              type='primary'
              danger
              onClick={() => {
                if (
                  // eslint-disable-next-line no-restricted-globals
                  confirm(`Bạn có muốn xóa thể loại ${value.name} này không`) === true
                ) {
                  destroyCate(value.id)
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
    getCate()
      .then((res: any) => {
        setDataCate(res.data.cate)
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
      setIdCate(value.id)
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
    setErrorCate('')
    setIdCate('')
  }

  // Thêm mới thể loại
  const postCate = async (values: any) => {
    await createCate(values)
      .then((res: any) => {
        setAlert(res.data.message)
        handleCancel()
        getCate().then((res: any) => {
          setDataCate(res.data.cate)
        })
      })
      .catch((err) => {
        err.response.status === 422 && setErrorCate(err.response.data.errors)
        console.log(err)
      })
  }

  // Cập nhật thể loại
  const changeCate = async (values: any) => {
    values.id = idCate
    await updateCate(idCate, values)
      .then((res) => {
        setAlert(res.data.message)
        handleCancel()
        getCate().then((res: any) => {
          setDataCate(res.data.cate)
        })
      })
      .catch((err) => {
        err.response.status === 422 && setErrorCate(err.response.data.errors)
        console.log(err)
      })
  }

  //Xóa thể loại
  const destroyCate = async (id: number) => {
    await deleteCate(id)
      .then((res) => {
        setAlert(res.data.message)
        getCate().then((res: any) => {
          setDataCate(res.data.cate)
        })
      })
      .catch((err) => console.log(err))
  }

  const saveCate = (values: any) => {
    if (!idCate) {
      postCate(values)
    } else {
      changeCate(values)
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
        <p>Danh sách thể loại</p>
        <div className='top-main__right'>
          <a href=''>Thể loại</a> / <span>Danh sách thể loại</span>
        </div>
      </div>
      <Card>
        <Tooltip title='Thêm thể loại' color={'blue'}>
          <Button type='primary' onClick={() => showModal('')} style={{ marginBottom: '20px' }}>
            <FontAwesomeIcon icon={faPlus} />
          </Button>
          {alert && (
            <Alert message={alert} type='success' closable style={{ marginBottom: '20px', fontSize: '24px' }} />
          )}
        </Tooltip>

        <Modal
          title={`${idCate ? 'Sửa thể loại' : 'Thêm mới thể loại'}`}
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
            onFinish={saveCate}
            onValuesChange={handleChange}
          >
            <Form.Item
              label='Tên thể loại'
              name='name'
              rules={[
                {
                  required: true,
                  message: 'Tên thể loại không được bỏ trống'
                },
                {
                  max: 255,
                  message: 'Tên thể loại không được quá 255 ký tự'
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
                {errorCate &&
                  errorCate.name &&
                  errorCate.name.map((item: any, index: number) => {
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
                {errorCate &&
                  errorCate.slug &&
                  errorCate.slug.map((item: any, index: number) => {
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
                {errorCate &&
                  errorCate.status &&
                  errorCate.status.map((item: any, index: number) => {
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

        <Table columns={columns} dataSource={dataCate} rowKey={(record) => record.id} scroll={{ x: 0 }} />
      </Card>
    </>
  )
}

export default ViewCate

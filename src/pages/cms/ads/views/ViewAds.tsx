import { Card, Button, Table, Alert, Row, Col, Form, Input, Modal, Select, Tooltip } from 'antd'
import '../styles/view-ads.scss'
import type { ColumnsType } from 'antd/es/table'
import { createAds, hiddenAds, getAds, updateAds } from '../api'
import { useEffect, useState } from 'react'
import { changeToSlug } from '~/ultis/changeToSlug'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { EditOutlined } from '@ant-design/icons'
import { faUserNinja, faPlus } from '@fortawesome/free-solid-svg-icons'

interface DataType {
  id: number
  name: string
  value: string
  status: number
}

const ViewAds: React.FC = () => {
  const [dataAds, setDataAds] = useState<any>()
  const [open, setOpen] = useState(false)
  const [errorAds, setErrorAds] = useState<any>()
  const [alert, setAlert] = useState('')
  const [idAds, setIdAds] = useState<any>()

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
      title: 'Giá trị',
      dataIndex: 'value',
      key: 'value'
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
          <Tooltip title='Sửa ads' color={'blue'}>
            <Button size='middle' type='primary' style={{ marginRight: '5px' }} onClick={() => showModal(value)}>
              <EditOutlined rev={undefined} />
            </Button>
          </Tooltip>
          <Tooltip title='Ẩn ads' color={'red'}>
            <Button
              size='middle'
              type='primary'
              danger
              onClick={() => {
                if (
                  // eslint-disable-next-line no-restricted-globals
                  confirm(`Bạn có muốn ẩn ${value.name} này không`) === true
                ) {
                  destroyAds(value.id)
                }
              }}
            >
              <FontAwesomeIcon icon={faUserNinja} />
            </Button>
          </Tooltip>
        </>
      )
    }
  ]

  useEffect(() => {
    getAds()
      .then((res: any) => {
        setDataAds(res.data.ads)
      })
      .catch((err) => console.log(err))
  }, [])

  useEffect(() => {
    if (alert) {
      const id = setTimeout(() => {
        setAlert('')
      }, 3000)
      return () => clearTimeout(id)
    }
  }, [alert])

  const showModal = (value: any) => {
    setOpen(true)
    if (value) {
      form.setFieldsValue({
        name: value.name,
        slug: value.slug,
        value: value.value,
        status: value.status
      })
      setIdAds(value.id)
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
    setErrorAds('')
    setIdAds('')
  }

  // Thêm mới ads
  const postAds = async (values: any) => {
    await createAds(values)
      .then((res: any) => {
        setAlert(res.data.message)
        handleCancel()
        getAds().then((res: any) => {
          setDataAds(res.data.ads)
        })
      })
      .catch((err) => {
        err.response.status === 422 && setErrorAds(err.response.data.errors)
        console.log(err)
      })
  }

  // Cập nhật ads
  const changeAds = async (values: any) => {
    values.id = idAds
    await updateAds(idAds, values)
      .then((res) => {
        setAlert(res.data.message)
        handleCancel()
        getAds().then((res: any) => {
          setDataAds(res.data.ads)
        })
      })
      .catch((err) => {
        err.response.status === 422 && setErrorAds(err.response.data.errors)
        console.log(err)
      })
  }

  //Xóa ads
  const destroyAds = async (id: number) => {
    await hiddenAds(id)
      .then((res) => {
        setAlert(res.data.message)
        getAds().then((res: any) => {
          setDataAds(res.data.ads)
        })
      })
      .catch((err) => console.log(err))
  }

  const saveAds = (values: any) => {
    if (!idAds) {
      postAds(values)
    } else {
      changeAds(values)
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
        <p>Danh sách ads</p>
        <div className='top-main__right'>
          <a href=''>ads</a> / <span>Danh sách ads</span>
        </div>
      </div>
      <Card>
        <Tooltip title='Thêm mới ads' color={'blue'}>
          <Button type='primary' onClick={() => showModal('')} style={{ marginBottom: '20px' }}>
            <FontAwesomeIcon icon={faPlus} />
          </Button>
        </Tooltip>
        {alert && <Alert message={alert} type='success' closable style={{ marginBottom: '20px', fontSize: '24px' }} />}

        <Modal title={`${idAds ? 'Sửa ads' : 'Thêm mới ads'}`} open={open} onOk={handleOk} onCancel={handleCancel}>
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
            onFinish={saveAds}
            onValuesChange={handleChange}
          >
            <Form.Item
              label='Tên ads'
              name='name'
              rules={[
                {
                  required: true,
                  message: 'Tên ads không được bỏ trống'
                },
                {
                  max: 255,
                  message: 'Tên ads không được quá 255 ký tự'
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
                {errorAds &&
                  errorAds.name &&
                  errorAds.name.map((item: any, index: number) => {
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
                {errorAds &&
                  errorAds.slug &&
                  errorAds.slug.map((item: any, index: number) => {
                    return (
                      <p key={index} style={{ color: 'red' }}>
                        {item}
                      </p>
                    )
                  })}
              </Col>
            </Row>
            <Form.Item
              label='Giá trị'
              name='value'
              rules={[{ required: true, message: 'giá trị không được bỏ trống' }]}
            >
              <Input type='text' name='value' />
            </Form.Item>
            <Row className='error'>
              <Col md={6}>
                <div></div>
              </Col>
              <Col md={18}>
                {errorAds &&
                  errorAds.value &&
                  errorAds.value.map((item: any, index: number) => {
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
                {errorAds &&
                  errorAds.status &&
                  errorAds.status.map((item: any, index: number) => {
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

        <Table columns={columns} dataSource={dataAds} rowKey={(record) => record.id} scroll={{ x: 0 }} />
      </Card>
    </>
  )
}

export default ViewAds

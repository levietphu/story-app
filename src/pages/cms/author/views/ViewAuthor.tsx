import { Card, Button, Table, Alert, Row, Col, Form, Input, Modal, Select, Tooltip } from 'antd'
import '../styles/view-author.scss'
import type { ColumnsType } from 'antd/es/table'
import { createAuthor, deleteAuthor, getAuthor, updateAuthor } from '../api'
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

const ViewAuthor: React.FC = () => {
  const [dataAuthor, setDataAuthor] = useState<any>()
  const [open, setOpen] = useState(false)
  const [errorAuthor, setErrorAuthor] = useState<any>()
  const [alert, setAlert] = useState('')
  const [idAuthor, setIdAuthor] = useState<any>()

  const [form] = Form.useForm()

  const columns: ColumnsType<DataType> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render(value, record, index) {
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
          <Tooltip title='Sửa tác giả' color={'blue'}>
            <Button size='middle' type='primary' style={{ marginRight: '5px' }} onClick={() => showModal(value)}>
              <EditOutlined rev={undefined} />
            </Button>
          </Tooltip>
          <Tooltip title='Xóa tác giả' color={'red'}>
            <Button
              size='middle'
              type='primary'
              danger
              onClick={() => {
                if (
                  // eslint-disable-next-line no-restricted-globals
                  confirm(`Bạn có muốn xóa Tác giả ${value.name} này không`) === true
                ) {
                  destroyAuthor(value.id)
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
    getAuthor()
      .then((res: any) => {
        setDataAuthor(res.data.author)
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
      setIdAuthor(value.id)
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
    setErrorAuthor('')
    setIdAuthor('')
  }

  // Thêm mới tác giả
  const postAuthor = async (values: any) => {
    await createAuthor(values)
      .then((res: any) => {
        setAlert(res.data.message)
        handleCancel()
        getAuthor().then((res: any) => {
          setDataAuthor(res.data.author)
        })
      })
      .catch((err) => {
        err.response.status === 422 && setErrorAuthor(err.response.data.errors)
        console.log(err)
      })
  }

  // Cập nhật tác giả
  const changeAuthor = async (values: any) => {
    values.id = idAuthor
    await updateAuthor(idAuthor, values)
      .then((res) => {
        setAlert(res.data.message)
        handleCancel()
        getAuthor().then((res: any) => {
          setDataAuthor(res.data.author)
        })
      })
      .catch((err) => {
        err.response.status === 422 && setErrorAuthor(err.response.data.errors)
        console.log(err)
      })
  }

  //Xóa tác giả
  const destroyAuthor = async (id: number) => {
    await deleteAuthor(id)
      .then((res) => {
        setAlert(res.data.message)
        getAuthor().then((res: any) => {
          setDataAuthor(res.data.author)
        })
      })
      .catch((err) => console.log(err))
  }

  const saveAuthor = (values: any) => {
    if (!idAuthor) {
      postAuthor(values)
    } else {
      changeAuthor(values)
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
        <p>Danh sách Tác giả</p>
        <div className='top-main__right'>
          <a href=''>Tác giả</a> / <span>Danh sách Tác giả</span>
        </div>
      </div>
      <Card>
        <Tooltip title='Thêm tác giả' color={'blue'}>
          <Button type='primary' onClick={() => showModal('')} style={{ marginBottom: '20px' }}>
            <FontAwesomeIcon icon={faPlus} />
          </Button>
        </Tooltip>
        {alert && <Alert message={alert} type='success' closable style={{ marginBottom: '20px', fontSize: '24px' }} />}

        <Modal
          title={`${idAuthor ? 'Sửa tác giả' : 'Thêm mới tác giả'}`}
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
            onFinish={saveAuthor}
            onValuesChange={handleChange}
          >
            <Form.Item
              label='Tên Tác giả'
              name='name'
              rules={[
                {
                  required: true,
                  message: 'Tên Tác giả không được bỏ trống'
                },
                {
                  max: 255,
                  message: 'Tên Tác giả không được quá 255 ký tự'
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
                {errorAuthor &&
                  errorAuthor.name &&
                  errorAuthor.name.map((item: any, index: number) => {
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
                {errorAuthor &&
                  errorAuthor.slug &&
                  errorAuthor.slug.map((item: any, index: number) => {
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
                {errorAuthor &&
                  errorAuthor.status &&
                  errorAuthor.status.map((item: any, index: number) => {
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
        <Table columns={columns} dataSource={dataAuthor} rowKey={(record) => record.id} scroll={{ x: 0 }} />
      </Card>
    </>
  )
}

export default ViewAuthor

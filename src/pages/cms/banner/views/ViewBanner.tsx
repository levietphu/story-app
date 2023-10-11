import { Card, Button, Table, Alert, Row, Col, Form, Input, Modal, Select, Image, message, Upload, Tooltip } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import '../styles/view-banner.scss'
import type { ColumnsType } from 'antd/es/table'
import { createBanner, deleteBanner, getBanner, updateBanner } from '../api'
import { useEffect, useState } from 'react'
import type { UploadProps } from 'antd/es/upload'
import type { UploadFile } from 'antd/es/upload/interface'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { EditOutlined } from '@ant-design/icons'
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'

interface DataType {
  id: number
  id_truyen: string
  name: string
  image: string
  status: number
}

const ViewBanner: React.FC = () => {
  const [dataBanner, setDataBanner] = useState<any>()
  const [story, setStory] = useState<any>()
  const [open, setOpen] = useState(false)
  const [errorBanner, setErrorBanner] = useState<any>()
  const [alert, setAlert] = useState('')
  const [idBanner, setIdBanner] = useState<any>()
  const [fileList, setFileList] = useState<UploadFile[]>([])

  const [form] = Form.useForm()

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
      title: 'Tên',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Ảnh',
      dataIndex: 'image',
      key: 'image',
      render(value) {
        return <Image width={200} src={`${import.meta.env.REACT_APP_UPLOADS}${value}`} preview={false} />
      }
    },
    {
      title: 'Trạng thái',
      key: 'status',
      dataIndex: 'status',
      render: (_, record) => {
        return (
          <Button size='small' type='primary' danger={record.status === 0}>
            {' '}
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
          <Tooltip title='Sửa banner' color={'blue'}>
            <Button size='middle' type='primary' onClick={() => showModal(value)}>
              <EditOutlined rev={undefined} />
            </Button>
          </Tooltip>
          <Tooltip title='Xóa banner' color={'red'}>
            <Button
              size='middle'
              danger
              type='primary'
              style={{ marginLeft: '5px' }}
              onClick={() => {
                if (
                  // eslint-disable-next-line no-restricted-globals
                  confirm(`Bạn có muốn xóa Banner ${value.name} này không`) === true
                ) {
                  destroyBanner(value.id)
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
    getBanner()
      .then((res: any) => {
        setDataBanner(res.data.banner)
        setStory(res.data.story)
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
        name: values.name,
        image: values.image,
        id_truyen: values.name + '/' + values.id_truyen,
        status: values.status
      })
      setIdBanner(values.id)
      setFileList([
        {
          uid: values.id,
          name: values.name,
          status: 'done',
          url: `${import.meta.env.REACT_APP_UPLOADS}${values.image}`
        }
      ])
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
    setErrorBanner('')
    setIdBanner('')
    setFileList([])
  }

  // Thêm mới Banner
  const postBanner = async (values: any) => {
    values.id_truyen = values.id_truyen.split('/')[1]
    await createBanner(values)
      .then((res: any) => {
        setAlert(res.data.message)
        handleCancel()
        getBanner().then((res: any) => {
          setDataBanner(res.data.banner)
        })
      })
      .catch((err) => {
        err.response.status === 422 && setErrorBanner(err.response.data.errors)
        console.log(err)
      })
  }

  // Cập nhật Banner
  const changeBanner = async (values: any) => {
    values.id = idBanner
    values.id_truyen = values.id_truyen.split('/')[1]
    await updateBanner(idBanner, values)
      .then((res) => {
        setAlert(res.data.message)
        handleCancel()
        getBanner().then((res: any) => {
          setDataBanner(res.data.banner)
        })
      })
      .catch((err) => {
        err.response.status === 422 && setErrorBanner(err.response.data.errors)
        console.log(err)
      })
  }

  //Xóa Banner
  const destroyBanner = async (id: number) => {
    await deleteBanner(id)
      .then((res) => {
        setAlert(res.data.message)
        getBanner().then((res: any) => {
          setDataBanner(res.data.banner)
        })
      })
      .catch((err) => console.log(err))
  }

  const saveBanner = (values: any) => {
    if (!idBanner) {
      postBanner(values)
    } else {
      changeBanner(values)
    }
  }

  const handleChange = (changedValues: any, allValues: any) => {
    if (changedValues.id_truyen) {
      allValues.name = changedValues.id_truyen.split('/')[0]
      form.setFieldsValue({
        name: changedValues.id_truyen.split('/')[0]
      })
    }
  }

  //upload ảnh
  const props: UploadProps = {
    name: 'image',
    action: `${import.meta.env.REACT_APP_API}cms/upload_banner/${idBanner ? idBanner : '0'}`,
    accept: 'image/png, image/gif, image/jpeg',
    listType: 'picture-card',
    fileList: fileList,
    onChange(info) {
      if (!idBanner) {
        setFileList(info.fileList)
      } else {
        setFileList(
          info.fileList.filter((item: any) => {
            return item.uid !== idBanner
          })
        )
      }

      if (info.file.status === 'done') {
        message.success(` tải ảnh ${info.file.name} lên thành công`)
      } else if (info.file.status === 'error') {
        message.error(` tải ảnh ${info.file.name} lên thất bại`)
      }
    }
  }

  const uploadButton = (
    <div>
      <PlusOutlined rev={undefined} />
      <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
    </div>
  )

  return (
    <>
      <div className='top-main'>
        <p>Danh sách Banner</p>
        <div className='top-main__right'>
          <a href=''>Banner</a> / <span>Danh sách Banner</span>
        </div>
      </div>
      <Card>
        <Tooltip title='Thêm banner' color={'blue'}>
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
          title={`${idBanner ? 'Sửa Banner' : 'Thêm mới Banner'}`}
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
            initialValues={{
              name: '',
              slug: '',
              status: 1,
              id_truyen: ''
            }}
            form={form}
            onFinish={saveBanner}
            onValuesChange={handleChange}
          >
            <Form.Item
              label='Truyện'
              name='id_truyen'
              rules={[
                {
                  required: true,
                  message: 'Tên Truyện không được bỏ trống'
                }
              ]}
            >
              <Select
                showSearch
                placeholder='Search to Select'
                optionFilterProp='children'
                filterOption={(input: string, option: any) => option?.label.toLowerCase().includes(input)}
                options={
                  story && [
                    ...story.map((item: any) => {
                      return {
                        value: item.name + '/' + item.id,
                        label: item.name
                      }
                    }),
                    {
                      value: '',
                      label: 'Tùy chọn'
                    }
                  ]
                }
              />
            </Form.Item>
            <Form.Item label='Tên Banner' name='name'>
              <Input type='text' name='name' disabled />
            </Form.Item>
            <Row className='error'>
              <Col md={6}>
                <div></div>
              </Col>
              <Col md={18}>
                {errorBanner &&
                  errorBanner.name &&
                  errorBanner.name.map((item: any, index: number) => {
                    return (
                      <p key={index} style={{ color: 'red' }}>
                        {item}
                      </p>
                    )
                  })}
              </Col>
            </Row>

            <Form.Item label='Ảnh' name='image'>
              <Upload {...props}>{fileList.length >= 8 ? null : uploadButton}</Upload>
            </Form.Item>
            <Row className='error'>
              <Col md={6}>
                <div></div>
              </Col>
              <Col md={18}>
                {errorBanner &&
                  errorBanner.image &&
                  errorBanner.image.map((item: any, index: number) => {
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
                {errorBanner &&
                  errorBanner.status &&
                  errorBanner.status.map((item: any, index: number) => {
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

        <Table columns={columns} dataSource={dataBanner} rowKey={(record) => record.id} scroll={{ x: 0 }} />
      </Card>
    </>
  )
}

export default ViewBanner

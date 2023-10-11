import { Card, Button, Table, Alert, Row, Col, Form, Input, Modal, Tooltip } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { createDiscount, deleteDiscount, getDiscount, updateDiscount } from '../api'
import { useEffect, useState } from 'react'
import { changeToSlug } from '~/ultis/changeToSlug'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { EditOutlined } from '@ant-design/icons'
import { faUserNinja, faPlus } from '@fortawesome/free-solid-svg-icons'
import { useParams } from 'react-router-dom'

interface DataType {
  id: number
  number_chapter: number
  value: string
}

const ViewDiscount: React.FC = () => {
  const [dataDiscount, setDataDiscount] = useState<any>()
  const [nameStory, setNameStory] = useState<string>('')
  const [open, setOpen] = useState(false)
  const [errorDiscount, setErrorDiscount] = useState<any>()
  const [alert, setAlert] = useState('')
  const [idDiscount, setIdDiscount] = useState<any>()

  const [form] = Form.useForm()
  const params = useParams()

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
      title: 'Số chương trở lên được giảm giá)',
      dataIndex: 'number_chapter',
      key: 'number_chapter'
    },
    {
      title: 'Giá trị',
      dataIndex: 'value',
      key: 'value'
    },

    {
      title: 'Action',
      key: 'action',
      render: (value) => (
        <>
          <Tooltip title='Sửa Discount' color={'blue'}>
            <Button size='middle' type='primary' style={{ marginRight: '5px' }} onClick={() => showModal(value)}>
              <EditOutlined rev={undefined} />
            </Button>
          </Tooltip>
          <Tooltip title='Xóa Discount' color={'red'}>
            <Button
              size='middle'
              type='primary'
              danger
              onClick={() => {
                if (
                  // eslint-disable-next-line no-restricted-globals
                  confirm(`Bạn có muốn xóa giảm giá này không`) === true
                ) {
                  destroyDiscount(value.id)
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
    getDiscount(Number(params.id_story))
      .then((res: any) => {
        setDataDiscount(res.data.discount)
        setNameStory(res.data.name_story)
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
        number_chapter: value.number_chapter,
        value: value.value
      })
      setIdDiscount(value.id)
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
    setErrorDiscount('')
    setIdDiscount('')
  }

  // Thêm mới Discount
  const postDiscount = async (values: any) => {
    values.id_truyen = Number(params.id_story)
    await createDiscount(Number(params.id_story), values)
      .then((res: any) => {
        setAlert(res.data.message)
        handleCancel()
        getDiscount(Number(params.id_story)).then((res: any) => {
          setDataDiscount(res.data.discount)
        })
      })
      .catch((err) => setErrorDiscount(err.response.data.errors))
  }

  // Cập nhật Discount
  const changeDiscount = async (values: any) => {
    await updateDiscount(idDiscount, values)
      .then((res) => {
        setAlert(res.data.message)
        handleCancel()
        getDiscount(Number(params.id_story)).then((res: any) => {
          setDataDiscount(res.data.discount)
        })
      })
      .catch((err) => setErrorDiscount(err.response.data.errors))
  }

  //Xóa Discount
  const destroyDiscount = async (id: number) => {
    await deleteDiscount(id)
      .then((res) => {
        setAlert(res.data.message)
        getDiscount(Number(params.id_story)).then((res: any) => {
          setDataDiscount(res.data.discount)
        })
      })
      .catch((err) => console.log(err))
  }

  const saveDiscount = (values: any) => {
    if (!idDiscount) {
      postDiscount(values)
    } else {
      changeDiscount(values)
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
        <p>Danh sách giảm giá: {nameStory}</p>
        <div className='top-main__right'>
          <a href=''>Discount</a> / <span>Danh sách Giảm giá</span>
        </div>
      </div>
      <Card>
        <Tooltip title='Thêm mới Discount' color={'blue'}>
          <Button type='primary' onClick={() => showModal('')} style={{ marginBottom: '20px' }}>
            <FontAwesomeIcon icon={faPlus} />
          </Button>
        </Tooltip>
        {alert && <Alert message={alert} type='success' closable style={{ marginBottom: '20px', fontSize: '24px' }} />}

        <Modal
          title={`${idDiscount ? 'Sửa Discount' : 'Thêm mới Discount'}`}
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
            onFinish={saveDiscount}
            onValuesChange={handleChange}
          >
            <Form.Item
              label='Số chương (discount)'
              name='number_chapter'
              rules={[
                {
                  required: true,
                  message: 'Số chương không được bỏ trống'
                }
              ]}
            >
              <Input type='number' name='number_chapter' />
            </Form.Item>
            <Row className='error'>
              <Col md={6}>
                <div></div>
              </Col>
              <Col md={18}>
                {errorDiscount &&
                  errorDiscount.number_chapter &&
                  errorDiscount.number_chapter.map((item: any, index: number) => {
                    return (
                      <p key={index} style={{ color: 'red' }}>
                        {item}
                      </p>
                    )
                  })}
              </Col>
            </Row>

            <Form.Item
              label='Giá trị (%)'
              name='value'
              rules={[{ required: true, message: 'giá trị không được bỏ trống' }]}
            >
              <Input type='number' name='value' />
            </Form.Item>
            <Row className='error'>
              <Col md={6}>
                <div></div>
              </Col>
              <Col md={18}>
                {errorDiscount &&
                  errorDiscount.value &&
                  errorDiscount.value.map((item: any, index: number) => {
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
        <Table columns={columns} dataSource={dataDiscount} rowKey={(record) => record.id} scroll={{ x: 0 }} />
        <Table columns={columns} dataSource={dataDiscount} rowKey={(record) => record.id} scroll={{ x: 0 }} />
      </Card>
    </>
  )
}

export default ViewDiscount

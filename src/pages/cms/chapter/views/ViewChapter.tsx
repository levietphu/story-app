import { Card, Button, Table, Alert, Row, Col, Form, Input, Modal, Tooltip } from 'antd'
import '../styles/view-chapter.scss'
import type { ColumnsType } from 'antd/es/table'
import { createChapter, deleteChapter, getChapter, updateChapter } from '../api'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { changeToSlug } from '~/ultis/changeToSlug'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { EditOutlined } from '@ant-design/icons'
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'

interface DataType {
  id: number
  name_chapter: string
  chapter_number: string
  content: string
  coin: number
}

const ViewChapter: React.FC = () => {
  const [dataChapter, setDataChapter] = useState<any>()
  const [nameStory, setNameStory] = useState<string>('')
  const [content, setContent] = useState<string>('')
  const [open, setOpen] = useState(false)
  const [errorChapter, setErrorChapter] = useState<any>()
  const [alert, setAlert] = useState('')
  const [idChapter, setIdChapter] = useState<any>()
  const [errorChapterNumber, setErrorChapterNumber] = useState<string>('')

  const [form] = Form.useForm()
  const params = useParams()

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
      title: 'Tên chương',
      dataIndex: 'name_chapter',
      key: 'name_chapter'
    },
    {
      title: 'Số chương',
      dataIndex: 'chapter_number',
      key: 'chapter_number'
    },
    {
      title: 'Số xu',
      dataIndex: 'coin',
      key: 'coin'
    },
    {
      title: 'Action',
      key: 'action',
      render: (value) => (
        <>
          <Tooltip title='Sửa chương' color={'blue'}>
            <Button size='middle' type='primary' onClick={() => showModal(value)}>
              <EditOutlined rev={undefined} />
            </Button>
          </Tooltip>
          <Tooltip title='Xóa chương' color={'red'}>
            <Button
              size='middle'
              type='primary'
              style={{ marginLeft: '10px' }}
              danger
              onClick={() => {
                if (
                  // eslint-disable-next-line no-restricted-globals
                  confirm(`Bạn có muốn xóa Chapter ${value.name_chapter} này không`) === true
                ) {
                  destroyChapter(value.id)
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
    getChapter(Number(params.id_story))
      .then((res) => {
        setDataChapter(res.data.chapter)
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

  const showModal = (values: any) => {
    setOpen(true)
    if (values) {
      form.setFieldsValue({
        name_chapter: values.name_chapter,
        chapter_number: values.chapter_number,
        slug: values.slug,
        coin: values.coin,
        content: values.content
      })
      setContent(values.content)
      setIdChapter(values.id)
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
    setErrorChapter('')
    setIdChapter('')
    setContent('')
  }

  // Thêm mới Chapter
  const postChapter = async (values: any) => {
    values.id_truyen = params.id_story
    values.content = content
    await createChapter(Number(params.id_story), values)
      .then((res: any) => {
        setAlert(res.data.message)
        handleCancel()
        getChapter(Number(params.id_story)).then((res: any) => {
          setDataChapter(res.data.chapter)
        })
      })
      .catch((err) => {
        setErrorChapter(err.response.data.errors)
        if (err.response.data.status === 400) {
          setErrorChapterNumber(err.response.data.message)
        }
      })
  }
  // Cập nhật Chapter
  const changeChapter = async (values: any) => {
    values.content = content
    values.id_truyen = params.id_story
    await updateChapter(Number(params.id_story), idChapter, values)
      .then((res) => {
        setAlert(res.data.message)
        handleCancel()
        getChapter(Number(params.id_story)).then((res: any) => {
          setDataChapter(res.data.chapter)
        })
      })
      .catch((err) => {
        setErrorChapter(err.response.data.errors)
        if (err.response.status === 400) {
          setErrorChapterNumber(err.response.data.message)
        }
      })
  }

  //Xóa Chapter
  const destroyChapter = async (id: number) => {
    await deleteChapter(id)
      .then((res) => {
        setAlert(res.data.message)
        getChapter(Number(params.id_story)).then((res: any) => {
          setDataChapter(res.data.chapter)
        })
      })
      .catch((err) => console.log(err))
  }

  const saveChapter = (values: any) => {
    if (!idChapter) {
      postChapter(values)
    } else {
      changeChapter(values)
    }
  }

  const handleChange = (changedValues: any, allValues: any) => {
    if (changedValues.chapter_number) {
      allValues.slug = changeToSlug(changedValues.chapter_number)
      form.setFieldsValue({
        slug: changeToSlug(changedValues.chapter_number)
      })
    }
    if (changedValues.chapter_number === '') {
      form.setFieldsValue({
        slug: ''
      })
    }
  }
  return (
    <>
      <div className='top-main'>
        <p>Danh sách Chapter:({nameStory && nameStory})</p>
        <div className='top-main__right'>
          <a href=''>Chapter</a> / <span>Danh sách Chapter:({nameStory && nameStory})</span>
        </div>
      </div>
      <Card>
        <Tooltip title='Thêm chương' color={'blue'}>
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
          title={`${idChapter ? 'Sửa Chapter' : 'Thêm mới Chapter'}`}
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
            initialValues={{ coin: 0 }}
            onFinish={saveChapter}
            onValuesChange={handleChange}
          >
            <Form.Item
              label='Tên Chương'
              name='name_chapter'
              rules={[
                {
                  required: true,
                  message: 'Tên chương không được bỏ trống'
                }
              ]}
            >
              <Input type='text' name='name_chapter' />
            </Form.Item>
            <Row className='error'>
              <Col md={6}>
                <div></div>
              </Col>
              <Col md={18}>
                {errorChapter &&
                  errorChapter.name_chapter &&
                  errorChapter.name_chapter.map((item: any, index: number) => {
                    return (
                      <p key={index} style={{ color: 'red' }}>
                        {item}
                      </p>
                    )
                  })}
              </Col>
            </Row>
            <Form.Item
              label='Số chương'
              name='chapter_number'
              rules={[
                {
                  required: true,
                  message: 'Số chương không được bỏ trống'
                }
              ]}
            >
              <Input type='text' name='chapter_number' placeholder='Ví dụ chương 1(có thể thay bằng số khác)' />
            </Form.Item>
            {errorChapterNumber && <p style={{ color: 'red' }}>{errorChapterNumber}</p>}
            <Row className='error'>
              <Col md={6}>
                <div></div>
              </Col>
              <Col md={18}>
                {errorChapter &&
                  errorChapter.chapter_number &&
                  errorChapter.chapter_number.map((item: any, index: number) => {
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
                  message: 'Slug không được bỏ trống'
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
                {errorChapter &&
                  errorChapter.slug &&
                  errorChapter.slug.map((item: any, index: number) => {
                    return (
                      <p key={index} style={{ color: 'red' }}>
                        {item}
                      </p>
                    )
                  })}
              </Col>
            </Row>
            <Form.Item label='Số xu' name='coin'>
              <Input type='number' name='coin' />
            </Form.Item>
            <Row className='error'>
              <Col md={6}>
                <div></div>
              </Col>
              <Col md={18}>
                {errorChapter &&
                  errorChapter.coin &&
                  errorChapter.coin.map((item: any, index: number) => {
                    return (
                      <p key={index} style={{ color: 'red' }}>
                        {item}
                      </p>
                    )
                  })}
              </Col>
            </Row>
            <Form.Item
              label='Nội dung'
              name='content'
              rules={[
                {
                  required: true,
                  message: 'Nội dung không được bỏ trống'
                }
              ]}
            >
              <CKEditor
                editor={ClassicEditor}
                data={content ? content : ''}
                onChange={(event, editor) => {
                  const data = editor.getData()
                  setContent(data)
                }}
              />
            </Form.Item>
            <Row className='error'>
              <Col md={6}>
                <div></div>
              </Col>
              <Col md={18}>
                {errorChapter &&
                  errorChapter.content &&
                  errorChapter.content.map((item: any, index: number) => {
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

        <Table columns={columns} dataSource={dataChapter} rowKey={(record) => record.id} scroll={{ x: 0 }} />
      </Card>
    </>
  )
}

export default ViewChapter

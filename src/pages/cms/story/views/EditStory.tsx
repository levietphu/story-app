import { Card, Button, Row, Col, Form, Input, Select, message, Upload } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import '../styles/view-story.scss'
import { editStory, updateStory } from '../api'
import { useContext, useEffect, useState } from 'react'
import type { UploadProps } from 'antd/es/upload'
import type { UploadFile } from 'antd/es/upload/interface'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { changeToSlug } from '~/ultis/changeToSlug'
import { AuthContext } from '~/context/AuthContextProvider'
import { useAppDispatch } from '~/store/hookStore'

const EditStory: React.FC = () => {
  const [data, setData] = useState<any>()
  const [discount, setDiscount] = useState('')
  const [introduce, setIntroduce] = useState('')
  const [errorStory, setErrorStory] = useState<any>()
  const [fileList, setFileList] = useState<UploadFile[]>([])

  const [form] = Form.useForm()

  const { user }: any = useContext(AuthContext)

  const navigate = useNavigate()
  const params = useParams()

  const dispatch = useAppDispatch()
  useEffect(() => {
    editStory(Number(params.id_story))
      .then((res) => {
        setData(res.data)
        form.setFieldsValue({
          name: res.data.edit.name,
          slug: res.data.edit.slug,
          image: res.data.edit.image,
          id_cate: res.data.id_cate,
          id_tacgia: res.data.edit.id_tacgia,
          id_trans: res.data.edit.id_trans,
          full: res.data.edit.full,
          vip: res.data.edit.vip,
          recommended: res.data.edit.recommended,
          hot: res.data.edit.hot,
          status: res.data.edit.status
        })
        setDiscount(res.data.edit.discount)
        setIntroduce(res.data.edit.introduce)
        setFileList([
          {
            uid: res.data.edit.id,
            name: res.data.edit.name,
            status: 'done',
            url: `${import.meta.env.REACT_APP_UPLOADS}${res.data.edit.image}`
          }
        ])
      })
      .catch((err) => console.log(err))
  }, [])

  // Cập nhật Story
  const postStory = async (values: any) => {
    await updateStory(Number(params.id_story), values)
      .then((res) => {
        dispatch({
          payload: res.data.message,
          type: 'story/updateStorySuccess'
        })
        navigate('/dashboard/story/view')
      })
      .catch((err) => {
        err.response.status === 422 && setErrorStory(err.response.data.errors)
        console.log(err)
      })
  }

  const saveStory = (values: any) => {
    values.discount = discount
    values.introduce = introduce
    values.id_user = user.user.id
    values.id = data.edit.id
    postStory(values)
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

  //upload ảnh
  const props: UploadProps = {
    name: 'image',
    action: `${import.meta.env.REACT_APP_API}cms/upload_story/0`,
    accept: 'image/png, image/gif, image/jpeg',
    listType: 'picture-card',
    fileList: fileList,
    onChange(info) {
      setFileList(
        info.fileList.filter((item: any) => {
          return item.uid !== data.edit.id
        })
      )

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
        <p>Sửa Truyện</p>
        <div className='top-main__right'>
          <Link to=''>Truyện</Link> / <span>Sửa Truyện</span>
        </div>
      </div>
      <Card>
        <Form
          name='wrap'
          layout='vertical'
          initialValues={{
            name: '',
            slug: '',
            introduce: '',
            image: '',
            vip: 0,
            full: 0,
            recommended: 0,
            hot: 0,
            status: 1
          }}
          form={form}
          onFinish={saveStory}
          onValuesChange={handleChange}
        >
          <Row gutter={[20, 20]}>
            <Col md={12}>
              <Form.Item
                label='Tên Truyện'
                name='name'
                rules={[
                  {
                    required: true,
                    message: 'Tên Truyện không được bỏ trống'
                  },
                  {
                    max: 255,
                    message: 'Tên truyện không được quá 255 ký tự'
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
                  {errorStory &&
                    errorStory.name &&
                    errorStory.name.map((item: any, index: number) => {
                      return (
                        <p key={index} style={{ color: 'red' }}>
                          {item}
                        </p>
                      )
                    })}
                </Col>
              </Row>
            </Col>
            <Col md={12}>
              <Form.Item
                label='Slug'
                name='slug'
                rules={[
                  {
                    required: true,
                    message: 'SLug không được bỏ trống'
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
                  {errorStory &&
                    errorStory.slug &&
                    errorStory.slug.map((item: any, index: number) => {
                      return (
                        <p key={index} style={{ color: 'red' }}>
                          {item}
                        </p>
                      )
                    })}
                </Col>
              </Row>
            </Col>
          </Row>
          <Row gutter={[20, 20]}>
            <Col md={12}>
              <Form.Item
                label='Giới thiệu'
                name='introduce'
                rules={[
                  {
                    required: true,
                    message: 'Giới thiệu không được bỏ trống'
                  }
                ]}
              >
                <CKEditor
                  editor={ClassicEditor}
                  data={introduce ? introduce : ''}
                  onChange={(_event, editor) => {
                    const data = editor.getData()
                    setIntroduce(data)
                  }}
                />
              </Form.Item>
              <Row className='error'>
                <Col md={6}>
                  <div></div>
                </Col>
                <Col md={18}>
                  {errorStory &&
                    errorStory.introduce &&
                    errorStory.introduce.map((item: any, index: number) => {
                      return (
                        <p key={index} style={{ color: 'red' }}>
                          {item}
                        </p>
                      )
                    })}
                </Col>
              </Row>
            </Col>
            <Col md={12}>
              <Form.Item label='Giảm giá'>
                <CKEditor
                  editor={ClassicEditor}
                  data={discount ? discount : ''}
                  onChange={(_event, editor) => {
                    const data = editor.getData()
                    setDiscount(data)
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[20, 20]}>
            <Col md={8}>
              <Form.Item label='Ảnh' name='image'>
                <Upload {...props}>{fileList.length >= 8 ? null : uploadButton}</Upload>
              </Form.Item>
              <Row className='error'>
                <Col md={6}>
                  <div></div>
                </Col>
                <Col md={18}>
                  {errorStory &&
                    errorStory.image &&
                    errorStory.image.map((item: any, index: number) => {
                      return (
                        <p key={index} style={{ color: 'red' }}>
                          {item}
                        </p>
                      )
                    })}
                </Col>
              </Row>
            </Col>
            <Col md={8}>
              <Form.Item
                label='Thể loại'
                name='id_cate'
                rules={[
                  {
                    required: true,
                    message: 'Thể loại không được bỏ trống'
                  }
                ]}
              >
                <Select
                  mode='multiple'
                  size='middle'
                  placeholder='Lựa chọn thể loại'
                  onChange={handleChange}
                  style={{ width: '100%' }}
                  filterOption={(input: string, option: any) => option?.label.toLowerCase().includes(input)}
                  options={
                    data &&
                    data.cates.map((item: any) => {
                      return {
                        value: item.id,
                        label: item.name
                      }
                    })
                  }
                />
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item
                label='Tác giả'
                name='id_tacgia'
                rules={[
                  {
                    required: true,
                    message: 'Tác giả không được bỏ trống'
                  }
                ]}
              >
                <Select
                  showSearch
                  placeholder='Lựa chọn tác giả'
                  optionFilterProp='children'
                  filterOption={(input: string, option: any) => option?.label.toLowerCase().includes(input)}
                  options={
                    data &&
                    data.authors.map((item: any) => {
                      return {
                        value: item.id,
                        label: item.name
                      }
                    })
                  }
                />
              </Form.Item>
              <Row className='error'>
                <Col md={6}>
                  <div></div>
                </Col>
                <Col md={18}>
                  {errorStory &&
                    errorStory.id_tacgia &&
                    errorStory.id_tacgia.map((item: any, index: number) => {
                      return (
                        <p key={index} style={{ color: 'red' }}>
                          {item}
                        </p>
                      )
                    })}
                </Col>
              </Row>
            </Col>
          </Row>
          <Row gutter={[20, 20]}>
            <Col md={8}>
              <Form.Item
                label='Dịch giả'
                name='id_trans'
                rules={[
                  {
                    required: true,
                    message: 'Dịch giả không được bỏ trống'
                  }
                ]}
              >
                <Select
                  showSearch
                  placeholder='Lựa chọn dịch giả'
                  optionFilterProp='children'
                  filterOption={(input: string, option: any) => option?.label.toLowerCase().includes(input)}
                  options={
                    data &&
                    data.trans.map((item: any) => {
                      return {
                        value: item.id,
                        label: item.name
                      }
                    })
                  }
                />
              </Form.Item>
              <Row className='error'>
                <Col md={6}>
                  <div></div>
                </Col>
                <Col md={18}>
                  {errorStory &&
                    errorStory.id_trans &&
                    errorStory.id_trans.map((item: any, index: number) => {
                      return (
                        <p key={index} style={{ color: 'red' }}>
                          {item}
                        </p>
                      )
                    })}
                </Col>
              </Row>
            </Col>
            <Col md={8}>
              <Form.Item
                label='Truyện full'
                name='full'
                rules={[
                  {
                    required: true,
                    message: 'Trạng full không được bỏ trống'
                  }
                ]}
              >
                <Select
                  options={[
                    { value: 1, label: 'Truyện đã full' },
                    { value: 0, label: 'Truyện đang ra' }
                  ]}
                />
              </Form.Item>
              <Row className='error'>
                <Col md={6}>
                  <div></div>
                </Col>
                <Col md={18}>
                  {errorStory &&
                    errorStory.full &&
                    errorStory.full.map((item: any, index: number) => {
                      return (
                        <p key={index} style={{ color: 'red' }}>
                          {item}
                        </p>
                      )
                    })}
                </Col>
              </Row>
            </Col>
            <Col md={8}>
              <Form.Item
                label='Truyện vip'
                name='vip'
                rules={[
                  {
                    required: true,
                    message: 'Truyện vip không được bỏ trống'
                  }
                ]}
              >
                <Select
                  options={[
                    { value: 1, label: 'Truyện vip' },
                    { value: 0, label: 'Truyện free' }
                  ]}
                />
              </Form.Item>
              <Row className='error'>
                <Col md={6}>
                  <div></div>
                </Col>
                <Col md={18}>
                  {errorStory &&
                    errorStory.vip &&
                    errorStory.vip.map((item: any, index: number) => {
                      return (
                        <p key={index} style={{ color: 'red' }}>
                          {item}
                        </p>
                      )
                    })}
                </Col>
              </Row>
            </Col>
          </Row>
          <Row gutter={[20, 20]}>
            <Col md={8}>
              <Form.Item
                label='Đề xuất'
                name='recommended'
                rules={[
                  {
                    required: true,
                    message: 'Đề xuất không được bỏ trống'
                  }
                ]}
              >
                <Select
                  options={[
                    { value: 1, label: 'Có' },
                    { value: 0, label: 'Không' }
                  ]}
                />
              </Form.Item>
              <Row className='error'>
                <Col md={6}>
                  <div></div>
                </Col>
                <Col md={18}>
                  {errorStory &&
                    errorStory.recommended &&
                    errorStory.recommended.map((item: any, index: number) => {
                      return (
                        <p key={index} style={{ color: 'red' }}>
                          {item}
                        </p>
                      )
                    })}
                </Col>
              </Row>
            </Col>
            <Col md={8}>
              <Form.Item
                label='Truyện hot'
                name='hot'
                rules={[
                  {
                    required: true,
                    message: 'Truyện hot không được bỏ trống'
                  }
                ]}
              >
                <Select
                  options={[
                    { value: 1, label: 'Có' },
                    { value: 0, label: 'Không' }
                  ]}
                />
              </Form.Item>
              <Row className='error'>
                <Col md={6}>
                  <div></div>
                </Col>
                <Col md={18}>
                  {errorStory &&
                    errorStory.hot &&
                    errorStory.hot.map((item: any, index: number) => {
                      return (
                        <p key={index} style={{ color: 'red' }}>
                          {item}
                        </p>
                      )
                    })}
                </Col>
              </Row>
            </Col>
            <Col md={8}>
              <Form.Item
                label='Trạng thái'
                name='status'
                rules={[
                  {
                    required: true,
                    message: 'Trạng thái không được bỏ trống'
                  }
                ]}
              >
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
                  {errorStory &&
                    errorStory.status &&
                    errorStory.status.map((item: any, index: number) => {
                      return (
                        <p key={index} style={{ color: 'red' }}>
                          {item}
                        </p>
                      )
                    })}
                </Col>
              </Row>
            </Col>
          </Row>

          <Button size='large' type='primary' htmlType='submit' style={{ marginRight: '10px' }}>
            Cập nhật
          </Button>
        </Form>
      </Card>
    </>
  )
}

export default EditStory

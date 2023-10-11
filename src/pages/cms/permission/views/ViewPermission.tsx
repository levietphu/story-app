import { Card, Button, Alert, Form, Select, Row, Col, Input } from 'antd'
import '../styles/view-permission.scss'
import { createPermission } from '../api'
import { useEffect, useState } from 'react'
import { changeToSlug } from '~/ultis/changeToSlug'
import { per } from '~/sample/per'

const ViewPermission: React.FC = () => {
  const [errorPermission, setErrorPermission] = useState<any>()
  const [alert, setAlert] = useState('')

  const [form] = Form.useForm()

  useEffect(() => {
    if (alert) {
      const id = setTimeout(() => setAlert(''), 1000)
      return () => clearTimeout(id)
    }
  }, [alert])

  // Thêm quyền
  const postPermission = async (values: any) => {
    await createPermission(values)
      .then((res: any) => {
        setAlert(res.data.message)
      })
      .catch((err) => setErrorPermission(err.response.data.errors))
  }

  const handleChange = (allValues: any, changedValues: any) => {
    if (changedValues.name_per) {
      allValues.slug = changeToSlug(changedValues.name_per)
      form.setFieldsValue({
        slug: changeToSlug(changedValues.name_per)
      })
    }
  }

  return (
    <>
      <div className='top-main'>
        <p>Danh sách Quyền</p>
        <div className='top-main__right'>
          <a href=''>Quyền</a> / <span>Danh sách Quyền</span>
        </div>
      </div>
      <Card>
        {alert && <Alert message={alert} type='success' closable style={{ marginBottom: '20px', fontSize: '24px' }} />}

        <Form
          name='wrap'
          labelCol={{ flex: '110px' }}
          labelAlign='left'
          labelWrap
          wrapperCol={{ flex: 1 }}
          colon={false}
          initialValues={{ name: '', slug: '', status: 1 }}
          form={form}
          onFinish={postPermission}
          onValuesChange={handleChange}
        >
          <Form.Item
            label='Tên Quyền'
            name='name_per'
            rules={[
              {
                required: true,
                message: 'Tên Quyền không được bỏ trống'
              },
              {
                max: 255,
                message: 'Tên Quyền không được quá 255 ký tự'
              }
            ]}
          >
            <Select options={per.map((item) => ({ value: item, label: item }))} />
          </Form.Item>
          <Row className='error'>
            <Col md={6}>
              <div></div>
            </Col>
            <Col md={18}>
              {errorPermission &&
                errorPermission.name &&
                errorPermission.name.map((item: any, index: number) => {
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
              {errorPermission &&
                errorPermission.slug &&
                errorPermission.slug.map((item: any, index: number) => {
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
              {errorPermission &&
                errorPermission.status &&
                errorPermission.status.map((item: any, index: number) => {
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
            <Button type='primary' danger>
              Hủy
            </Button>
          </div>
        </Form>
      </Card>
    </>
  )
}

export default ViewPermission

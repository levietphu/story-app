import { Card, Button, Table, Alert, Row, Col, Form, Input, Modal, Select, Checkbox, Tooltip } from 'antd'
import '../styles/view-role.scss'
import type { ColumnsType } from 'antd/es/table'
import { createRole, deleteRole, getRole, updateRole } from '../api'
import { useEffect, useState } from 'react'
import type { CheckboxChangeEvent } from 'antd/es/checkbox'
import type { CheckboxValueType } from 'antd/es/checkbox/Group'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { EditOutlined } from '@ant-design/icons'
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'

interface DataType {
  id: number
  name: string
  status: number
}

const ViewRole: React.FC = () => {
  const [dataRole, setDataRole] = useState<any>()
  const [dataPer, setDataPer] = useState<any>()
  const [open, setOpen] = useState(false)
  const [errorRole, setErrorRole] = useState<any>()
  const [alert, setAlert] = useState('')
  const [idRole, setIdRole] = useState<any>()

  const [checkedList, setCheckedList] = useState<CheckboxValueType[]>()
  const [checkAll, setCheckAll] = useState(false)

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
      title: 'Số quyền',
      key: 'role_per_count',
      render: (value) => {
        return <span>{value.role_per.length === dataPer.length ? 'full' : value.role_per.length}</span>
      }
    },
    {
      title: 'Trạng thái',
      key: 'status',
      dataIndex: 'status',
      render: (_, record) => {
        return (
          <Button size='middle' type='primary' danger={record.status !== 1}>
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
          <Tooltip title='Sửa vai trò' color={'blue'}>
            <Button size='middle' type='primary' onClick={() => showModal(value)}>
              <EditOutlined rev={undefined} />
            </Button>
          </Tooltip>
          <Tooltip title='Xóa vai trò' color={'red'}>
            <Button
              size='middle'
              type='primary'
              danger
              style={{ marginLeft: '10px' }}
              onClick={() => {
                if (
                  // eslint-disable-next-line no-restricted-globals
                  confirm(`Bạn có muốn xóa Vai trò ${value.name} này không`) === true
                ) {
                  destroyRole(value.id)
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
    getRole()
      .then((res: any) => {
        setDataRole(res.data.role)
        setDataPer(res.data.per)
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
        status: value.status
      })
      setCheckedList(value.role_per.map((item: any) => item.id))
      setCheckAll(value.role_per.length === dataPer.length)
      setIdRole(value.id)
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
    setErrorRole('')
    setIdRole('')
    setCheckedList([])
    setCheckAll(false)
  }

  // Thêm mới Vai trò
  const postRole = async (values: any) => {
    await createRole(values)
      .then((res: any) => {
        setAlert(res.data.message)
        handleCancel()
        getRole().then((res: any) => {
          setDataRole(res.data.role)
        })
      })
      .catch((err) => {
        err.response.status === 422 && setErrorRole(err.response.data.errors)
        console.log(err)
      })
  }

  // Cập nhật Vai trò
  const changeRole = async (values: any) => {
    values.id = idRole
    await updateRole(idRole, values)
      .then((res) => {
        setAlert(res.data.message)
        handleCancel()
        getRole().then((res: any) => {
          setDataRole(res.data.role)
        })
      })
      .catch((err) => {
        err.response.status === 422 && setErrorRole(err.response.data.errors)
        console.log(err)
      })
  }

  //Xóa Vai trò
  const destroyRole = async (id: number) => {
    await deleteRole(id)
      .then((res) => {
        setAlert(res.data.message)
        getRole().then((res: any) => {
          setDataRole(res.data.role)
        })
      })
      .catch((err) => console.log(err))
  }

  const saveRole = (values: any) => {
    values.id_per = checkedList
    if (!idRole) {
      postRole(values)
    } else {
      changeRole(values)
    }
  }

  const onChange = (list: CheckboxValueType[]) => {
    setCheckedList(list)
    setCheckAll(list.length === dataPer.length)
  }

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    setCheckedList(e.target.checked ? dataPer.map((item: any) => item.id) : [])
    setCheckAll(e.target.checked)
  }

  return (
    <>
      <div className='top-main'>
        <p>Danh sách Vai trò</p>
        <div className='top-main__right'>
          <a href=''>Vai trò</a> / <span>Danh sách Vai trò</span>
        </div>
      </div>
      <Card>
        <Tooltip title='Thêm vai trò' color={'blue'}>
          <Button type='primary' onClick={() => showModal('')} style={{ marginBottom: '20px' }}>
            <FontAwesomeIcon icon={faPlus} />
          </Button>
          {alert && (
            <Alert message={alert} type='success' closable style={{ marginBottom: '20px', fontSize: '24px' }} />
          )}
        </Tooltip>

        <Modal
          title={`${idRole ? 'Sửa Vai trò' : 'Thêm mới Vai trò'}`}
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
            onFinish={saveRole}
          >
            <Form.Item
              label='Tên Vai trò'
              name='name'
              rules={[
                {
                  required: true,
                  message: 'Tên Vai trò không được bỏ trống'
                },
                {
                  max: 255,
                  message: 'Tên Vai trò không được quá 255 ký tự'
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
                {errorRole &&
                  errorRole.name &&
                  errorRole.name.map((item: any, index: number) => {
                    return (
                      <p key={index} style={{ color: 'red' }}>
                        {item}
                      </p>
                    )
                  })}
              </Col>
            </Row>
            <div style={{ margin: '10px 0' }}>
              <p>Quyền</p>
              <Checkbox onChange={onCheckAllChange} checked={checkAll}>
                Check All
              </Checkbox>
              <Checkbox.Group
                value={checkedList}
                onChange={onChange}
                options={
                  dataPer
                    ? dataPer.map((item: any) => ({
                        value: item.id,
                        label: item.name_per
                      }))
                    : []
                }
              ></Checkbox.Group>
              <Row className='error'>
                <Col md={6}>
                  <div></div>
                </Col>
                <Col md={18}>
                  {errorRole &&
                    errorRole.id_per &&
                    errorRole.id_per.map((item: any, index: number) => {
                      return (
                        <p key={index} style={{ color: 'red' }}>
                          {item}
                        </p>
                      )
                    })}
                </Col>
              </Row>
            </div>

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
                {errorRole &&
                  errorRole.status &&
                  errorRole.status.map((item: any, index: number) => {
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

        <Table columns={columns} dataSource={dataRole} rowKey={(record) => record.id} scroll={{ x: 0 }} />
      </Card>
    </>
  )
}

export default ViewRole

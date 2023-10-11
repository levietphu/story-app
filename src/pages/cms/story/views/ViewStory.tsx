import { Card, Button, Table, Alert, Typography, Tooltip } from 'antd'
import '../styles/view-story.scss'
import type { ColumnsType } from 'antd/es/table'
import { deleteStory, getStory } from '../api'
import { useContext, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '~/store/hookStore'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { EditOutlined } from '@ant-design/icons'
import { faTrash, faPlus, faAddressBook, faPercent } from '@fortawesome/free-solid-svg-icons'
import { AuthContext } from '~/context/AuthContextProvider'

interface DataType {
  id: number
  name: string
  status: number
  name_user: string
  full: number
  vip: number
  all_chapter: number
}

const { Text } = Typography

const ViewStory: React.FC = () => {
  const [dataStory, setDataStory] = useState<any>()
  const navigate = useNavigate()

  const alertRedux = useAppSelector((state) => state.story.alert)
  const dispatch = useAppDispatch()

  const { user }: any = useContext(AuthContext)
  const columns: ColumnsType<DataType> = [
    {
      title: 'Stt',
      dataIndex: 'id',
      key: 'id',
      render(value, record, index) {
        return index + 1
      }
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => {
        return (
          <Text type='success' strong>
            {record.name}
          </Text>
        )
      }
    },
    {
      title: 'Trạng thái truyện',
      dataIndex: 'full',
      key: 'full',
      render: (_, record) => {
        return (
          <Button size='small' type='primary' danger={record.full === 0}>
            {record.full === 1 ? 'Truyện đã hoàn thành' : 'Truyện đang ra'}
          </Button>
        )
      }
    },
    {
      title: 'Dạng truyện',
      dataIndex: 'vip',
      key: 'vip',
      render: (_, record) => {
        return (
          <Button size='small' type='primary' danger={record.vip === 0}>
            {record.vip === 1 ? 'Truyện vip' : 'Truyện miến phí'}
          </Button>
        )
      }
    },
    {
      title: 'Trạng thái hiển thị',
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
      title: 'Số chương',
      key: 'all_chapter',
      dataIndex: 'all_chapter'
    },
    {
      title: 'Người thêm',
      key: 'name_user',
      dataIndex: 'name_user',
      render: (_, record) => {
        return <Text type='success'>{record.name_user}</Text>
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (value) => (
        <>
          {user.user.id === value.id_user ? (
            <>
              <Tooltip title='View chương' color={'blue'}>
                <Button
                  size='small'
                  type='primary'
                  style={{ margin: '0 5px 5px 0' }}
                  onClick={() => navigate(`/dashboard/chapter/${value.id}/view`)}
                >
                  <FontAwesomeIcon icon={faAddressBook} />
                </Button>
              </Tooltip>
              <Tooltip title='View giảm giá' color={'blue'}>
                <Button
                  size='small'
                  type='primary'
                  style={{ margin: '0 5px 5px 0' }}
                  onClick={() => navigate(`/dashboard/discount/${value.id}/view`)}
                >
                  <FontAwesomeIcon icon={faPercent} />
                </Button>
              </Tooltip>
              <Tooltip title='Sửa truyện' color={'blue'}>
                <Button
                  size='small'
                  type='primary'
                  onClick={() => {
                    navigate(`/dashboard/story/edit/${value.id}`)
                  }}
                >
                  <EditOutlined rev={undefined} />
                </Button>
              </Tooltip>
              <Tooltip title='Xóa truyện' color={'red'}>
                <Button
                  size='small'
                  type='primary'
                  danger
                  style={{ marginLeft: '5px' }}
                  onClick={() => {
                    if (
                      // eslint-disable-next-line no-restricted-globals
                      confirm(`Bạn có muốn xóa truyện ${value.name} này không`) === true
                    ) {
                      destroyStory(value.id)
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </Tooltip>
            </>
          ) : (
            'Không có quyền'
          )}
        </>
      )
    }
  ]

  useEffect(() => {
    getStory()
      .then((res: any) => {
        setDataStory(res.data.story)
      })
      .catch((err: any) => console.log(err))
  }, [])

  useEffect(() => {
    if (alertRedux) {
      const id = setTimeout(() => dispatch({ payload: '', type: 'story/setDefaultAlert' }), 3000)
      return () => clearTimeout(id)
    }
  }, [alertRedux])

  //Xóa Story
  const destroyStory = async (id: number) => {
    await deleteStory(id)
      .then((res) => {
        dispatch({
          payload: res.data.message,
          type: 'story/updateStorySuccess'
        })
        getStory().then((res: any) => {
          setDataStory(res.data.story)
        })
      })
      .catch((err) => console.log(err))
  }

  return (
    <>
      <div className='top-main'>
        <p>Danh sách Truyện</p>
        <div className='top-main__right'>
          <Link to=''>Truyện</Link> / <span>Danh sách Truyện</span>
        </div>
      </div>
      <Card>
        <Tooltip title='Thêm mới truyện' color={'blue'}>
          <Button
            type='primary'
            onClick={() => {
              navigate('/dashboard/story/create')
            }}
            style={{ marginBottom: '20px' }}
          >
            <FontAwesomeIcon icon={faPlus} />
          </Button>
          {alertRedux && (
            <Alert message={alertRedux} type='success' closable style={{ marginBottom: '20px', fontSize: '24px' }} />
          )}
        </Tooltip>

        <Table columns={columns} dataSource={dataStory} rowKey={(record) => record.id} scroll={{ x: 0 }} />
      </Card>
    </>
  )
}

export default ViewStory

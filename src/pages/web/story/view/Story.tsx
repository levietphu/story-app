import { useState, useEffect, useContext, useCallback } from 'react'
import '../styles/story.scss'
import MainLayout from '../../layout/view/MainLayout'
import { Link, useParams, useNavigate, useSearchParams } from 'react-router-dom'
import CommentStory from '../components/CommentStory'
import ChapterStory from '../components/ChapterStory'
import Loader from '../components/Loader'
import { AuthContext } from '~/context/AuthContextProvider'
import { DownOutlined, UpOutlined, CrownFilled } from '@ant-design/icons'
import { Alert, Modal } from 'antd'
import ModalDonate from '../components/ModalDonate'
import ModalChapterVip from '../components/ModalChapterVip'
import callApi from '~/ultis/callApi'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPerson } from '@fortawesome/free-solid-svg-icons'

const Story = () => {
  // data api
  const [story, setStory] = useState<any>()
  const [donates, setDonates] = useState<any[]>()
  const [totalDonate, setTotalDonate] = useState<number>()
  const [loader, setLoader] = useState<boolean>(true)
  const [isModalDonateOpen, setIsModalDonateOpen] = useState(false)
  const [isModalChapterVipOpen, setIsModalChapterVipOpen] = useState(false)
  const [checkViewMore, setCheckViewMore] = useState(false)
  const [showMessage, setShowMessage] = useState<string>('')
  const [showMessageDonate, setShowMessageDonate] = useState<string>('')
  const [searchParams, setSearchParams] = useSearchParams()

  const { user }: any = useContext(AuthContext)

  const checkStoryAddView = JSON.parse(sessionStorage.getItem('checkStoryAddView') || '[]')

  const params = useParams()
  const navigate = useNavigate()

  if (!params.slug?.includes('-')) {
    navigate('/404')
  }

  const getStory = async () => {
    await callApi('get', '', `get_story?slug=${params.slug}`).then((res: any) => {
      setStory(res.data.data.items)
      setLoader(false)
    })
  }

  const getDonate = useCallback(async (pageDonate = 1) => {
    await callApi('get', '', `donate?page=${pageDonate}&slug=${params.slug}`).then((res: any) => {
      setDonates(res.data.donates)
      setTotalDonate(res.data.totalDonate)
    })
  }, [])

  const addViewStory = async () => {
    await callApi('post', { slug: params.slug }, `addview`)
  }

  useEffect(() => {
    getStory()
    setLoader(true)
    getDonate()
    if (searchParams.get('buy')) {
      setIsModalChapterVipOpen(true)
    }
    if (checkStoryAddView.length === 0) {
      sessionStorage.setItem('checkStoryAddView', JSON.stringify([{ slug: params.slug, timestamp: Date.now() }]))
      addViewStory()
    } else {
      const itemStory = checkStoryAddView.find((item: any) => {
        return item.slug === params.slug
      })
      if (itemStory) {
        if (Math.floor((Date.now() - itemStory.timestamp) / 1000) >= 60) {
          sessionStorage.setItem(
            'checkStoryAddView',
            JSON.stringify(
              checkStoryAddView.map((item: any) => {
                if (item.slug === params.slug) {
                  return {
                    slug: item.slug,
                    timestamp: Date.now()
                  }
                } else {
                  return item
                }
              })
            )
          )
          addViewStory()
        }
      } else {
        sessionStorage.setItem(
          'checkStoryAddView',
          JSON.stringify([...checkStoryAddView, { slug: params.slug, timestamp: Date.now() }])
        )
        addViewStory()
      }
    }
  }, [])

  useEffect(() => {
    if (!loader) {
      document.title = story.name
    }
  }, [loader])

  useEffect(() => {
    if (showMessage) {
      const id = setTimeout(() => setShowMessage(''), 3000)
      return () => clearTimeout(id)
    }
  }, [showMessage])
  useEffect(() => {
    if (showMessageDonate) {
      const id = setTimeout(() => setShowMessageDonate(''), 3000)
      return () => clearTimeout(id)
    }
  }, [showMessageDonate])

  return (
    <MainLayout>
      {!loader ? (
        <>
          <div className='header__story'>
            <div
              className='bg'
              style={{
                background: `url(${import.meta.env.REACT_APP_UPLOADS}${story.image})`,
                backgroundSize: 'cover'
              }}
            ></div>
            <div className='header__story--left'>
              <div className='header__story--image'>
                <img src={`${import.meta.env.REACT_APP_UPLOADS}${story.image}`} alt='webtruyen' />
                {story.rank.map((item: any, index: any) => {
                  return (
                    item.id === story.id && (
                      <Link
                        key={index}
                        to='/danh-sach/truyen-vip'
                        className='rank-story'
                        style={{
                          background: `${index + 1 === 2 ? '#f14668' : index + 1 === 1 ? '#ffe08a' : '#3e8ed0'}`,
                          color: `${index + 1 > 1 ? 'white' : '#363636'}`
                        }}
                      >
                        {index === 0 && <CrownFilled style={{ marginRight: '5px' }} rev={undefined} />}
                        <span>Top {index + 1}</span>
                      </Link>
                    )
                  )
                })}
              </div>
            </div>
            <div className='header__story--right'>
              {story.vip === 1 && (
                <span className='btn__vip' style={{ marginRight: '5px' }}>
                  vip
                </span>
              )}
              {story.full === 1 && <span className='btn__full'>full</span>}
              <span className='cate__story header__story--cate'>
                {story.theloais.map((item: any) => {
                  return (
                    <Link className='cate__story' to={`/the-loai/${item.slug}`} key={item.id}>
                      {item.name}
                    </Link>
                  )
                })}
              </span>

              <h1 className='header__story--name'>{story.name}</h1>
              <p className='header__story--author'>
                <span>tác giả: </span> <Link to={`/tac-gia/${story.tacgia.slug}`}>{story.tacgia.name}</Link>
              </p>
              <p className='header__story--translator'>
                <span>dịch giả: </span>{' '}
                <Link to={`/dich-gia/${story.dichgia.slug}`}>
                  <span className='person'>
                    <FontAwesomeIcon icon={faPerson} />
                  </span>{' '}
                  <span style={{ textTransform: 'initial' }}>{story.dichgia.name}</span>
                </Link>
              </p>
              <div className='header__story--view'>
                <span className='boder-right'>Lượt xem</span>
                <span className='bg-blue boder-left'>{story.view_count}</span>
              </div>
              {story.discount && (
                <div className='header__story--discount'>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: story.discount
                    }}
                  ></div>
                </div>
              )}
              <div className='view-more-introduce'>
                <div
                  className={`header__story--introduce ${!checkViewMore ? 'hidden-content' : ''}`}
                  dangerouslySetInnerHTML={{
                    __html: story.introduce
                  }}
                ></div>
                <p className='view_more' onClick={() => setCheckViewMore(!checkViewMore)}>
                  {!checkViewMore ? 'Xem thêm' : 'Xem ít hơn'}
                  {!checkViewMore ? (
                    <DownOutlined rev={undefined} style={{ fontSize: '12px' }} />
                  ) : (
                    <UpOutlined rev={undefined} style={{ fontSize: '12px' }} />
                  )}
                </p>
              </div>
              <div className='header__stoty--read'>
                <button className='bg-primary' onClick={() => navigate(`/${params.slug}/${story.chapter_one.slug}`)}>
                  Đọc từ đầu
                </button>
                <button className='bg-blue' onClick={() => setIsModalDonateOpen(true)}>
                  Ủng hộ truyện
                  <i className='fa-solid fa-circle-dollar-to-slot'></i>
                </button>
                <button className='bg-vip' onClick={() => setIsModalChapterVipOpen(true)}>
                  Mua chương vip
                </button>
              </div>
            </div>
          </div>
          <div className='main__story'>
            <ChapterStory getDonate={getDonate} donates={donates} user={user} story={story} totalDonate={totalDonate} />
            <CommentStory slug={params.slug} story={story} />
          </div>
          <Modal
            className='modal-story'
            title={`Ủng hộ truyện ${story.name}`}
            open={isModalDonateOpen}
            onOk={() => setIsModalDonateOpen(true)}
          >
            <ModalDonate
              id_truyen={story.id}
              setIsModalDonateOpen={setIsModalDonateOpen}
              getDonate={getDonate}
              setShowMessageDonate={setShowMessageDonate}
            />
          </Modal>
          <Modal
            className='modal-story'
            title='Mua chương VIP'
            open={isModalChapterVipOpen}
            onOk={() => setIsModalChapterVipOpen(true)}
          >
            <ModalChapterVip
              story={story}
              setIsModalChapterVipOpen={setIsModalChapterVipOpen}
              setShowMessage={setShowMessage}
              setSearchParams={setSearchParams}
              searchParams={searchParams}
            />
          </Modal>
          <Alert
            className='alert-success'
            message={showMessageDonate ? showMessageDonate : showMessage}
            type='success'
            showIcon
            style={{
              top: `${showMessage || showMessageDonate ? '50%' : '-1000px'}`,
              transition: `${showMessage || showMessageDonate ? '0.3s' : 'unset'}`
            }}
          />
        </>
      ) : (
        <Loader />
      )}
    </MainLayout>
  )
}

export default Story

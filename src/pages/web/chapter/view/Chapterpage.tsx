import { useState, useContext, useEffect, useCallback } from 'react'
import MainLayout from '../../layout/view/MainLayout'
import '../styles/chapter.scss'
import { useParams, Link } from 'react-router-dom'
import ChapterVip from '../components/ChapterVip'
import Loader from '../components/Loader'
import { AuthContext } from '~/context/AuthContextProvider'
import ListChapter from '../components/ListChapter'
import Popup from '../components/Popup'
import { Alert } from 'antd'
import { useAppDispatch, useAppSelector } from '~/store/hookStore'
import { changeTheme, changeSize, isTogglePopup } from '~/store/common/commonSlice'
import { disableReactDevTools } from '~/ultis/disable'
import callApi from '~/ultis/callApi'
// import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faA,
  faArrowDown,
  faArrowLeft,
  faArrowRight,
  faArrowUp,
  faBookOpen,
  faBookmark,
  faGear,
  faLightbulb,
  faList,
  faMoon,
  faXmark
} from '@fortawesome/free-solid-svg-icons'
import { faBookmark as faReBookmark } from '@fortawesome/free-regular-svg-icons'

const Chapterpage = () => {
  const [toggleSetting, setToggleSetting] = useState<boolean>(true)
  const [bookMark, setBookMark] = useState<boolean>(false)
  const [dataChapter, setDataChapter] = useState<any>()
  const [loader, setLoader] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  const [idBookMark, setIdBookMark] = useState<number>()
  const [alertBookMark, setAlertBookMark] = useState<string>('')
  const [checkSuccess, setCheckSuccess] = useState<boolean>(true)

  const dispatch = useAppDispatch()
  const { setting } = useAppSelector((state) => state.common)

  const { user, loaderUser }: any = useContext(AuthContext)

  const params = useParams()

  const getChapter = useCallback(
    async (id_user: string) => {
      await callApi(
        'get',
        '',
        `view_chapter?slug_story=${params.slugstory}&slug=${params.slugchapter}&id_user=${id_user}`
      ).then((res: any) => {
        setDataChapter(res.data.data.items)
        setLoader(false)
      })
    },
    [params.slugchapter, params.slugstory]
  )

  const callAddBookMark = async () => {
    await callApi(
      'post',
      {
        slug_story: params.slugstory,
        slug: params.slugchapter,
        id_user: user.user.id
      },
      'add_bookmark'
    ).then((res: any) => {
      setAlertBookMark(res.data.message)
      setIdBookMark(res.data.id)
      if (res.data.status === 400) {
        setCheckSuccess(false)
      } else {
        setCheckSuccess(true)
      }
    })
  }

  const callRemoveItemBookMark = async () => {
    await callApi('post', { id: idBookMark }, 'remove_bookmark_item').then((res: any) => {
      setAlertBookMark(res.data.message)
      if (res.data.status === 400) {
        setCheckSuccess(false)
      } else {
        setCheckSuccess(true)
      }
    })
  }

  const handleBookMark = () => {
    setBookMark(!bookMark)
    if (!bookMark) {
      callAddBookMark()
    } else {
      callRemoveItemBookMark()
    }
  }

  useEffect(() => {
    if (user) {
      getChapter(user.user.id)
    } else {
      if (loaderUser !== 'loader') {
        getChapter('')
      }
    }
    setLoader(true)
    window.scrollTo(0, 0)
    disableReactDevTools()
    return () => setBookMark(false)
  }, [params.slugchapter, params.slugstory, loaderUser])

  useEffect(() => {
    if (error) {
      const id = setTimeout(() => {
        setError('')
      }, 3000)

      return () => clearTimeout(id)
    }
  }, [error])

  useEffect(() => {
    if (!loader && params.slugchapter && params.slugstory) {
      document.title =
        dataChapter.chuong.chapter_number + '. ' + dataChapter.chuong.name_chapter + ' - ' + dataChapter.truyen.name
    }
  }, [loader])

  useEffect(() => {
    if (alertBookMark) {
      const id = setTimeout(() => {
        setAlertBookMark('')
      }, 3000)
      return () => clearTimeout(id)
    }
  }, [alertBookMark])

  //   const handlePlay = () => {
  //     axios({
  //       method: 'post',
  //       headers: { 'Content-Type': 'application/json' },
  //       url: `https://api.fpt.ai/hmi/tts/v5`,
  //       data: {
  //         api_key: 'Tdw70xoYqmHfpaPw2RCKO00YDa154IFR',
  //         voice: 'banmai',
  //         speed: 0,
  //         format: 'mp3'
  //       }
  //     })
  //       .then((res) => {
  //         // res.data.play();
  //         console.log(res)
  //       })
  //       .catch((err) => console.log(err))
  //   }
  return (
    <>
      <MainLayout>
        <Alert
          className='error_chapter'
          message={error}
          type='error'
          showIcon
          style={{
            top: `${error ? '15%' : '-100px'}`,
            transition: `${error ? '0.8s' : 'unset'}`
          }}
        />
        <Alert
          className='error_chapter'
          message={alertBookMark}
          type={checkSuccess ? 'success' : 'error'}
          style={{
            top: `${alertBookMark ? '15%' : '-100px'}`,
            transition: `${alertBookMark ? '0.8s' : 'unset'}`
          }}
        />
        {!loader ? (
          <>
            <section className='screen-80'>
              <div className='header__chapter'>
                <div className='name__story'>
                  <Link to={`/${params.slugstory}`}>{dataChapter.truyen.name}</Link>
                </div>
                <div className='info__chapter'>
                  <span className='number__chapter'>{dataChapter.chuong.chapter_number}. </span>
                  <span className='name__chapter'>{dataChapter.chuong.name_chapter}</span>
                </div>
                <div className='next__prev--chapter'>
                  {!dataChapter.slug_prev ? (
                    <span className='next__chapter forbidden__chapter'>Chương trước</span>
                  ) : (
                    <Link to={`/${params.slugstory}/${dataChapter.slug_prev}`} className={`next__chapter`}>
                      Chương trước
                    </Link>
                  )}
                  {/* <button onClick={handlePlay}>đọc </button> */}
                  {!dataChapter.slug_next ? (
                    <span className='next__chapter forbidden__chapter'>Chương sau</span>
                  ) : (
                    <Link to={`/${params.slugstory}/${dataChapter.slug_next}`} className={`next__chapter`}>
                      Chương sau
                    </Link>
                  )}
                </div>
              </div>
              <div className='content__chapter'>
                {!dataChapter.vip ? (
                  <div
                    className='main__content'
                    style={{
                      fontSize: `${setting.size}px`,
                      lineHeight: `${(setting.size * 100) / 75}px`
                    }}
                    dangerouslySetInnerHTML={{
                      __html: dataChapter.chuong.content
                    }}
                  ></div>
                ) : (
                  <ChapterVip coin={dataChapter.chuong.coin} setError={setError} callApi={getChapter} />
                )}
              </div>
              <div className='next__prev--chapter'>
                {!dataChapter.slug_prev ? (
                  <span className='next__chapter forbidden__chapter'>Chương trước</span>
                ) : (
                  <Link to={`/${params.slugstory}/${dataChapter.slug_prev}`} className={`next__chapter`}>
                    Chương trước
                  </Link>
                )}
                {!dataChapter.slug_next ? (
                  <span className='next__chapter forbidden__chapter'>Chương sau</span>
                ) : (
                  <Link to={`/${params.slugstory}/${dataChapter.slug_next}`} className={`next__chapter`}>
                    Chương sau
                  </Link>
                )}
              </div>
            </section>
            {toggleSetting ? (
              <div className='setting__chapter'>
                <div className='setting' onClick={() => setToggleSetting(false)}>
                  <FontAwesomeIcon className='icon-i' icon={faGear} />
                </div>
                <Link
                  to={`/${params.slugstory}`}
                  className='change__story center'
                  style={{
                    color: `${setting.theme === 'light' || setting.theme === 'book' ? 'black' : 'white'}`
                  }}
                >
                  <FontAwesomeIcon className='icon-i' icon={faBookOpen} />
                </Link>
                <div
                  className='list__chapter'
                  onClick={() => {
                    dispatch(isTogglePopup(true))
                  }}
                >
                  <FontAwesomeIcon className='icon-i' icon={faList} />
                </div>
                <div className='tick__chapter' onClick={() => handleBookMark()}>
                  {bookMark ? (
                    <FontAwesomeIcon className='icon-i' icon={faBookmark} />
                  ) : (
                    <FontAwesomeIcon className='icon-i' icon={faReBookmark} />
                  )}
                </div>
                {!dataChapter.slug_prev ? (
                  <div className='next__chapter forbidden center'>
                    <FontAwesomeIcon className='icon-i' icon={faArrowLeft} />
                  </div>
                ) : (
                  <Link
                    style={{
                      color: `${setting.theme === 'light' || setting.theme === 'book' ? 'black' : 'white'}`
                    }}
                    to={`/${params.slugstory}/${dataChapter.slug_prev}`}
                    className={`prev__chapter center`}
                  >
                    <FontAwesomeIcon className='icon-i' icon={faArrowLeft} />
                  </Link>
                )}
                {!dataChapter.slug_next ? (
                  <div className='next__chapter forbidden center'>
                    <FontAwesomeIcon className='icon-i' icon={faArrowRight} />
                  </div>
                ) : (
                  <Link
                    style={{
                      color: `${setting.theme === 'light' || setting.theme === 'book' ? 'black' : 'white'}`
                    }}
                    to={`/${params.slugstory}/${dataChapter.slug_next}`}
                    className={`next__chapter center`}
                  >
                    <FontAwesomeIcon className='icon-i' icon={faArrowRight} />
                  </Link>
                )}
              </div>
            ) : (
              <div className='main__setting'>
                <div className={`setting__close`}>
                  <FontAwesomeIcon className='xmark' icon={faXmark} onClick={() => setToggleSetting(true)} />
                  <p className='center'>Cài đặt</p>
                </div>
                <div className='interfce'>
                  <p className='name'>Giao diện</p>
                  <div className='icon-block'>
                    <FontAwesomeIcon
                      icon={faLightbulb}
                      className={`icon fix-padding ${setting.theme === 'light' ? 'active__theme' : ''}`}
                      onClick={() => dispatch(changeTheme('light'))}
                      style={{
                        color: `${setting.theme === 'dark' ? 'white' : ''}`
                      }}
                    />
                    <FontAwesomeIcon
                      icon={faMoon}
                      className={`icon fix-padding ${setting.theme === 'dark' ? 'active__theme' : ''}`}
                      onClick={() => dispatch(changeTheme('dark'))}
                    />
                    <FontAwesomeIcon
                      icon={faBookOpen}
                      className={`icon ${setting.theme === 'book' ? 'active__theme' : ''}`}
                      onClick={() => dispatch(changeTheme('book'))}
                    />
                  </div>
                </div>
                <div className='fontsize-container'>
                  <p>Cỡ chữ</p>
                  <div>
                    <div className='fontsize__up' onClick={() => dispatch(changeSize(true))}>
                      <FontAwesomeIcon icon={faA} />
                      <FontAwesomeIcon icon={faArrowUp} />
                    </div>
                    <div className='fontsize__down' onClick={() => dispatch(changeSize(false))}>
                      <FontAwesomeIcon icon={faA} />
                      <FontAwesomeIcon icon={faArrowDown} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <Loader />
        )}
      </MainLayout>
      <ListChapter />

      {setting.togglePopup && <Popup />}
    </>
  )
}

export default Chapterpage

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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState, useContext, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { changeSize, changeTheme, isTogglePopup } from '~/store/common/commonSlice'
import { useAppDispatch, useAppSelector } from '~/store/hookStore'
import callApi from '~/ultis/callApi'
import { AuthContext } from '~/context/AuthContextProvider'
import { Alert } from 'antd'
import '../styles/setting-chapter.scss'

type SettingChapterProps = {
  dataChapter: any
}

const SettingChapter: React.FC<SettingChapterProps> = ({ dataChapter }) => {
  const [toggleSetting, setToggleSetting] = useState<boolean>(true)
  const [bookMark, setBookMark] = useState<boolean>(false)
  const [idBookMark, setIdBookMark] = useState<number>()
  const [alertBookMark, setAlertBookMark] = useState<string>('')
  const [checkSuccess, setCheckSuccess] = useState<boolean>(true)

  const { user }: any = useContext(AuthContext)

  const params = useParams()
  const dispatch = useAppDispatch()
  const { setting } = useAppSelector((state) => state.common)

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
    if (alertBookMark) {
      const id = setTimeout(() => {
        setAlertBookMark('')
      }, 3000)
      return () => clearTimeout(id)
    }
  }, [alertBookMark])
  return (
    <>
      <Alert
        className='error_chapter'
        message={alertBookMark}
        type={checkSuccess ? 'success' : 'error'}
        style={{
          top: `${alertBookMark ? '15%' : '-100px'}`,
          transition: `${alertBookMark ? '0.8s' : 'unset'}`
        }}
      />
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
  )
}

export default SettingChapter

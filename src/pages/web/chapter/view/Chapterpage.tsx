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
import { useAppSelector } from '~/store/hookStore'
import { disableReactDevTools } from '~/ultis/disable'
import callApi from '~/ultis/callApi'
import SettingChapter from '../components/SettingChapter'
// import axios from 'axios'

const Chapterpage = () => {
  const [dataChapter, setDataChapter] = useState<any>()
  const [loader, setLoader] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

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
    [params.slugchapter, params.slugstory, loaderUser]
  )

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
    // return () => setBookMark(false)
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
                  <ChapterVip coin={dataChapter.chuong.coin} setError={setError} getChapter={getChapter} />
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
            <SettingChapter dataChapter={dataChapter} />
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

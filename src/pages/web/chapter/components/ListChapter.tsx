import { useContext, useState, useEffect, memo } from 'react'
import { useParams, Link } from 'react-router-dom'
import Moment from 'react-moment'
import { AuthContext } from '~/context/AuthContextProvider'
import { useAppSelector } from '~/store/hookStore'
import callApi from '~/ultis/callApi'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp19, faArrowUp91, faLockOpen, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

const ListChapter = memo(() => {
  const { togglePopup } = useAppSelector((state) => state.common.setting)
  const { user, loaderUser }: any = useContext(AuthContext)

  const [dataChapter, setDataChapter] = useState<any>()
  const [loader, setLoader] = useState<boolean>(true)
  const [keyword, setKeyword] = useState<string>('')
  const [orderby, setOrderby] = useState<string>('asc')
  const [checkKeywordOrderby, setCheckKeywordOrderby] = useState<boolean>(false)
  const [checkSearchChapter, setCheckSearchChapter] = useState(false)

  const params = useParams()

  const getListChapter = async (id_user: string, page: number) => {
    await callApi(
      'get',
      '',
      `get_chapter_story?slug=${params.slugstory}&id_user=${id_user}&page=${page}&keyword=${keyword}&orderby=${orderby}`
    ).then((res: any) => {
      setDataChapter(res.data.chapter)
      setLoader(false)
    })
  }

  useEffect(() => {
    if (user) {
      getListChapter(user.user.id, Math.ceil(Number(params.slugchapter?.split('-')[1]) / 20))
    } else {
      if (loaderUser !== 'loader') {
        getListChapter('', Math.ceil(Number(params.slugchapter?.split('-')[1]) / 20))
      }
    }
    setLoader(true)
  }, [params.slugstory, params.slugchapter, loaderUser])

  useEffect(() => {
    if (togglePopup && checkKeywordOrderby) {
      if (user) {
        const id = setTimeout(() => getListChapter(user.user.id, 1), 600)

        return () => clearTimeout(id)
      } else {
        if (loaderUser !== 'loader') {
          const id = setTimeout(() => getListChapter('', 1), 600)

          return () => clearTimeout(id)
        }
      }
    }
  }, [keyword, togglePopup])

  useEffect(() => {
    if (togglePopup && checkKeywordOrderby) {
      if (user) {
        getListChapter(user.user.id, 1)
      } else {
        if (loaderUser !== 'loader') {
          getListChapter('', 1)
        }
      }
    }
  }, [orderby, togglePopup])

  const changePageChapter = (word: string) => {
    if (word === 'next') {
      if (user) {
        getListChapter(user.user.id, dataChapter.current_page + 1)
      } else {
        if (loaderUser !== 'loader') {
          getListChapter('', dataChapter.current_page + 1)
        }
      }
    } else {
      if (user) {
        getListChapter(user.user.id, dataChapter.current_page - 1)
      } else {
        if (loaderUser !== 'loader') {
          getListChapter('', dataChapter.current_page - 1)
        }
      }
    }
  }

  return (
    <>
      {!loader && (
        <div
          className='popup__list__container'
          style={{
            left: `${togglePopup ? '0' : '-500'}px`
          }}
        >
          <div style={{ position: 'relative' }}>
            <div className='header__list'>
              <div className='list'>
                <span>Danh sách chương</span>
              </div>
              <div className='sort__search'>
                {orderby === 'asc' ? (
                  <button
                    onClick={() => {
                      setOrderby('desc')
                      !checkKeywordOrderby && setCheckKeywordOrderby(true)
                    }}
                  >
                    <FontAwesomeIcon icon={faArrowUp19} />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setOrderby('asc')
                      !checkKeywordOrderby && setCheckKeywordOrderby(true)
                    }}
                  >
                    <FontAwesomeIcon icon={faArrowUp91} />
                  </button>
                )}
                <div className='search'>
                  <div className={`search__container ${checkSearchChapter ? 'search__chapter--active' : ''}`}>
                    <div className='search__icon'>
                      <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </div>
                    <input
                      className='search-input'
                      type='text'
                      placeholder='Tìm theo số chương, tên chương...'
                      onClick={() => setCheckSearchChapter(!checkSearchChapter)}
                      onBlur={() => setCheckSearchChapter(false)}
                      value={keyword}
                      onChange={(e) => {
                        setKeyword(e.target.value)
                        !checkKeywordOrderby && setCheckKeywordOrderby(true)
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className='main__list'>
              {dataChapter.data.map((item: any) => {
                return (
                  <Link
                    to={`/${params.slugstory}/${item.slug}`}
                    className={`main__item ${params.slugchapter === item.slug ? 'active' : ''}`}
                    key={item.id}
                  >
                    <div className='item__name__number'>
                      <span className='number'>{item.chapter_number}.</span>
                      <span>
                        {' '}
                        {item.name_chapter.length > 17 ? item.name_chapter.slice(0, 14) + '...' : item.name_chapter}
                      </span>
                    </div>
                    <i>
                      <span>Cập nhật: </span>
                      <span>
                        <Moment fromNow locale='vi'>
                          {item.created_at}
                        </Moment>
                      </span>
                    </i>
                    {item.bought && (
                      <div className='bought'>
                        <FontAwesomeIcon icon={faLockOpen} color='white' />
                      </div>
                    )}
                    {!item.bought && item.coin > 0 && <span className='money'>{item.coin} xu </span>}
                  </Link>
                )
              })}
            </div>
            <div className='footer__list'>
              <div className='next__prev'>
                <button
                  className={`footer__list--prev ${dataChapter.current_page === 1 ? 'forbidden' : ''}`}
                  onClick={() => dataChapter.current_page > 1 && changePageChapter('prev')}
                >
                  Trang trước
                </button>
                <button
                  className={`footer__list--next ${
                    dataChapter.current_page === dataChapter.last_page ? 'forbidden' : ''
                  }`}
                  onClick={() => dataChapter.current_page !== dataChapter.last_page && changePageChapter('next')}
                >
                  Trang sau
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
})

export default ListChapter

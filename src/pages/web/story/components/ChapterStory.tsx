import { useState, useEffect, memo, useCallback } from 'react'
import chicken from '~/assets/chicken.png'
import 'moment/locale/vi'
import { useParams } from 'react-router-dom'
import coin from '~/assets/coin.svg'
import PaginationPage from '../../pagination/PaginationPage'
import ChapterItem from './ChapterItem'
import DonateItem from './DonateItem'
import callApi from '~/ultis/callApi'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp19, faArrowUp91, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

const ChapterStory = ({ getDonate, story, user, donates, totalDonate }: any) => {
  const [chapterStory, setChapterStory] = useState<any>()

  const [keyword, setKeyword] = useState<string>('')
  const [orderby, setOrderby] = useState<string>('asc')
  const [checkKeywordOrderby, setCheckKeywordOrderby] = useState<boolean>(false)
  const [checkInput, setCheckInput] = useState(false)
  const [checkDonateOrChapter, setCheckDonateOrChapter] = useState<string>('chapter')

  const params = useParams()

  const getChapter = useCallback(
    async (id_user: string, page: number) => {
      await callApi(
        'get',
        '',
        `get_chapter_story?slug=${params.slug}&page=${page}&keyword=${keyword}&orderby=${orderby}&id_user=${id_user}`
      ).then((res: any) => setChapterStory(res.data.chapter))
    },
    [keyword, orderby]
  )

  useEffect(() => {
    if (user) {
      getChapter(user.user.id, 1)
    } else {
      getChapter('', 1)
    }
  }, [])

  useEffect(() => {
    if (checkKeywordOrderby) {
      if (user) {
        const id = setTimeout(() => getChapter(user.user.id, 1), 600)

        return () => clearTimeout(id)
      } else {
        const id = setTimeout(() => getChapter('', 1), 600)

        return () => clearTimeout(id)
      }
    }
  }, [keyword])

  useEffect(() => {
    if (checkKeywordOrderby) {
      if (user) {
        getChapter(user.user.id, 1)
      } else {
        getChapter('', 1)
      }
    }
  }, [orderby])

  return (
    <div className='chapter__donate'>
      <div className='list__chapter__donate'>
        <div
          className={`main__story--chapter center ${
            checkDonateOrChapter === 'chapter' ? 'active__chapter__donate' : ''
          }`}
          onClick={() => {
            setCheckDonateOrChapter('chapter')
          }}
        >
          Ds Chương <span>{story.total_chapter}</span>
        </div>
        <div
          className={`main__story--chapter center ${
            checkDonateOrChapter === 'donate' ? 'active__chapter__donate' : ''
          }`}
          onClick={() => {
            setCheckDonateOrChapter('donate')
          }}
        >
          Ủng hộ<span>{totalDonate}</span>
        </div>
      </div>
      <div className='center__chapter'>
        <div
          className='center__chapter--left'
          style={{
            display: `${checkDonateOrChapter === 'chapter' ? '' : 'none'}`
          }}
          tabIndex={checkDonateOrChapter === 'chapter' ? 0 : -1}
        >
          <div className='sort__search'>
            {orderby === 'desc' ? (
              <button
                onClick={() => {
                  if (chapterStory && chapterStory.data.length > 0) {
                    setOrderby('asc')
                    !checkKeywordOrderby && setCheckKeywordOrderby(true)
                  }
                }}
              >
                <FontAwesomeIcon icon={faArrowUp91} />
              </button>
            ) : (
              <button
                onClick={() => {
                  if (chapterStory && chapterStory.data.length > 0) {
                    setOrderby('desc')
                    !checkKeywordOrderby && setCheckKeywordOrderby(true)
                  }
                }}
              >
                <FontAwesomeIcon icon={faArrowUp19} />
              </button>
            )}

            <div className='search'>
              <div className={`search__container ${checkInput ? 'search__container--active' : ''}`}>
                <div className='search__icon'>
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </div>
                <input
                  className='search-input'
                  type='text'
                  placeholder='Tìm theo số chương, tên chương...'
                  onClick={() => setCheckInput(!checkInput)}
                  onBlur={() => setCheckInput(false)}
                  value={keyword}
                  onChange={(e) => {
                    if (chapterStory && chapterStory.data.length > 0) {
                      setKeyword(e.target.value)
                      !checkKeywordOrderby && setCheckKeywordOrderby(true)
                    }
                  }}
                />
              </div>
            </div>
          </div>
          <div className='center__chapter--list'>
            {chapterStory &&
              chapterStory.data.map((value: any, index: number) => {
                return <ChapterItem key={index} value={value} index={index} params={params} />
              })}
          </div>
          <PaginationPage data={chapterStory} callApiPagination={getChapter} check='chapter' />
        </div>
        <div
          className='center__chapter--right'
          style={{
            display: `${checkDonateOrChapter === 'donate' ? '' : 'none'}`
          }}
          tabIndex={checkDonateOrChapter === 'donate' ? 0 : -1}
        >
          <p className='text-donate'>Danh sách ủng hộ</p>

          {donates && donates.data.length > 0 ? (
            <div className='center__chapter--left'>
              <div className='center__chapter--list'>
                {donates.data.map((value: any, index: number) => {
                  return <DonateItem value={value} index={index} key={index} coin={coin} />
                })}
              </div>
              <PaginationPage check='donate' data={donates} callApiPagination={getDonate} />
            </div>
          ) : (
            <div className='donate__story center'>
              <div>
                <div className='image__donate'>
                  <img src={chicken} alt='webtruyen' />
                </div>
                <p>Hãy bấm vào nút Ủng hộ truyện ở trên để ủng hộ dịch giả nhé!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default memo(ChapterStory)

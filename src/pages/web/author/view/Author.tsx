import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import MainLayout from '../../layout/view/MainLayout'
import '../styles/translator.scss'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import callApi from '~/ultis/callApi'
import { faUser } from '@fortawesome/free-solid-svg-icons'

const Author = () => {
  const [dataAuthor, setDataAuthor] = useState<any>()
  const [nameAuthor, setNameAuthor] = useState<any>()
  const [loader, setLoader] = useState<boolean>(true)

  const params = useParams()

  const getAuthor = async () => {
    await callApi('get', '', `author?slug=${params.slugauthor}`).then((res: any) => {
      setDataAuthor(res.data.author)
      setLoader(false)
      setNameAuthor(res.data.name_author)
    })
  }

  useEffect(() => {
    getAuthor()
  }, [params.slugauthor])

  return (
    <MainLayout>
      <div className='center'>
        <div className='translator__header center'>
          <div>
            <div className='center'>
              <FontAwesomeIcon icon={faUser} />
            </div>
            <div className='translator__name'>
              <h1>{!loader && nameAuthor}</h1>
              <p>@{!loader && nameAuthor}</p>
            </div>
          </div>
        </div>
      </div>
      <div className='translator__story'>
        <h1>
          Truyện được viết bởi <span>{!loader && nameAuthor}</span>
        </h1>
        <div className='drag__story' style={{ marginTop: '15px' }}>
          <div className='drag__story--slider'>
            {!loader &&
              dataAuthor.map((item: any) => {
                return (
                  <div className='story__slider--item' key={item.id}>
                    <Link to={`/${item.slug}`}>
                      <div className='pin'>
                        {item.vip === 1 && <span className='btn__vip'>vip</span>}
                        {item.full === 1 && <span className='btn__full'>full</span>}
                      </div>
                      <div className='image__story'>
                        <img src={`${import.meta.env.REACT_APP_UPLOADS}${item.image}`} alt='webtruyen' />
                      </div>
                      <div className='hover__story'>
                        <p className='hover__story--name ml-10 mr-15'>
                          {item.name.length > 35 ? item.name.slice(0, 35) + '....' : item.name}
                        </p>
                        <span className='ml-10 mr-15'>{item.nameTheloai ? item.nameTheloai : item.theloais.name}</span>
                        <p className='border-top'></p>
                        <div
                          className='ml-10 mr-15 discount__story'
                          dangerouslySetInnerHTML={{
                            __html: item.discount ? item.discount : 'Truyện chưa có giảm giá'
                          }}
                        ></div>
                      </div>
                    </Link>
                  </div>
                )
              })}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default Author

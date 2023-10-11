import MainLayout from '../../layout/view/MainLayout'
import '../styles/translator.scss'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import callApi from '~/ultis/callApi'

const Transalator = () => {
  const [dataTran, setDataTran] = useState<any>()
  const [loader, setLoader] = useState<boolean>(true)

  const params = useParams()

  const getTranslator = async () => {
    await callApi('get', '', `translator?slug=${params.slugdichgia}`).then((res: any) => {
      setDataTran(res.data.data.items)
      setLoader(false)
    })
  }

  useEffect(() => {
    getTranslator()
  }, [params.slugdichgia])

  useEffect(() => {
    document.title = `Truyện dịch bởi ${params.slugdichgia}`
  }, [])

  return (
    <MainLayout>
      <div className='center'>
        <div className='translator__header center'>
          <div>
            <div className='center'>
              <i className='fa-solid fa-user'></i>
            </div>
            <div className='translator__name'>
              <h1>{params.slugdichgia}</h1>
              <p>@{params.slugdichgia}</p>
            </div>
          </div>
        </div>
      </div>
      <div className='translator__story'>
        <h1>
          Truyện dịch bởi <span>{params.slugdichgia}</span>
        </h1>
        <div className='drag__story' style={{ marginTop: '15px' }}>
          <div className='drag__story--slider'>
            {!loader &&
              dataTran.map((item: any) => {
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
                        <p
                          className='ml-10 mr-15 discount__story'
                          dangerouslySetInnerHTML={{
                            __html: item.discount ? item.discount : 'Truyện chưa có giảm giá'
                          }}
                        ></p>
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

export default Transalator

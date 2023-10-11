import '../styles/cate.scss'
import MainLayout from '../../layout/view/MainLayout'
import { Link, useParams } from 'react-router-dom'
import 'moment/locale/vi'
import { useState, useEffect } from 'react'
import image from '~/assets/mascot-02.235fd60.png'
import PaginationPage from '../../pagination/PaginationPage'
import LoaderCate from '../components/LoaderCate'
import CateItem from '../components/CateItem'
import callApi from '~/ultis/callApi'

const CatePage = () => {
  const [dataCate, setDataCate] = useState<any>()
  const [nameCate, setNameCate] = useState<string>('')
  const [loader, setLoader] = useState<boolean>(true)

  const params = useParams()

  const getCate = async (page: number) => {
    if (params.slugcate) {
      await callApi('get', '', `cate?slug=${params.slugcate}&page=${page}`).then((res: any) => {
        setDataCate(res.data.data.items)
        setLoader(false)
        setNameCate(res.data.data.name)
      })
    } else {
      await callApi('get', '', `list?slug=${params.sluglist}&page=${page}`).then((res: any) => {
        setDataCate(res.data.data.items)
        setLoader(false)
      })
    }
  }

  useEffect(() => {
    if (params.slugcate || params.sluglist) {
      getCate(1)
      setLoader(true)
      window.scrollTo({
        top: 0
      })
    }
  }, [params.slugcate, params.sluglist])

  const checkName = () => {
    const name: any = params.slugcate
      ? !loader && 'Truyện ' + nameCate
      : params.sluglist === 'truyen-vip'
      ? 'Bảng xếp hạng truyện vip'
      : params.sluglist === 'truyen-moi'
      ? 'Truyện mới'
      : params.sluglist === 'truyen-mien-phi'
      ? 'Truyện miễn phí'
      : 'Truyện đã hoàn thành'
    return name
  }

  useEffect(() => {
    if (!loader && (params.slugcate || params.sluglist)) {
      document.title = checkName()
    }
  }, [loader])

  return (
    <MainLayout>
      <div className='cate__page'>
        <h1 className={`cate-title ${params.sluglist && params.sluglist === 'truyen-vip' ? 'center' : ''}`}>
          {checkName()}
        </h1>
        <div className='cate-content'>
          {!loader ? (
            dataCate.data.length !== 0 ? (
              <>
                <div className='list__story--newupdate'>
                  {dataCate.data.map((item: any, index: any) => {
                    return <CateItem key={item.id} item={item} index={index} />
                  })}
                </div>
                {(params.slugcate || params.sluglist) && params.sluglist !== 'truyen-vip' && (
                  <PaginationPage data={dataCate} check='cate' callApiPagination={getCate} />
                )}
              </>
            ) : (
              <div className='no-view'>
                <div>
                  <img src={image} alt='webtruyen' />
                  <h4 className='center'>Hiện chưa có truyện nào</h4>
                  <p className='center'>Bạn hãy quay lại sau nhé!</p>
                  <span className='center'>
                    <Link to='/'>Về trang chủ</Link>
                  </span>
                </div>
              </div>
            )
          ) : (
            <LoaderCate />
          )}
        </div>
      </div>
    </MainLayout>
  )
}

export default CatePage

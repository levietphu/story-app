import { Link } from 'react-router-dom'
import { AuthContext } from '~/context/AuthContextProvider'
import { useContext } from 'react'
import image from '~/assets/mascot-02.235fd60.png'
import callApi from '~/ultis/callApi'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

const BookCase = () => {
  const { user, getUser }: any = useContext(AuthContext)

  const deleteBookMark = async (id_story: number) => {
    await callApi('post', { id_story }, 'remove_bookmark').then(() => {
      getUser()
    })
  }

  return (
    <div className='list__bookcase'>
      {Object.entries(user.bookcase).length !== 0 ? (
        Object.entries(user.bookcase).map((item: any, index: any) => {
          return (
            <div className='item__bookcase' key={index}>
              <div className='item'>
                <div className='height__full'>
                  <div className='image__bookcase'>
                    <Link to={`/${item[1].truyen.slug}`}>
                      <img src={`${import.meta.env.REACT_APP_UPLOADS}${item[1].truyen.image}`} alt='webtruyen' />
                    </Link>
                  </div>
                  <div className='title__book'>
                    <Link to={`/${item[1].truyen.slug}`} className='name__book'>
                      {item[1].truyen.name}
                    </Link>
                    <Link to={`/${item[1].truyen.slug}/${item[1].chuong.slug}`} className='save__chapter'>
                      <i>đọc tiếp {item[1].chuong.chapter_number}</i>{' '}
                    </Link>
                  </div>
                  <FontAwesomeIcon className='close' icon={faXmark} onClick={() => deleteBookMark(item[1].truyen.id)} />
                </div>
              </div>
            </div>
          )
        })
      ) : (
        <div className='no-view'>
          <div>
            <div className='center'>
              <img src={image} alt='webtruyen' />
            </div>
            <h4>Bạn chưa đánh dấu truyện nào cả</h4>
            <p>Hãy đánh dấu truyện đang đọc để đưa vào Tủ sách nhé!</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookCase

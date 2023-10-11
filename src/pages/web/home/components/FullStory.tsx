import { Link } from 'react-router-dom'
import FullStoryLoader from './FullStoryLoader'

const FullStory = ({ data }: any) => {
  return (
    <div className='full-story'>
      <div className='full__story--list'>
        {data ? (
          data.map((item: any) => {
            return (
              <Link to={`/${item.slug}`} className='full__story--item' key={item.id}>
                <h3 className='name__story'>{item?.name}</h3>
                <div className='cate__story'>
                  {item?.vip === 1 && <p className='cate btn__vip'>vip</p>}
                  <p className='cate btn__full'>full</p>
                  {item.theloais.map((value: any) => {
                    return (
                      <p className='cate' key={value.id}>
                        {value.name}
                      </p>
                    )
                  })}
                </div>
              </Link>
            )
          })
        ) : (
          <FullStoryLoader />
        )}
      </div>
    </div>
  )
}

export default FullStory

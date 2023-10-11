import { faBookmark } from '@fortawesome/free-regular-svg-icons'
import { faArrowLeft, faArrowRight, faBookOpen, faGear, faList } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Skeleton } from 'antd'

const Loader = () => {
  return (
    <>
      <section className='screen-80'>
        <div className='header__chapter'>
          <Skeleton.Button active size={'default'} />
          <Skeleton className='mb-20 chapter-loader' paragraph={{ rows: 1 }} loading={true} active title={false} />
          <div className='next__prev--chapter'>
            <span
              className={`next__chapter
      }`}
            >
              Chương trước
            </span>
            <span
              className={`next__chapter
      }`}
            >
              Chương sau
            </span>
          </div>
          <div className='content__chapter'>
            <Skeleton
              className='mb-20'
              paragraph={{ rows: 20 }}
              loading={true}
              active
              title={false}
              style={{ padding: '20px' }}
            />
          </div>
        </div>
        <div className='next__prev--chapter'>
          <span
            className={`next__chapter
      }`}
          >
            Chương trước
          </span>
          <span
            className={`next__chapter
      }`}
          >
            Chương sau
          </span>
        </div>
      </section>
      <div className='setting__chapter'>
        <div className='setting'>
          <FontAwesomeIcon className='icon-i' icon={faGear} />
        </div>
        <div className='change__story center'>
          <FontAwesomeIcon className='icon-i' icon={faBookOpen} />
        </div>
        <div className='list__chapter'>
          <FontAwesomeIcon className='icon-i' icon={faList} />
        </div>
        <div className='tick__chapter'>
          <FontAwesomeIcon className='icon-i' icon={faBookmark} />
        </div>
        <div className='next__chapter forbidden center'>
          <FontAwesomeIcon className='icon-i' icon={faArrowLeft} />
        </div>

        <div className='next__chapter forbidden center'>
          <FontAwesomeIcon className='icon-i' icon={faArrowRight} />
        </div>
      </div>
    </>
  )
}

export default Loader

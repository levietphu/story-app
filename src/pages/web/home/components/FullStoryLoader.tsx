import { Skeleton } from 'antd'

const FullStoryLoader = () => {
  return (
    <>
      <Skeleton
        className='mb-20'
        paragraph={{ rows: 2 }}
        loading={true}
        active
        style={{ borderBottom: '1px solid #dbd7d7', padding: '15px' }}
      />
      <Skeleton
        className='mb-20'
        paragraph={{ rows: 2 }}
        loading={true}
        active
        style={{ borderBottom: '1px solid #dbd7d7', padding: '15px' }}
      />
      <Skeleton
        className='mb-20'
        paragraph={{ rows: 2 }}
        loading={true}
        active
        style={{ borderBottom: '1px solid #dbd7d7', padding: '15px' }}
      />
      <Skeleton
        className='mb-20'
        paragraph={{ rows: 2 }}
        loading={true}
        active
        style={{ borderBottom: '1px solid #dbd7d7', padding: '15px' }}
      />
    </>
  )
}

export default FullStoryLoader

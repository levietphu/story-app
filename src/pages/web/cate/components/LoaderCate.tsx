import { Skeleton } from 'antd'

const LoaderCate = () => {
  return (
    <>
      <Skeleton
        className='mb-20'
        avatar={{
          shape: 'square',
          style: { width: 80, height: 120, borderRadius: '5px' }
        }}
        paragraph={{ rows: 3 }}
        loading={true}
        active
        style={{ borderBottom: '1px solid #dbd7d7' }}
      />
      <Skeleton
        className='mb-20'
        avatar={{
          shape: 'square',
          style: { width: 80, height: 120, borderRadius: '5px' }
        }}
        paragraph={{ rows: 3 }}
        loading={true}
        active
        style={{ borderBottom: '1px solid #dbd7d7' }}
      />
      <Skeleton
        className='mb-20'
        avatar={{
          shape: 'square',
          style: { width: 80, height: 120, borderRadius: '5px' }
        }}
        paragraph={{ rows: 3 }}
        loading={true}
        active
        style={{ borderBottom: '1px solid #dbd7d7' }}
      />
      <Skeleton
        className='mb-20'
        avatar={{
          shape: 'square',
          style: { width: 80, height: 120, borderRadius: '5px' }
        }}
        paragraph={{ rows: 3 }}
        loading={true}
        active
        style={{ borderBottom: '1px solid #dbd7d7' }}
      />
    </>
  )
}

export default LoaderCate

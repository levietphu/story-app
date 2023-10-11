import { Skeleton } from 'antd'

const NewUpdateLoader = () => {
  return (
    <>
      <Skeleton
        className='mb-20'
        avatar={{
          shape: 'square',
          style: { width: 60, height: 90, borderRadius: '5px' }
        }}
        paragraph={{ rows: 2 }}
        loading={true}
        active
        style={{ borderBottom: '1px solid #dbd7d7', padding: '15px' }}
      />
      <Skeleton
        className='mb-20'
        avatar={{
          shape: 'square',
          style: { width: 60, height: 90, borderRadius: '5px' }
        }}
        paragraph={{ rows: 2 }}
        loading={true}
        active
        style={{ borderBottom: '1px solid #dbd7d7', padding: '15px' }}
      />
      <Skeleton
        className='mb-20'
        avatar={{
          shape: 'square',
          style: { width: 60, height: 90, borderRadius: '5px' }
        }}
        paragraph={{ rows: 2 }}
        loading={true}
        active
        style={{ borderBottom: '1px solid #dbd7d7', padding: '15px' }}
      />
      <Skeleton
        className='mb-20'
        avatar={{
          shape: 'square',
          style: { width: 60, height: 90, borderRadius: '5px' }
        }}
        paragraph={{ rows: 2 }}
        loading={true}
        active
        style={{ borderBottom: '1px solid #dbd7d7', padding: '15px' }}
      />
    </>
  )
}

export default NewUpdateLoader

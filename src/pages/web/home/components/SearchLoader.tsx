import { Skeleton } from 'antd'

const SearchLoader = () => {
  return (
    <>
      <Skeleton
        avatar={{
          shape: 'square',
          style: { width: 60, height: 90 }
        }}
        paragraph={{ rows: 1 }}
        loading={true}
        active
        style={{ borderBottom: '1px solid #dbd7d7', padding: '15px' }}
      />
      <Skeleton
        avatar={{
          shape: 'square',
          style: { width: 60, height: 90 }
        }}
        paragraph={{ rows: 1 }}
        loading={true}
        active
        style={{ borderBottom: '1px solid #dbd7d7', padding: '15px' }}
      />
    </>
  )
}

export default SearchLoader

import { Skeleton } from 'antd'

const Loader = () => {
  return (
    <>
      <Skeleton
        className='loader-story'
        avatar={{
          shape: 'square',
          style: { width: 300, height: 400 }
        }}
        paragraph={{ rows: 4 }}
        loading={true}
        active
      />
    </>
  )
}

export default Loader

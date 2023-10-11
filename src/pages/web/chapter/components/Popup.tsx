import { isTogglePopup } from '~/store/common/commonSlice'
import { useAppDispatch } from '~/store/hookStore'

const Popup = () => {
  const dispatch = useAppDispatch()

  return (
    <>
      <div className='popup__chapter'>
        <div className='popup__chapter--left'></div>
        <div className='popup__chapter--right' onClick={() => dispatch(isTogglePopup(false))}></div>
      </div>
    </>
  )
}

export default Popup

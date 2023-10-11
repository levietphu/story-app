import '../styles/popupfull.scss'
import xuly from '~/assets/xuly.png'
import xuly2 from '~/assets/xuly2.png'
import { useOutSide } from '~/hookCustom/useOutSide'
import { Image } from 'antd'

const PopupFull = ({ setCheckPopupHome }: any) => {
  const Ref = useOutSide(() => setCheckPopupHome(false))
  return (
    <div className='popup-full'>
      <div className='popup-full__center' ref={Ref}>
        <div className='popup-full__center--popup'>
          <h3>Vì lý do: chứng chỉ ssl nên muốn vào trang cần làm theo hướng dẫn:</h3>
          <a href='https://139.162.17.88/' target='_blank' style={{ display: 'block' }}>
            Nhấp vào đây nhé
          </a>
          <div>
            <Image src={xuly} />
            <Image src={xuly2} />
          </div>
          <p>
            Đợi vào được bên backend thì chuyển lại vào trang này(Chỉ cần làm 1 lần để chrome cho phép từ lần sau vẫn
            vào bình thường)
          </p>
        </div>
      </div>
    </div>
  )
}

export default PopupFull

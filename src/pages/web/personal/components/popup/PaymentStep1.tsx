import { Tabs } from 'antd'
import '../../styles/modal-step1.scss'
import type { TabsProps } from 'antd'
import PaymentStep1Item from './PaymentStep1Item'
import LabelStep1 from './LabelStep1'

type PaymentStep1Props = {
  data: any
  setIsModal: (value: boolean) => void
  setInfoItem: (value: any) => void
  transitionCode: string
}

const PaymentStep1: React.FC<PaymentStep1Props> = ({ data, setIsModal, setInfoItem, transitionCode }) => {
  const items: TabsProps['items'] = data.map((item: any, index: number) => {
    return {
      key: index,
      label: <LabelStep1 key={index} image={item.image} />,
      children: (
        <PaymentStep1Item
          key={index}
          item={item}
          note={item.note ? item.note : ''}
          setIsModal={setIsModal}
          setInfoItem={setInfoItem}
          transitionCode={transitionCode}
        />
      )
    }
  })

  return (
    <div className='modal-step1'>
      <div className='content-modal'>
        <Tabs items={items} />
      </div>
    </div>
  )
}

export default PaymentStep1

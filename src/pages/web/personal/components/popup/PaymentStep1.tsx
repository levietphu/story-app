import { Tabs } from 'antd'
import '../../styles/modal-step1.scss'
import type { TabsProps } from 'antd'
import PaymentStep1Item from './PaymentStep1Item'
import LabelStep1 from './LabelStep1'

const PaymentStep1 = ({ data, setIsModal, setInfoItem, transitionCode }: any) => {
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

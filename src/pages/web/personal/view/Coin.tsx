import HistoryTransition from '../components/coin/HistoryTransition'
import LoadCents from '../components/coin/LoadCents'

const Coin = () => {
  return (
    <div className='coin__personal'>
      <LoadCents />
      <HistoryTransition />
    </div>
  )
}

export default Coin

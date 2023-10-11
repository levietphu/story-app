import coin from '~/assets/coin.svg'
import '../../styles/historytran.scss'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '~/context/AuthContextProvider'
import Pagination from '../../../pagination/PaginationPage'
import Moment from 'react-moment'
import 'moment/locale/vi'
import callApi from '~/ultis/callApi'

const HistoryTransition = () => {
  const [transactionHistory, setTransactionHistory] = useState<any>()
  const [loader, setLoader] = useState(true)

  const { user }: any = useContext(AuthContext)

  const getTransaction = async (page = 1) => {
    await callApi('get', '', `show_transaction?id_user=${user.user.id}&page=${page}`).then((res: any) => {
      setTransactionHistory(res.data.transaction_history)
      setLoader(false)
    })
  }

  useEffect(() => {
    getTransaction()
  }, [])

  return (
    <>
      <div className='text-his'>Lịch sử giao dịch</div>
      {!loader && transactionHistory.data.length !== 0 && (
        <>
          <div className='table'>
            <table>
              <thead>
                <tr>
                  <th>Mã giao dịch</th>
                  <th>Nội dung</th>
                  <th>XU</th>
                  <th>Tình trạng</th>
                  <th>Cập nhật lần cuối</th>
                </tr>
              </thead>
              <tbody>
                {transactionHistory &&
                  transactionHistory.data.map((item: any, index: number) => {
                    return (
                      <tr draggable={false} key={index}>
                        <td>{item.transaction_code}</td>
                        <td>
                          <span>
                            <strong>Nạp Xu</strong>
                          </span>
                          <p
                            style={{
                              opacity: '0.7',
                              marginTop: '5px'
                            }}
                          >
                            {item.content}
                          </p>
                        </td>

                        <td>
                          +{item.coin_number} <img src={coin} alt='webtruyen' width='16' height='16' />{' '}
                        </td>
                        <td>
                          <span
                            style={{
                              background: `${item.status === 2 ? 'green' : item.status === 1 ? 'red' : '#4f4d47'}`
                            }}
                          >
                            {item.status === 2 ? 'Thành công' : item.status === 1 ? 'Lỗi nạp' : 'Chờ duyệt'}
                          </span>
                        </td>
                        <td>
                          <Moment format='hh-mm-ss DD-MM-YYYY'>{item.updated_at}</Moment>
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
          <Pagination data={transactionHistory} check='transactionHistory' callApiPagination={getTransaction} />
        </>
      )}
    </>
  )
}

export default HistoryTransition

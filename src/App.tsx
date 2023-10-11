import './app.scss'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { useState, useLayoutEffect } from 'react'
import { history } from './store/common/history'
import PermissionContent from './middleware/PermissionContent'
import NotFound from './pages/web/NotFound/view/NotFound'

function App() {
  const CustomRouter = ({ history, ...props }: any) => {
    const [state, setState] = useState({
      action: history.action,
      location: history.location
    })

    useLayoutEffect(() => history.listen(setState), [history])

    return <Router {...props} location={state.location} navigationType={state.action} navigator={history} />
  }

  return (
    <CustomRouter history={history}>
      <Routes>
        <Route path='/*' element={<PermissionContent />}></Route>
        <Route path='*' element={<NotFound />}></Route>
      </Routes>
    </CustomRouter>
  )
}

export default App

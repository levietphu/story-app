import { Routes, Route, Navigate } from 'react-router-dom'
import routesCms from './routesCms'
import { AuthContext } from '~/context/AuthContextProvider'
import { useContext, Suspense } from 'react'
import { checkPer } from '~/ultis/checkPer'
import Dashboard from './dashboard/view/Dashboard'
import NotFound from '../web/NotFound/view/NotFound'
import { Spin } from 'antd'
import PermissionDenied from './permission-dennied/view/PermissionDenied'

const Cms = () => {
  const { user, loaderUser }: any = useContext(AuthContext)
  return (
    <Routes>
      <Route
        path='/'
        element={
          loaderUser === 'loader' ? (
            <Spin />
          ) : user && user.role.length <= 0 ? (
            <PermissionDenied />
          ) : user ? (
            <Dashboard />
          ) : (
            !user && loaderUser === 'login' && <Navigate to='/login' />
          )
        }
      >
        {routesCms.map((route: any, idx: number) => {
          return (
            <Route
              path={route.path}
              element={
                <Suspense fallback={<Spin />}>
                  {user && (checkPer(user.role, route.per) || !route.per) ? (
                    <route.component />
                  ) : (
                    <p style={{ fontSize: '24px' }}>Bạn không đủ quyền vào</p>
                  )}
                </Suspense>
              }
              key={idx}
            />
          )
        })}
      </Route>
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default Cms

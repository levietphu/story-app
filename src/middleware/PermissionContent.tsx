import { Route, Routes } from 'react-router-dom'
import routes from '../routes/routes'
import { RouteProps } from '../store/common/interface'
import { useAppDispatch } from '../store/hookStore'
import { useEffect } from 'react'
import { getApiLayout } from '../store/common/commonSlice'

const PermissionContent = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getApiLayout())
  }, [])

  return (
    <Routes>
      {routes.map((route: RouteProps, idx: number) => {
        return <Route path={route.path} key={idx} element={route.component} />
      })}
    </Routes>
  )
}

export default PermissionContent

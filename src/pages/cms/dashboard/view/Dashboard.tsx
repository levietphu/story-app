import LayoutCms from '../../LayoutCms/view/LayoutCms'
import { Outlet } from 'react-router-dom'

const Dashboard = () => {
  return (
    <LayoutCms>
      <Outlet />
    </LayoutCms>
  )
}

export default Dashboard

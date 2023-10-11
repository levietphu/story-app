import Web from '../pages/web/Web'
import Cms from '../pages/cms/Cms'

const routes: any[] = [
  { path: '/*', exact: true, name: 'Web', component: <Web /> },
  { path: '/dashboard/*', exact: true, name: 'Cms', component: <Cms /> }
]

export default routes

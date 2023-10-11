import CatePage from './cate/view/CatePage'
import HomePage from './home/view/HomePage'
import NotFound from './NotFound/view/NotFound'
import Chapterpage from './chapter/view/Chapterpage'
import Story from './story/view/Story'
import Transalator from './translator/view/Transalator'
import Login from './user/Login'
import Register from './user/Register'
import ForgotPassword from './user/ForgotPassword'
import Author from './author/view/Author'

export const routesWeb: any[] = [
  { path: '/', index: true, name: 'Home', component: <HomePage /> },
  {
    path: '/the-loai/:slugcate',
    index: true,
    name: 'Cate',
    component: <CatePage />
  },

  {
    path: '/danh-sach/:sluglist',
    index: true,
    name: 'List',
    component: <CatePage />
  },
  {
    path: '/dich-gia/:slugdichgia',
    index: true,
    name: 'Translator',
    component: <Transalator />
  },
  {
    path: '/tac-gia/:slugauthor',
    index: true,
    name: 'Author',
    component: <Author />
  },
  { path: '/login', index: true, name: 'Login', component: <Login /> },
  { path: '/register', index: true, name: 'Register', component: <Register /> },
  {
    path: '/reset-password',
    index: true,
    name: 'FogotPass',
    component: <ForgotPassword />
  },
  { path: '/404', index: true, name: 'NotFound', component: <NotFound /> },
  {
    path: '/support',
    index: true,
    name: 'Support',
    component: <span>Hỗ trợ</span>
  },
  {
    path: '/regulation',
    index: true,
    name: 'Regulation',
    component: <span>Quy định và chính sách</span>
  },
  { path: '/:slug', index: true, name: 'Story', component: <Story /> },
  {
    path: '/:slugstory/:slugchapter',
    index: true,
    name: 'Chapter',
    component: <Chapterpage />
  }
]

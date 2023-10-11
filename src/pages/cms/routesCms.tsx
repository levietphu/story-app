import React from 'react'

const ViewDashboard = React.lazy(() => import('./dashboard/view/ViewDashboard'))
const ViewCate = React.lazy(() => import('./cate/views/ViewCate'))
const ViewAuthor = React.lazy(() => import('./author/views/ViewAuthor'))
const ViewTranslator = React.lazy(() => import('./translator/views/ViewTranslator'))
const ViewAds = React.lazy(() => import('./ads/views/ViewAds'))
const ViewContact = React.lazy(() => import('./contact/views/ViewContact'))
const ViewLogo = React.lazy(() => import('./logo/views/ViewLogo'))
const ViewTransaction = React.lazy(() => import('./transaction/view/ViewTransaction'))
const WithdrawMoneyView = React.lazy(() => import('./withdrawmoney/view/WithdrawMoneyView'))
const ViewAffiliatedBank = React.lazy(() => import('./affiliatedbank/view/ViewAffiliatedBank'))
const ViewBanner = React.lazy(() => import('./banner/views/ViewBanner'))
const ViewBankInfo = React.lazy(() => import('./bankinfo/views/ViewBankInfo'))
const ViewStory = React.lazy(() => import('./story/views/ViewStory'))
const ViewUser = React.lazy(() => import('./user/views/ViewUser'))
const ViewRole = React.lazy(() => import('./role/views/ViewRole'))
const CreateStory = React.lazy(() => import('./story/views/CreateStory'))
const EditStory = React.lazy(() => import('./story/views/EditStory'))
const ViewChapter = React.lazy(() => import('./chapter/views/ViewChapter'))
const ViewLoadCent = React.lazy(() => import('./loadcents/views/ViewLoadCent'))
const ViewDiscount = React.lazy(() => import('./discount/views/ViewDiscount'))
const ViewPermission = React.lazy(() => import('./permission/views/ViewPermission'))

const routesCms: any[] = [
  { path: '/', index: true, per: '', component: ViewDashboard },
  {
    path: '/cate/view',
    index: true,
    per: 'cate-view',
    component: ViewCate
  },
  {
    path: '/author/view',
    index: true,
    per: 'author-view',
    component: ViewAuthor
  },
  {
    path: '/trans/view',
    index: true,
    per: 'trans-view',
    component: ViewTranslator
  },
  { path: '/ads/view', index: true, per: 'ads-view', component: ViewAds },
  {
    path: '/contact/view',
    index: true,
    per: 'contact-view',
    component: ViewContact
  },
  {
    path: '/logo/view',
    index: true,
    per: 'logo-view',
    component: ViewLogo
  },
  {
    path: '/transaction/view',
    index: true,
    per: 'transaction-view',
    component: ViewTransaction
  },
  {
    path: '/withdraw_money/view',
    index: true,
    per: 'withdrawmoney-view',
    component: WithdrawMoneyView
  },
  {
    path: '/affiliated_bank/view',
    index: true,
    per: 'affiliatedbank-view',
    component: ViewAffiliatedBank
  },
  {
    path: '/banner/view',
    index: true,
    per: 'banner-view',
    component: ViewBanner
  },
  {
    path: '/bankinfo/view',
    index: true,
    per: 'bankinfo-view',
    component: ViewBankInfo
  },
  {
    path: '/story/view',
    index: true,
    per: 'story-view',
    component: ViewStory
  },
  {
    path: '/user/view',
    index: true,
    per: 'user-view',
    component: ViewUser
  },
  {
    path: '/role/view',
    index: true,
    per: 'role-view',
    component: ViewRole
  },
  {
    path: '/per/view',
    index: true,
    per: 'per-view',
    component: ViewPermission
  },
  {
    path: '/story/create',
    index: true,
    per: 'story-create',
    component: CreateStory
  },
  {
    path: '/profile/view',
    index: true,
    per: 'profile-view',
    component: CreateStory
  },
  {
    path: '/story/edit/:id_story',
    index: true,
    per: 'story-edit',
    component: EditStory
  },
  {
    path: '/discount/:id_story/view',
    index: true,
    per: '',
    component: ViewDiscount
  },
  {
    path: '/chapter/:id_story/view',
    index: true,
    per: '',
    component: ViewChapter
  },
  {
    path: '/loadcent/:id_bankinfo/view',
    index: true,
    per: '',
    component: ViewLoadCent
  }
]

export default routesCms

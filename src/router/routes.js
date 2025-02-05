import HomeView from '../views/home.view.vue'
import ReserveView from '../views/reserve/index.view.vue'
import ReserveStatusView from  '../views/reserve/status.view.vue'

export default [
  {
    path: '/',
    name: 'HomeView',
    component: HomeView
  },
  {
    path: '/reserves/:id',
    name: 'ReserveView',
    component: ReserveView
  },
  {
    path: '/reserves/:id/status',
    name: 'ReserveStatusView',
    component: ReserveStatusView
  },
]

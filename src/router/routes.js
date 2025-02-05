import HomeView from '../views/home.view.vue'
import ReserveView from '../views/reserve/index.view.vue'

export default [
  {
    path: '/',
    name: 'HomeView',
    component: HomeView
  },
  {
    path: '/reserve',
    name: 'ReserveView',
    component: ReserveView
  },
]

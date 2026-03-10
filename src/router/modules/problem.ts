import { AppRouteRecord } from '@/types/router'
import PERMISSION_ENUM from '@/access/permissionEnum'

export const problemRoutes: AppRouteRecord = {
  path: '/problem',
  name: 'Problem',
  component: '/index/index',
  meta: {
    title: 'menus.problem.title',
    icon: 'ri:book-2-line',
    roles: ['root']
  },
  children: [
    {
      path: 'all',
      name: 'AllProblem',
      component: '/problem/problem-list',
      meta: { title: 'menus.problem.allProblem', icon: 'ri:book-3-line', keepAlive: true }
    }
  ]
}

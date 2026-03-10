import { AppRouteRecord } from '@/types/router'

export const adminRoutes: AppRouteRecord = {
  path: '/admin',
  name: 'Admin',
  component: '/index/index',
  meta: {
    title: 'menus.admin.title',
    icon: 'ri:user-line',
    roles: ['root']
  },
  children: []
}

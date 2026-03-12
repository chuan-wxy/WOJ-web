import { AppRouteRecordRaw } from '@/types/router'
import PERMISSION_ENUM from '@/access/permissionEnum'

/**
 * 静态路由配置（不需要权限就能访问的路由）
 *
 *
 * 注意事项：
 * 1、path、name 不要和动态路由冲突，否则会导致路由冲突无法访问
 * 2、静态路由不管是否登录都可以访问
 */
export const staticRoutes: AppRouteRecordRaw[] = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@views/index/index.vue'),
    meta: { title: 'menus.dashboard.title', icon: 'ri:home-5-line' },
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@views/dashboard/HomeView.vue'),
        meta: { title: 'menus.dashboard.home' }
      },
      {
        path: 'announcement',
        name: 'Announcement',
        component: () => import('@/views/dashboard/announcement/index.vue'),
        meta: {
          title: 'menus.dashboard.announcement'
        }
      }
    ]
  },
  {
    path: '/common',
    name: 'Common',
    component: () => import('@views/index/index.vue'),
    meta: { title: 'menus.common.login', icon: 'ri:login-box-line' },
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('@views/auth/login/index.vue'),
        meta: { title: 'menus.dashboard.home' }
      },
      {
        path: 'forget-password',
        name: 'ForgetPassword',
        component: () => import('@views/auth/forgot-password/index.vue'),
        meta: { title: 'menus.dashboard.forgot-password' }
      }
    ]
  }
]

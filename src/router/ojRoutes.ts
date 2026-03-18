import PERMISSION_ENUM from '../access/permissionEnum'

const ojRoutes = [
  {
    path: '/',
    redirect: { name: 'HomeView' }
  },
  {
    path: '/common',
    name: 'Common',
    component: () => import('../layout/UserLayout.vue'),
    redirect: { name: 'HomeView' },
    children: [
      {
        path: 'home',
        name: 'HomeView',
        component: () => import('@views/dashboard/HomeView.vue'),
        meta: { access: PERMISSION_ENUM.NO, title: '首页' }
      },
      {
        path: 'user/profile',
        name: 'UserProfileView',
        component: () => import('@/views/user/UserProfileView.vue'),
        meta: { access: PERMISSION_ENUM.USER, title: '用户信息页面' }
      },
      {
        path: 'login',
        name: 'UserRegistView',
        component: () => import('@/views/user/UserRegistView.vue'),
        meta: {
          access: PERMISSION_ENUM.NO
        }
      },
      {
        path: 'activity',
        name: 'ActivityView',
        component: () => import('@/views/activity/ActivityView.vue'),
        meta: {
          access: PERMISSION_ENUM.NO
        }
      },
      {
        path: 'activity/content',
        name: 'ActivityContentView',
        component: () => import('@/views/activity/ActivityContentView.vue'),
        meta: {
          access: PERMISSION_ENUM.NO
        }
      },
      {
        path: 'course',
        name: 'CourseView',
        component: () => import('@/views/course/CourseView.vue'),
        children: [
          {
            path: 'content',
            name: 'CourseContentView',
            component: () => import('@/views/course/CourseContentView.vue')
          }
        ]
      }
    ]
  }
]

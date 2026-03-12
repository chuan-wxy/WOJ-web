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
        path: 'problem/content',
        name: 'ProblemContentView',
        component: () => import('@/views/question/ProblemContentView.vue'),
        meta: {
          access: PERMISSION_ENUM.NO,
          title: '题目详情页面',
          isHide: true
        }
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
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../layout/BasicLayout.vue'),
    meta: { access: PERMISSION_ENUM.MANAGE },
    children: [
      {
        path: 'addannouncement',
        name: 'add-announcement',
        component: import('@/views/admin/AddAnnouncementView.vue'),
        meta: { access: PERMISSION_ENUM.MANAGE, title: '新增公告' }
      },
      {
        path: 'addactivity',
        name: 'add-activity',
        component: import('@/views/admin/AddActivityView.vue'),
        meta: { access: PERMISSION_ENUM.MANAGE, title: '新增活动' }
      },
      {
        path: 'userlist',
        name: 'User-list',
        component: () => import('@/views/admin/UserListView.vue'),
        meta: { access: PERMISSION_ENUM.MANAGE, title: '用户列表' }
      },
      {
        path: 'addproblem',
        name: 'AddProblemView',
        component: () => import('@/views/admin/AddProblemView.vue'),
        meta: { access: PERMISSION_ENUM.MANAGE, title: '新增题目' }
      },
      {
        path: 'addcourse',
        name: 'AddCourseView',
        component: () => import('@/views/admin/AddCourseView.vue'),
        meta: { access: PERMISSION_ENUM.MANAGE, title: '新增课程' }
      }
    ]
  }
]

import PERMISSION_ENUM from '../access/permissionEnum'

const adminRoutes = [
  {
    path: '/admin/',
    component: import('../layout/BasicLayout.vue'),
    meta: { access: PERMISSION_ENUM.MANAGE },
    children: [
      {
        path: 'addannouncement',
        name: 'add-announcement',
        component: import('@views/admin/announcement-manage/index.vue'),
        meta: { access: PERMISSION_ENUM.MANAGE, title: '新增公告' }
      },
      {
        path: 'addactivity',
        name: 'add-activity',
        component: import('@views/admin/activity-manage/index.vue'),
        meta: { access: PERMISSION_ENUM.MANAGE, title: '新增活动' }
      },
      {
        path: 'admin/addcourse',
        name: 'AddCourseView',
        component: () => import('@views/admin/course-manage/index.vue'),
        meta: { access: PERMISSION_ENUM.MANAGE, title: '新增课程' }
      }
    ]
  }
]

export default adminRoutes

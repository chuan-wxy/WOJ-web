import { AppRouteRecord } from '@/types/router'
import PERMISSION_ENUM from '@/access/permissionEnum'

export const adminRoutes: AppRouteRecord = {
  path: '/admin',
  name: 'Admin',
  component: '/index/index',
  meta: {
    title: 'menus.admin.title',
    icon: 'ri:user-line',
    roles: ['root']
  },
  children: [
    {
      path: 'activity',
      name: 'ActivityManage',
      component: '/admin/activity-manage',
      meta: {
        title: 'menus.admin.activityManage',
        icon: 'streamline-stickies-color:winter-day-activities-duo',
        roles: ['root']
      }
    },
    {
      path: 'announcement',
      name: 'Announcement Manage',
      component: '/admin/announcement-manage',
      meta: {
        title: 'menus.admin.announcementManage',
        icon: 'icon-park-outline:announcement',
        roles: ['root']
      }
    },
    {
      path: 'course',
      name: 'CourseManage',
      component: '/admin/course-manage',
      meta: {
        title: 'menus.admin.courseManage',
        icon: 'tdesign:course',
        roles: ['root']
      }
    },
    {
      path: 'problem',
      name: 'ProblemManage',
      component: '/admin/problem-manage',
      meta: {
        title: 'menus.admin.problemManage',
        icon: 'ri:question-answer-line',
        roles: ['root']
      }
    },
    {
      path: 'user',
      name: 'UserManage',
      component: '/admin/user-manage',
      meta: {
        title: 'menus.admin.userManage',
        icon: 'ri:user-line',
        roles: ['root']
      }
    }
  ]
}

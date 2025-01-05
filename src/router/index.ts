import { createRouter, createWebHistory } from "vue-router";
import PERMISSION_ENUM from "@/access/permissionEnum";
import adminRoutes from "./adminRoutes.ts";
import ojRoutes from "./ojRoutes.ts";
import {useUserStore} from "../store/UserStore.ts";
import {useCommonStore} from "../store/CommonStore.ts";
import ACCESS_ENUM from "../access/accessEnum.ts";

const router = createRouter({
  history: createWebHistory(),
  routes:[
    {
      path: "/",
      redirect: { name: "HomeView" },
    },
    {
      path: "/common",
      name: "Common",
      component:()=>import("../layout/UserLayout.vue"),
      redirect: { name: "HomeView" },
      children: [
        {
          path: "home",
          name: "HomeView",
          component: ()=>import("@/views/HomeView.vue"),
          meta: { access: PERMISSION_ENUM.NO,title:'首页'},
        },
        {
          path: "problem",
          name: "ProblemView",
          component: ()=>import("@/views/question/ProblemListView.vue"),
          meta: { access: PERMISSION_ENUM.NO,title:'题目页面'},
        },
        {
          path: "problem/content",
          name: "ProblemContentView",
          component: ()=>import("@/views/question/ProblemContentView.vue"),
          meta: {
            access: PERMISSION_ENUM.NO,
            title:'题目详情页面',
            isHide: true,
          },
        },
        {
          path: "user/profile",
          name: "UserProfileView",
          component: ()=>import("@/views/user/UserProfileView.vue"),
          meta: { access: PERMISSION_ENUM.USER,title:'用户信息页面'},
        },
        {
          path: "login",
          name: "UserRegistView",
          component: ()=>import("@/views/user/UserRegistView.vue"),
          meta: {
            access: PERMISSION_ENUM.NO,
          },
        },
        {
          path: "activity",
          name: "ActivityView",
          component: ()=>import("@/views/activity/ActivityView.vue"),
          meta: {
            access: PERMISSION_ENUM.NO,
          },
        },
        {
          path: "activity/content",
          name: "ActivityContentView",
          component: ()=>import("@/views/activity/ActivityContentView.vue"),
          meta: {
            access: PERMISSION_ENUM.NO,
          },
        },
        {
          path: "announcement",
          name: "AnnouncementView",
          component: ()=>import("@/views/announcement/AnnouncementView.vue"),
          meta: {
            access: PERMISSION_ENUM.NO,
          },
        },
        {
          path: "course",
          name: "CourseView",
          component: ()=>import("@/views/course/CourseView.vue"),
          children: [
            {
              path: "content",
              name: "CourseContentView",
              component: ()=>import("@/views/course/CourseContentView.vue"),
            },
          ],
        },
      ],
    },
    {
      path:"/md",
      component: ()=>import("@/components/MdEditor.vue")
    },
    {
      path: '/admin',
      name: "admin",
      component: ()=>import("../layout/BasicLayout.vue"),
      meta: { access: PERMISSION_ENUM.MANAGE },
      children: [
        {
          path: 'addannouncement',
          name: 'add-announcement',
          component: import("@/views/admin/AddAnnouncementView.vue"),
          meta: { access: PERMISSION_ENUM.MANAGE,title:'新增公告'},
        },
        {
          path: 'addactivity',
          name: 'add-activity',
          component: import("@/views/admin/AddActivityView.vue"),
          meta: { access: PERMISSION_ENUM.MANAGE,title:'新增活动'},
        },
        {
          path: "userlist",
          name: "User-list",
          component: ()=>import("@/views/admin/UserListView.vue"),
          meta: { access: PERMISSION_ENUM.MANAGE,title:'用户列表'},
        },
        {
          path: "addproblem",
          name: "AddProblemView",
          component: ()=>import("@/views/admin/AddProblemView.vue"),
          meta: { access: PERMISSION_ENUM.MANAGE,title:'新增题目'},
        },
        {
          path: "addcourse",
          name: "AddCourseView",
          component: ()=>import("@/views/admin/AddCourseView.vue"),
          meta: { access: PERMISSION_ENUM.MANAGE,title:'新增课程'},
        },
      ]
    }]
});
//
// router.beforeEach((to, from, next) => {
//   const userStore = useUserStore();
//   const commonStore = useCommonStore();
//   const userRole: string[] = userStore.userRole;
//
//   if (to.path === "/home") {
//     commonStore.setActiveIndex(0);
//   } else if (to.path.includes("/activity")) {
//     commonStore.setActiveIndex(1);
//   } else if (to.path.includes("problem")) {
//     commonStore.setActiveIndex(2);
//   } else if (to.path.includes("/admin")) {
//     commonStore.setActiveIndex(3);
//   } else {
//     commonStore.setActiveIndex(-1);
//   }
//
//   const needAccess = (to.meta?.access as string) ?? PERMISSION_ENUM.NO;
//   // 不需要特殊权限
//   if (needAccess === PERMISSION_ENUM.NO) {
//     next();
//   } else {
//     if (!userRole) {
//       ElMessage.error("请先登录");
//       next(`/login?redirect=${to.path}`);
//     }
//     // 需要提交权限
//     if (needAccess === PERMISSION_ENUM.SUBMIT) {
//       if (
//           userRole.indexOf(ACCESS_ENUM.NO_SUBMIT_USER) === -1 &&
//           userRole.indexOf(ACCESS_ENUM.NO_SUBMIT_MUTE_USER) === -1 &&
//           userRole.indexOf(ACCESS_ENUM.NO_SUBMIT_NO_DISCUSS_USER) === -1
//       ) {
//         next();
//       } else {
//         next("/NoAuth");
//       }
//     }
//
//     switch (needAccess) {
//       case PERMISSION_ENUM.SUBMIT:
//         if (
//             !userRole.includes(ACCESS_ENUM.NO_SUBMIT_USER) &&
//             !userRole.includes(ACCESS_ENUM.NO_SUBMIT_MUTE_USER) &&
//             !userRole.includes(ACCESS_ENUM.NO_SUBMIT_NO_DISCUSS_USER)
//         ) {
//           next(); // 有提交权限
//         } else {
//           next("/NoAuth"); // 无提交权限
//         }
//         break;
//       case PERMISSION_ENUM.POST_MESSAGE:
//       case PERMISSION_ENUM.DISCUSS:
//         if (
//             !userRole.includes(ACCESS_ENUM.NO_DISCUSS_USER) &&
//             !userRole.includes(ACCESS_ENUM.MUTE_USER) &&
//             !userRole.includes(ACCESS_ENUM.NO_SUBMIT_NO_DISCUSS_USER) &&
//             !userRole.includes(ACCESS_ENUM.NO_SUBMIT_MUTE_USER)
//         ) {
//           next(); // 有发帖或讨论权限
//         } else {
//           next("/NoAuth"); // 无权限
//         }
//         break;
//       case PERMISSION_ENUM.MANAGE:
//         if (userRole.includes(ACCESS_ENUM.ROOT) || userRole.includes(ACCESS_ENUM.ADMIN)) {
//           next(); // 有管理权限
//         } else {
//           next("/NoAuth"); // 无管理权限
//         }
//         break;
//       case PERMISSION_ENUM.PROBLEM_MANAGE:
//         if (
//             userRole.includes(ACCESS_ENUM.ROOT) ||
//             userRole.includes(ACCESS_ENUM.ADMIN) ||
//             userRole.includes(ACCESS_ENUM.PROBLEM_ADMIN)
//         ) {
//           next(); // 有题目管理权限
//         } else {
//           next("/NoAuth"); // 无权限
//         }
//         break;
//       case PERMISSION_ENUM.REPLY:
//         if (
//             !userRole.includes(ACCESS_ENUM.MUTE_USER) &&
//             !userRole.includes(ACCESS_ENUM.NO_SUBMIT_MUTE_USER)
//         ) {
//           next(); // 有回复权限
//         } else {
//           next("/NoAuth"); // 无回复权限
//         }
//         break;
//       default:
//         // 如果需要，可以处理未知的权限类型
//         next(); // 或者根据需求重定向到某个页面
//     }
//
//     // 需要发帖权限,需要讨论权限
//     if (
//       needAccess === PERMISSION_ENUM.POST_MESSAGE ||
//       needAccess === PERMISSION_ENUM.DISCUSS
//     ) {
//       if (
//         userRole.indexOf(ACCESS_ENUM.NO_DISCUSS_USER) === -1 &&
//         userRole.indexOf(ACCESS_ENUM.MUTE_USER) === -1 &&
//         userRole.indexOf(ACCESS_ENUM.NO_SUBMIT_NO_DISCUSS_USER) === -1 &&
//         userRole.indexOf(ACCESS_ENUM.NO_SUBMIT_MUTE_USER) === -1
//       ) {
//         next();
//       } else {
//         next("/NoAuth");
//       }
//     }
//     // 需要管理权限
//     if (needAccess === PERMISSION_ENUM.MANAGE) {
//       if (
//         userRole.indexOf(ACCESS_ENUM.ROOT) !== -1 ||
//         userRole.indexOf(ACCESS_ENUM.ADMIN) !== -1
//       ) {
//         next();
//       } else {
//         next("/NoAuth");
//       }
//     }
//     // 需要题目管理权限
//     if (needAccess === PERMISSION_ENUM.PROBLEM_MANAGE) {
//       if (
//         userRole.indexOf(ACCESS_ENUM.ROOT) === 1 ||
//         userRole.indexOf(ACCESS_ENUM.ADMIN) === 1 ||
//         userRole.indexOf(ACCESS_ENUM.PROBLEM_ADMIN) === 1
//       ) {
//         next();
//       } else {
//         next("/NoAuth");
//       }
//     }
//     // 需要回复权限
//     if (needAccess === PERMISSION_ENUM.REPLY) {
//       if (
//         userRole.indexOf(ACCESS_ENUM.MUTE_USER) === -1 &&
//         userRole.indexOf(ACCESS_ENUM.NO_SUBMIT_MUTE_USER) === -1
//       ) {
//         next();
//       } else {
//         next("/NoAuth");
//       }
//     }
//   }
//   next();
// });
export default router;

import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import ProblemView from "@/views/question/ProblemListView.vue";
import UserRegistView from "@/views/user/UserRegistView.vue";
import ACCESS_ENUM from "@/access/accessEnum";
import { useUserStore } from "@/store/UserStore";
import { useCommonStore } from "@/store/CommonStore";
import AdminView from "@/views/admin/AdminView.vue";
import BasicLayout from "@/layout/BasicLayout.vue";
import TestView from "@/views/admin/TestView.vue";
import UserProfileView from "@/views/user/UserProfileView.vue";
import ProblemContentView from "@/views/question/ProblemContentView.vue";
import AddQuesitonView from "@/views/admin/AddProblemView.vue";
import AddProblemView from "@/views/admin/AddProblemView.vue";

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "首页",
      component: BasicLayout,
      redirect: "/home",
      children: [
        {
          path: "/home",
          name: "HomeView",
          component: HomeView,
        },
        {
          path: "/problem",
          name: "题库",
          component: ProblemView,
        },
        {
          path: "/admin",
          name: "Admin",
          component: AdminView,
          children: [
            {
              path: "/admin/test",
              name: "测试",
              component: TestView,
            },
            {
              path: "/admin/addproblem",
              name: "新增题目",
              component: AddProblemView,
            },
          ],
        },
        {
          path: "/user/profile",
          name: "个人信息",
          component: UserProfileView,
        },
        {
          path: "/login",
          name: "登录",
          component: UserRegistView,
          meta: {
            access: ACCESS_ENUM.NOT_LOGIN,
          },
        },
        {
          path: "/problem/content",
          name: "题目页面",
          component: ProblemContentView,
          meta: {
            isHide: true,
          },
        },
      ],
    },
    // {
    //   path: "/courses",
    //   name: "课程",
    //   component: CoursesView,
    //   meta: {
    //     title: "课程",
    //   },
    //   children: [
    //     {
    //       path: "/activity/",
    //       name: "活动",
    //       component: ActivityDefaultView,
    //     },
    //   ],
    // },
    // {
    //   path: "/activity/content",
    //   name: "asd",
    //   component: ActivityContentView,
    //   meta: {
    //     isHide: true,
    //   },
    // },
    // {
    //   path: "/teacher",
    //   name: "教资",
    //   component: TeacherView,
    // },
    // },
    // },
    // {
    //   path: "/admin/addteacherquestion",
    //   name: "新增教资题目",
    //   component: AddTeacherQuestionView,
    //   meta: {
    //     access: ACCESS_ENUM.ADMIN,
    //   },
    // },
    // {
    //   path: "/updatequestion",
    //   name: "更新题目",
    //   component: UpdateProblemView,
    //   meta: {
    //     access: ACCESS_ENUM.ADMIN,
    //   },
    // },
    // {
    //   path: "/managequestion",
    //   name: "管理题目",
    //   component: ManageQuestionView,
    //   meta: {
    //     access: ACCESS_ENUM.ADMIN,
    //   },
    // },
    // {
    //   path: "/NoAuth",
    //   name: "NoAuth",
    //   component: NoAuthView,
    //   meta: {
    //     isHide: true,
    //   },
    // },
  ],
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const commonStore = useCommonStore();
  const userRole = userStore.userRole;

  if (to.path === "/home") {
    commonStore.setActiveIndex(0);
  } else if (to.path === "/activity") {
    commonStore.setActiveIndex(1);
  } else if (to.path === "/problem") {
    commonStore.setActiveIndex(2);
  } else if (to.path === "/admin") {
    commonStore.setActiveIndex(3);
  } else {
    commonStore.setActiveIndex(-1);
  }

  const needAccess = (to.meta?.access as string) ?? ACCESS_ENUM.NOT_LOGIN;
  if (needAccess === ACCESS_ENUM.NOT_LOGIN) {
    next();
  }
  // if (needAccess === ACCESS_ENUM.ADMIN) {
  //   if (!userRole) {
  //     ElMessage.error("请先登录");
  //     next(`/login?redirect=${to.path}`);
  //   }
  //   if (!checkAccess(userRole ?? ACCESS_ENUM.NOT_LOGIN, ACCESS_ENUM.ADMIN)) {
  //     next("/NoAuth");
  //   }
  // }
});
export default router;

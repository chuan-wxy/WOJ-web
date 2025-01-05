import PERMISSION_ENUM from "../access/permissionEnum.ts";

const adminRoutes= [
    {
        path: '/admin/',
        component: import("../layout/BasicLayout.vue"),
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
                path: "admin/addcourse",
                name: "AddCourseView",
                component: ()=>import("@/views/admin/AddCourseView.vue"),
                meta: { access: PERMISSION_ENUM.MANAGE,title:'新增课程'},
            },
        ]
    },
]

export default adminRoutes
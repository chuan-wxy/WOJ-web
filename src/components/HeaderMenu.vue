<template>
  <el-row>
    <el-menu
        ellipsis
        router
        :default-active="paths"
        class="el-menu-popper-demo header-menu"
        mode="horizontal"
        :popper-offset="16"
    >
      <el-menu-item index="/common/home">首页</el-menu-item>
      <el-menu-item index="/common/problem">题库</el-menu-item>
      <el-menu-item index="/common/course">课程</el-menu-item>
      <el-menu-item v-show="userStore.userRole.includes('not_login')" index="/common/login">用户中心</el-menu-item>
      <el-sub-menu v-show="!userStore.userRole.includes('not_login')" >
        <template #title>用户中心</template>
        <el-menu-item index="/common/user/profile">个人资料</el-menu-item>
        <el-menu-item v-show="userStore.userRole.some(role => role === 'admin' || role === 'root')" @click="this.$router.push({ path: '/admin' });" >管理中心</el-menu-item>
        <el-menu-item @click="logout">退出登录</el-menu-item>
      </el-sub-menu>
    </el-menu>
  </el-row>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {useUserStore} from "@/store/UserStore";
import {useCommonStore} from "@/store/CommonStore";
import router from "@/router";

const userStore = useUserStore();
const userInfo = ref();

// const handleCommand = (command: string | number | object) => {
//   router.push({
//     path: command as string,
//   });
// };

// const visibleRoutes = computed(() => {
//   if (!userStore.userRole.includes("admin")) return [];
//   const routes = router.getRoutes();
//   return routes.filter((item, index) => {
//     if (item.meta?.isHide === true) {
//       return false;
//     }
//     if (item.meta?.premission === PERMISSION_ENUM.MANGE) {
//       return true;
//     } else return false;
//   });
// });

const changeTheme = () => {
  document.body.classList.toggle("light-mode");
};

const logout = () => {
  userStore.clearUserInfo();

  // router.push("/home");
};

const paths = ref("");

onMounted(() => {
  setTimeout(() => {
    paths.value = router.currentRoute.value.fullPath;
  }, 1000);
  userInfo.value = userStore.userInfo;
});
</script>
<style scoped>
.header-menu {
  min-width: 1200px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

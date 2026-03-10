<template>
  <div class="layout-headerbar">
    <ElMenu
      :default-active="routerPath"
      :default-openeds="defaultOpenedMenus"
      :hide-timeout="50"
      :show-timeout="50"
      :unique-opened="uniqueOpened"
    >
      <SidebarSubmenu
        :isMobile="isMobileMode"
        :list="menuList"
        :theme="getMenuTheme"
        @close="handleMenuClose"
      />
    </ElMenu>
    <!--  <ElMenu-->
    <!--    ellipsis-->
    <!--    router-->
    <!--    :default-active="activePath"-->
    <!--    class="el-menu-popper-demo header-menu"-->
    <!--    mode="horizontal"-->
    <!--    :popper-offset="16"-->
    <!--  >-->
    <!--    <el-menu-item index="/common/home">首页</el-menu-item>-->
    <!--    <el-menu-item index="/common/problem">题库</el-menu-item>-->
    <!--    <el-menu-item index="/common/course">课程</el-menu-item>-->
    <!--    <el-menu-item v-if="!userStore.isLogin" index="/common/login">用户中心</el-menu-item>-->
    <!--    &lt;!&ndash;      <el-sub-menu v-else>&ndash;&gt;-->
    <!--    &lt;!&ndash;        <template #title>用户中心</template>&ndash;&gt;-->
    <!--    &lt;!&ndash;        <el-menu-item index="/common/user/profile">个人资料</el-menu-item>&ndash;&gt;-->
    <!--    &lt;!&ndash;        <el-menu-item&ndash;&gt;-->
    <!--    &lt;!&ndash;          v-show="userStore.userRole.some((role) => role === 'admin' || role === 'root')"&ndash;&gt;-->
    <!--    &lt;!&ndash;          @click="this.$router.push({ path: '/admin' })"&ndash;&gt;-->
    <!--    &lt;!&ndash;          >管理中心</el-menu-item&ndash;&gt;-->
    <!--    &lt;!&ndash;        >&ndash;&gt;-->
    <!--    &lt;!&ndash;        <el-menu-item @click="logout">退出登录</el-menu-item>&ndash;&gt;-->
    <!--    &lt;!&ndash;      </el-sub-menu>&ndash;&gt;-->
    <!--  </ElMenu>-->
  </div>
</template>

<script setup>
  import { useUserStore } from '@/store/modules/user'
  import router from '@/router'
  import { UserControllerService } from '@/openapi/user/index.ts'
  import { ElMessage } from 'element-plus'
  import { useMenuStore } from '@/store/modules/menu'

  const userStore = useUserStore()
  const route = useRoute()
  const activePath = computed(() => route.meta.activeMenu || route.path)

  const menuList = computed(() => {
    const menuStore = useMenuStore()
    const allMenus = menuStore.menuList

    // 处理一级菜单
    if (route.meta.isFirstLevel) {
      return []
    }

    // 返回当前顶级路径对应的子菜单
    const currentTopPath = `/${route.path.split('/')[1]}`
    const currentMenu = allMenus.find((menu) => menu.path === currentTopPath)
    console.log(currentMenu)
    return currentMenu?.children ?? []
  })

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
    document.body.classList.toggle('light-mode')
  }

  const logout = async () => {
    await UserControllerService.logout()
    userStore.clearUserInfo()
    ElMessage.success('退出登录')
    router.push({ name: 'HomeView', replace: true })
  }
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

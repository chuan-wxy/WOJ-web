<!-- 左侧菜单 或 双列菜单 -->
<template>
  <div class="layout-sidebar" :class="{ 'no-border': menuList.length === 0 }">
    <!-- 左侧菜单 || 双列菜单（右侧） -->
    <div
      v-show="menuList.length > 0"
      class="menu-left"
      :class="`menu-left-${getMenuTheme.theme} menu-left-open`"
      :style="{ background: getMenuTheme.background }"
    >
      <ElScrollbar>
        <!-- Logo、系统名称 -->
        <div
          class="header"
          @click="navigateToHome"
          :style="{
            background: getMenuTheme.background
          }"
        >
          <Logo class="logo" />

          <p
            :style="{
              color: getMenuTheme.systemNameColor
            }"
            style="opacity: 1"
          >
            {{ AppConfig.systemInfo.name }}
          </p>
        </div>

        <ElMenu
          :class="'el-menu-' + getMenuTheme.theme"
          :default-active="routerPath"
          :text-color="getMenuTheme.textColor"
          :background-color="getMenuTheme.background"
          :default-openeds="defaultOpenedMenus"
          :popper-class="`menu-left-popper menu-left-${getMenuTheme.theme}-popper`"
          :show-timeout="50"
          :hide-timeout="50"
        >
          <SidebarSubmenu :list="menuList" :isMobile="isMobileMode" :theme="getMenuTheme" />
        </ElMenu>
      </ElScrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
  import AppConfig from '@/config'
  import { useSettingStore } from '@/store/modules/setting'
  import { MenuTypeEnum, MenuWidth } from '@/enums/appEnum'
  import { useMenuStore } from '@/store/modules/menu'
  import { isIframe } from '@/utils/navigation'
  import { handleMenuJump } from '@/utils/navigation'
  import SidebarSubmenu from './widget/SidebarSubmenu.vue'
  import { useCommon } from '@/hooks/core/useCommon'
  import { useWindowSize, useTimeoutFn } from '@vueuse/core'

  defineOptions({ name: 'ArtSidebarMenu' })

  const MOBILE_BREAKPOINT = 800
  const ANIMATION_DELAY = 350
  const MENU_CLOSE_WIDTH = MenuWidth.CLOSE

  const route = useRoute()
  const router = useRouter()
  const settingStore = useSettingStore()

  const { getMenuOpenWidth, menuType, getMenuTheme } = storeToRefs(settingStore)

  // 组件内部状态
  const defaultOpenedMenus = ref<string[]>([])
  const isMobileMode = ref(false)
  const showMobileModal = ref(false)

  // 使用 VueUse 的窗口尺寸监听
  const { width } = useWindowSize()

  // 菜单宽度相关
  const menuopenwidth = computed(() => getMenuOpenWidth.value)
  const menuclosewidth = computed(() => MENU_CLOSE_WIDTH)

  // 路由相关
  const routerPath = computed(() => String(route.meta.activePath || route.path))

  // 菜单数据
  const firstLevelMenus = computed(() => {
    return useMenuStore().menuList.filter((menu) => !menu.meta.isHide)
  })

  const menuList = computed(() => {
    const menuStore = useMenuStore()
    const allMenus = menuStore.menuList

    // 处理 iframe 路径
    if (isIframe(route.path)) {
      return findIframeMenuList(route.path, allMenus)
    }

    // 处理一级菜单
    if (route.meta.isFirstLevel) {
      return []
    }

    // 返回当前顶级路径对应的子菜单
    const currentTopPath = `/${route.path.split('/')[1]}`
    const currentMenu = allMenus.find((menu) => menu.path === currentTopPath)
    return currentMenu?.children ?? []
  })

  /**
   * 延迟隐藏移动端模态框（使用 VueUse 的 useTimeoutFn）
   */
  const { start: delayHideMobileModal } = useTimeoutFn(
    () => {
      showMobileModal.value = false
    },
    ANIMATION_DELAY,
    { immediate: false }
  )

  /**
   * 查找 iframe 对应的二级菜单列表
   */
  const findIframeMenuList = (currentPath: string, menuList: any[]) => {
    // 递归查找包含当前路径的菜单项
    const hasPath = (items: any[]): boolean => {
      for (const item of items) {
        if (item.path === currentPath) {
          return true
        }
        if (item.children && hasPath(item.children)) {
          return true
        }
      }
      return false
    }

    // 遍历一级菜单查找匹配的子菜单
    for (const menu of menuList) {
      if (menu.children && hasPath(menu.children)) {
        return menu.children
      }
    }
    return []
  }

  const { homePath } = useCommon()

  /**
   * 导航到首页
   */
  const navigateToHome = (): void => {
    router.push(homePath.value)
  }
</script>

<style lang="scss" scoped>
  @use './style';
</style>

<style lang="scss">
  @use './theme';

  .layout-sidebar {
    // 展开的宽度
    .el-menu:not(.el-menu--collapse) {
      width: v-bind(menuopenwidth);
    }

    // 折叠后宽度
    .el-menu--collapse {
      width: v-bind(menuclosewidth);
    }
  }
</style>

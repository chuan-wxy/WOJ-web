import { SETTING_DEFAULT_CONFIG } from '@/config/setting'
import { setElementThemeColor } from '@utils/ui'
import { ContainerWidthEnum, SystemThemeEnum } from '@/enums/appEnum'
import { StorageConfig } from '@utils/storage/storage-config'
import { MenuThemeType } from '@/types/store'
import AppConfig from '@/config'

export const useSettingStore = defineStore(
  'settingStore',
  () => {
    // 菜单相关设置
    /** 菜单类型 */
    const menuType = ref(SETTING_DEFAULT_CONFIG.menuType)
    /** 菜单展开宽度 */
    const menuOpenWidth = ref(SETTING_DEFAULT_CONFIG.menuOpenWidth)
    /** 菜单是否展开 */
    const menuOpen = ref(SETTING_DEFAULT_CONFIG.menuOpen)
    /** 双菜单是否显示文本 */
    const dualMenuShowText = ref(SETTING_DEFAULT_CONFIG.dualMenuShowText)

    /** 是否显示进度条 */
    const showNprogress = ref(SETTING_DEFAULT_CONFIG.showNprogress)

    // 主题相关设置
    /** 系统主题类型 */
    const systemThemeType = ref(SETTING_DEFAULT_CONFIG.systemThemeType)
    /** 系统主题模式 */
    const systemThemeMode = ref(SETTING_DEFAULT_CONFIG.systemThemeMode)
    /** 菜单主题类型 */
    const menuThemeType = ref(SETTING_DEFAULT_CONFIG.menuThemeType)
    /** 系统主题颜色 */
    const systemThemeColor = ref(SETTING_DEFAULT_CONFIG.systemThemeColor)

    // 功能设置
    /** 是否刷新 */
    const refresh = ref(SETTING_DEFAULT_CONFIG.refresh)

    // 样式设置
    /** 边框模式 */
    const boxBorderMode = ref(SETTING_DEFAULT_CONFIG.boxBorderMode)
    /** 页面过渡效果 */
    const pageTransition = ref(SETTING_DEFAULT_CONFIG.pageTransition)
    /** 自定义圆角 */
    const customRadius = ref(SETTING_DEFAULT_CONFIG.customRadius)
    /** 容器宽度 */
    const containerWidth = ref(SETTING_DEFAULT_CONFIG.containerWidth)

    /**
     * 设置Element Plus主题颜色
     * @param theme 主题颜色
     */
    const setElementTheme = (theme: string) => {
      systemThemeColor.value = theme
      setElementThemeColor(theme)
    }

    /**
     * 设置全局主题
     * @param theme 主题类型
     * @param themeMode 主题模式
     */
    const setGlopTheme = (theme: SystemThemeEnum, themeMode: SystemThemeEnum) => {
      systemThemeType.value = theme
      systemThemeMode.value = themeMode
      localStorage.setItem(StorageConfig.THEME_KEY, theme)
    }

    /**
     * 获取自定义圆角
     */
    const getCustomRadius = computed((): string => {
      return customRadius.value + 'rem' || SETTING_DEFAULT_CONFIG.customRadius + 'rem'
    })

    /**
     * 获取菜单展开宽度
     */
    const getMenuOpenWidth = computed((): string => {
      return menuOpenWidth.value + 'px' || SETTING_DEFAULT_CONFIG.menuOpenWidth + 'px'
    })

    /**
     * 获取菜单主题
     * 根据当前主题类型和暗色模式返回对应的主题配置
     */
    const getMenuTheme = computed((): MenuThemeType => {
      const list = AppConfig.themeList.filter((item) => item.theme === menuThemeType.value)
      if (isDark.value) {
        return AppConfig.darkMenuStyles[0]
      } else {
        return list[0]
      }
    })

    /**
     * 判断是否为暗色模式
     */
    const isDark = computed((): boolean => {
      return systemThemeType.value === SystemThemeEnum.DARK
    })

    /**
     * 设置自定义圆角
     * @param radius 圆角值
     */
    const setCustomRadius = (radius: string) => {
      customRadius.value = radius
      document.documentElement.style.setProperty('--custom-radius', `${radius}rem`)
    }

    /**
     * 刷新页面
     */
    const reload = () => {
      refresh.value = !refresh.value
    }

    /**
     * 设置容器宽度
     * @param width 容器宽度枚举值
     */
    const setContainerWidth = (width: ContainerWidthEnum) => {
      containerWidth.value = width
    }
    return {
      showNprogress,
      systemThemeType,
      systemThemeMode,
      menuThemeType,
      systemThemeColor,
      setElementTheme,
      setGlopTheme,
      getCustomRadius,
      setCustomRadius,
      refresh,
      boxBorderMode,
      pageTransition,
      customRadius,
      containerWidth,
      setContainerWidth,
      reload,
      getMenuOpenWidth,
      menuType,
      getMenuTheme
    }
  },
  {
    persist: {
      key: 'setting',
      storage: localStorage
    }
  }
)

/**
 * useHeaderBar - 顶部栏功能管理
 *
 * 统一管理顶部栏各个功能模块的显示状态和配置信息。
 * 提供灵活的功能开关控制，支持动态显示/隐藏顶部栏的各个功能按钮。
 *
 * ## 主要功能
 *
 * 1. 功能开关控制 - 统一管理菜单按钮、刷新按钮、快速入口等功能的显示状态
 * 2. 配置信息获取 - 获取各个功能模块的详细配置信息
 * 3. 功能列表查询 - 快速获取所有启用或禁用的功能列表
 * 4. 响应式状态 - 所有状态自动响应配置和 store 变化
 *
 * @module useHeaderBar
 * @author Art Design Pro Team
 */

import { computed } from 'vue'
import { useSettingStore } from '@/store/modules/setting'
import { headerBarConfig } from '@/config/modules/headerBar'
import { HeaderBarFeatureConfig } from '@/types/config'

/**
 * 顶部栏功能管理
 * @returns 顶部栏功能相关的状态和方法
 */
export function useHeaderBar() {
  const settingStore = useSettingStore()

  // 获取顶部栏配置
  const headerBarConfigRef = computed<HeaderBarFeatureConfig>(() => headerBarConfig)

  /**
   * 检查特定功能是否启用
   * @param feature 功能名称
   * @returns 是否启用
   */
  const isFeatureEnabled = (feature: keyof HeaderBarFeatureConfig): boolean => {
    return headerBarConfigRef.value[feature]?.enabled ?? false
  }

  /**
   * 获取功能配置信息
   * @param feature 功能名称
   * @returns 功能配置信息
   */
  const getFeatureConfig = (feature: keyof HeaderBarFeatureConfig) => {
    return headerBarConfigRef.value[feature]
  }

  // 获取快速入口的最小宽度
  const fastEnterMinWidth = computed(() => {
    const config = getFeatureConfig('fastEnter')
    return (config as any)?.minWidth || 1200
  })

  /**
   * 检查功能是否启用（别名）
   * @param feature 功能名称
   * @returns 是否启用
   */
  const isFeatureActive = (feature: keyof HeaderBarFeatureConfig): boolean => {
    return isFeatureEnabled(feature)
  }

  /**
   * 获取功能配置（别名）
   * @param feature 功能名称
   * @returns 功能配置
   */
  const getFeatureInfo = (feature: keyof HeaderBarFeatureConfig) => {
    return getFeatureConfig(feature)
  }

  /**
   * 获取所有启用的功能列表
   * @returns 启用的功能名称数组
   */
  const getEnabledFeatures = (): (keyof HeaderBarFeatureConfig)[] => {
    return Object.keys(headerBarConfigRef.value).filter(
      (key) => headerBarConfigRef.value[key as keyof HeaderBarFeatureConfig]?.enabled
    ) as (keyof HeaderBarFeatureConfig)[]
  }

  /**
   * 获取所有禁用的功能列表
   * @returns 禁用的功能名称数组
   */
  const getDisabledFeatures = (): (keyof HeaderBarFeatureConfig)[] => {
    return Object.keys(headerBarConfigRef.value).filter(
      (key) => !headerBarConfigRef.value[key as keyof HeaderBarFeatureConfig]?.enabled
    ) as (keyof HeaderBarFeatureConfig)[]
  }

  /**
   * 获取所有启用的功能（别名）
   * @returns 启用的功能列表
   */
  const getActiveFeatures = () => {
    return getEnabledFeatures()
  }

  /**
   * 获取所有禁用的功能（别名）
   * @returns 禁用的功能列表
   */
  const getInactiveFeatures = () => {
    return getDisabledFeatures()
  }

  return {
    // 配置
    headerBarConfig: headerBarConfigRef,

    // 配置相关
    fastEnterMinWidth, // 快速入口最小宽度

    // 方法
    isFeatureEnabled, // 检查功能是否启用
    isFeatureActive, // 检查功能是否启用（别名）
    getFeatureConfig, // 获取功能配置
    getFeatureInfo, // 获取功能配置（别名）
    getEnabledFeatures, // 获取所有启用的功能
    getDisabledFeatures, // 获取所有禁用的功能
    getActiveFeatures, // 获取所有启用的功能（别名）
    getInactiveFeatures // 获取所有禁用的功能（别名）
  }
}

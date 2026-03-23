import { defineAsyncComponent } from 'vue'

/**
 * 全局组件配置列表
 */
export const globalComponentsConfig: GlobalComponentConfig[] = [
  {
    name: '聊天窗口',
    key: 'chat-window',
    component: defineAsyncComponent(() => import('@/components/layouts/ai-chat-window/index.vue')),
    enabled: true
  }
]

/**
 * 全局组件配置接口
 */
export interface GlobalComponentConfig {
  /** 组件名称 */
  name: string
  /** 组件标识 */
  key: string
  /** 组件 */
  component: any
  /** 是否启用 */
  enabled?: boolean
  /** 组件描述 */
  description?: string
}

/**
 * 获取启用的全局组件
 * @returns 已启用的组件配置列表
 */
export const getEnabledGlobalComponents = () => {
  return globalComponentsConfig.filter((config) => config.enabled !== false)
}

/**
 * 根据 key 获取组件配置
 * @param key 组件标识
 * @returns 组件配置对象
 */
export const getGlobalComponentByKey = (key: string) => {
  return globalComponentsConfig.find((config) => config.key === key)
}

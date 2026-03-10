import { defineStore } from 'pinia'

export const useCommonStore = defineStore(
  'commonStore',
  () => {
    // 激活索引
    const activeIndexOfBar = ref(0)
    // 风格
    const webStyle = ref(0)
    // 设置激活索引
    const setActiveIndex = (index: number) => {
      activeIndexOfBar.value = index
    }

    return {
      activeIndexOfBar,
      webStyle,
      setActiveIndex
    }
  },
  {
    persist: {
      key: 'common',
      storage: localStorage
    }
  }
)

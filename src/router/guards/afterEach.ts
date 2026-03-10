import { Router } from 'vue-router'
import { getPendingLoading, resetPendingLoading } from '@/router/guards/beforeEach'
import { loadingService } from '@utils/ui'

/** 路由全局后置守卫 */
export function setupAfterEachGuard(router: Router) {
  // const { scrollToTop } = useCommon()

  router.afterEach(() => {
    console.log('afterEachGuard')

    // todo
    //   scrollToTop()
    //
    //   // 关闭进度条
    //   const settingStore = useSettingStore()
    //   if (settingStore.showNprogress) {
    //     NProgress.done()
    //     // 确保进度条完全移除，避免残影
    //     setTimeout(() => {
    //       NProgress.remove()
    //     }, 600)
    //   }
    //
    // 关闭 loading 效果
    if (getPendingLoading()) {
      nextTick(() => {
        loadingService.hideLoading()
        resetPendingLoading()
      })
    }
  })
}

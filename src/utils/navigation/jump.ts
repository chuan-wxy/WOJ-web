import { AppRouteRecord } from '@/types/router'
import { router } from '@/router'

// 打开外部链接
export const openExternalLink = (link: string) => {
  window.open(link, '_blank')
}

/**
 * 菜单跳转
 * @param item 菜单项
 * @param jumpToFirst 是否跳转到第一个子菜单
 * @returns
 */
export const handleMenuJump = (item: AppRouteRecord, jumpToFirst: boolean = false) => {
  const { link, isIframe } = item.meta

  // 外部链接
  if (link && !isIframe) {
    return openExternalLink(link)
  }

  // 直接跳转当前菜单
  if (!jumpToFirst || !item.children?.length) {
    if (router.currentRoute.value.path !== item.path) {
      return router.push(item.path)
    }
    return
  }

  const findFirstLeafMenu = (items: AppRouteRecord[]): AppRouteRecord => {
    for (const child of items) {
      if (!child.meta.isHide) {
        return child.children?.length ? findFirstLeafMenu(child.children) : child
      }
    }
    return items[0]
  }

  const firstChild = findFirstLeafMenu(item.children)

  if (firstChild.meta?.link) {
    return openExternalLink(firstChild.meta.link)
  }

  if (router.currentRoute.value.path !== firstChild.path) {
    router.push(firstChild.path)
  }
}

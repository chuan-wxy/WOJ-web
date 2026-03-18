import { useUserStore } from '@/store/modules/user' // 根据你实际的 store 路径修改
export function useUser() {
  const userStore = useUserStore()

  const hasRole = (value: string | string[]): boolean => {
    const roles = userStore.userInfo.roles || []

    if (Array.isArray(value)) {
      if (value.length === 0) return true
      return roles.some((role) => value.includes(role))
    } else {
      return roles.includes(value)
    }
  }

  return {
    hasRole
  }
}

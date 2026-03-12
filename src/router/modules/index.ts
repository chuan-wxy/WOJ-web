import { AppRouteRecord } from '@/types/router'
import { problemRoutes } from '@/router/modules/problem'
import { adminRoutes } from '@/router/modules/admin'
import { systemRoutes } from '@/router/modules/system'

/**
 * 导出所有模块化路由
 */
export const routeModules: AppRouteRecord[] = [problemRoutes, adminRoutes, systemRoutes]

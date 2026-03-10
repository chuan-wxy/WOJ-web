import { AppRouteRecord } from '@/types/router'
import { dashboardRoutes } from './dashboard'
import { problemRoutes } from '@/router/modules/problem'
import { adminRoutes } from '@/router/modules/admin'

/**
 * 导出所有模块化路由
 */
export const routeModules: AppRouteRecord[] = [problemRoutes, adminRoutes]

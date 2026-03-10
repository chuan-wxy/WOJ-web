export class StorageConfig {
  /** 当前应用版本 */
  static readonly CURRENT_VERSION = __APP_VERSION__

  /** 存储键前缀 */
  static readonly STORAGE_PREFIX = 'sys-v'

  /** 版本键名 */
  static readonly VERSION_KEY = 'sys-version'

  /** 主题键名（index.html中使用了，如果修改，需要同步修改） */
  static readonly THEME_KEY = 'sys-theme'

  /** 上次登录用户ID键名（用于判断是否为同一用户登录） */
  static readonly LAST_USER_ID_KEY = 'sys-last-user-id'

  /** 跳过升级检查的版本 */
  static readonly SKIP_UPGRADE_VERSION = '1.0.0'

  /** 升级处理延迟时间（毫秒） */
  static readonly UPGRADE_DELAY = 1000

  /** 登出延迟时间（毫秒） */
  static readonly LOGOUT_DELAY = 1000

  /**
   * 生成版本化的存储键名
   * @param storeId 存储ID
   * @param version 版本号，默认使用当前版本
   */
  static generateStorageKey(storeId: string, version: string = this.CURRENT_VERSION): string {
    return `${this.STORAGE_PREFIX}${version}-${storeId}`
  }

  /**
   * 创建存储键匹配的正则表达式
   * @param storeId 存储ID
   */
  static createKeyPattern(storeId: string): RegExp {
    return new RegExp(`^${this.STORAGE_PREFIX}[^-]+-${storeId}$`)
  }
}

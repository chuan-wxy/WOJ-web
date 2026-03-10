import { createPinia } from 'pinia'
import type { App } from 'vue'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import { StorageKeyManager } from '@/utils/storage/storage-key-manager'

export const store = createPinia()

// 创建存储键管理器实例
const storageKeyManager = new StorageKeyManager()

store.use(
  createPersistedState({
    key: (storeId: string) => storageKeyManager.getStorageKey(storeId),
    storage: localStorage,
    serializer: {
      serialize: JSON.stringify,
      deserialize: JSON.parse
    }
  })
)

export function initPinia(app: App) {
  app.use(store)
}

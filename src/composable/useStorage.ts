import { InjectionKey, inject, reactive } from 'vue'


export interface StorageData {
}

export const storageSymbol: InjectionKey<StorageData> = Symbol()

export function initStorage(): StorageData {
  return reactive({
  })
}

export function useStorage() {
  const storage = inject(storageSymbol)
  if (!storage) {
    throw new Error('Storage not properly injected in app')
  }
  return storage
}
import { InjectionKey, ref, computed, inject, reactive, ReactiveEffect } from 'vue'
import { useStorage } from '@vueuse/core'


export interface UserData { 
  id?: number,
  first_name?: string,
  second_name?: string,
  email?: string,
}

export interface AuthApiData {
  user_session: UserSessionData,
}

export interface UserSessionData {
  refresh_token: string,
  access_token: string,
  access_token_timestamp: number|null,
  user?: UserData,
  isLoggedIn: boolean,
}

export const userSessionSymbol: InjectionKey<UserSessionData> = Symbol()


export function initUserSession(): UserSessionData {
  const refresh_token = useStorage('refresh_token', '')
  const access_token = useStorage('access_token', '')
  const access_token_timestamp = useStorage<number>('access_token_timestamp', null)
  const user = ref<UserData>({});
  const isLoggedIn = computed(() => Boolean(access_token.value))
    
  return reactive({
    refresh_token,
    access_token,
    access_token_timestamp,
    user,
    isLoggedIn
  }) 
}

export function useUserSession() {
  const userSession = inject(userSessionSymbol)
  if (!userSession) {
      throw new Error('UserSession not properly injected in app')
  }
  return userSession
}
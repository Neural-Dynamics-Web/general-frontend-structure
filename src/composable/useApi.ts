import { InjectionKey, inject } from 'vue'
import axios, { Axios }  from 'axios'
import { useI18n } from 'vue-i18n'

import useNotyf from './useNotyf'
import { UserSessionData } from './useUserAPI'


export const apiSymbol: InjectionKey<Axios> = Symbol()
export const API_ROOT = import.meta.env.VITE_API_ROOT
const notyf = useNotyf()
const { locale } = useI18n()


export function initApi(session: UserSessionData) {
    const api = axios.create({
      baseURL: `${API_ROOT}/api/frontend/`,
      headers:{
        'Accept-Language':locale.value
      }
    })

    const fetchAccessToken = async() => {   
      const current_timestamp = (new Date()).getTime()
      const access_timestamp = session.access_token_timestamp;
    
      if(!access_timestamp) return Promise.reject("No auth data exists")
    
      // if token lifetime < 5 min
      if (Math.abs((current_timestamp - access_timestamp) / 1000) < 4.5*60) {
        return session.access_token
      }

      try {
        const { data } = await api.post(
          'token/refresh/',
          {"refresh":session.refresh_token},
          { noAuth: true }
        )
        session.access_token = data.access
        session.access_token_timestamp = (new Date()).getTime()
        return session.access_token
      } catch (error:any) {
        return Promise.reject(error)
      }
    }

    api.interceptors.request.use(async (config:any) => {
      if(!config.noAuth === true){
        const access_token = await fetchAccessToken()
        config.headers.common.Authorization = `Bearer ${access_token}`
      }

      if(config.params == undefined) config.params = {}
      
      if(config.method === 'get'){
        config.params['t'] = (new Date()).getTime();
      }
      
      return config
    })
  
    api.interceptors.response.use(
      (response:any) => {
        if (response.data?.success === false) {
          return Promise.reject(response.data.error)
        }
        return Promise.resolve(response)
      },
      (error:any) => {
        if (error.request && error.request.status === 500) {
          notyf.error("Server error")
          return Promise.reject(error)
        }else{
          return Promise.reject(error)
        }
    });

    return api
}


export function useApi() {
    const api = inject(apiSymbol)
    if (!api) {
        throw new Error('Api not properly injected in app')
    }
    return api
}
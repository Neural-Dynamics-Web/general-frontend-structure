import {
  createApp as createClientApp,
  resolveDynamicComponent,
  h,
  VNode,
  provide,
  Transition
} from 'vue'

import { createI18n } from './i18n'
import { RouterView } from 'vue-router'
import { createRouter } from './router'
import Multiselect from "multiselect"
import useNotyf from '/@src/composable/useNotyf'

import {
  initSession,
  sessionSymbol,
} from './composable/useSession'
import { initApi, apiSymbol } from '/@src/composable/useApi'
import { initStorage, storageSymbol } from "/@src/composable/useStorage"


async function createApp() {
  const i18n = createI18n()
  const router = createRouter()
  const session = initSession()
  const storage = initStorage()
  const api = initApi(session, i18n.global.locale)

  if (session.isLoggedIn) {
    // there you should fetch user to check
    // if tokens are fresh
  }

  const app = createClientApp({
    setup() {
      provide(apiSymbol, api)
      provide(sessionSymbol, session)
      provide(storageSymbol, storage)

      return () => {
        const defaultSlot = ({ Component: _Component }: any) => {
          const Component = resolveDynamicComponent(_Component) as VNode

          return [
            h(
              Transition,
              {
                name: 'fade-slow', mode: 'out-in'
              },
              {
                default: () => [h(Component)],
              }
            ),
          ]
        }

        return [
          h(RouterView, null, {
            default: defaultSlot,
          }),
        ]
      }
    },
  })

  router.beforeEach((to, from) => {
    if (to.meta.requiresAuth && !session.isLoggedIn) {
      const notif = useNotyf()
      notif.error(
        "You don't have access to this page",
        2000
      )

      return {
        name: 'index-login',
        query: {
          next: to.fullPath
        }
      }
    }
  })

  // @ts-expect-error
  Multiselect.props.noOptionsText.default = i18n.global.t('multiselect.noOptions')
  // @ts-expect-error
  Multiselect.props.noResultsText.default = i18n.global.t('multiselect.noResults')

  // global components injections
  app.component('Multiselect', Multiselect)

  // packages use
  app.use(router)
  app.use(i18n)

  return app
}


const app = await createApp()
app.mount('#app')
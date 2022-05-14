import { useStorage } from '@vueuse/core'
import { createI18n as createClientI18n } from 'vue-i18n'
import messages from '@intlify/vite-plugin-vue-i18n/messages'


const locales = ['en','uk'] as const
const fallbackLocale = 'uk'
type localeType = typeof locales[number]


export function createI18n() {
  const navigatorLanguage: localeType = navigator?.language.slice(0, 2) as localeType || fallbackLocale
  const defaultLocale = useStorage<localeType>(
    'locale',
    // check if navigator lang exists in languages list
    // or set default to uk
    locales.includes(navigatorLanguage) ? navigatorLanguage : fallbackLocale
  )

  const i18n = createClientI18n({
    globalInjection: true,
    locale: defaultLocale.value,
    fallbackLocale: fallbackLocale,
    messages
  })
  return i18n
}
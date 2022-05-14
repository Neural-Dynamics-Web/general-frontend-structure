import * as validators from '@vuelidate/validators'
import { i18n } from "/@src/i18n"

const { createI18nMessage } = validators

const { t } = i18n.global || i18n;

const withI18nMessage = createI18nMessage({ t })

export const required = withI18nMessage(validators.required)
export const email = withI18nMessage(validators.email)
export const url = withI18nMessage(validators.url)
export const minLength = withI18nMessage(validators.minLength, { withArguments: true })
export const maxLength = withI18nMessage(validators.maxLength, { withArguments: true })
export const minValue = withI18nMessage(validators.minValue, { withArguments: true })
export const requiredIf = withI18nMessage(validators.requiredIf, { withArguments: true })
export const sameAs = withI18nMessage(validators.sameAs, { withArguments: true })
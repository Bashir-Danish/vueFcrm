import { createI18n } from 'vue-i18n'
import messages from '@/i18n/langs'

// Get stored language from localStorage
const storedLanguage = localStorage.getItem('language')
const defaultLanguage = 'en'

// Extract language code from stored format (e.g., 'language_fa' -> 'fa')
const getLanguageCode = (lang: string | null): string => {
  if (!lang) return defaultLanguage
  return lang.startsWith('language_') ? lang.substring(9) : lang
}

// Set initial language and direction
const initialLanguage = getLanguageCode(storedLanguage)
document.documentElement.dir = initialLanguage === 'fa' ? 'rtl' : 'ltr'
document.documentElement.lang = initialLanguage

const i18n = createI18n({
    fallbackLocale: defaultLanguage,
    globalInjection: true,
    legacy: false,
    silentFallbackWarn: true,
    fallbackWarn: false,
    silentTranslationWarn: true,
    missingWarn: false,
    locale: initialLanguage,
    messages
})

export default i18n

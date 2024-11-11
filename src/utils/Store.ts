const LANGUAGE = 'language'

export const StoreUtils = {
    getLanguage(): string | null {
        return localStorage.getItem('language')
    },

    setLanguage(language: string): void {
        localStorage.setItem('language', language)
    },

    setString(key: string, value: any): void
    {
        localStorage.setItem(key, value)
    },

    getString(key: string): string
    {
        return localStorage.getItem(key) as string
    },
}
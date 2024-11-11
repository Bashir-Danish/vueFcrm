<template>
  <Select v-model="language" @update:modelValue="injectLanguage">
    <SelectTrigger class="w-[150px]">
      <SelectValue :placeholder="$t('sidebar.language')" class="select-none"/>
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectItem class="pl-6 cursor-pointer select-none" value="language_en">English</SelectItem>
        <SelectItem class="pl-6 cursor-pointer select-none" value="language_fa">فارسی</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useI18n } from 'vue-i18n'
import { StoreUtils } from '@/utils/Store'

const language = ref(StoreUtils.getLanguage() || 'language_en')
const { locale } = useI18n()

const setDocumentDirection = (lang: string) => {
  document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr'
  document.documentElement.lang = lang
}

const injectLanguage = (language: string) => {
  StoreUtils.setLanguage(language)
  const prefix = 'language_'
  if (language.startsWith(prefix)) {
    const lang = language.substring(prefix.length)
    locale.value = lang
    setDocumentDirection(lang)
  }
}

onMounted(() => {
  // Ensure the stored language is applied on component mount
  const storedLang = StoreUtils.getLanguage()
  if (storedLang) {
    injectLanguage(storedLang)
  }
})
</script>

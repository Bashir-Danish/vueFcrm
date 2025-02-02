<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold my-4 sm:my-6 rtl:text-right">
        {{ $t('payments.list.title') }}
      </h1>
      <router-link to="/payments/payment" class="btn btn-primary">
        {{ $t('payments.list.addPayment') }}
      </router-link>
    </div>

    <PaymentsTable 
      :data="store.paymentsData" 
      :loading="loading"
      @customer-change="handleCustomerChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '@/stores/main'
import PaymentsTable from './PaymentsTable.vue'

const router = useRouter()
const store = useMainStore()
const loading = ref(true)

const handleCustomerChange = (customerId: string) => {
  fetchPaymentsData(1, store.paymentsData.limit, '', customerId)
}

const fetchPaymentsData = async (
  page: number = 1, 
  limit: number = 10, 
  search: string = '',
  customerId: string = ''
) => {
  loading.value = true
  try {
    await store.fetchPayments(page, limit, search, customerId)
  } catch (error) {
    console.error('Error fetching payments:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  loading.value = true
  try {
    await store.fetchPayments()
  } catch (error) {
    console.error('Error fetching payments:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.payments-list {
  padding: 1.5rem;
}
</style> 
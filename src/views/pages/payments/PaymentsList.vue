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

    <div class="mb-6">
      <Tabs v-model="transactionType" class="w-full">
        <TabsList class="w-full sm:w-auto mb-4">
          <TabsTrigger 
            value="all" 
            @click="handleTypeChange"
          >
            {{ $t('payments.list.allTransactions') }}
          </TabsTrigger>
          <TabsTrigger 
            value="invoice" 
            @click="handleTypeChange"
          >
            {{ $t('payments.list.invoicesOnly') }}
          </TabsTrigger>
          <TabsTrigger 
            value="payment" 
            @click="handleTypeChange"
          >
            {{ $t('payments.list.paymentsOnly') }}
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>

    <PaymentsTable 
      :data="tableData" 
      :loading="loading"
      @customer-change="handleCustomerChange"
      @page-change="handlePageChange"
      @limit-change="handleLimitChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useMainStore } from '@/stores/main'
import PaymentsTable from './PaymentsTable.vue'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useMainStore()
const loading = ref(true)
const transactionType = ref<'all' | 'invoice' | 'payment'>('all')
const currentCustomerId = ref('')

// Compute the data for the table based on transaction type
const tableData = computed(() => {
  if (!store.transactionsData || !store.transactionsData.success) {
    return {
      payments: [],
      totalCount: 0,
      page: 1,
      limit: 10,
      totalPages: 0
    }
  }

  // Format the data for PaymentsTable component
  let items = []
  
  if (transactionType.value === 'all' && store.transactionsData.transactions) {
    items = store.transactionsData.transactions
  } else if (transactionType.value === 'invoice') {
    items = store.transactionsData.invoices
  } else {
    items = store.transactionsData.payments
  }

  let totalCount = 0
  if (transactionType.value === 'all') {
    totalCount = (store.transactionsData.summary.totalInvoices || 0) + 
                (store.transactionsData.summary.totalPayments || 0)
  } else if (transactionType.value === 'invoice') {
    totalCount = store.transactionsData.summary.totalInvoices || 0
  } else {
    totalCount = store.transactionsData.summary.totalPayments || 0
  }

  return {
    payments: items,
    totalCount,
    page: store.transactionsData.pagination?.page || 1,
    limit: store.transactionsData.pagination?.limit || 10,
    totalPages: Math.ceil(totalCount / (store.transactionsData.pagination?.limit || 10))
  }
})

const handleCustomerChange = (customerId: string) => {
  currentCustomerId.value = customerId
  fetchTransactionsData(customerId, transactionType.value)
}

const handleTypeChange = () => {
  // Tab clicks will automatically update transactionType.value because of v-model
  fetchTransactionsData(currentCustomerId.value, transactionType.value)
}

const handlePageChange = (newPage: number) => {
  fetchTransactionsData(
    currentCustomerId.value, 
    transactionType.value, 
    newPage, 
    store.transactionsData.pagination?.limit || 10
  )
}

const handleLimitChange = (newLimit: number) => {
  fetchTransactionsData(
    currentCustomerId.value,
    transactionType.value,
    1, // Reset to first page when changing limit
    newLimit
  )
}

const fetchTransactionsData = async (
  customerId: string = '',
  type: 'all' | 'invoice' | 'payment' = 'all',
  page: number = 1, 
  limit: number = 10
) => {
  loading.value = true
  try {
    await store.fetchTransactions(customerId, type, page, limit)
  } catch (error) {
    console.error('Error fetching transactions:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  loading.value = true
  try {
    await store.fetchTransactions('', transactionType.value)
  } catch (error) {
    console.error('Error fetching transactions:', error)
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
<template>
  <div class="payments-list">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">{{ $t('payments.list.title') }}</h1>
      <router-link
        to="/payments/payment"
        class="btn btn-primary"
      >
        {{ $t('payments.list.addPayment') }}
      </router-link>
    </div>

    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <div class="overflow-x-auto">
          <table class="table w-full">
            <thead>
              <tr>
                <th>{{ $t('payments.list.columns.id') }}</th>
                <th>{{ $t('payments.list.columns.date') }}</th>
                <th>{{ $t('payments.list.columns.customer') }}</th>
                <th>{{ $t('payments.list.columns.amount') }}</th>
                <th>{{ $t('payments.list.columns.status') }}</th>
                <th>{{ $t('payments.list.columns.actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="6" class="text-center py-4">
                  {{ $t('common.loading') }}
                </td>
              </tr>
              <tr v-else-if="payments.length === 0">
                <td colspan="6" class="text-center py-4">
                  {{ $t('payments.list.noPayments') }}
                </td>
              </tr>
              <tr v-for="payment in payments" :key="payment.id">
                <td>{{ payment.id }}</td>
                <td>{{ formatDate(payment.date) }}</td>
                <td>{{ payment.customer }}</td>
                <td>{{ formatCurrency(payment.amount) }}</td>
                <td>
                  <span :class="getStatusClass(payment.status)">
                    {{ payment.status }}
                  </span>
                </td>
                <td>
                  <button
                    class="btn btn-sm btn-ghost"
                    @click="viewPayment(payment.id)"
                  >
                    {{ $t('common.view') }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { formatDate, formatCurrency } from '@/utils/formatters'

const router = useRouter()
const loading = ref(true)
const payments = ref([])

const getStatusClass = (status: string) => {
  const classes = {
    completed: 'badge badge-success',
    pending: 'badge badge-warning',
    failed: 'badge badge-error'
  }
  return classes[status.toLowerCase()] || 'badge'
}

const viewPayment = (id: string) => {
  router.push(`/payments/payment?id=${id}`)
}

onMounted(async () => {
  try {
    // TODO: Implement API call to fetch payments
    loading.value = false
  } catch (error) {
    console.error('Error fetching payments:', error)
    loading.value = false
  }
})
</script>

<style scoped>
.payments-list {
  padding: 1.5rem;
}
</style> 
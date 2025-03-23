<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import DataTable from '@/components/ui/data-table/DataTable.vue';
import { createColumns } from './columns';
import { useMainStore } from "@/stores/main";
import { useToast } from "@/components/ui/toast/use-toast";
import InvoiceDialog from './InvoiceDialog.vue';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-vue-next';
import ScrollArea from '@/components/ui/scroll-area/ScrollArea.vue';
import { formatCurrency } from '@/utils/formatters';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import debounce from 'lodash/debounce';
import { useI18n } from 'vue-i18n';

// Add proper interface for customer
interface Customer {
  _id: string;
  quickbooksCustomerId: string;
  name: string;
  lastName: string;
  username: string;
  companyName?: string;
  custType: 'individual' | 'business';
}

const store = useMainStore();
const { toast } = useToast();
const { t } = useI18n();

const dialogOpen = ref(false);
const selectedInvoice = ref<any>(null);

// Customer filter states
const customerSearch = ref('');
const selectedCustomer = ref('');
const customers = ref<Customer[]>([]);
const isLoadingCustomers = ref(false);
const customerSelectOpen = ref(false);
const customerSearchInputRef = ref<HTMLInputElement>();
const hasMore = ref(true);
const page = ref(1);

// Add loading state for initial customer load
// const loading = ref(false);

// Add loading state for view button
const loadingInvoiceId = ref<string | null>(null);

const handleViewInvoice = async (item: any) => {
  try {
    loadingInvoiceId.value = item.id;
    console.log('Handling view item:', item);
    
    // Different handling based on transaction type
    if (item.type === 'invoice') {
      // For invoices, use the docNumber
      const invoiceNumber = item.docNumber;
      console.log('Fetching invoice number:', invoiceNumber);
      
      const invoice = await store.fetchInvoiceByNumber(invoiceNumber);
      console.log('Fetched invoice:', invoice);

      if (!invoice) {
        toast({
          title: "Error",
          description: "Invoice not found",
          variant: "destructive",
        });
        return;
      }

      selectedInvoice.value = invoice;
      dialogOpen.value = true;
    } else if (item.type === 'payment') {
      // For payments, use the payment id or docNumber
      const paymentNumber = item.docNumber || item.id;
      console.log('Viewing payment:', paymentNumber);
      
      // If payment is linked to an invoice, get the invoice details
      if (item.linkedInvoices && item.linkedInvoices.length > 0) {
        const linkedInvoice = item.linkedInvoices[0];
        const invoice = await store.fetchInvoiceByNumber(linkedInvoice.invoiceId);
        
        if (invoice) {
          selectedInvoice.value = invoice;
          dialogOpen.value = true;
          return;
        }
      }
      
      // If no invoice was found or no linked invoices, show a toast with payment details
      toast({
        title: "Payment Details",
        description: `Payment #${paymentNumber} for ${item.amount.toFixed(2)}`,
      });
    }
  } catch (error) {
    console.error('Error fetching item details:', error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to fetch details",
      variant: "destructive",
    });
  } finally {
    loadingInvoiceId.value = null;
  }
};

// Pass loadingInvoiceId to columns
const columns = createColumns(handleViewInvoice, loadingInvoiceId);

const filterConfigs = {
  // status: [
  //   { label: 'Completed', value: 'completed' },
  //   { label: 'Pending', value: 'pending' },
  //   { label: 'Failed', value: 'failed' },
  // ]
};

// Add initial customer loading function
const loadInitialCustomers = async () => {
  try {
    isLoadingCustomers.value = true;
    const result = await store.searchInvoiceCustomers('', false);
    customers.value = result.customers;
    hasMore.value = result.customers.length === 20;
  } catch (error) {
    console.error('Error loading initial customers:', error);
    toast({
      title: 'Error',
      description: 'Failed to load customers',
      variant: 'destructive'
    });
  } finally {
    isLoadingCustomers.value = false;
  }
};

// Add watch for customerSelectOpen
watch(customerSelectOpen, async (newValue) => {
  if (newValue && customers.value.length === 0) {
    await loadInitialCustomers();
  }
});

// Load customers on component mount
onMounted(async () => {
  await loadInitialCustomers();
});

// Update the handleCustomerChange function
const handleCustomerChange = (customerId: string) => {
  selectedCustomer.value = customerId;
  customerSelectOpen.value = false; // Close dropdown after selection
  emit('customer-change', customerId);
};

// Update the loadCustomers function
const loadCustomers = async (search: string = '') => {
  if (!hasMore.value && search === customerSearch.value) return;
  
  try {
    isLoadingCustomers.value = true;
    const result = await store.searchInvoiceCustomers(search, false);
    
    if (page.value === 1) {
      customers.value = result.customers;
    } else {
      customers.value = [...customers.value, ...result.customers];
    }
    
    hasMore.value = result.customers.length === 20;
  } catch (error) {
    console.error('Error loading customers:', error);
    toast({
      title: 'Error',
      description: 'Failed to load customers',
      variant: 'destructive'
    });
  } finally {
    isLoadingCustomers.value = false;
  }
};

// Update props interface
interface Props {
  data: any;
  loading?: boolean;
}

const props = defineProps<Props>();

// Add these methods for customer filtering
const handleCustomerSearchInput = debounce(async (e: Event) => {
  const search = (e.target as HTMLInputElement).value;
  page.value = 1;
  hasMore.value = true;
  await loadCustomers(search);
}, 300);

const selectedCustomerDisplay = computed(() => {
  const customer = customers.value.find(c => c.quickbooksCustomerId === selectedCustomer.value);
  if (!customer) return '';
  return customer.custType === 'business'
    ? customer.companyName
    : `${customer.name} ${customer.lastName} (${customer.username})`;
});

const handleScroll = async (event: Event) => {
  const target = event.target as HTMLElement;
  if (
    target.scrollTop + target.clientHeight >= target.scrollHeight - 20 &&
    !isLoadingCustomers.value &&
    hasMore.value
  ) {
    page.value++;
    await loadCustomers(customerSearch.value);
  }
};

// Handle pagination changes
const handlePageChange = (page: number) => {
  emit('page-change', page);
};

// Handle limit changes
const handleLimitChange = (limit: number) => {
  emit('limit-change', limit);
};

// Define emits
const emit = defineEmits(['customer-change', 'page-change', 'limit-change']);
</script>

<template>
  <div>
    <DataTable 
      :columns="columns" 
      :data="data.payments || []"
      :filter-options="['customerName', 'docNumber', 'status', 'type']"
      :filter-configs="filterConfigs"
      :filter-counts="{}"
      :page="data.page"
      :limit="data.limit"
      :total-count="data.totalCount"
      :loading="props.loading"
      @page-change="handlePageChange"
      @limit-change="handleLimitChange"
    >
      <template #toolbar>
        <div class="flex items-center space-x-4">
          <Select v-model="selectedCustomer" @update:modelValue="handleCustomerChange">
            <SelectTrigger class="w-[300px]" @click="customerSelectOpen = !customerSelectOpen">
              <SelectValue :placeholder="t('payments.list.selectCustomer')">
                {{ selectedCustomerDisplay }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent v-if="customerSelectOpen" class="w-[var(--radix-select-trigger-width)]">
              <div class="p-2">
                <Input
                  ref="customerSearchInputRef"
                  v-model="customerSearch"
                  :placeholder="t('payments.list.searchCustomers')"
                  class="mb-2 h-8"
                  @input="handleCustomerSearchInput"
                  @click.stop
                  @keydown.stop
                />
              </div>
              <ScrollArea 
                :style="{ height: `${Math.min(customers.length * 40 + (isLoadingCustomers ? 40 : 0), 250)}px` }"
                @scroll="handleScroll"
              >
                <template v-if="!isLoadingCustomers">
                  <SelectItem
                    v-for="customer in customers"
                    :key="customer._id"
                    :value="customer.quickbooksCustomerId"
                    @click="customerSelectOpen = false"
                    tabindex="-1"
                    class="rtl:text-right w-full"
                  >
                    <span class="rtl:mr-2 ltr:ml-2">
                      {{ customer.custType === 'business' ? customer.companyName : `${customer.name} ${customer.lastName}` }}
                    </span>
                    <span class="text-muted-foreground">({{ customer.username }})</span>
                  </SelectItem>
                </template>
                <div v-if="isLoadingCustomers" class="flex justify-center items-center py-2">
                  <Loader2 class="rtl:ml-2 ltr:mr-2 h-4 w-4 animate-spin" />
                  {{ t('payments.list.loading') }}
                </div>
              </ScrollArea>
            </SelectContent>
          </Select>
        </div>
      </template>

      <!-- Add loading state template -->
      <template #loading>
        <div class="w-full h-[400px] flex items-center justify-center">
          <div class="flex flex-col items-center gap-2">
            <Loader2 class="h-8 w-8 animate-spin text-primary" />
            <span class="text-sm text-muted-foreground">
              {{ t('payments.list.loadingPayments') }}
            </span>
          </div>
        </div>
      </template>
    </DataTable>

    <InvoiceDialog
      :invoice="selectedInvoice"
      v-model:open="dialogOpen"
    />
  </div>
</template> 
<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useMainStore } from "@/stores/main";
import { useI18n } from "vue-i18n";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import InvoiceActions from "./InvoiceActions.vue";
import ScrollArea from "@/components/ui/scroll-area/ScrollArea.vue";
import { Search, SearchIcon } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-vue-next";
import type { Invoice} from "@/types/invoice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

// Add this interface definition
interface PaymentAmounts {
  [invoiceId: string]: {
    [lineItemId: string]: number;
  };
}

interface DepositAccount {
  id: string;
  name: string;
  accountType: string;
}

// Add this interface near the top with other interfaces
interface TooltipStyle {
  top: string;
  left: string;
  transform?: string;
  transition?: string;
}

const route = useRoute();
const router = useRouter();
const mainStore = useMainStore();
const { t } = useI18n();
const { toast } = useToast();

const search = ref("");
const loading = ref(false);
const reslLoading = ref(false);
const showResults = ref(false);
const showDropdown = ref(false);
const searchResults = ref<any[]>([]);
const isSearching = ref(false);
const expandedRows = ref<string>('');
const paymentAmounts = ref<PaymentAmounts>({});
const depositAccounts = ref<DepositAccount[]>([]);
const selectedDepositAccounts = ref<{ [key: string]: string }>({});
const loadingPayments = ref<{ [key: string]: boolean }>({});
const activeTooltip = ref<string | null>(null);
const tooltipStyle = ref<TooltipStyle>({
  top: '0px',
  left: '0px'
});

// Add these refs
const tooltipPosition = ref({ x: 0, y: 0 });
const tooltipTarget = ref({ x: 0, y: 0 });
const animationFrame = ref<number>();

// Add this computed property to track remaining balances
const remainingBalances = computed(() => {
  const balances: { [key: string]: { [key: string]: number } } = {};
  mainStore.invoicesData.invoices.forEach(invoice => {
    balances[invoice.id] = {};
    invoice.lineItems.forEach(item => {
      balances[invoice.id][item.id] = item.remainingBalance;
    });
  });
  return balances;
});

const toggleRow = (invoiceId: string) => {
  if (expandedRows.value === invoiceId) {
    // Closing
    expandedRows.value = '';
  } else {
    // Opening
    expandedRows.value = invoiceId;
  }
};

const isRowExpanded = (invoiceId: string) => {
  return expandedRows.value === invoiceId;
};

const fetchCustomers = async (searchTerm: string) => {
  if (searchTerm.length < 3) {
    searchResults.value = [];
    showDropdown.value = false;
    isSearching.value = false;
    return;
  }

  isSearching.value = true;
  loading.value = true;

  try {
    const response = await mainStore.searchInvoiceCustomers(searchTerm);
    searchResults.value = response?.customers || [];
    showDropdown.value = searchResults.value.length > 0;
  } catch (error) {
    console.error("Error fetching customers:", error);
    toast({
      title: t('invoices.search.error'),
      description: error instanceof Error ? error.message : 'Failed to search customers',
      variant: 'destructive'
    });
    searchResults.value = [];
  } finally {
    isSearching.value = false;
    loading.value = false;
  }
};

const selectCustomer = async (customer: any) => {
  search.value = customer.name;
  showDropdown.value = false;
  reslLoading.value = true;
  showResults.value = false; 

  try {
    await mainStore.fetchCustomerInvoices(customer.quickbooksCustomerId || customer._id);
    showResults.value = true;
    
    // Update URL with customer name
    router.replace({
      query: { 
        ...route.query,
        search: customer.name
      }
    });
  } catch (error) {
    console.error("Error fetching customer invoices:", error);
  } finally {
    reslLoading.value = false;
  }
};

// Update debounce function with proper types
const debounce = <T extends (...args: any[]) => any>(fn: T, delay: number) => {
  let timeoutId: number | undefined;
  return function (this: any, ...args: Parameters<T>) {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
    }
    timeoutId = window.setTimeout(() => {
      fn.apply(this, args);
      timeoutId = undefined;
    }, delay);
  };
};

const debouncedFetch = debounce(fetchCustomers, 300);

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest(".search-container")) {
    showDropdown.value = false;
  }
};

// Update URL when search changes
watch(() => search.value, (newValue) => {
  if (newValue.length < 3) {
    showDropdown.value = false;
    searchResults.value = [];
    showResults.value = false; 
    mainStore.invoicesData.invoices = [];
    mainStore.invoicesData.summary = {
      totalAmount: 0,
      totalBalance: 0,
      paidInvoices: 0,
      unpaidInvoices: 0,
      totalInvoices: 0,
    };
    // Remove search param from URL if empty
    router.replace({
      query: { 
        ...route.query,
        search: undefined
      }
    });
  } else {
    // Update URL with search term
    router.replace({
      query: { 
        ...route.query,
        search: newValue
      }
    });
  }
});

// Initialize from URL params
onMounted(async () => {
  const searchParam = route.query.search as string;
  if (searchParam) {
    search.value = searchParam;
    if (search.value.length >= 3) {
      fetchCustomers(search.value);
    }
  }
  document.addEventListener("click", handleClickOutside);
  await fetchDepositAccounts();

  // Hide tooltip when mouse leaves
  document.addEventListener('mouseleave', () => {
    activeTooltip.value = null;
  });

  // Update tooltip position on mouse move
  document.addEventListener('mousemove', (e) => {
    if (activeTooltip.value) {
      tooltipTarget.value = { x: e.clientX, y: e.clientY };
      if (!animationFrame.value) {
        animationFrame.value = requestAnimationFrame(updateTooltipPosition);
      }
    }
  });
});

// Clean up animation frame on tooltip hide
watch(activeTooltip, (newValue) => {
  if (!newValue && animationFrame.value) {
    cancelAnimationFrame(animationFrame.value);
    animationFrame.value = undefined;
  }
});

const getLineItemPaymentAmount = (invoiceId: string, lineItemId: string): number => {
  return paymentAmounts.value[invoiceId]?.[lineItemId] || 0;
};

const setLineItemPaymentAmount = (invoiceId: string, lineItemId: string, amount: number) => {
  if (!paymentAmounts.value[invoiceId]) {
    paymentAmounts.value[invoiceId] = {};
  }

  const maxAmount = remainingBalances.value[invoiceId]?.[lineItemId] ?? 0;
  
  // Ensure amount is not negative and doesn't exceed remaining balance
  let validAmount = Math.max(0, Math.min(amount, maxAmount));

  // If amount exceeds maximum, show warning and adjust
  if (amount > maxAmount) {
    validAmount = maxAmount;
    toast({
      title: t('invoices.payment.warning'),
      description: t('invoices.payment.amountExceedsBalance', { 
        max: formatCurrency(maxAmount) 
      }),
      variant: 'default'
    });
  }

  // Update the amount
  paymentAmounts.value[invoiceId][lineItemId] = validAmount;
};

const handleLineItemPayment = async (invoiceId: string, lineItemId: string) => {
  const paymentKey = `${invoiceId}-${lineItemId}`;
  loadingPayments.value[paymentKey] = true;

  try {
    // Check if deposit account is selected
    if (!selectedDepositAccounts.value[invoiceId]) {
      toast({
        title: t('invoices.payment.error'),
        description: t('invoices.payment.selectDepositAccount'),
        variant: 'destructive'
      });
      return;
    }

    const amount = getLineItemPaymentAmount(invoiceId, lineItemId);
    const invoice = mainStore.invoicesData.invoices.find(inv => inv.id === invoiceId);

    await mainStore.makeInvoicePayment({
      invoiceId,
      amount,
      customerId: invoice?.customerRef.value || '',
      lineItemId,
      depositToAccountId: selectedDepositAccounts.value[invoiceId]
    });

    // After successful payment
    toast({
      title: t('invoices.payment.success'),
      description: t('invoices.payment.itemPaymentSuccess', { 
        amount: formatCurrency(amount) 
      }),
      variant: 'default'
    });

    // Clear the payment amount
    setLineItemPaymentAmount(invoiceId, lineItemId, 0);

    // Refresh the invoices data
    if (invoice?.customerRef?.value) {
      await mainStore.fetchCustomerInvoices(invoice.customerRef.value);
    }

  } catch (error) {
    console.error('Payment failed:', error);
    toast({
      title: t('invoices.payment.error'),
      description: error instanceof Error ? error.message : 'Payment failed',
      variant: 'destructive'
    });
  } finally {
    loadingPayments.value[paymentKey] = false;
  }
};

const handleFullPayment = async (invoice: Invoice) => {
  try {
    if (invoice.balance <= 0) {
      toast({
        title: t('invoices.payment.error'),
        description: t('invoices.payment.alreadyPaid'),
        variant: 'destructive'
      });
      return;
    }

    // Make sure we have a customerId
    if (!invoice.customerRef?.value) {
      throw new Error('Customer ID is missing');
    }

    // Check if deposit account is selected
    if (!selectedDepositAccounts.value[invoice.id]) {
      toast({
        title: t('invoices.payment.error'),
        description: t('invoices.payment.selectDepositAccount'),
        variant: 'destructive'
      });
      return;
    }

    // Use the new full payment method
    await mainStore.makeFullPayment(
      invoice.id, 
      invoice.customerRef.value,
      selectedDepositAccounts.value[invoice.id]
    );

    toast({
      title: t('invoices.payment.success'),
      description: t('invoices.payment.fullPaymentSuccess', {
        amount: formatCurrency(invoice.balance) 
      }),
      variant: 'default'
    });

    // Refresh the invoices data
    if (invoice?.customerRef?.value) {
      await mainStore.fetchCustomerInvoices(invoice.customerRef.value);
    }

  } catch (error) {
    console.error('Full payment failed:', error);
    toast({
      title: t('invoices.payment.error'),
      description: error instanceof Error ? error.message : 'Payment failed',
      variant: 'destructive'
    });
  }
};

const handleDelete = async (invoiceId: string) => {
  if (confirm(t('invoices.confirmDelete'))) {
    try {
      console.log(`Deleting invoice ${invoiceId}`);
      const customer = searchResults.value.find(c => 
        mainStore.invoicesData.invoices.find(inv => inv.id === invoiceId)?.customer?.quickbooksCustomerId === c.id
      );
      if (customer) {
        await mainStore.fetchCustomerInvoices(customer.id);
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  }
};

const getPaymentStatusVariant = (invoice: Invoice) => {
  switch (invoice.status) {
    case 'paid':
      return 'default'
    case 'partially_paid':
      return 'secondary'
    case 'unpaid':
      return 'destructive'
    default:
      return 'default'
  }
};

const getPaymentStatusText = (invoice: Invoice) => {
  switch (invoice.status) {
    case 'paid':
      return t("invoices.status.paid")
    case 'partially_paid':
      // Calculate total paid amount
      const paidAmount = invoice.totalAmount - invoice.balance
      return `${t("invoices.status.partiallyPaid")} (${formatCurrency(paidAmount)} / ${formatCurrency(invoice.totalAmount)})`
    case 'unpaid':
      return formatCurrency(invoice.balance)
    default:
      return formatCurrency(invoice.balance)
  }
};

// Update the mousemove handler to use smooth animation
const updateTooltipPosition = () => {
  if (!activeTooltip.value) return;

  const dx = tooltipTarget.value.x - tooltipPosition.value.x;
  const dy = tooltipTarget.value.y - tooltipPosition.value.y;

  tooltipPosition.value.x += dx * 0.2; // Adjust this value to control smoothness
  tooltipPosition.value.y += dy * 0.2;

  tooltipStyle.value = {
    top: `${tooltipPosition.value.y}px`,
    left: `${tooltipPosition.value.x}px`,
    transform: 'translate(10px, 10px)',
    transition: 'none' // Remove default transitions for smoother animation
  };

  animationFrame.value = requestAnimationFrame(updateTooltipPosition);
};

// Update showTooltip function
const showTooltip = (event: MouseEvent, item: any) => {
  activeTooltip.value = item.id;
  tooltipPosition.value = { x: event.clientX, y: event.clientY };
  tooltipTarget.value = { x: event.clientX, y: event.clientY };
  tooltipStyle.value = {
    top: `${event.clientY}px`,
    left: `${event.clientX}px`,
    transform: 'translate(10px, 10px)',
    transition: 'none'
  };
};

const fetchDepositAccounts = async () => {
  try {
    depositAccounts.value = await mainStore.fetchDepositAccounts();
  } catch (error) {
    console.error('Error fetching deposit accounts:', error);
    toast({
      title: t('invoices.payment.error'),
      description: error instanceof Error ? error.message : 'Failed to fetch deposit accounts',
      variant: 'destructive'
    });
  }
};

const handleSearchInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  search.value = target.value;
  
  if (search.value.length >= 3) {
    isSearching.value = true;
    loading.value = true;
    showResults.value = false;
    debouncedFetch(search.value);
  } else {
    showDropdown.value = false;
    searchResults.value = [];
    loading.value = false;
  }
};
</script>
<template>
  <div class="container relative mx-auto px-4 sm:px-6 lg:px-8">
    <!-- <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold my-4 sm:my-6 rtl:text-right">
      {{ t("invoices.title") }}
    </h1> -->

    <!-- Search Input with Dropdown -->
    <div class="w-full search-container bg-background" style="position: sticky; top: 0; z-index: 100; padding-top: 3rem; padding-bottom: 1rem;">
      <div class="relative max-w-2xl mx-auto">
        <div
          class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
        >
          <Search class="h-5 w-5 text-gray-400" />
        </div>
        <Input
          :placeholder="$t('invoices.search.placeholder')"
          :value="search"
          @input="handleSearchInput"
          class="w-full pl-10 rtl:text-right ltr:text-left"
        >
          <template #prefix>
            <SearchIcon class="mr-2 h-4 w-4" />
          </template>
        </Input>
        <div
          v-if="loading"
          class="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <div
            class="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"
          ></div>
        </div>

        <!-- Customer Search Results Dropdown -->
        <div v-if="showDropdown && searchResults.length > 0"
            class="absolute max-w-2xl w-full mt-1 rounded-md bg-popover text-popover-foreground shadow-md border">
            <ScrollArea :class="[
                'w-full rounded-md',
                searchResults.length > 4 ? 'h-[250px]' : 'max-h-[250px]'
            ]">
                <ul class="p-1">
                    <li v-for="customer in searchResults"
                        :key="customer._id"
                        @click="selectCustomer(customer)"
                        class="w-full relative flex cursor-pointer select-none rounded-lg px-4 py-3 hover:bg-card hover:text-muted-foreground transition-all duration-200 group border border-transparent hover:border-primary/20">
                        <div class="flex flex-row items-center w-full gap-4">
                            <div class="flex-1 flex justify-between">
                                <!-- Left side: Name and username -->
                                <div class="flex flex-col w-3/3">
                                    <!-- First row: Name and Company -->
                                    <div class="flex items-center gap-2">
                                        <span class="font-medium text-base">
                                            {{ customer.custType === 'business' ? customer.companyName : customer.name }}
                                        </span>
                                        <span v-if="customer.custType === 'business'" class="text-sm text-muted-foreground">
                                            ({{ customer.fullName }})
                                        </span>
                                    </div>
                                    
                                    <!-- Second row: Username -->
                                    <div class="text-sm text-muted-foreground">
                                        <span v-if="customer.username">@{{ customer.username }}</span>
                                    </div>
                                </div>

                                <!-- Middle: Contact info -->
                                <div class="flex flex-col w-1/3 text-sm text-muted-foreground">
                                    <span v-if="customer.phones">📱 {{ customer.phones }}</span>
                                    <span v-if="customer.address">📍 {{ customer.address }}</span>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </ScrollArea>
        </div>

        <!-- Empty State -->
        <div
          v-else-if="showDropdown && searchResults.length === 0 && !isSearching"
          class="absolute max-w-lg w-full mt-1 rounded-md bg-popover text-popover-foreground shadow-md border"
        >
          <div class="p-4 text-center text-muted-foreground">
            {{ t("invoices.search.noResults") }}
          </div>
        </div>
      </div>

      <div
        v-if="search.length > 0 && search.length < 3"
        class="text-sm text-muted-foreground mt-2 text-center"
      >
        {{ t("invoices.search.minChars") }}
      </div>
    </div>

    <div class="mt-4"> <!-- Added margin to prevent content from hiding under sticky header -->
      <!-- Loading Spinner -->
      <div v-if="reslLoading" class="flex justify-center items-center py-12">
        <div
          class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"
        ></div>
      </div>

      <!-- Empty State when no search -->
      <div
        v-if="!reslLoading && !showResults && search.length === 0"
        class="flex flex-col items-center justify-center min-h-[50vh] text-center"
      >
        <SearchIcon class="h-16 w-16 text-muted-foreground mb-4" />
        <p class="text-lg text-muted-foreground">
          {{ t("invoices.search.startSearching") }}
        </p>
      </div>

    <!-- Results Section with Transition -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 transform translate-y-4"
      enter-to-class="opacity-100 transform translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 transform translate-y-0"
      leave-to-class="opacity-0 transform translate-y-4"
    >
      <div v-if="showResults && !loading">
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-16 mb-6">
          <Card>
            <CardHeader>
              <CardTitle class="text-sm font-medium">
                {{ t("invoices.summary.totalAmount") }}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">
                {{ formatCurrency(mainStore.invoicesData.summary.totalAmount) }}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle class="text-sm font-medium">
                {{ t("invoices.summary.totalBalance") }}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">
                {{
                  formatCurrency(mainStore.invoicesData.summary.totalBalance)
                }}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle class="text-sm font-medium">
                {{ t("invoices.summary.paidInvoices") }}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold text-green-600">
                {{ mainStore.invoicesData.summary.paidInvoices }}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle class="text-sm font-medium">
                {{ t("invoices.summary.unpaidInvoices") }}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold text-red-600">
                {{ mainStore.invoicesData.summary.unpaidInvoices }}
              </div>
            </CardContent>
          </Card>
        </div>

          <!-- Simple Table -->
          <div class="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{{ t("invoices.columns.number") }}</TableHead>
                  <TableHead>{{ t("invoices.columns.customer") }}</TableHead>
                  <TableHead>{{ t("invoices.columns.date") }}</TableHead>
                  <TableHead>{{ t("invoices.columns.dueDate") }}</TableHead>
                  <TableHead>{{ t("invoices.columns.totalAmount") }}</TableHead>
                  <TableHead>{{ t("invoices.columns.balance") }}</TableHead>
                  <TableHead class="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <template v-for="invoice in mainStore.invoicesData.invoices" :key="invoice.id">
                  <!-- Main Invoice Row -->
                <TableRow
                    class="cursor-pointer select-none hover:bg-muted/30"
                    @click="toggleRow(invoice.id)"
                    :class="{ 'border-b-0': isRowExpanded(invoice.id) }"
                >
                  <TableCell>{{ invoice.docNumber }}</TableCell>
                  <TableCell>{{ invoice.customerName }}</TableCell>
                  <TableCell>{{ formatDate(invoice.date) }}</TableCell>
                  <TableCell>{{ formatDate(invoice.dueDate) }}</TableCell>
                  <TableCell>{{ formatCurrency(invoice.totalAmount) }}</TableCell>
                  <TableCell>
                    <Badge
                      :variant="getPaymentStatusVariant(invoice)"
                      :class="{
                        'bg-green-500 hover:bg-green-600 text-black': invoice.status === 'paid',
                        'bg-yellow-500 hover:bg-yellow-600 text-black': invoice.status === 'partially_paid',
                        'bg-destructive hover:bg-destructive/90': invoice.status === 'unpaid'
                      }"
                    >
                      {{ getPaymentStatusText(invoice) }}
                    </Badge>
                  </TableCell>
                  <TableCell class="text-right px-5">
                    <InvoiceActions :invoice="invoice" />
                  </TableCell>
                </TableRow>

                  <!-- Expanded Line Items Row -->
                  <Transition
                    enter-active-class="transition-all duration-300 "
                    enter-from-class="max-h-0 opacity-0"
                    enter-to-class="max-h-[1000px] opacity-100"
                    leave-active-class="transition-all duration-100 "
                    leave-from-class="max-h-[1000px] opacity-100"
                    leave-to-class="max-h-0 opacity-0"
                  >
                    <TableRow v-if="isRowExpanded(invoice.id)" class="bg-muted/30 overflow-hidden">
                      <TableCell colspan="7" class="p-0">
                        <div class="p-4">
                          <!-- Line Items Section -->
                          <div class="mb-4">
                            <div class="text-sm font-medium mb-2 select-none">{{ t("invoices.lineItems.title") }}</div>
                            <div class="rounded-lg border">
                              <table class="w-full">
                                <thead>
                                  <tr class="border-b">
                                    <th class="text-left py-2 px-4">{{ t("invoices.lineItems.description") }}</th>
                                    <th class="text-right py-2 px-4">{{ t("invoices.lineItems.quantity") }}</th>
                                    <th class="text-right py-2 px-4">{{ t("invoices.lineItems.unitPrice") }}</th>
                                    <th class="text-right py-2 px-4">{{ t("invoices.lineItems.amount") }}</th>
                                    <th class="text-right py-2 px-4">{{ t("invoices.payment.title") }}</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr v-for="(item, index) in invoice.lineItems" 
                                      :key="index" 
                                      class="border-b last:border-b-0 hover:bg-muted/30">
                                    <td class="py-2 px-4">{{ item.description }}</td>
                                    <td class="text-right py-2 px-4">{{ item.quantity }}</td>
                                    <td class="text-right py-2 px-4">{{ formatCurrency(item.unitPrice) }}</td>
                                    <td class="py-2 px-4">
                                      <div class="flex flex-col items-end relative group">
                                        <!-- Amount display -->
                                        <span 
                                          class="cursor-help font-medium" 
                                          @mouseover="item.payments?.length ? showTooltip($event, item) : null"
                                          @mouseleave="activeTooltip = null"
                                        >
                                          {{ formatCurrency(item.amount) }}
                                        </span>

                                        <!-- Hover card with payment history - positioned relative to cursor -->
                                        <div v-if="activeTooltip === item.id && item.payments?.length" 
                                             :style="tooltipStyle"
                                             class="fixed w-64 p-3 bg-card rounded-lg shadow-lg border border-border/50 z-[100] pointer-events-none">
                                          <div class="text-xs space-y-2">
                                            <div class="font-semibold text-sm mb-2 text-foreground/90 border-b pb-2">
                                              {{ t('invoices.payment.history') }}
                                            </div>
                                            <div v-for="(payment, pIndex) in item.payments" 
                                                 :key="pIndex" 
                                                 class="flex justify-between py-1 hover:bg-muted/50 rounded px-1">
                                              <span class="text-muted-foreground">{{ formatDate(payment.date) }}</span>
                                              <span class="font-medium text-foreground">{{ formatCurrency(payment.amount) }}</span>
                                            </div>
                                          </div>
                                        </div>

                                        <!-- Show paid and remaining amounts only if not fully paid -->
                                        <template v-if="item.remainingBalance > 0">
                                          <div class="text-sm space-y-1">
                                            <div v-if="item.paidAmount > 0" class="text-green-500">
                                              {{ t('invoices.payment.paidAmount', { amount: formatCurrency(item.paidAmount) }) }}
                                            </div>
                                            <div class="text-red-500">
                                              {{ t('invoices.payment.balanceAmount', { amount: formatCurrency(item.remainingBalance) }) }}
                                            </div>
                                          </div>
                                        </template>
                                      </div>
                                    </td>
                                    <td class="py-2 px-4">
                                      <div class="flex items-center justify-end gap-2">
                                        <!-- Only show input and button if not fully paid -->
                                        <template v-if="item.remainingBalance > 0">
                                          <Select
                                            v-model="selectedDepositAccounts[invoice.id]"
                                            :disabled="!!selectedDepositAccounts[invoice.id]"
                                          >
                                            <SelectTrigger class="w-[200px]">
                                              <SelectValue :placeholder="t('payments.receive.selectDepositAccount')" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem 
                                                v-for="account in depositAccounts" 
                                                :key="account.id" 
                                                :value="account.id"
                                              >
                                                {{ account.name }} ({{ account.accountType }})
                                              </SelectItem>
                                            </SelectContent>
                                          </Select>
                                          <Input
                                            type="number"
                                            :placeholder="t('invoices.payment.amount')"
                                            :value="getLineItemPaymentAmount(invoice.id, item.id)"
                                            @input="(e: Event) => {
                                              const input = e.target as HTMLInputElement;
                                              const newValue = Number(input.value);
                                              setLineItemPaymentAmount(invoice.id, item.id, newValue);
                                              // Force update input value to show validated amount
                                              input.value = getLineItemPaymentAmount(invoice.id, item.id).toString();
                                            }"
                                            class="w-24 text-right focus:ring focus:ring-opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            :min="0"
                                            :max="remainingBalances[invoice.id]?.[item.id] ?? 0"
                                            step="0.01"
                                          />
                                          <Button 
                                            variant="default" 
                                            size="sm"
                                            @click.stop="handleLineItemPayment(invoice.id, item.id)"
                                            :disabled="!getLineItemPaymentAmount(invoice.id, item.id) || 
                                                       getLineItemPaymentAmount(invoice.id, item.id) <= 0 ||
                                                       loadingPayments[`${invoice.id}-${item.id}`]"
                                            class="whitespace-nowrap"
                                          >
                                            <template v-if="loadingPayments[`${invoice.id}-${item.id}`]">
                                              <span class="inline-block animate-spin mr-2">
                                                <svg class="h-4 w-4" viewBox="0 0 24 24">
                                                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                                </svg>
                                              </span>
                                              <!-- {{ t('invoices.common.processing') }} -->
                                            </template>
                                            <template v-else>
                                              {{ t("invoices.payment.payItem") }}
                                            </template>
                                          </Button>
                                        </template>
                                        
                                        <!-- Show only paid status if fully paid -->
                                        <div v-else class="text-green-500 font-medium">
                                          {{ t("invoices.payment.paidStatus") }}
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                                <tfoot>
                                  <tr class="border-t font-medium">
                                    <td colspan="3" class="py-2 px-4 text-right">{{ t("invoices.total") }}:</td>
                                    <td class="py-2 px-4 text-right">{{ formatCurrency(invoice.totalAmount) }}</td>
                                    <td class="py-2 px-4">
                                      <div class="flex items-center justify-end gap-2">
                                        <!-- Only show buttons if invoice has remaining balance -->
                                        <template v-if="invoice.balance > 0">
                                          <Button 
                                            variant="default" 
                                            size="sm"
                                            @click.stop="handleFullPayment(invoice)"
                                            class="whitespace-nowrap"
                                          >
                                            {{ t("invoices.payment.payFull") }}
                                          </Button>
                                          <Button 
                                            variant="destructive" 
                                            size="icon"
                                            @click.stop="handleDelete(invoice.id)"
                                            class="h-8 w-8"
                                          >
                                            <Trash2Icon class="h-4 w-4" />
                                          </Button>
                                        </template>
                                      </div>
                                    </td>
                                  </tr>
                                </tfoot>
                              </table>
                            </div>
                            
                            <!-- Memo Section -->
                            <div class="mt-3 text-sm text-muted-foreground" v-if="invoice.memo">
                              <strong>{{ t("invoices.memo") }}:</strong> {{ invoice.memo }}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  </Transition>
                </template>
                <TableRow
                  v-if="!loading && mainStore.invoicesData.invoices.length === 0"
                >
                  <TableCell
                    colspan="7"
                    class="text-center py-4 text-muted-foreground"
                  >
                    {{ t("dataTable.noResults") }}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.search-container {
  position: relative;
}

/* Add smooth transitions */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.transition-all {
  transition-property: all;
}

.duration-300 {
  transition-duration: 300ms;
}

.duration-200 {
  transition-duration: 200ms;
}

.ease-out {
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
}

.ease-in {
  transition-timing-function: cubic-bezier(0.4, 0, 1, 1);
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Add these new styles */
.flex-col {
  display: flex;
  flex-direction: column;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.text-center {
  text-align: center;
}

/* Optional: Add hover effect for better UX */
li:hover {
  background-color: var(--muted);
  color: var(--muted-foreground);
}

/* Optional: Add spacing between items */
li + li {
  margin-top: 0.25rem;
}

.cursor-pointer {
  cursor: pointer;
}

/* Optional: Add transition for smooth expansion */
.expanded-content-enter-active,
.expanded-content-leave-active {
  transition: all 0.3s ease-in-out;
  max-height: 500px;
}

.expanded-content-enter-from,
.expanded-content-leave-to {
  max-height: 0;
  opacity: 0;
}

/* Add to your existing styles */
.expanded-row {
  background-color: var(--muted);
  transition: background-color 0.2s ease;
}

table {
  border-collapse: collapse;
  width: 100%;
}

th, td {
  transition: background-color 0.2s ease;
}

tr:hover td {
  background-color: var(--muted);
}

.payment-input {
  max-width: 100px;
  text-align: right;
}

/* Animation for accordion */
.accordion-enter-active,
.accordion-leave-active {
  transition: max-height 0.3s ease-in-out;
  overflow: hidden;
}

.accordion-enter-from,
.accordion-leave-to {
  max-height: 0;
}

.accordion-enter-to,
.accordion-leave-from {
  max-height: 1000px;
}

.badge {
  @apply transition-colors duration-200;
}

.badge.secondary {
  @apply bg-yellow-500 text-white hover:bg-yellow-600;
}
</style>
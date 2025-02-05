<script setup lang="ts">
import { ref, onMounted, computed, watch, onUnmounted } from 'vue';
import { useMainStore } from '@/stores/main';
import DataTable from '@/components/ui/data-table/DataTable.vue';
import { getColumns } from './columns';
import { useToast } from "@/components/ui/toast";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, useRoute } from 'vue-router';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checklist } from "@/types/types";
import { useI18n } from 'vue-i18n';
import { RefreshCw } from 'lucide-vue-next';

import DatePicker from "@/components/DatePicker.vue";
import {
  useVueTable,
  getCoreRowModel,
  type RowSelectionState,
  type Updater,
} from '@tanstack/vue-table'

const selectedDate = ref<Date>(new Date());
let dateFilterActive = ref(false);
const { t, locale } = useI18n();

const mainStore = useMainStore();
const { toast } = useToast();
const router = useRouter();
const route = useRoute();

const page = ref(1);
const limit = ref(10);
const loading = ref(true);
const type = ref('all');
const selectedStatus = ref<string[]>([]);
const selectedLocation = ref<string[]>([]);

const showDetailsDialog = ref(false);
const showConfirmDialog = ref(false);
const confirmActionType = ref<'approve' | 'reject' | null>(null);
const selectedItem = ref<Checklist | null>(null);

const deviceTotalPrice = ref(0);
const packagePrice = ref(0);

const filterFields = ref(["status", "location"]);
const filterConfigs = ref({
  status: [
    { value: "pending", label: "pending" },
    { value: "done", label: "done" },
    { value: "others", label: "others" },
    { value: "hidden", label: "hidden" }
  ],
  location: [] as { value: string; label: string }[]
});

interface FetchChecklistParams {
  page: number;
  limit: number;
  status: string;
  type: string;
  date?: string;
  search?: string;
  [key: string]: string | number | undefined;
}

const fetchChecklistItems = async (params: FetchChecklistParams) => {
  try {
    loading.value = true;
    console.log('7. Fetching items with params:', params);
    await mainStore.fetchChecklistItems(params);
  } catch (error: any) {
    console.error('Error fetching checklist items:', error);
    toast({
      title: "Error",
      description: error.response?.data?.message || "Failed to fetch checklist items",
      variant: "destructive",
    });
  } finally {
    loading.value = false;
  }
};

// Update the date formatting function to handle timezone
const formatDateToYYYYMMDD = (date: Date) => {
  // Add Afghanistan timezone offset (UTC+4:30)
  const afghanistanOffset = 4.5 * 60 * 60 * 1000; // 4.5 hours in milliseconds
  const afghanistanDate = new Date(date.getTime() + afghanistanOffset);
  
  const year = afghanistanDate.getUTCFullYear();
  const month = String(afghanistanDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(afghanistanDate.getUTCDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

// Update onMounted to handle date from URL
onMounted(async () => {
  try {
    await mainStore.fetchBranches();
    // Convert branches to filter config format
    filterConfigs.value.location = mainStore.branchesData.branches.map(branch => ({
      value: branch._id,
      label: branch.location
    }));

    const { page: routePage, limit: routeLimit, status: routeStatus, type: routeType, date: routeDate, branch: routeBranch } = route.query;
    page.value = Number(routePage) || 1;
    limit.value = Number(routeLimit) || 10;
    selectedStatus.value = routeStatus ? String(routeStatus).split(',').filter(Boolean) : [];
    selectedLocation.value = routeBranch ? String(routeBranch).split(',').filter(Boolean) : [];
    type.value = String(routeType || 'all');
    
    // Handle date from URL if exists
    if (routeDate) {
      selectedDate.value = new Date(String(routeDate));
      dateFilterActive.value = true;
    }
    
    // Create initial params
    const params: FetchChecklistParams = {
      page: page.value,
      limit: limit.value,
      status: selectedStatus.value.join(','),
      type: type.value !== 'all' ? type.value : '',
    };

    // Add date to params if it exists in URL
    if (dateFilterActive.value) {
      params.date = formatDateToYYYYMMDD(selectedDate.value);
    }

    // Remove empty params
    Object.keys(params).forEach(key => {
      if (!params[key]) {
        delete params[key];
      }
    });

    fetchChecklistItems(params);
  } catch (error) {
    console.error('Error fetching branches:', error);
  }
});

const handlePageChange = (newPage: number) => {
  page.value = newPage;
  updateRouteAndFetch();
};

const handleLimitChange = (newLimit: number) => {
  limit.value = newLimit;
  page.value = 1;
  updateRouteAndFetch();
};

const handleTypeChange = (newType: string) => {
  type.value = newType;
  page.value = 1;
  updateRouteAndFetch();
};

const handleFilterChange = (filterKey: string, newValue: string[]) => {
  if (filterKey === "status") {
    selectedStatus.value = newValue;
    page.value = 1;
    updateRouteAndFetch();
  } else if (filterKey === "location") {
    selectedLocation.value = newValue;
    page.value = 1;
    updateRouteAndFetch();
  }
};

// Update updateRouteAndFetch to use YYYY-MM-DD format
const updateRouteAndFetch = (additionalParams: Record<string, any> = {}) => {
  const query: Record<string, string | number> = {
    page: page.value,
    limit: limit.value,
  };

  if (selectedStatus.value.length > 0) {
    query.status = selectedStatus.value.join(',');
  }

  if (selectedLocation.value.length > 0) {
    query.branch = selectedLocation.value.join(',');
  }

  if (type.value !== 'all') {
    query.type = type.value;
  }

  if (dateFilterActive.value) {
    query.date = formatDateToYYYYMMDD(selectedDate.value);
  }

  // Add any additional params (like search)
  Object.assign(query, additionalParams);

  router.push({ query });
  
  const params: FetchChecklistParams = {
    page: page.value,
    limit: limit.value,
    status: selectedStatus.value.join(','),
    branch: selectedLocation.value.join(','),
    type: type.value !== 'all' ? type.value : '',
    ...additionalParams
  };

  if (dateFilterActive.value) {
    params.date = formatDateToYYYYMMDD(selectedDate.value);
  }

  Object.keys(params).forEach(key => {
    if (!params[key]) {
      delete params[key];
    }
  });

  fetchChecklistItems(params);
};

// Add a debug log in handleDateChange
const handleDateChange = (newDate: Date) => {
  console.log('Date changed:', {
    originalDate: newDate,
    formatted: formatDateToYYYYMMDD(newDate),
    localTime: newDate.toLocaleString(),
    utcTime: newDate.toUTCString()
  });
  selectedDate.value = newDate;
  dateFilterActive.value = true;
  updateRouteAndFetch();
};

const handleApprove = () => {
  confirmActionType.value = 'approve';
  showConfirmDialog.value = true;
};

const handleReject = () => {
  confirmActionType.value = 'reject';
  showConfirmDialog.value = true;
};

const handleConfirmAction = async () => {
  if (!selectedItem.value || typeof selectedItem.value.customerId !== 'object') return;

  try {
    showConfirmDialog.value = false;
    showDetailsDialog.value = false;
    loading.value = true;

    const action = confirmActionType.value;
    const itemId = selectedItem.value._id;
    const customer = selectedItem.value.customerId;
    
    const creditCheckData = {
      id: itemId,
      status: action === 'approve' ? 'done' : 'others',
      deviceTotalPrice: deviceTotalPrice.value,
      packagePrice: packagePrice.value,
      totalPrice: totalPrice.value,
      devices: customer.devices?.filter(device => !device.paid && device.device) || [],
      currentService: customer.currentService && !customer.currentService.paid ? customer.currentService : null
    };

    const response = await mainStore.approveCreditCheck(creditCheckData);
    
    if (response && response.data.success) {
      toast({
        title: action === 'approve' ? "Approved" : "Rejected",
        description: response.data.message || `Credit check has been ${action === 'approve' ? 'approved' : 'rejected'} successfully.`,
      });

      // Update the filter counts in the store if needed
      if (mainStore.checklistData.filterCounts) {
        const oldStatus = selectedItem.value.status;
        const newStatus = response.data.checklist.status;
        
        if (oldStatus && newStatus && oldStatus !== newStatus) {
          if (mainStore.checklistData.filterCounts.status[oldStatus]) {
            mainStore.checklistData.filterCounts.status[oldStatus]--;
          }
          if (mainStore.checklistData.filterCounts.status[newStatus] !== undefined) {
            mainStore.checklistData.filterCounts.status[newStatus]++;
          } else {
            mainStore.checklistData.filterCounts.status[newStatus] = 1;
          }
        }
      }

      // Update the specific item in the table
      const index = mainStore.checklistData.items.findIndex(item => item._id === itemId);
      if (index !== -1) {
        mainStore.checklistData.items.splice(index, 1, response.data.checklist);
      }
    } else {
      const errorMessage = response?.data?.message || 'Operation failed';
      throw new Error(errorMessage);
    }
  } catch (err) {
    console.error(`Error ${confirmActionType.value}ing credit check:`, err);
    toast({
      title: "Error",
      description: (err as Error).message || `Failed to ${confirmActionType.value} credit check. Please try again.`,
      variant: "destructive",
    });
  } finally {
    loading.value = false;
  }
};

const handleShowDetails = (id: string) => {
  const item = mainStore.checklistData.items.find(item => item._id === id);
  if (!item) return;
  
  selectedItem.value = item;
  
  if (typeof item.customerId === 'object') {
    const customer = item.customerId;
    
    // Calculate device total price for reference
    deviceTotalPrice.value = customer.devices
      ?.filter(device => !device.paid && device.device)
      .reduce((total, device) => {
        if (!device.device || typeof device.device !== 'object') return total;
        const price = device.device.price || 0;
        const quantity = device.quantity || 1;
        return total + (price * quantity);
      }, 0) || 0;

    // Set package price for reference
    packagePrice.value = customer.currentService && 
      !customer.currentService.paid && 
      customer.currentService.service?.Price ? 
        parseFloat(customer.currentService.service.Price) : 0;

    // If totalPrice is not set, initialize it with calculated total
    if (!item.totalPrice) {
      item.totalPrice = Number(deviceTotalPrice.value) + Number(packagePrice.value);
    }
  }
  
  showDetailsDialog.value = true;
};

const totalPrice = computed({
  get: () => {
    // Always return the checklist's totalPrice
    return selectedItem.value?.totalPrice || 0;
  },
  set: (value) => {
    // Only allow editing if conditions are met
    if (selectedItem.value && 
        selectedItem.value.status !== 'others' && 
        !(selectedItem.value.invoiceCreated && selectedItem.value.sentToQuickbooks)) {
      selectedItem.value.totalPrice = Number(value);
    }
  }
});

const preparedData = computed(() => {
  return mainStore.checklistData.items.map(item => ({
    ...item,
    onShowDetails: handleShowDetails,
  }));
});

watch([selectedStatus], () => {
  updateRouteAndFetch();
});

watch([selectedDate], () => {
  page.value = 1;
  updateRouteAndFetch();
});

// Update columns with translations
const columns = getColumns(t, toast, mainStore);

// You can also create a computed property for better readability:
const tabOptions = computed(() => {
  return locale.value === 'fa' 
    ? ['service', 'device', 'all']  
    : ['all', 'device', 'service']; 
});

const selectedRows = ref(new Set<string>());

// Add table props computed property
const tableProps = computed(() => ({
  // Add any table-specific props here
  enableRowSelection: true,
  enableMultiRowSelection: true
}));

// Update event listener types
const handleRowSelectionChange: EventListener = (event) => {
  const customEvent = event as CustomEvent;
  const { id, checked } = customEvent.detail;
  console.log('Selection change event:', { id, checked });
  
  if (checked) {
    selectedRows.value.add(id);
  } else {
    selectedRows.value.delete(id);
  }
  
  console.log('Updated selections:', Array.from(selectedRows.value));
};

// Add event listeners with cleanup
onMounted(() => {
  window.addEventListener('row-selection-change', handleRowSelectionChange as EventListener);
  window.addEventListener('resend-checklist', handleResendChecklist as EventListener);
});

onUnmounted(() => {
  window.removeEventListener('row-selection-change', handleRowSelectionChange as EventListener);
  window.removeEventListener('resend-checklist', handleResendChecklist as EventListener);
});

// Update handleSync function
const handleSync = async () => {
  const selectedIds = Array.from(selectedRows.value);
  console.log('Syncing selected IDs:', selectedIds);

  if (selectedIds.length === 0) {
    toast({
      title: t('creditCheck.sync.noSelection'),
      description: t('creditCheck.sync.selectItems'),
      variant: 'destructive',
    });
    return;
  }

  try {
    syncLoading.value = true;
    await mainStore.syncCreditCheck(selectedIds);
    toast({
      title: t('creditCheck.sync.success'),
      description: t('creditCheck.sync.completed'),
    });
    selectedRows.value.clear(); // Clear selection after successful sync
    await fetchChecklistItems({
      page: page.value,
      limit: limit.value,
      status: selectedStatus.value.join(','),
      type: type.value !== 'all' ? type.value : '',
      date: dateFilterActive.value ? formatDateToYYYYMMDD(selectedDate.value) : undefined
    });
  } catch (error) {
    console.error('Sync error:', error);
    toast({
      title: t('creditCheck.sync.error'),
      description: t('creditCheck.sync.failed'),
      variant: 'destructive',
    });
  } finally {
    syncLoading.value = false;
  }
};

// Add debug watcher
watch(selectedRows, (newSelection) => {
  console.log('Selection state changed:', {
    size: newSelection.size,
    items: Array.from(newSelection)
  });
}, { deep: true });

const dataTableRef = ref();

// const handleSelectAll = () => {
//   if (dataTableRef.value) {
//     const table = dataTableRef.value.getTable();
//     const allSelected = table.getIsAllRowsSelected();
//     table.toggleAllRowsSelected(!allSelected);
//   }
// };

// Add these new refs near the top of the script
const syncLoading = ref(false);

// Update event listener types
const handleResendChecklist: EventListener = async (event) => {
  const customEvent = event as CustomEvent;
  const { id } = customEvent.detail;
  
  try {
    loading.value = true;
    await mainStore.syncCreditCheck([id]);
    toast({
      title: t('creditCheck.sync.success'),
      description: t('creditCheck.sync.completed'),
    });
    await fetchChecklistItems({
      page: page.value,
      limit: limit.value,
      status: selectedStatus.value.join(','),
      type: type.value !== 'all' ? type.value : '',
      date: dateFilterActive.value ? formatDateToYYYYMMDD(selectedDate.value) : undefined
    });
  } catch (error) {
    console.error('Resend error:', error);
    toast({
      title: t('creditCheck.sync.error'),
      description: t('creditCheck.sync.failed'),
      variant: 'destructive',
    });
  } finally {
    loading.value = false;
  }
};

const handleSearchChange = (searchTerm: string) => {
  console.log('5. CreditCheckHome received search term:', searchTerm)
  // Reset to first page when searching
  page.value = 1;
  const params: FetchChecklistParams = {
    page: 1,
    limit: limit.value,
    status: selectedStatus.value.join(','),
    type: type.value !== 'all' ? type.value : '',
    search: searchTerm,
    branch: selectedLocation.value.join(',')
  };
  
  if (dateFilterActive.value) {
    params.date = formatDateToYYYYMMDD(selectedDate.value);
  }

  // Remove empty params
  Object.keys(params).forEach(key => {
    if (!params[key]) {
      delete params[key];
    }
  });

  console.log('6. Final search params:', params);
  fetchChecklistItems(params);
};

// Update event listener types
const handleHideChecklist: EventListener = async (event) => {
  const customEvent = event as CustomEvent;
  const { id } = customEvent.detail;
  try {
    loading.value = true;
    const response = await fetch(`/api/creditcheck/${id}/hide`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) throw new Error('Failed to hide checklist');
    
    const data = await response.json();
    const isHidden = data.checklist?.isHidden;

    toast({
      title: t('creditCheck.notifications.hidden.title'),
      description: isHidden ? 
        t('creditCheck.notifications.hidden.hideDescription') : 
        t('creditCheck.notifications.hidden.unhideDescription')
    });

    // Refresh the list with current filters if item was unhidden
    if (!isHidden) {
      await fetchChecklistItems({
        page: page.value,
        limit: limit.value,
        status: selectedStatus.value.join(','),
        type: type.value !== 'all' ? type.value : '',
        branch: selectedLocation.value.join(','),
        date: dateFilterActive.value ? formatDateToYYYYMMDD(selectedDate.value) : undefined
      });
    }
  } catch (error) {
    console.error('Hide error:', error);
    toast({
      title: t('creditCheck.notifications.error.title'),
      description: t('creditCheck.notifications.error.description'),
      variant: 'destructive'
    });
  } finally {
    loading.value = false;
  }
};

// Add event listener
onMounted(() => {
  window.addEventListener('hide-checklist', handleHideChecklist as EventListener);
});

onUnmounted(() => {
  window.removeEventListener('hide-checklist', handleHideChecklist as EventListener);
});

// Add this before the template
const table = useVueTable({
  data: preparedData.value,
  columns,
  state: {
    rowSelection: {} as RowSelectionState
  },
  enableRowSelection: true,
  enableMultiRowSelection: true,
  getCoreRowModel: getCoreRowModel(),
  onRowSelectionChange: (updater: Updater<RowSelectionState>) => {
    const newSelection = typeof updater === 'function' ? updater({}) : updater;
    selectedRows.value = new Set(Object.keys(newSelection).filter(key => newSelection[key]));
  }
});

</script>

<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold my-4 sm:my-6 rtl:text-right ltr:text-left">
      {{ t('creditCheck.title') }}
    </h1>

    <div class="mb-6 space-y-4">
      <Tabs v-model="type" class="rtl:float-right ltr:float-left py-2">
        <TabsList>
          <TabsTrigger 
            v-for="typeOption in tabOptions"
            :key="typeOption"
            :value="typeOption" 
            @click="handleTypeChange(typeOption)"
          >
            {{ t(`creditCheck.types.${typeOption}`) }}
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <!-- DataTable with Status Filter -->
      <DataTable
        ref="dataTableRef"
        :table="table"
        v-bind="tableProps"
        :columns="columns"
        :data="preparedData"
        :filter-options="filterFields"
        :filter-configs="filterConfigs"
        :filter-counts="mainStore.checklistData.filterCounts"
        :current-filters="{
          status: selectedStatus,
          location: selectedLocation
        }"
        :page="page"
        :limit="limit"
        :total-count="mainStore.checklistData.totalCount"
        :loading="loading"
        @page-change="handlePageChange"
        @limit-change="handleLimitChange"
        @filter-change="handleFilterChange"
        @search-change="handleSearchChange"
        class="rtl:text-right ltr:text-left clear-both"
      >
        <template #toolbar>
          <div class="flex w-full justify-between items-center">
            <div class="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                :class="[
                  'h-8 rtl:order-first ltr:order-last hidden lg:flex',
                  'items-center justify-center gap-2',
                  'bg-transparent bg-primary/80 hover:bg-primary hover:text-white'
                ]"
                :disabled="syncLoading"
                @click="handleSync"
              >
                <RefreshCw class="h-4 w-4" :class="{ 'animate-spin': syncLoading }" />
                <span>{{ t('creditCheck.sync.title') }}</span>
              </Button>
            </div>
            <div class="rtl:order-last ltr:order-first px-2">
              <DatePicker 
                v-model="selectedDate" 
                :placeholder="t('customers.form.selectDate')" 
                class="w-[130px] h-8"
                @update:model-value="handleDateChange"
                clearable
              />
            </div>
          </div>
        </template>
      </DataTable>
    </div>

    <Dialog v-model:open="showDetailsDialog">
      <DialogContent class="sm:max-w-[650px] bg-background">
        <DialogHeader class="pb-1">
          <DialogTitle class="text-base font-medium flex items-center gap-2">
            {{ t('creditCheck.details.title') }}
            <span 
              :class="[
                'px-1.5 py-0.5 text-xs rounded-full',
                selectedItem?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                selectedItem?.status === 'done' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              ]"
            >
              {{ selectedItem?.status }}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div v-if="selectedItem && typeof selectedItem.customerId === 'object'" class="space-y-2">
          <!-- Customer Information Section -->
          <div class="bg-background border border-border p-2 rounded-lg">
            <h3 class="font-medium text-sm mb-1.5 flex items-center gap-2">
              <span>{{ t('creditCheck.details.customerInfo.title') }}</span>
              <span class="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded">
                {{ selectedItem.customerId.custType }}
              </span>
            </h3>
            
            <div class="grid grid-cols-2 gap-3">
              <!-- Common Information -->
              <div class="space-y-1.5">
                <p class="flex justify-between text-xs">
                  <span class="text-gray-600">{{ t('creditCheck.details.customerInfo.customerId') }}:</span>
                  <span class="font-medium">{{ selectedItem.customerId.customerId }}</span>
                </p>
                <p class="flex justify-between text-xs">
                  <span class="text-gray-600">{{ t('creditCheck.details.customerInfo.name') }}:</span>
                  <span class="font-medium">{{ selectedItem.customerId.name }} {{ selectedItem.customerId.lastName }}</span>
                </p>
                <p class="flex justify-between text-xs">
                  <span class="text-gray-600">{{ t('creditCheck.details.customerInfo.phone') }}:</span>
                  <span class="font-medium">{{ selectedItem.customerId.phones?.[0] || 'N/A' }}</span>
                </p>
                <p class="flex justify-between text-xs">
                  <span class="text-gray-600">{{ t('creditCheck.details.customerInfo.email') }}:</span>
                  <span class="font-medium">{{ selectedItem.customerId.email || 'N/A' }}</span>
                </p>
                <p class="flex justify-between text-xs">
                  <span class="text-gray-600">{{ t('creditCheck.details.customerInfo.deltaId') }}:</span>
                  <span class="font-medium">{{ selectedItem.customerId.deltaSibUserId || 'N/A' }}</span>
                </p>
              </div>

              <div class="space-y-1.5">
                <!-- Individual Specific Information -->
                <template v-if="selectedItem.customerId.custType === 'individual'">
                  <p class="flex justify-between text-xs">
                    <span class="text-gray-600">{{ t('creditCheck.details.customerInfo.nid') }}:</span>
                    <span class="font-medium">{{ selectedItem.customerId.nid || 'N/A' }}</span>
                  </p>
                </template>

                <!-- Business Specific Information -->
                <template v-else-if="selectedItem.customerId.custType === 'business'">
                  <p class="flex justify-between text-xs">
                    <span class="text-gray-600">{{ t('creditCheck.details.customerInfo.companyName') }}:</span>
                    <span class="font-medium">{{ selectedItem.customerId.companyName || 'N/A' }}</span>
                  </p>
                  <p class="flex justify-between text-xs">
                    <span class="text-gray-600">{{ t('creditCheck.details.customerInfo.licenseNo') }}:</span>
                    <span class="font-medium">{{ selectedItem.customerId.licenseNo || 'N/A' }}</span>
                  </p>
                  <p class="flex justify-between text-xs">
                    <span class="text-gray-600">{{ t('creditCheck.details.customerInfo.activity') }}:</span>
                    <span class="font-medium">{{ selectedItem.customerId.activity || 'N/A' }}</span>
                  </p>
                </template>

                <!-- Common Address -->
                <p class="flex justify-between text-xs">
                  <span class="text-gray-600">{{ t('creditCheck.details.customerInfo.address') }}:</span>
                  <span class="font-medium">{{ selectedItem.customerId.address || 'N/A' }}</span>
                </p>
              </div>
            </div>
          </div>

          <!-- Devices Section -->
          <div v-if="selectedItem?.customerId?.devices?.some(d => !d.paid)" 
               class="bg-background border border-border p-2 rounded-lg">
            <h3 class="font-medium text-sm mb-1.5">{{ t('creditCheck.details.devices.title') }}</h3>
            <div class="space-y-1.5">
              <div class="grid grid-cols-4 gap-3 text-xs font-medium text-gray-600">
                <div>{{ t('creditCheck.details.devices.name') }}</div>
                <div>{{ t('creditCheck.details.devices.quantity') }}</div>
                <div>{{ t('creditCheck.details.devices.unitPrice') }}</div>
                <div>{{ t('creditCheck.details.devices.total') }}</div>
              </div>
              <div v-for="device in selectedItem.customerId.devices.filter(d => !d.paid && d.device)" 
                   :key="device.device?._id"
                   class="grid grid-cols-4 gap-3 text-xs border-b pb-1.5">
                <div>{{ device.device?.name }}</div>
                <div>{{ device.quantity || 1 }}</div>
                <div>${{ device.device?.price?.toFixed(2) }}</div>
                <div>${{ ((device.device?.price || 0) * (device.quantity || 1)).toFixed(2) }}</div>
              </div>
              <div class="flex justify-end items-center gap-2">
                <span class="text-xs font-medium">{{ t('creditCheck.details.devices.totalPrice') }}</span>
                <Input 
                  type="number" 
                  min="0"
                  step="0.01" 
                  v-model="deviceTotalPrice" 
                  readonly
                  class="w-28 text-right text-sm h-7 focus:ring focus:ring-opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                />
              </div>
            </div>
          </div>

          <!-- Service Package Section -->
          <div v-if="selectedItem?.customerId?.currentService && !selectedItem.customerId.currentService.paid" 
               class="bg-background border border-border p-2 rounded-lg">
            <h3 class="font-medium text-sm mb-1.5">{{ t('creditCheck.details.package.title') }}</h3>
            <div class="space-y-1.5">
              <div class="grid grid-cols-3 gap-3">
                <div>
                  <p class="text-xs text-gray-600 mb-0.5">{{ t('creditCheck.details.package.name') }}</p>
                  <p class="text-sm font-medium">{{ selectedItem.customerId.currentService.service?.ServiceName }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-600 mb-0.5">{{ t('creditCheck.details.package.period') }}</p>
                  <p class="text-sm font-medium">
                    {{ selectedItem.customerId.currentService.startDate ? 
                      new Date(selectedItem.customerId.currentService.startDate).toLocaleDateString() : 'N/A' }} - 
                    {{ selectedItem.customerId.currentService.endDate ? 
                      new Date(selectedItem.customerId.currentService.endDate).toLocaleDateString() : 'N/A' }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-gray-600 mb-0.5">{{ t('creditCheck.details.package.price') }}</p>
                  <Input 
                    type="number" 
                    min="0"
                    step="0.01" 
                    v-model="packagePrice" 
                    readonly
                    class="w-28 text-right text-sm h-7 focus:ring focus:ring-opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Total Price Section -->
           <div v-if="selectedItem" class="bg-background border border-border p-2 rounded-lg">
            <div class="flex justify-between items-center">
              <h3 class="font-medium text-sm">{{ t('creditCheck.details.total.title') }}</h3>
              <div class="flex items-center gap-2">
                <Input 
                  v-model="totalPrice" 
                  type="number" 
                 
                  :disabled="selectedItem?.status === 'others' || 
                             (selectedItem?.invoiceCreated && selectedItem?.sentToQuickbooks)"
                  class="w-32"
                />
                <span v-if="selectedItem?.status === 'others' || 
                            (selectedItem?.invoiceCreated && selectedItem?.sentToQuickbooks)" 
                      class="text-sm text-gray-500">
                  ({{ t('creditCheck.details.total.readonly') }})
                </span>
              </div>
            </div>
          </div> 

          <!-- Total Section - Simplified -->
          
        </div>

        <DialogFooter class="mt-3 space-x-2">
          <Button @click="showDetailsDialog = false" variant="outline" class="h-8 text-sm">
            {{ t('creditCheck.actions.cancel') }}
          </Button>
          <Button @click="handleReject" variant="destructive" class="h-8 text-sm">
            {{ t('creditCheck.actions.reject') }}
          </Button>
          <Button @click="handleApprove" variant="default" class="h-8 text-sm">
            {{ t('creditCheck.actions.approve') }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Dialog v-model:open="showConfirmDialog">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{{ t('creditCheck.dialog.confirm.title') }}</DialogTitle>
        </DialogHeader>
        <p>{{ t(`creditCheck.dialog.confirm.${confirmActionType}Message`) }}</p>
        <DialogFooter>
          <Button @click="showConfirmDialog = false" variant="outline">
            {{ t('creditCheck.actions.cancel') }}
          </Button>
          <Button 
            @click="handleConfirmAction" 
            :variant="confirmActionType === 'approve' ? 'default' : 'destructive'"
          >
            {{ t(`creditCheck.actions.${confirmActionType}`) }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<style scoped>
.dialog-content {
  padding: 1rem;
}
</style>

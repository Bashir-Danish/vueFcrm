<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
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
import { Checklist, Equipment } from "@/types/types";
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const mainStore = useMainStore();
const { toast } = useToast();
const router = useRouter();
const route = useRoute();

const page = ref(1);
const limit = ref(10);
// const search = ref('');
const loading = ref(true);
const status = ref('pending');

const initialLoading = ref(true);

const showDetailsDialog = ref(false);
const showConfirmDialog = ref(false);
const confirmActionType = ref<'approve' | 'reject' | null>(null);
const selectedItem = ref<Checklist | null>(null);

const deviceTotalPrice = ref(0);
const packagePrice = ref(0);

const fetchChecklistItems = async () => {
  try {
    if (initialLoading.value) {
      loading.value = true;
    }
    await mainStore.fetchChecklistItems(page.value, limit.value, status.value);
  } catch (error) {
    console.error('Error fetching checklist items:', error);
    toast({
      title: "Error",
      description: "Failed to fetch checklist items. Please try again.",
      variant: "destructive",
    });
  } finally {
    loading.value = false;
    initialLoading.value = false;
  }
};

onMounted(() => {
  const { page: routePage, limit: routeLimit, status: routeStatus } = route.query;
  page.value = Number(routePage) || 1;
  limit.value = Number(routeLimit) || 10;
  status.value = String(routeStatus || 'pending');
  fetchChecklistItems();
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

const handleStatusChange = (newStatus: string) => {
  status.value = newStatus;
  page.value = 1;
  updateRouteAndFetch();
};

const updateRouteAndFetch = () => {
  router.push({
    query: {
      ...route.query,
      page: page.value,
      limit: limit.value,
      status: status.value,
    },
  });
  fetchChecklistItems();
};

// const handleUpdateTotalPrice = async (id: string, newPrice: number) => {
//   try {
//     // await mainStore.updateChecklistTotalPrice(id, newPrice);
//     toast({
//       title: "Success",
//       description: "Total price updated successfully.",
//     });
//   } catch (error) {
//     console.error('Error updating total price:', error);
//     toast({
//       title: "Error",
//       description: "Failed to update total price. Please try again.",
//       variant: "destructive",
//     });
//   }
// };

const handleApprove = () => {
  confirmActionType.value = 'approve';
  showConfirmDialog.value = true;
};

const handleReject = () => {
  confirmActionType.value = 'reject';
  showConfirmDialog.value = true;
};

const handleConfirmAction = async () => {
  if (selectedItem.value && typeof selectedItem.value.customerId === 'object') {
    const action = confirmActionType.value;
    const itemId = selectedItem.value._id;
    const customer = selectedItem.value.customerId;
    
    // Filter only unpaid devices with device property
    const unpaidDevices = customer.devices?.filter(device => !device.paid && device.device) || [];
    // Get current service only if unpaid
    const unpaidService = customer.currentService && !customer.currentService.paid ? customer.currentService : null;
    
    const creditCheckData = {
      id: itemId,
      status: action === 'approve' ? 'done' : 'others', 
      deviceTotalPrice: deviceTotalPrice.value,
      packagePrice: packagePrice.value,
      totalPrice: totalPrice.value,
      devices: unpaidDevices,
      currentService: unpaidService
    };

    try {
      // Use approveCreditCheck for both approve and reject actions
      await mainStore.approveCreditCheck(creditCheckData);

      toast({
        title: action === 'approve' ? "Approved" : "Rejected",
        description: `Credit check has been ${action === 'approve' ? 'approved' : 'rejected'}.`,
      });
      
      await fetchChecklistItems();
    } catch (error) {
      console.error(`Error ${action}ing credit check:`, error);
      toast({
        title: "Error",
        description: `Failed to ${action} credit check. Please try again.`,
        variant: "destructive",
      });
    } finally {
      showConfirmDialog.value = false;
      showDetailsDialog.value = false;
    }
  }
};

// const handleUpdateDevicePrice = (deviceId: string, newPrice: number) => {
//   if (selectedItem.value) {
//     // Implement your device price update logic here
//     console.log(`Updating device ${deviceId} price to ${newPrice}`);
//   }
// };

// const handleUpdatePackagePrice = (newPrice: number) => {
//   if (selectedItem.value) {
//     // Implement your package price update logic here
//     console.log(`Updating package price to ${newPrice}`);
//   }
// };

const handleShowDetails = (id: string) => {
  selectedItem.value = mainStore.checklistData.items.find(item => item._id === id) || null;
  if (selectedItem.value && typeof selectedItem.value.customerId === 'object') {
    const customer = selectedItem.value.customerId;
    
    // Calculate total price only for unpaid devices with proper type checking
    deviceTotalPrice.value = customer.devices?.filter(device => !device.paid && device.device)
      .reduce((total, device) => {
        // Add type checking for device.device
        if (!device.device || typeof device.device !== 'object') return total;
        const price = (device.device as Equipment).price || 0;
        const quantity = device.quantity || 1;
        return total + (price * quantity);
      }, 0) || 0;

    // Set package price only if service is unpaid with proper type checking
    packagePrice.value = customer.currentService && 
      !customer.currentService.paid && 
      customer.currentService.service?.Price ? 
        parseFloat(customer.currentService.service.Price) : 0;
  }
  showDetailsDialog.value = true;
};

const totalPrice = computed(() => {
  return Number(deviceTotalPrice.value) + Number(packagePrice.value);
});

const preparedData = computed(() => {
  return mainStore.checklistData.items.map(item => ({
    ...item,
    onShowDetails: handleShowDetails,
  }));
});

watch([status], () => {
  updateRouteAndFetch();
});

// Update columns with translations
const columns = computed(() => getColumns(t));
</script>

<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold my-4 sm:my-6">
      {{ t('creditCheck.title') }}
    </h1>

    <div class="mb-2 flex">
      <Tabs v-model="status" class="w-full mb-6 flex rtl:flex-row-reverse">
        <TabsList class="rtl:flex-row-reverse">
          <TabsTrigger value="pending" @click="handleStatusChange('pending')">
            {{ t('creditCheck.status.pending') }}
          </TabsTrigger>
          <TabsTrigger value="done" @click="handleStatusChange('done')">
            {{ t('creditCheck.status.done') }}
          </TabsTrigger>
          <TabsTrigger value="others" @click="handleStatusChange('others')">
            {{ t('creditCheck.status.others') }}
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>

    <DataTable
      :columns="columns"
      :data="preparedData"
      :page="page"
      :limit="limit"
      :filterOptions="[]"
      :filterConfigs="{}"
      :filterCounts="mainStore.checklistData.filterCounts"
      :total-count="mainStore.checklistData.totalCount"
      :loading="loading"
      @page-change="handlePageChange"
      @limit-change="handleLimitChange"
    />

    <Dialog v-model:open="showDetailsDialog">
      <DialogContent class="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle class="text-xl font-semibold">
            {{ t('creditCheck.details.title') }}
          </DialogTitle>
        </DialogHeader>
        <div v-if="selectedItem && typeof selectedItem.customerId === 'object'" class="space-y-4 text-sm">
          <!-- Customer Information -->
          <div class="border-b pb-2">
            <h3 class="font-medium mb-1">
              {{ t('creditCheck.details.customerInfo.title') }}
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p><span class="font-semibold">{{ t('creditCheck.details.customerInfo.name') }}:</span> {{ selectedItem.customerId.name }} {{ selectedItem.customerId.lastName }}</p>
                <p><span class="font-semibold">{{ t('creditCheck.details.customerInfo.email') }}:</span> {{ selectedItem.customerId.email || 'N/A' }}</p>
                <p><span class="font-semibold">{{ t('creditCheck.details.customerInfo.phone') }}:</span> {{ selectedItem.customerId.phones?.[0] || 'N/A' }}</p>
                <p><span class="font-semibold">{{ t('creditCheck.details.customerInfo.customerType') }}:</span> {{ selectedItem.customerId.custType }}</p>
              </div>
              <div>
                <template v-if="selectedItem.customerId.custType === 'individual'">
                  <p><span class="font-semibold">{{ t('creditCheck.details.customerInfo.nid') }}:</span> {{ selectedItem.customerId.nid || 'N/A' }}</p>
                </template>
                <template v-else-if="selectedItem.customerId.custType === 'business'">
                  <p><span class="font-semibold">{{ t('creditCheck.details.customerInfo.companyName') }}:</span> {{ selectedItem.customerId.companyName || 'N/A' }}</p>
                  <p><span class="font-semibold">{{ t('creditCheck.details.customerInfo.licenseNo') }}:</span> {{ selectedItem.customerId.licenseNo || 'N/A' }}</p>
                </template>
                <p><span class="font-semibold">{{ t('creditCheck.details.customerInfo.address') }}:</span> {{ selectedItem.customerId.address || 'N/A' }}</p>
              </div>
            </div>
          </div>
          
          <!-- Unpaid Devices -->
          <div v-if="selectedItem?.customerId?.devices?.some(d => !d.paid)" class="border-b pb-2">
            <h3 class="font-medium mb-1">
              {{ t('creditCheck.details.devices.title') }}
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <ul class="list-disc list-inside">
                  <li v-for="device in selectedItem.customerId.devices.filter(d => !d.paid && d.device)" 
                      :key="device.device?._id || Math.random()">
                    {{ device.device?.name || 'Unknown Device' }} (x{{ device.quantity || 1 }})
                  </li>
                </ul>
              </div>
              <div class="flex justify-end items-center">
                <span class="mr-2">
                  {{ t('creditCheck.details.devices.totalPrice') }}
                </span>
                <Input 
                  type="number" 
                  min="0"
                  step="0.01" 
                  v-model="deviceTotalPrice" 
                  class="w-24 h-7 text-sm focus:ring focus:ring-opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                />
              </div>
            </div>
          </div>
          
          <!-- Unpaid Package -->
          <div v-if="selectedItem?.customerId?.currentService && !selectedItem.customerId.currentService.paid" class="border-b pb-2">
            <h3 class="font-medium mb-1">
              {{ t('creditCheck.details.package.title') }}
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p>{{ selectedItem.customerId.currentService.service?.ServiceName || 'Unknown Package' }}</p>
              </div>
              <div class="flex justify-end items-center">
                <span class="mr-2">
                  {{ t('creditCheck.details.package.price') }}
                </span>
                <Input 
                  type="number" 
                  min="0"
                  step="0.01" 
                  v-model="packagePrice" 
                  class="w-24 h-7 text-sm focus:ring focus:ring-opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                />
              </div>
            </div>
          </div>
          
          <!-- Total Price -->
          <div class="font-medium">
            <div class="flex justify-between items-center">
              <span>
                {{ t('creditCheck.details.totalAmount') }}
              </span>
              <span>${{ totalPrice.toFixed(2) }}</span>
            </div>
          </div>
        </div>
        <DialogFooter class="mt-4">
          <Button @click="handleReject" variant="destructive" size="sm">
            {{ t('creditCheck.actions.reject') }}
          </Button>
          <Button @click="handleApprove" variant="default" size="sm">
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

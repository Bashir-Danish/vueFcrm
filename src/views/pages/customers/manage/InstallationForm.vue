<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from "vue";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DatePicker from "@/components/DatePicker.vue";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMainStore } from "@/stores/main";
import Separator from "@/components/ui/separator/Separator.vue";
import { useToast } from '@/components/ui/toast/use-toast'; 
import { useAuthStore } from '@/stores/auth';
import type { Installation, Service, Customer } from "@/types/types";
import { useDebounce } from '@vueuse/core';
import { Loader2, Check } from "lucide-vue-next";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  customerData?: Customer;
  taskData?: any;
  installationData?: Installation;
}>();

const authStore = useAuthStore();
const isNocUser = computed(() => authStore.user?.role === 'noc');

const customerName = ref("");
const customerAddress = ref("");
const customerPhone = ref("");
const status = ref("pending");
const type = ref("installation");
const date = ref(new Date());
const signal = ref("");
const ccq = ref("");
const base = ref("");
const note = ref("");
const cable = ref("");
const router = ref("");
const routerMac = ref("");
const antenna = ref("");
const antennaMac = ref("");
const deviceSource = ref("own"); 
const selectedPackageId = ref("");
const installationId = ref("");
const currentPackage = ref<Service | null>(null);

watch(
  () => props.installationData,
  (newInstallationData) => {
    console.log("New Installation Data:", newInstallationData);
    if (newInstallationData) {
      const customer = newInstallationData.customerId as Customer;
      installationId.value = newInstallationData._id || "";
      
      customerName.value = customer ? `${customer.name || ""} ${customer.lastName || ""}` : "";
      customerAddress.value = customer?.address || "";
      customerPhone.value = customer?.phones?.[0] || "";
      status.value = newInstallationData.status || "pending";
      type.value = newInstallationData.type || "installation";
      date.value = newInstallationData.date ? new Date(newInstallationData.date) : new Date();
      signal.value = newInstallationData.result?.signal?.toString() || "";
      ccq.value = newInstallationData.result?.ccq?.toString() || "";
      base.value = newInstallationData.result?.base || "";
      note.value = newInstallationData.result?.note || "";
      cable.value = newInstallationData.devices?.cable || "";
      router.value = newInstallationData.devices?.router || "";
      routerMac.value = newInstallationData.devices?.routerMac || "";
      antenna.value = newInstallationData.devices?.antenna || "";
      antennaMac.value = newInstallationData.devices?.antennaMac || "";
      deviceSource.value = newInstallationData.devices?.source || "own";
      currentPackage.value = customer?.currentService?.service || null;
      selectedPackageId.value = customer?.currentService?.service?.Service_Id || "";
      
      console.log("Updated form values:", {
        installationId: installationId.value,
        customerName: customerName.value,
        customerAddress: customerAddress.value,
        customerPhone: customerPhone.value,
        status: status.value,
        type: type.value,
        date: date.value,
        signal: signal.value,
        ccq: ccq.value,
        base: base.value,
        note: note.value,
        cable: cable.value,
        router: router.value,
        routerMac: routerMac.value,
        antenna: antenna.value,
        antennaMac: antennaMac.value,
        deviceSource: deviceSource.value,
        selectedPackageId: selectedPackageId.value,
      });
    } else {
      console.log("Installation Data is null or undefined");
    }
  },
  { immediate: true }
);

const mainStore = useMainStore();
const toast = useToast();

const handleSubmit = async () => {
  const selectedService = services.value.find(service => service.Service_Id === selectedPackageId.value);
  
  const installationData = {
    _id: installationId.value,
    taskId: props.taskData?._id,
    status: status.value,
    type: type.value,
    date: date.value,
    result: {
      signal: Number(signal.value),
      ccq: Number(ccq.value),
      base: base.value,
      note: note.value,
    },
    devices: {
      cable: cable.value,
      router: router.value,
      routerMac: routerMac.value,
      antenna: antenna.value,
      antennaMac: antennaMac.value,
      source: deviceSource.value
    },
    selectedService
  };

  try {
    await mainStore.updateInstallation(installationData);
    toast.toast({ 
      title: 'Success', 
      description: 'Installation and service updated successfully!' 
    });
  } catch (error) {
    console.error("Error updating installation:", error);
    toast.toast({ 
      title: 'Error', 
      description: error instanceof Error ? error.message : 'Failed to update installation.', 
      variant: 'destructive' 
    });
  }
};

const handleApprove = async () => {
  try {
    const selectedService = services.value.find(service => service.Service_Id === selectedPackageId.value);
    
    const response = await mainStore.approveOrRejectInstallation(
      installationId.value, 
      'approve', 
      undefined,
      selectedService
    );
    
    toast.toast({ 
      title: 'Success', 
      description: response.toastMessage || 'Installation approved successfully!' 
    });
  } catch (error) {
    console.error("Error approving installation:", error);
    toast.toast({ 
      title: 'Error', 
      description: error instanceof Error ? error.message : 'Failed to approve installation.', 
      variant: 'destructive' 
    });
  }
};

const handleReject = async () => {
  try {
    const response = await mainStore.approveOrRejectInstallation(installationId.value, 'reject', note.value);
    toast.toast({ 
      title: 'Success', 
      description: response.toastMessage || 'Installation rejected successfully!' 
    });
  } catch (error) {
    console.error("Error rejecting installation:", error);
    toast.toast({ 
      title: 'Error', 
      description: error instanceof Error ? error.message : 'Failed to reject installation.', 
      variant: 'destructive' 
    });
  }
};

const services = ref<Service[]>([]);
const isLoadingServices = ref(false);
const hasMoreServices = ref(true);
const currentPage = ref(1);
const packageSearch = ref('');
const packageSelectOpen = ref(false);
const packageSearchInput = ref<HTMLInputElement | null>(null);

const debouncedSearch = useDebounce(packageSearch, 300);

watch(debouncedSearch, () => {
  currentPage.value = 1;
  fetchServices();
});

const fetchServices = async () => {
  isLoadingServices.value = true;
  try {
    const response = await mainStore.fetchServices(packageSearch.value, currentPage.value);
    if (currentPage.value === 1) {
      services.value = response.services;
    } else {
      services.value = [...services.value, ...response.services];
    }
    hasMoreServices.value = response.hasMore;
  } catch (error) {
    console.error("Error fetching services:", error);
  } finally {
    isLoadingServices.value = false;
  }
};

onMounted(() => {
  fetchServices();
});

const showDetailedFields = computed(() => status.value !== "failed");

const selectedPackageName = computed(() => {
  const selectedPackage = services.value.find(service => service.Service_Id === selectedPackageId.value);
  return selectedPackage ? selectedPackage.ServiceName : (currentPackage.value ? currentPackage.value.ServiceName : 'Select a package');
});

const filteredServices = computed(() => {
  return services.value.filter((service) =>
    service.ServiceName.toLowerCase().includes(packageSearch.value.toLowerCase())
  );
});

const focusPackageSearch = () => {
  nextTick(() => {
    if (packageSearchInput.value) {
      packageSearchInput.value.focus();
    }
  });
};

const { t } = useI18n();

</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="flex items-center gap-4">
          <Label for="date" class="w-32 select-none">{{ t('customers.installation.form.date') }}</Label>
          <DatePicker v-model="date" :placeholder="t('customers.installation.form.selectDate')" class="flex-1" />
        </div>
        <div class="flex items-center gap-4">
          <Label for="type" class="w-32 select-none">{{ t('customers.installation.form.type') }}</Label>
          <Select v-model="type" class="flex-1">
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="installation">{{ t('customers.installation.form.types.installation') }}</SelectItem>
              <SelectItem value="troubleshooting">{{ t('customers.installation.form.types.troubleshooting') }}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div class="flex items-center gap-4">
          <Label for="status" class="w-32 select-none">{{ t('customers.installation.form.status.title') }}</Label>
          <Select v-model="status" class="flex-1">
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">{{ t('customers.installation.form.status.pending') }}</SelectItem>
              <SelectItem value="in-progress">{{ t('customers.installation.form.status.inProgress') }}</SelectItem>
              <SelectItem value="done">{{ t('customers.installation.form.status.done') }}</SelectItem>
              <SelectItem value="failed">{{ t('customers.installation.form.status.failed') }}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>

    <Separator class="my-6" />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="flex items-center gap-4">
        <Label class="w-32 select-none">{{ t('customers.installation.form.customerInfo.name') }}</Label>
        <Input v-model="customerName" disabled class="flex-1 capitalize" />
      </div>
      <div class="flex items-center gap-4">
        <Label for="package" class="w-32 select-none">{{ t('customers.form.package') }}</Label>
        <Select v-model="selectedPackageId">
          <SelectTrigger class="flex-1" @click="packageSelectOpen = !packageSelectOpen">
            <SelectValue :placeholder="t('customers.form.selectPackage')">
              {{ selectedPackageName }}
            </SelectValue>
          </SelectTrigger>
          <SelectContent v-if="packageSelectOpen" class="w-[var(--radix-select-trigger-width)]">
            <div class="p-2">
              <Input
                ref="packageSearchInput"
                v-model="packageSearch"
                :placeholder="t('customers.form.searchPackages')"
                class="mb-2 h-8"
                @focus="focusPackageSearch"
                @keydown="focusPackageSearch"
              />
            </div>
            <ScrollArea class="h-[200px]">
              <SelectItem
                v-for="service in filteredServices"
                :key="service.Service_Id"
                :value="service.Service_Id"
                @click="packageSelectOpen = false"
              >
                <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                  <Check v-if="selectedPackageId === service.Service_Id" class="h-4 w-4" />
                </span>
                <span>{{ service.ServiceName }} (اف{{ service.Price }})</span>
              </SelectItem>
              <div v-if="isLoadingServices" class="flex justify-center items-center py-2">
                <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                {{ t('customers.common.loading') }}
              </div>
            </ScrollArea>
          </SelectContent>
        </Select>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="flex items-center gap-4">
        <Label class="w-32 select-none">{{ t('customers.installation.form.customerInfo.phone') }}</Label>
        <Input v-model="customerPhone" class="flex-1" />
      </div>
      <div class="flex items-center gap-4">
        <Label class="w-32 select-none">{{ t('customers.installation.form.customerInfo.address') }}</Label>
        <Input v-model="customerAddress"  class="flex-1" />
      </div>
    </div>

    <template v-if="showDetailedFields">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="flex items-center gap-4">
          <Label for="signal" class="w-32 select-none">{{ t('customers.installation.form.details.signal') }}</Label>
          <Input id="signal" v-model="signal" type="number" class="flex-1 border rounded-md shadow-sm focus:ring focus:ring-opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
        </div>
        <div class="flex items-center gap-4">
          <Label for="ccq" class="w-32 select-none">{{ t('customers.installation.form.details.ccq') }}</Label>
          <Input id="ccq" v-model="ccq" type="number" class="flex-1 border rounded-md shadow-sm focus:ring focus:ring-opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="flex items-center gap-4">
          <Label for="base" class="w-32 select-none">{{ t('customers.installation.form.details.base') }}</Label>
          <Input id="base" v-model="base" class="flex-1" />
        </div>
        <div class="flex items-center gap-4">
          <Label for="cable" class="w-32 select-none">{{ t('customers.installation.form.details.cable') }}</Label>
          <Input id="cable" v-model="cable" class="flex-1" />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="flex  gap-4">
          <Label for="router" class="w-32 select-none mt-2">{{ t('customers.installation.form.details.router') }}</Label>
          <div class="flex-1 flex flex-col gap-2">
            <Input id="router" v-model="router" placeholder="Router Name" class="" />
            <Input v-model="routerMac" placeholder="MAC Address" class="" />
          </div>
        </div>
        <div class="flex gap-4">
          <Label for="antenna" class="w-32 select-none mt-2">{{ t('customers.installation.form.details.antenna') }}</Label>
          <div class="flex-1 flex flex-col gap-2 ">
            <Input id="antenna" v-model="antenna" placeholder="Antenna Name"  />
            <Input v-model="antennaMac" placeholder="MAC Address"  />
          </div>
        </div>
      </div>

      <div class="flex items-center gap-4 w-1/2">
        <Label for="deviceSource" class="w-32 select-none">Device Source</Label>
        <Select v-model="deviceSource" >
          <SelectTrigger class="flex-1">
            <SelectValue placeholder="Select device source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="own">Own</SelectItem>
            <SelectItem value="borrowed">Borrowed</SelectItem>
            <SelectItem value="purchased">Purchased</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </template>

    <div class="flex items-center gap-4">
      <Label for="note" class="w-32 select-none">
        {{ status === 'failed' ? t('customers.installation.form.details.cancelReason') : t('customers.installation.form.details.note') }}
      </Label>
      <Textarea id="note" v-model="note" class="flex-1" />
    </div>

    <div v-if="isNocUser" class="flex justify-end w-full">
      <Button @click="handleApprove" type="button" class="mr-2">
        {{ t('customers.installation.form.actions.approve') }}
      </Button>
      <Button @click="handleReject" type="button" variant="outline">
        {{ t('customers.installation.form.actions.reject') }}
      </Button>
    </div>
    <div v-if="!isNocUser" class="flex justify-end w-full">
      <Button type="submit">
        {{ t('customers.installation.form.actions.submit') }}
      </Button>
    </div>
  </form>
</template>

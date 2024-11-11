<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash, Loader2 } from 'lucide-vue-next';
import { useMainStore } from '@/stores/main';
// import { useAuthStore } from '@/stores/auth'; 
import { storeToRefs } from 'pinia';
import Input from '@/components/ui/input/Input.vue'; 
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  customerData?: any;
}>();

const emit = defineEmits(['submit']);

const mainStore = useMainStore();
// const authStore = useAuthStore();

const { equipmentData, customersData } = storeToRefs(mainStore);

const selectedDevice = ref('');
const deviceSearch = ref('');
const quantity = ref<{ [deviceId: string]: number }>({});
const totalAmount = ref(0);
const isSubmitting = ref(false);
const selectedCustomer = ref<any>(null);
const customerSearch = ref('');
const selectedCustomerId = ref('');

const customerSelectOpen = ref(false);
const deviceSelectOpen = ref(false);
const customerSearchInput = ref<HTMLInputElement | null>(null);
const deviceSearchInput = ref<HTMLInputElement | null>(null);

const { t } = useI18n();

const selectedCustomerName = computed(() => {
  if (selectedCustomer.value) {
    return `${selectedCustomer.value.name} ${selectedCustomer.value.lastName}`;
  }
  return t('customers.form.selectCustomer');
});

const calculateTotalAmount = () => {
  let amount = 0;
  Object.keys(quantity.value).forEach((deviceId) => {
    const device = equipmentData.value.equipment.find((d) => d._id === deviceId);
    if (device) {
      amount += device.price * quantity.value[deviceId];
    }
  });
  totalAmount.value = amount;
};

watch(() => props.customerData, (newCustomerData) => {
  if (newCustomerData) {
    selectedCustomer.value = newCustomerData;
    selectedCustomerId.value = newCustomerData._id;
    // console.log('Customer data received:', selectedCustomer.value);
    if (newCustomerData.devices && newCustomerData.devices.length > 0) {
      quantity.value = {};
      newCustomerData.devices.forEach((deviceData: any) => {
        if (deviceData.device && deviceData.device._id) {
          quantity.value[deviceData.device._id] = deviceData.quantity || 1;
        }
      });
    } else {
      quantity.value = {};
    }
    calculateTotalAmount();
  } else {
    selectedCustomer.value = null;
    selectedCustomerId.value = '';
    quantity.value = {};
    totalAmount.value = 0;
  }
}, { immediate: true });

const handleCustomerChange = (customerId: string) => {
  const customer = customersData.value.customers.find(c => c._id === customerId);
  if (customer) {
    selectedCustomer.value = customer;
    selectedCustomerId.value = customerId;
  }
};

onMounted(async () => {
  try {
    await mainStore.fetchEquipment(1, 100, '');
    await mainStore.fetchCustomers();

    if (props.customerData) {
      selectedCustomer.value = props.customerData;
      selectedCustomerId.value = props.customerData._id;
      if (selectedCustomer.value.devices && selectedCustomer.value.devices.length > 0) {
        selectedCustomer.value.devices.forEach((deviceData: any) => {
          if (deviceData.device && deviceData.device._id) {
            quantity.value[deviceData.device._id] = deviceData.quantity || 1;
          }
        });
      }
      calculateTotalAmount();
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});

const filteredDevices = computed(() => {
  return equipmentData.value.equipment.filter((device) =>
    device.name.toLowerCase().includes(deviceSearch.value.toLowerCase())
  );
});

const filteredCustomers = computed(() => {
  return customersData.value.customers.filter((customer) =>
    (customer.name?.toLowerCase().includes(customerSearch.value.toLowerCase()) ?? false) ||
    (customer.lastName?.toLowerCase().includes(customerSearch.value.toLowerCase()) ?? false)
  );
});

watch(quantity, () => {
  calculateTotalAmount();
}, { deep: true });

const handleAddDevice = () => {
  const device = equipmentData.value.equipment.find((d) => d._id === selectedDevice.value);
  if (device && !(selectedDevice.value in quantity.value)) {
    quantity.value[selectedDevice.value] = 1;
    selectedDevice.value = ''; 
    deviceSearch.value = '';
    calculateTotalAmount();
  }
};

const handleRemoveDevice = (deviceId: string) => {
  delete quantity.value[deviceId];
  calculateTotalAmount();
};

const handleQuantityChange = (deviceId: string, newQuantity: number) => {
  if (newQuantity >= 1) {
    quantity.value[deviceId] = newQuantity;
  } else if (newQuantity === 0) {
    handleRemoveDevice(deviceId);
  }
  calculateTotalAmount();
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  
  const devicesToSend = Object.keys(quantity.value).map((deviceId) => ({
    device: deviceId,
    quantity: quantity.value[deviceId],
  }));

  const dataToSend = {
    customerId: selectedCustomerId.value,
    devices: devicesToSend,
  };

  try {
    console.log('Emitting submit event with data:', dataToSend);
    emit('submit', dataToSend);
  } catch (error) {
    console.error("Error in handleSubmit:", error);
  } finally {
    isSubmitting.value = false;
  }
};

const keepFocusOnSearch = () => {
  nextTick(() => {
    if (deviceSearchInput.value) {
      deviceSearchInput.value.focus();
    }
  });
};

const handleDeviceSearchInput = (e: Event) => {
  e.preventDefault();
  keepFocusOnSearch();
};
</script>

<template>
  <div class="space-y-6 mt-6">
    <div class="flex items-center gap-4 ">
      <Select v-model="selectedCustomerId" @update:modelValue="handleCustomerChange">
        <SelectTrigger class="w-1/2" @click="customerSelectOpen = !customerSelectOpen">
          <SelectValue :placeholder="t('customers.form.selectCustomer')">
            {{ selectedCustomerName }}
          </SelectValue>
        </SelectTrigger>
        <SelectContent v-if="customerSelectOpen">
          <div class="p-2">
            <Input
              ref="customerSearchInput"
              v-model="customerSearch"
              :placeholder="t('customers.form.searchCustomer')"
              class="mb-2"
            />
          </div>
          <div class="overflow-auto max-h-60">
            <SelectItem
              v-for="customer in filteredCustomers"
              :key="customer._id"
              :value="customer._id || ''"
              @click="customerSelectOpen = false"
              class="rtl:text-right"
            >
              {{ customer.name ?? '' }} {{ customer.lastName ?? '' }}
            </SelectItem>
          </div>
        </SelectContent>
      </Select>
      <Select v-model="selectedDevice" @update:modelValue="(value) => selectedDevice = value">
        <SelectTrigger class="w-1/2" @click="deviceSelectOpen = !deviceSelectOpen">
          <SelectValue :placeholder="t('customers.devices.selectDevice')" />
        </SelectTrigger>
        <SelectContent v-if="deviceSelectOpen">
          <div class="p-2">
            <Input
              ref="deviceSearchInput"
              v-model="deviceSearch"
              :placeholder="t('customers.devices.searchDevices')"
              class="mb-2"
              @input="handleDeviceSearchInput"
              @click.stop
              @keydown.stop
            />
          </div>
          <div class="overflow-auto max-h-60 rtl:text-right" @mousedown.prevent>
            <SelectItem
              v-for="device in filteredDevices"
              :key="device._id"
              :value="device._id || ''"
              @click="deviceSelectOpen = false"
              tabindex="-1"
            >
              {{ device.name }}
            </SelectItem>
          </div>
        </SelectContent>
      </Select>
      <Button @click="handleAddDevice" class="rtl:mr-auto ltr:ml-auto">
        {{ t('customers.devices.add') }}
      </Button>
    </div>

    <Table>
      <TableHeader>
        <TableRow class="rtl:text-right">
          <TableHead class="w-1/7">{{ t('customers.devices.table.name') }}</TableHead>
          <TableHead class="w-1/7">{{ t('customers.devices.table.model') }}</TableHead>
          <TableHead class="w-1/7">{{ t('customers.devices.table.company') }}</TableHead>
          <TableHead class="w-1/7">{{ t('customers.devices.table.unit') }}</TableHead>
          <TableHead class="w-1/7">{{ t('customers.devices.table.price') }}</TableHead>
          <TableHead class="w-1/7">{{ t('customers.devices.table.quantity') }}</TableHead>
          <TableHead class="w-1/7 min-w-14"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="deviceId in Object.keys(quantity)" :key="deviceId" class="rtl:text-right">
          <TableCell class="w-1/7">{{ equipmentData.equipment.find(d => d._id === deviceId)?.name }}</TableCell>
          <TableCell class="w-1/7">{{ equipmentData.equipment.find(d => d._id === deviceId)?.model }}</TableCell>
          <TableCell class="w-1/7">{{ equipmentData.equipment.find(d => d._id === deviceId)?.company }}</TableCell>
          <TableCell class="w-1/7">{{ equipmentData.equipment.find(d => d._id === deviceId)?.unit }}</TableCell>
          <TableCell class="w-1/7">{{ equipmentData.equipment.find(d => d._id === deviceId)?.price }}</TableCell>
          <TableCell class="w-1/7">
            <Input
              type="number"
              v-model="quantity[deviceId]"
              @update:modelValue="(value) => handleQuantityChange(deviceId, parseInt(value as string))"
              min="0"
              class="w-20 px-2 py-1 border rounded-md focus:ring focus:ring-opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </TableCell>
          <TableCell
            class="w-1/7 hover:text-red-500"
            @click="() => handleRemoveDevice(deviceId)"
          >
            <Button
              variant="ghost"
              size="icon"
              class="hover:text-red-500 rtl:mr-auto ltr:ml-auto"
            >
              <Trash :size="20"/>
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    <div class="mt-4 flex justify-between items-center ">
      <p class="text-red-500 rtl:ml-4 ltr:mr-4">
        {{ t('customers.devices.totalAmount') }}: {{ totalAmount }}
      </p>
      <Button @click="handleSubmit" :disabled="isSubmitting">
        <template v-if="isSubmitting">
          <Loader2 class="rtl:ml-2 ltr:mr-2 h-4 w-4 animate-spin" />
          {{ t('customers.common.submitting') }}
        </template>
        <template v-else>
          {{ t('customers.devices.submit') }}
        </template>
      </Button>
    </div>
  </div>
</template>

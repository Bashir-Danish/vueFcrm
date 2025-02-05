<script setup lang="ts">
import { ref, computed, watch, onMounted, defineEmits, nextTick } from 'vue'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import  DatePicker  from "@/components/DatePicker.vue"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { X, Loader2 } from "lucide-vue-next"
import { Checkbox } from "@/components/ui/checkbox"
import { useMainStore } from '@/stores/main';
import eventBus from '@/eventBus'
import { useDebounce } from '@vueuse/core'
import { Service } from "@/types/types"
import ScrollArea from '@/components/ui/scroll-area/ScrollArea.vue'
import { useI18n } from 'vue-i18n';
import { useToast } from "@/components/ui/toast/use-toast"
import { useAuthStore } from '@/stores/auth';
const { t } = useI18n();
const { toast } = useToast()

const props = defineProps<{
  customerData?: any;
}>()

const emit = defineEmits(['submit'])

const mainStore = useMainStore();
const authStore = useAuthStore();

const customerType = ref(props.customerData?.custType || 'individual');
const username = ref(props.customerData?.username || '');
const date = ref(props.customerData?.date ? new Date(props.customerData.date) : new Date())
const phoneNumbers = ref(props.customerData?.phones || [])
const customFields = ref(props.customerData?.customFields || [])
const selectedPackage = ref(props.customerData?.packageId || '')

const localInternetUsagePurpose = ref(props.customerData?.internetUsagePurpose || '')
const localFamiliarityWithUs = ref(props.customerData?.familiarityWithUs || '')
const localPreviousInternetPackage = ref(props.customerData?.previousPackage || '')
const localPreviousWirelessUsage = ref(props.customerData?.internetUsage === 'Yes')
const internetUsage = ref(props.customerData?.internetUsage || 'No')
const localTerminationReasons = ref({
  price: props.customerData?.terminationReason?.includes('price') || false,
  quality: props.customerData?.terminationReason?.includes('quality') || false,
  customerService: props.customerData?.terminationReason?.includes('customerService') || false,
  speed: props.customerData?.terminationReason?.includes('speed') || false,
})

// const assistantNameLabel = computed(() => customerType.value === 'business' ? 'Assistant Name' : 'Name')
// const assistantLastNameLabel = computed(() => customerType.value === 'business' ? 'Assistant Last Name' : 'Last Name')

const handleAddPhone = (phone: string) => {
  if (phone && !phoneNumbers.value.includes(phone)) {
    phoneNumbers.value.push(phone)
  }
}

const handleRemovePhone = (phone: string) => {
  phoneNumbers.value = phoneNumbers.value.filter((p: string) => p !== phone)
}

const handleAddCustomField = () => {
  customFields.value.push({ key: '', value: '' })
}

const handleRemoveCustomField = (index: number) => {
  customFields.value.splice(index, 1)
}

const handleLocalTerminationReasonChange = (reason: keyof typeof localTerminationReasons.value, checked: boolean) => {
  localTerminationReasons.value[reason] = checked;
}

const handleInternetUsageChange = (checked: boolean) => {
  localPreviousWirelessUsage.value = checked
  internetUsage.value = checked ? 'Yes' : 'No'
}

const services = computed(() => mainStore.servicesData.services);
const isLoadingServices = computed(() => mainStore.servicesData.isLoading);

onMounted(async () => {
  try {
    if (services.value.length === 0) {
      await mainStore.fetchServices();
    }
    if (props.customerData?.currentService?.service?.Service_Id) {
      selectedPackageId.value = props.customerData.currentService.service.Service_Id;
      selectedPackageName.value = props.customerData.currentService.service.ServiceName;
    }
  } catch (error) {
    console.error('Error fetching initial services:', error);
  }
});

const packageSearch = ref('');
const packageSelectOpen = ref(false);
const currentPage = ref(1);
const searchInputRef = ref<HTMLInputElement | null>(null);

const debouncedSearch = useDebounce(packageSearch, 300);

watch(debouncedSearch, () => {
  currentPage.value = 1;
  fetchServices();
});

watch(packageSelectOpen, (newValue) => {
  if (newValue) {
    nextTick(() => {
      if (searchInputRef.value instanceof HTMLInputElement) {
        searchInputRef.value.focus();
      }
    });
  }
});

const fetchServices = async () => {
  await mainStore.fetchServices(packageSearch.value, currentPage.value);
};

const focusSearchInput = () => {
  nextTick(() => {
    if (searchInputRef.value instanceof HTMLInputElement) {
      searchInputRef.value.focus();
    }
  });
};

const handlePackageSearchInput = (e: Event) => {
  e.preventDefault();
  focusSearchInput();
};

onMounted(() => {
  fetchServices();
});

const name = ref(props.customerData?.name || '')
const lastName = ref(props.customerData?.lastName || '')
const email = ref(props.customerData?.email || '')
const address = ref(props.customerData?.address || '')
const nid = ref(props.customerData?.nid?.toString() || '')
const companyName = ref(props.customerData?.companyName || '')
const licenseNo = ref(props.customerData?.licenseNo?.toString() || '')
const activity = ref(props.customerData?.activity || '')

const selectedPackageId = ref(props.customerData?.currentService?.service?.Service_Id || '');
const selectedPackageName = ref(props.customerData?.currentService?.service?.ServiceName || '');

const selectedPackageDisplay = computed(() => {
  if (selectedPackageName.value) {
    return selectedPackageName.value;
  }
  return 'Select a package';
});

watch(() => props.customerData, (newData) => {
  if (newData) {
    customerType.value = newData.custType || 'individual'
    username.value = newData.username || ''
    date.value = newData.date ? new Date(newData.date) : new Date()
    phoneNumbers.value = newData.phones || []
    customFields.value = newData.customFields || []
    selectedPackage.value = newData.packageId || ''
    name.value = newData.name || ''
    lastName.value = newData.lastName || ''
    email.value = newData.email || ''
    address.value = newData.address || ''
    nid.value = newData.nid?.toString() || ''
    companyName.value = newData.companyName || ''
    licenseNo.value = newData.licenseNo?.toString() || ''
    activity.value = newData.activity || ''
    localInternetUsagePurpose.value = newData.internetUsagePurpose || ''
    localFamiliarityWithUs.value = newData.familiarityWithUs || ''
    localPreviousInternetPackage.value = newData.previousPackage || ''
    localPreviousWirelessUsage.value = newData.internetUsage === 'Yes'
    internetUsage.value = newData.internetUsage || 'No'
    localTerminationReasons.value = {
      price: newData.terminationReason?.includes('price') || false,
      quality: newData.terminationReason?.includes('quality') || false,
      customerService: newData.terminationReason?.includes('customerService') || false,
      speed: newData.terminationReason?.includes('speed') || false,
    }
    if (newData.currentService?.service) {
      selectedPackageId.value = newData.currentService.service.Service_Id;
      selectedPackageName.value = newData.currentService.service.ServiceName;
    } else {
      selectedPackageId.value = '';
      selectedPackageName.value = '';
    }
  }
}, { immediate: true })

interface FormData {
  custType: 'individual' | 'business';
  username: string;
  password: string;
  date: Date;
  name: string;
  lastName: string;
  email: string;
  address: string;
  phones: string[];
  customFields: { key: string; value: string }[];
  internetUsagePurpose: string;
  familiarityWithUs: string;
  previousPackage: string;
  internetUsage: string;
  terminationReason: string;
  nid?: string;
  companyName?: string;
  licenseNo?: string;
  activity?: string;
  currentService?: {
    service: Service;
    startDate: Date;
    paid: boolean;
  };
  branch_id: string;
}

const selectedServiceId = ref<string | undefined>(undefined);

const handleServiceChange = (serviceId: string) => {
  selectedServiceId.value = serviceId;
  const service = services.value.find(s => s.Service_Id === serviceId);
  if (service) {
    selectedPackageName.value = service.ServiceName;
    selectedPackageId.value = service.Service_Id;
  }
};

const handleSubmit = () => {
  if (!phoneNumbers.value || phoneNumbers.value.length === 0) {
    toast({
      title: t('customers.dialog.errors.title'),
      description: t('customers.dialog.errors.phoneRequired'),
      variant: "destructive",
    })
    return
  }

  const selectedReasons = Object.entries(localTerminationReasons.value)
    .filter(([_, value]) => value)
    .map(([key, _]) => key)
    .join(',');

  const formData: FormData = {
    custType: customerType.value,
    username: username.value.trim(),
    password: phoneNumbers.value[0],
    date: date.value,
    name: name.value.trim(),
    lastName: lastName.value.trim(),
    email: email.value.trim(),
    address: address.value.trim(),
    phones: phoneNumbers.value,
    customFields: customFields.value.map((field: { key: string; value: string }) => ({ key: field.key.trim(), value: field.value.trim() })),
    internetUsagePurpose: localInternetUsagePurpose.value.trim(),
    familiarityWithUs: localFamiliarityWithUs.value.trim(),
    previousPackage: localPreviousInternetPackage.value.trim(),
    internetUsage: internetUsage.value,
    terminationReason: selectedReasons,
    branch_id: authStore.user.branch_id
  }

  if (customerType.value === 'individual') {
    formData.nid = nid.value ? nid.value.toString().trim() : '';
  } else {
    formData.companyName = companyName.value.trim();
    formData.licenseNo = licenseNo.value ? licenseNo.value.toString().trim() : '';
    formData.activity = activity.value.trim();
  }

  const selectedService = services.value.find(s => s.Service_Id === selectedPackageId.value);
  if (selectedService) {
    formData.currentService = {
      service: selectedService,
      startDate: new Date(),
      paid: false
    };
  } else {
    console.error('No service selected');
    return;
  }

  eventBus.emit('customer-form-submit', formData)
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="mt-4 space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="flex items-center gap-4">
        <Label class="w-32 select-none rtl:text-right">{{ t('customers.form.date') }}</Label>
        <DatePicker 
          v-model="date" 
          :placeholder="t('customers.form.selectDate')" 
          class="flex-1"
        />
      </div>
      <div class="flex items-center gap-4">
        <Label for="customerType" class="w-32 select-none">{{ t('customers.form.customerType') }}</Label>
        <Select v-model="customerType">
          <SelectTrigger class="w-[180px]">
            <SelectValue :placeholder="t('customers.form.selectCustomerType')" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="individual">{{ t('customers.form.individual') }}</SelectItem>
            <SelectItem value="business">{{ t('customers.form.business') }}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="flex items-center gap-4">
        <Label for="username" class="w-32 select-none">{{ t('customers.form.username') }}</Label>
        <Input
          id="username"
          name="username"
          type="text"
          required
          v-model="username"
          :placeholder="t('customers.form.usernamePlaceholder')"
          class="flex-1 border rounded-md shadow-sm focus:ring focus:ring-opacity-50"
        />
      </div>
    </div>
    <Separator />
    <template v-if="customerType === 'business'">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="flex items-center gap-5">
          <Label for="companyName" class="w-32">{{ t('customers.form.companyName') }}</Label>
          <Input
            id="companyName"
            name="companyName"
            type="text"
            required
            v-model="companyName"
            :placeholder="t('customers.form.companyNamePlaceholder')"
            class="flex-1 border rounded-md shadow-sm focus:ring focus:ring-opacity-50"
          />
        </div>
        <div class="flex items-center gap-4">
          <Label for="activity" class="w-32">{{ t('customers.form.activity') }}</Label>
          <Input
            id="activity"
            name="activity"
            type="text"
            required
            v-model="activity"
            :placeholder="t('customers.form.activityPlaceholder')"
            class="flex-1 border rounded-md shadow-sm focus:ring focus:ring-opacity-50"
          />
        </div>
      </div>
    </template>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="flex items-center gap-4">
        <Label for="name" class="w-32 select-none">{{ t('customers.form.name') }}</Label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          v-model="name"
          :placeholder="t('customers.form.namePlaceholder')"
          class="flex-1 border rounded-md shadow-sm focus:ring focus:ring-opacity-50"
        />
      </div>
      <div class="flex items-center gap-4">
        <Label for="lastName" class="w-32 select-none">{{ t('customers.form.lastName') }}</Label>
        <Input
          id="lastName"
          name="lastName"
          type="text"
          required
          v-model="lastName"
          :placeholder="t('customers.form.lastNamePlaceholder')"
          class="flex-1 border rounded-md shadow-sm focus:ring focus:ring-opacity-50"
        />
      </div>
      <div class="flex items-center gap-4">
        <Label for="email" class="w-32 select-none">{{ t('customers.form.email') }}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          v-model="email"
          :placeholder="t('customers.form.emailPlaceholder')"
          class="flex-1 border rounded-md shadow-sm focus:ring focus:ring-opacity-50"
        />
      </div>
      <template v-if="customerType === 'business'">
        <div class="flex items-center gap-4">
          <Label for="licenseNo" class="w-32 select-none">{{ t('customers.form.licenseNo') }}</Label>
          <Input
            id="licenseNo"
            name="licenseNo"
            type="number"
            required
            v-model="licenseNo"
            :placeholder="t('customers.form.licenseNoPlaceholder')"
            class="flex-1 border rounded-md shadow-sm focus:ring focus:ring-opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
      </template>
      <template v-else>
        <div class="flex items-center gap-4">
          <Label for="nid" class="w-32 select-none">{{ t('customers.form.nid') }}</Label>
          <Input
            id="nid"
            name="nid"
            type="number"
            :placeholder="t('customers.form.nidPlaceholder')"
            v-model="nid"
            class="flex-1 border rounded-md shadow-sm focus:ring focus:ring-opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
      </template>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="flex items-center gap-4">
        <Label for="address" class="w-32 select-none">{{ t('customers.form.address') }}</Label>
        <Input
          id="address"
          name="address"
          type="text"
          required
          v-model="address"
          :placeholder="t('customers.form.addressPlaceholder')"
          class="flex-1 border rounded-md shadow-sm focus:ring focus:ring-opacity-50"
        />
      </div>
      <div class="flex items-center gap-4">
        <Label for="package" class="w-32 select-none">{{ t('customers.form.package') }}</Label>
        <Select v-model="selectedPackageId" @update:modelValue="handleServiceChange">
          <SelectTrigger class="flex-1" @click="packageSelectOpen = !packageSelectOpen">
            <SelectValue :placeholder="t('customers.form.selectPackage')">
              {{ selectedPackageDisplay }}
            </SelectValue>
          </SelectTrigger>
          <SelectContent v-if="packageSelectOpen" class="w-[var(--radix-select-trigger-width)]">
            <div class="p-2">
              <Input
                ref="searchInputRef"
                v-model="packageSearch"
                :placeholder="t('customers.form.searchPackages')"
                class="mb-2 h-8"
                @input="handlePackageSearchInput"
                @click.stop
                @keydown.stop
              />
            </div>
            <ScrollArea class="h-[200px]" @mousedown.prevent>
              <SelectItem
                v-for="service in services"
                :key="service.Service_Id"
                :value="service.Service_Id"
                @click="packageSelectOpen = false"
                tabindex="-1"
                class="rtl:text-right w-full"
              >
                <span class="rtl:mr-2 ltr:ml-2">{{ service.ServiceName }}</span>
                <span class="text-muted-foreground">(اف{{ service.Price }})</span>
              </SelectItem>
              <div v-if="isLoadingServices" class="flex justify-center items-center py-2">
                <Loader2 class="rtl:ml-2 ltr:mr-2 h-4 w-4 animate-spin" />
                {{ t('customers.common.loading') }}
              </div>
            </ScrollArea>
          </SelectContent>
        </Select>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="flex items-center gap-4">
        <Label for="phone" class="w-32 select-none">{{ t('customers.form.phones.title') }}</Label>
        <Input
          name="phone"
          type="number"
          :placeholder="t('customers.form.phones.placeholder')"
          @keydown.enter.prevent="handleAddPhone($event.target.value); $event.target.value = ''"
          class="flex-1 border rounded-md shadow-sm focus:ring focus:ring-opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>
      <div class="flex flex-wrap gap-2">
        <div
          v-for="(phone, index) in phoneNumbers"
          :key="index"
          class="bg-background p-2 rounded-lg shadow-lg flex items-center relative group cursor-pointer"
        >
          {{ phone }}
          <button
            type="button"
            @click="handleRemovePhone(phone)"
            class="hidden cursor-pointer group-hover:block rtl:mr-2 ltr:ml-2 text-red-400 absolute top-1/2 rtl:left-1 ltr:right-1 -translate-y-1/2 bg-slate-100 shadow-xl rounded-full p-1"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
    <Separator />
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="flex items-center gap-4">
        <Label for="previousWirelessUsage" class="select-none rtl:ml-4 ltr:mr-4">
          {{ t('customers.form.internetUsage.title') }}
        </Label>
        <div class="flex items-center gap-2">
          <Checkbox
            id="previousWirelessUsage"
            name="previousWirelessUsage"
            :checked="localPreviousWirelessUsage"
            @update:checked="handleInternetUsageChange"
          />
          <span
            @click="handleInternetUsageChange(!localPreviousWirelessUsage)"
            class="cursor-pointer select-none"
          >
            {{ t('customers.form.internetUsage.yes') }}
          </span>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <Label for="internetUsagePurpose" class="w-48 select-none rtl:ml-4 ltr:mr-4">
          {{ t('customers.form.internetPurpose.title') }}
        </Label>
        <Input
          id="internetUsagePurpose"
          name="internetUsagePurpose"
          type="text"
          v-model="localInternetUsagePurpose"
          :placeholder="t('customers.form.internetPurpose.placeholder')"
          class="flex-1 border rounded-md shadow-sm focus:ring focus:ring-opacity-50"
        />
      </div>
      <div class="flex items-center gap-4">
        <Label for="familiarityWithUs" class="w-48 select-none rtl:ml-4 ltr:mr-4">
          {{ t('customers.form.findUs.title') }}
        </Label>
        <Input
          id="familiarityWithUs"
          name="familiarityWithUs"
          type="text"
          v-model="localFamiliarityWithUs"
          :placeholder="t('customers.form.findUs.placeholder')"
          class="flex-1 border rounded-md shadow-sm focus:ring focus:ring-opacity-50"
        />
      </div>
      <div class="flex items-center gap-4">
        <Label for="previousPackage" class="w-48 select-none rtl:ml-4 ltr:mr-4">
          {{ t('customers.form.previousPackage.title') }}
        </Label>
        <Input
          id="previousPackage"
          name="previousPackage"
          type="text"
          v-model="localPreviousInternetPackage"
          :placeholder="t('customers.form.previousPackage.placeholder')"
          class="flex-1 border rounded-md shadow-sm focus:ring focus:ring-opacity-50"
        />
      </div>
    </div>
    <div class="flex gap-4 ">
      <Label class="select-none rtl:ml-4 ltr:mr-4">{{ t('customers.form.terminationReasons.title') }}</Label>
      <div class="flex gap-4 ">
        <div
          v-for="(checked, reason) in localTerminationReasons"
          :key="reason"
          class="flex items-center gap-2 "
        >
          <Checkbox
            :id="`termination${reason}`"
            :checked="checked"
            @update:checked="(value:any) => handleLocalTerminationReasonChange(reason, value)"
          />
          <Label :for="`termination${reason}`" class="select-none">
            {{ t(`customers.form.terminationReasons.${reason}`) }}
          </Label>
        </div>
      </div>
    </div>
    <Separator />
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="flex flex-col gap-6 md:col-span-1">
        <Label class="w-32 select-none rtl:text-right">{{ t('customers.form.customFields.title') }}</Label>
        <Button
          type="button"
          variant="outline"
          @click="handleAddCustomField"
          class="select-none"
        >
          {{ t('customers.form.customFields.add') }}
        </Button>
        <div
          v-for="(field, index) in customFields"
          :key="index"
          class="flex items-center gap-4 mb-2"
        >
          <Input
            type="text"
            :placeholder="t('customers.form.customFields.key')"
            v-model="field.key"
            class="flex-1 border rounded-md shadow-sm focus:ring focus:ring-opacity-50"
          />
          <Input
            type="text"
            :placeholder="t('customers.form.customFields.value')"
            v-model="field.value"
            class="flex-1 border rounded-md shadow-sm focus:ring focus:ring-opacity-50"
          />
          <Button
            type="button"
            variant="outline"
            @click="handleRemoveCustomField(index)"
            class="text-red-500"
          >
            <X class="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>

    <!-- Submit Button -->
    <div class="flex rtl:justify-start ltr:justify-end mt-6">
      <Button type="submit" class="bg-primary text-white">
        {{ t('customers.form.submit') }}
      </Button>
    </div>
  </form>
</template>

<style scoped>
:dir(rtl) .form-container {
  direction: rtl;
}

:dir(ltr) .form-container {
  direction: ltr;
}
</style>

<script setup lang="ts">
import {
  ref,
  onMounted,
  computed,
  onUnmounted,
  watch,
  nextTick,
  onErrorCaptured,
  onBeforeMount,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import eventBus from "@/eventBus";
import { useMainStore } from "@/stores/main";
import { useToast } from "@/components/ui/toast/use-toast";
import StepsList from "@/views/pages/customers/manage/StepsList.vue";
import CustomerForm from "@/views/pages/customers/manage/CustomerForm.vue";
import DevicesForm from "@/views/pages/customers/manage/DevicesForm.vue";
import Assignment from "@/views/pages/customers/manage/Assignment.vue";
import InstallationForm from "@/views/pages/customers/manage/InstallationForm.vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/auth";
import { Installation, Customer } from "@/types/types";
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const route = useRoute();
const router = useRouter();
const mainStore = useMainStore();
const toast = useToast();
const authStore = useAuthStore();

const steps = [
  { title: t('customers.manage.steps.customer'), component: CustomerForm, roles: ["admin", "noc" ,"installer" , "creditChecker"] },
  { title: t('customers.manage.steps.devices'), component: DevicesForm, roles: ["admin", "noc", "installer" , "creditChecker"] },
  { title: t('customers.manage.steps.assign'), component: Assignment, roles: ["admin", "noc", "installer" , "creditChecker"] },
  { title: t('customers.manage.steps.installation'), component: InstallationForm, roles: ["admin","noc", "installer" , "creditChecker"] },
];

const accessibleSteps = computed(() => {
  const userRole = authStore.user?.role;
  return steps.map((step) => ({
    ...step,
    accessible: step.roles.includes(userRole),
  }));
});

const firstAccessibleStep = computed(() => {
  return accessibleSteps.value.findIndex((step) => step.accessible);
});

type InstallationType = Installation | null;
const currentStep = ref(0);
// let startX = 0;
// let isDragging = ref(false);
const formContainerRef = ref<HTMLElement | null>(null);
const selectedCustomer = ref<any>(null);
const isLoading = ref(false);
const currentTaskData = ref<any>(null);
const currentInstallationData = ref<InstallationType>(null);

// Set initial step before mounting
onBeforeMount(() => {
  const step = Number(route.query.step);
  
  if (step) {
    currentStep.value = step - 1;
  }
});

const orderedSteps = computed(() => {
  const current = currentStep.value;
  if (current === 0) {
    return [steps[0], steps[1]];
  } else if (current === steps.length - 1) {
    return [steps[current - 1], steps[current]];
  } else {
    return [steps[current - 1], steps[current], steps[current + 1]];
  }
});

// const startDrag = (event: MouseEvent | TouchEvent) => {
//   isDragging.value = true;
//   startX = "touches" in event ? event.touches[0].clientX : event.clientX;
// };

// const drag = (event: MouseEvent | TouchEvent) => {
//   if (!isDragging.value) return;
//   const currentX =
//     "touches" in event ? event.touches[0].clientX : event.clientX;
//   const diff = startX - currentX;
//   if (Math.abs(diff) > 950) {
//     if (diff > 0 && currentStep.value < steps.length - 1) {
//       handleStepChange(currentStep.value + 1);
//     } else if (diff < 0 && currentStep.value > 0) {
//       handleStepChange(currentStep.value - 1);
//     }
//     endDrag();
//   }
// };

// const endDrag = () => {
//   isDragging.value = false;
// };

const getStepClass = (index: number) => {
  if (currentStep.value === 0) {
    return index === 0 ? "current" : "next";
  } else if (currentStep.value === steps.length - 1) {
    return index === 0 ? "previous" : "current";
  } else {
    if (index === 0) return "previous";
    if (index === 1) return "current";
    return "next";
  }
};

const handleStepClick = (stepIndex: number) => {
  if (accessibleSteps.value[stepIndex].accessible) {
    handleStepChange(stepIndex);
  }
};

const fetchCustomer = async (id: string) => {
  isLoading.value = true;
  try {
    const customer = await mainStore.getCustomerById(id);
    selectedCustomer.value = customer;
    currentCustomerData.value = customer;
  } catch (error) {
    console.error("Error fetching customer:", error);
    toast.toast({
      title: "Error",
      description: "Failed to fetch customer details. Please try again.",
      variant: "destructive",
    });
  } finally {
    isLoading.value = false;
  }
};

// Add proper typing for currentCustomerData
const currentCustomerData = ref<Customer | null>(null);

const { assignedTasksData } = storeToRefs(mainStore);

onMounted(async () => {
  const customerId = route.query.id as string;
  const taskId = route.query.taskId as string;
  const installationId = route.query.installationId as string;

  if (customerId) {
    await fetchCustomer(customerId);
  }

  if (taskId) {
    if (assignedTasksData.value.assignedTasks.length === 0) {
      await mainStore.fetchAssignedTasks({});
    }
    const task = assignedTasksData.value.assignedTasks.find(
      (t) => t._id === taskId
    );
    if (task) {
      currentTaskData.value = task;
      if (typeof task.installationId === "object") {
        currentInstallationData.value = task.installationId;
        if (task.installationId?.customerId) {
          currentCustomerData.value = task.installationId.customerId;
        }
      } else {
        try {
          const installation = await mainStore.getInstallationById(
            task.installationId
          );
          currentInstallationData.value = installation;
          if (installation.customerId) {
            currentCustomerData.value = installation.customerId;
          }
        } catch (error) {
          console.error("Error fetching installation:", error);
          toast.toast({
            title: "Error",
            description:
              "Failed to fetch installation details. Please try again.",
            variant: "destructive",
          });
        }
      }
    }
  }

  if (!installationId && customerId) {
    if (assignedTasksData.value.assignedTasks.length === 0) {
      await mainStore.fetchAssignedTasks({});
    }
    const matchingTask = assignedTasksData.value.assignedTasks.find(task => {
      if (typeof task.installationId === 'object') {
        return task.installationId.customerId?._id === customerId;
      }
      return false;
    });
    if (matchingTask && matchingTask.installationId) {
      if (typeof matchingTask.installationId === 'object') {
        currentInstallationData.value = matchingTask.installationId;
        if (matchingTask.installationId.customerId) {
          currentCustomerData.value = matchingTask.installationId.customerId;
        }
      } else {
        try {
          const installation = await mainStore.getInstallationById(matchingTask.installationId);
          currentInstallationData.value = installation;
          if (installation.customerId) {
            currentCustomerData.value = installation.customerId;
          }
        } catch (error) {
          console.error("Error fetching installation:", error);
        }
      }
    }
  } else if (installationId) {
    try {
      console.log("Fetching installation with ID:", installationId);
      const installation = await mainStore.getInstallationById(installationId);
      console.log("Fetched installation:", installation);
      currentInstallationData.value = installation;
      if (installation.customerId) {
        currentCustomerData.value = installation.customerId;
      }
    } catch (error) {
      console.error("Error fetching installation:", error);
      toast.toast({
        title: "Error",
        description: "Failed to fetch installation details. Please try again.",
        variant: "destructive",
      });
    }
  }
});

watch(
  () => route.query.step,
  (newStep) => {
    const step = Number(newStep);
    const installationId = route.query.installationId as string;
    
    if (step === 4 && installationId) {
      handleStepChange(3);
    } else {
      handleStepChange((step || 1) - 1);
    }
  }
);

const currentStepComponent = computed(() => {
  return steps[currentStep.value]?.component || null;
});

const componentKey = ref(0);

const handleStepChange = (step: number) => {
  if (step >= 0 && step < steps.length) {
    if (accessibleSteps.value[step].accessible) {
      nextTick(() => {
        currentStep.value = step;
        router.push({ query: { ...route.query, step: step + 1 } });
      });
    } else {
      const nextAccessibleStep = accessibleSteps.value.findIndex(
        (s, index) => index >= step && s.accessible
      );
      if (nextAccessibleStep !== -1) {
        nextTick(() => {
          currentStep.value = nextAccessibleStep;
          router.push({
            query: { ...route.query, step: nextAccessibleStep + 1 },
          });
        });
      } else {
        nextTick(() => {
          currentStep.value = firstAccessibleStep.value;
          router.push({
            query: { ...route.query, step: firstAccessibleStep.value + 1 },
          });
        });
      }
    }
  }
};

const handleCustomerSubmit = async (customerData: any) => {
  try {
    const requiredFields = ["custType", "username", "name", "lastName", "email", "address"];
    for (const field of requiredFields) {
      if (!customerData[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    let customer;
    if (selectedCustomer.value) {
      const result = await mainStore.updateCustomer({
        ...selectedCustomer.value,
        ...customerData,
      });
      customer = result.customer;
      toast.toast({
        title: t('common.success'),
        description: t('customers.notifications.customerUpdated', { name: customer.name })
      });
    } else {
      const result = await mainStore.addCustomer(customerData);
      customer = result.customer;
      toast.toast({
        title: "Success",
        description: `${customer.name} has been successfully added as a customer!`,
      });
    }

    selectedCustomer.value = customer;
    currentCustomerData.value = customer;
    handleStepChange(1);
  } catch (error: any) {
    console.error("Error processing customer:", error);
    
    // Handle username-specific error
    if (error.response?.data?.error === 'Username already exists') {
      toast.toast({
        title: "Username Error",
        description: "This username is already taken. Please choose a different username.",
        variant: "destructive",
      });
      return;
    }

    toast.toast({
      title: "Error",
      description: error.message || "Failed to process customer.",
      variant: "destructive",
    });
  }
};

const handleDevicesSubmit = async (devicesData: any) => {
  try {
    await mainStore.updateCustomerDevices(devicesData);
    const customerName = currentCustomerData.value?.name || t('customers.common.customer');
    toast.toast({
      title: t('customers.common.success'),
      description: t('customers.notifications.deviceUpdated', { name: customerName })
    });
    handleStepChange(2);
  } catch (error: any) {
    console.error("Error updating customer devices:", error);
    const customerName = currentCustomerData.value?.name || t('customers.common.customer');
    toast.toast({
      title: t('customers.common.error'),
      description: t('customers.notifications.deviceUpdateFailed', { name: customerName }),
      variant: "destructive",
    });
  }
};

const handleInstallationSubmit = async () => {
  try {
    // await mainStore.submitInstallation(installationData);
    const customerName = currentCustomerData.value?.name || 'Customer';
    toast.toast({
      title: "Success", 
      description: `Installation for ${customerName} has been submitted successfully!`,
    });
  } catch (error: any) {
    console.error("Error submitting installation form:", error);
    const customerName = currentCustomerData.value?.name || 'Customer';
    toast.toast({
      title: "Error",
      description: error.message || `Failed to submit installation for ${customerName}.`,
      variant: "destructive",
    });
  }
};

onMounted(() => {
  if (formContainerRef.value) {
    formContainerRef.value.style.height = `${formContainerRef.value.scrollHeight}px`;
  }
});

onMounted(() => {
  eventBus.on("customer-form-submit", handleCustomerSubmit);
});

onUnmounted(() => {
  eventBus.off("customer-form-submit", handleCustomerSubmit);
});

onErrorCaptured((err, instance, info) => {
  console.error("Captured error:", err, instance, info);

  // Handle TypeError for null customer data
  if (err instanceof TypeError && err.message.includes("Cannot read properties of null")) {
    toast.toast({
      title: "Data Error",
      description: "Customer data is not available. Please try again or contact support.",
      variant: "destructive",
    });
    return false;
  }

  // Handle SelectItem error
  if (err instanceof Error && err.message.includes("A <SelectItem /> must have a value prop")) {
    toast.toast({
      title: "Form Error",
      description: "Please ensure all dropdown options have a valid value.",
      variant: "destructive",
    });
    return false;
  }

  // Handle all other errors
  toast.toast({
    title: "Error",
    description: "An unexpected error occurred. Please try refreshing the page.",
    variant: "destructive",
  });

  return false;
});
</script>

<template>
  <div class="customers-manage min-h-screen flex flex-col select-none">
    <StepsList
      :steps="accessibleSteps"
      :current-step="currentStep"
      @step-click="handleStepChange"
    />

    <div
      class="form-container flex-grow overflow-y-auto overflow-x-hidden custom-scrollbar relative select-none"
    >
      <div
        v-for="(step, index) in orderedSteps"
        :key="step ? step.title : index"
        class="form-layer px-10 border bg-background absolute w-full select-none cursor-pointer"
        :class="[
          getStepClass(index),
          {
            'border-primary/15': getStepClass(index) === 'current',
            'border-muted/65': getStepClass(index) !== 'current',
          },
        ]"
        @click="getStepClass(index) !== 'current' && handleStepClick(currentStep + (getStepClass(index) === 'next' ? 1 : -1))"
      >
        <div class="flex justify-between items-center mb-4 select-none">
          <button
            @click.stop="handleStepChange(currentStep - 1)"
            class="p-2 text-primary rounded-full shadow select-none"
            :disabled="
              currentStep === 0 || !accessibleSteps[currentStep - 1]?.accessible
            "
            :title="
              !accessibleSteps[currentStep - 1]?.accessible
                ? 'Access Denied'
                : ''
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="rtl:hidden"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="ltr:hidden"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
          <h2 class="text-xl font-semibold select-none rtl:text-right">
            {{ step ? step.title : "" }}
          </h2>
          <button
            @click.stop="handleStepChange(currentStep + 1)"
            class="p-2 text-primary rounded-full shadow select-none"
            :disabled="
              currentStep === steps.length - 1 ||
              !accessibleSteps[currentStep + 1]?.accessible
            "
            :title="
              !accessibleSteps[currentStep + 1]?.accessible
                ? 'Access Denied'
                : ''
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="rtl:hidden"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="ltr:hidden"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
        </div>
        <component
          :is="currentStepComponent"
          :key="`${currentStep}-${componentKey}`"
          v-if="getStepClass(index) === 'current'"
          :customerData="currentCustomerData"
          :taskData="currentTaskData"
          :installationData="currentInstallationData"
          @submit="(data: any) => {
            if (currentStep === 0) handleCustomerSubmit(data);
            else if (currentStep === 1) handleDevicesSubmit(data);
            else if (currentStep === 3) handleInstallationSubmit();
          }"
        />
        <div
          v-if="getStepClass(index) !== 'current' && step"
          class="absolute inset-0 bg-background/85 flex items-center justify-center select-none"
          :title="
            !accessibleSteps[steps.findIndex((s:any) => s.title === step.title)]
              ?.accessible
              ? 'Access Denied'
              : ''
          "
        >
          <span
            v-if="
              !accessibleSteps[steps.findIndex((s:any) => s.title === step.title)]
                ?.accessible
            "
            class="text-red-500 font-bold select-none"
          >
            Access Denied
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-container {
  position: relative;
  perspective: 2000px;
  margin-bottom: 10px;
}

.form-layer {
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
  transform-origin: center center;
  min-height: 300px;
}

.form-layer.current {
  left: 2%;
  top: 2%;
  width: 96%;
  min-height: 95%;
  transform: translateZ(0) rotateY(0deg);
  z-index: 3;
}
.form-layer.next {
  right: 1%;
  top: 8%;
  width: 80%;
  min-height: 75%;
  max-height: 75%;
  overflow: hidden;
  transform: translateZ(-55px) rotateY(-10deg);
  z-index: 2;
  opacity: 0.9;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}
.form-layer.previous {
  left: 1%;
  top: 8%;
  width: 80%;
  min-height: 75%;
  max-height: 70%;
  overflow: hidden;
  transform: translateZ(-55px) rotateY(10deg);
  z-index: 2;
  opacity: 1;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}
.form-content {
  min-height: 85%;
  width: 90%;
  user-select: none;
}

.step-title {
  user-select: none;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-primary/70;
  border-radius: 4px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  opacity: 1;
}

.custom-scrollbar::-webkit-scrollbar-button {
  display: none;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: transparent;
}

.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  @apply bg-primary/70;
}

.step-transition-move,
.step-transition-enter-active,
.step-transition-leave-active {
  transition: all 0.5s ease;
}

.step-transition-enter-from,
.step-transition-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.step-transition-leave-active {
  position: absolute;
}
</style>

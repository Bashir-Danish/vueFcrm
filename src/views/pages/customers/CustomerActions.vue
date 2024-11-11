<script setup lang="ts">
import { useMainStore } from '@/stores/main';
import { MoreHorizontal } from 'lucide-vue-next';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useToast } from "@/components/ui/toast/use-toast";

const props = defineProps<{
  customer: any;
}>();

const mainStore = useMainStore();
const router = useRouter();
const { t } = useI18n();
const { toast } = useToast();

const copyCustomerId = () => {
  navigator.clipboard.writeText(props.customer._id);
  toast({
    title: t('customers.common.success'),
    description: t('customers.notifications.idCopied'),
  });
};

const removeCustomer = async () => {
  try {
    await mainStore.deleteCustomer(props.customer._id);
    toast({
      title: t('customers.common.success'),
      description: t('customers.notifications.customerDeleted', { name: props.customer.name }),
    });
  } catch (error) {
    toast({
      title: t('customers.common.error'),
      description: t('customers.notifications.deleteFailed'),
      variant: "destructive",
    });
  }
};

const updateCustomer = () => {
  router.push(`/customers/manage?id=${props.customer._id}`);
};
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="h-8 w-8 p-0 px-1">
        <span class="sr-only">{{ t('customers.actions.menu') }}</span>
        <MoreHorizontal class="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent 
      align="end" 
      class="rtl:text-right"
    >
      <DropdownMenuLabel class="rtl:pr-2 ltr:pl-2">
        {{ t('customers.actions.title') }}
      </DropdownMenuLabel>
      <DropdownMenuItem 
        @click="copyCustomerId"
        class="rtl:pr-2 ltr:pl-2 flex items-center gap-2 rtl:flex-row-reverse"
      >
        {{ t('customers.actions.copyId') }}
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem 
        @click="updateCustomer"
        class="rtl:pr-2 ltr:pl-2 flex items-center gap-2 rtl:flex-row-reverse"
      >
        {{ t('customers.actions.edit') }}
      </DropdownMenuItem>
      <DropdownMenuItem 
        @click="removeCustomer"
        class="rtl:pr-2 ltr:pl-2 flex items-center gap-2 rtl:flex-row-reverse text-red-500 focus:text-red-500"
      >
        {{ t('customers.actions.delete') }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

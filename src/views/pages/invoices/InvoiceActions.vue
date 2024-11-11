<script setup lang="ts">
import { MoreHorizontal, FileText, Download } from 'lucide-vue-next';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from 'vue-i18n';
import { useToast } from "@/components/ui/toast/use-toast";
import type { Invoice } from '@/types/invoice';

const props = defineProps<{
  invoice: Invoice;
}>();

const { t } = useI18n();
const { toast } = useToast();

const viewInvoice = () => {
  toast({
    title: t('invoices.actions.view'),
    description: t('invoices.notifications.viewNotImplemented'),
  });
};

const downloadInvoice = () => {
  toast({
    title: t('invoices.actions.download'),
    description: t('invoices.notifications.downloadNotImplemented'),
  });
};
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="h-8 w-8 p-0">
        <span class="sr-only">{{ t('invoices.actions.menu') }}</span>
        <MoreHorizontal class="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="rtl:text-right">
      <DropdownMenuLabel>{{ t('invoices.actions.title') }}</DropdownMenuLabel>
      <DropdownMenuItem @click="viewInvoice" class="rtl:flex-row-reverse">
        <FileText class="rtl:ml-2 ltr:mr-2 h-4 w-4" />
        <span>{{ t('invoices.actions.view') }}</span>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="downloadInvoice" class="rtl:flex-row-reverse">
        <Download class="rtl:ml-2 ltr:mr-2 h-4 w-4" />
        <span>{{ t('invoices.actions.download') }}</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template> 
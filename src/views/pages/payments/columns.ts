import { ColumnDef } from "@tanstack/vue-table";
import { h, Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { formatDate, formatCurrency } from '@/utils/formatters';
import { Button } from '@/components/ui/button';
import { Eye, Loader2 } from 'lucide-vue-next';

export const createColumns = (onView: (payment: any) => void, loadingInvoiceId: Ref<string | null>): ColumnDef<any>[] => {
  const { t } = useI18n();

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "id",
      header: t('payments.list.columns.id'),
      cell: ({ row }) => {
        return h('div', { class: 'px-5' }, [
          h('div', row.getValue('id'))
        ]);
      },
    },
    {
      accessorKey: "date",
      header: t('payments.list.columns.date'),
      cell: ({ row }) => {
        return h('div', {}, formatDate(row.getValue('date')));
      },
    },
    {
      accessorKey: "customer",
      header: t('payments.list.columns.customer'),
      cell: ({ row }) => {
        return h('div', {}, row.getValue('customer'));
      },
    },
    {
      accessorKey: "amount",
      header: t('payments.list.columns.amount'),
      cell: ({ row }) => {
        return h('div', {}, formatCurrency(row.getValue('amount')));
      },
    },
    {
      accessorKey: "referenceNo",
      header: t('payments.list.columns.referenceNo'),
      cell: ({ row }) => {
        return h('div', {}, row.getValue('referenceNo'));
      },
    },
    {
      id: "actions",
      header: t('payments.list.columns.actions'),
      cell: ({ row }) => {
        const payment = row.original;
        const isLoading = loadingInvoiceId.value === payment.id;
        
        return h(Button, {
          variant: "ghost",
          size: "icon",
          disabled: isLoading,
          onClick: () => onView(payment),
        }, () => [
          isLoading 
            ? h(Loader2, { class: "h-4 w-4 animate-spin" })
            : h(Eye, { class: "h-4 w-4" })
        ]);
      },
    },
  ];

  return columns;
};
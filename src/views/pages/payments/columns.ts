import { ColumnDef } from "@tanstack/vue-table";
import { h, Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { formatDate, formatCurrency } from '@/utils/formatters';
import { Button } from '@/components/ui/button';
import { Eye, Loader2, FileText, CreditCard, BanknoteIcon } from 'lucide-vue-next';

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
      accessorKey: "type",
      header: t('payments.list.columns.type'),
      cell: ({ row }) => {
        const type = row.getValue('type') as string;
        if (type === 'invoice') {
          return h('div', { class: 'flex items-center' }, [
            h(FileText, { class: 'h-4 w-4 mr-2 text-blue-500' }),
            h('span', {}, t('payments.list.types.invoice'))
          ]);
        } else {
          return h('div', { class: 'flex items-center' }, [
            h(BanknoteIcon, { class: 'h-4 w-4 mr-2 text-green-500' }),
            h('span', {}, t('payments.list.types.payment'))
          ]);
        }
      },
    },
    {
      accessorKey: "customerName",
      header: t('payments.list.columns.customer'),
      cell: ({ row }) => {
        return h('div', {}, row.getValue('customerName'));
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
      accessorKey: "status",
      header: t('payments.list.columns.status'),
      cell: ({ row }) => {
        const item = row.original;
        const type = item.type;
        const status = type === 'invoice' ? item.status : 'COMPLETED';
        
        let statusClass = '';
        if (status === 'OPEN') statusClass = 'bg-yellow-100 text-yellow-800';
        else if (status === 'PAID' || status === 'COMPLETED') statusClass = 'bg-green-100 text-green-800';
        else statusClass = 'bg-gray-100 text-gray-800';
        
        return h('div', { class: `px-2 py-1 rounded-full text-xs font-medium inline-block ${statusClass}` }, status);
      },
    },
    {
      accessorKey: "docNumber",
      header: t('payments.list.columns.referenceNo'),
      cell: ({ row }) => {
        return h('div', {}, row.getValue('docNumber'));
      },
    },
    {
      accessorKey: "balance",
      header: t('payments.list.columns.balance'),
      cell: ({ row }) => {
        const item = row.original;
        if (item.type === 'invoice') {
          return h('div', {}, formatCurrency(item.balance || 0));
        }
        return h('div', {}, '-');
      },
    },
    {
      id: "actions",
      header: t('payments.list.columns.actions'),
      cell: ({ row }) => {
        const item = row.original;
        const isLoading = loadingInvoiceId.value === item.id;
        
        return h(Button, {
          variant: "ghost",
          size: "icon",
          disabled: isLoading,
          onClick: () => onView(item),
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
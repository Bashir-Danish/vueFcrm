import { h } from 'vue';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useI18n } from 'vue-i18n';
import { CreditCard } from 'lucide-vue-next';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
}

interface Row {
  original: Customer;
}

export const useCustomerColumns = () => {
  const { t } = useI18n();

  return [
    {
      accessorKey: "name",
      header: t('payments.search.columns.name'),
      cell: ({ row }: { row: Row }) => row.original.name,
    },
    {
      accessorKey: "email",
      header: t('payments.search.columns.email'),
      cell: ({ row }: { row: Row }) => row.original.email,
    },
    {
      accessorKey: "phone",
      header: t('payments.search.columns.phone'),
      cell: ({ row }: { row: Row }) => row.original.phone,
    },
    {
      id: "actions",
      header: t('payments.search.columns.actions'),
      cell: ({ row }: { row: Row }) => h(Button, {
        variant: 'secondary',
        size: 'sm',
        onClick: () => selectCustomer(row.original)
      }, () => [
        h(CreditCard, { class: 'mr-2 h-4 w-4' }),
        t('common.select')
      ]),
    },
  ];
}; 
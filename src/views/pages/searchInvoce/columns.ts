import { h } from 'vue';
import { Invoice } from '@/types/invoice';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import InvoiceActions from './InvoiceActions.vue';
import { useI18n } from 'vue-i18n';
import { ChevronRight, CreditCard } from 'lucide-vue-next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Row {
  original: Invoice;
}

export const useInvoiceColumns = () => {
  const { t } = useI18n();

  const renderLineItemsDialog = (row: Row) => {
    return h(Dialog, {}, {
      default: () => [
        h(DialogTrigger, { asChild: true }, () => 
          h('button', { 
            class: 'flex items-center gap-2 hover:bg-muted p-1 rounded transition-colors'
          }, [
            h(ChevronRight, { size: 16 }),
            row.original.docNumber
          ])
        ),
        h(DialogContent, { class: 'max-w-4xl w-full' }, () => [
          h(DialogHeader, {}, () => [
            h(DialogTitle, {}, () => [
              h('div', { class: 'flex items-center gap-5' }, [
                h('span', {}, `${t('invoices.lineItems.title')} - ${row.original.docNumber}`),
                h(Badge, {
                  variant: row.original.balance === 0 ? 'default' : 'destructive', 
                  class: row.original.balance === 0 ? 'bg-green-500' : ''
                }, () => row.original.balance === 0
                  ? t('invoices.columns.status.paid')
                  : t('invoices.columns.status.unpaid')
                )
              ])
            ])
          ]),
          // Customer Info Card
          h('div', { class: 'bg-muted/30 rounded-lg p-4 mb-6' }, [
            h('div', { class: 'grid grid-cols-3 gap-4' }, [
              h('div', [
                h('div', { class: 'text-sm text-muted-foreground' }, t('invoices.columns.customer')),
                h('div', { class: 'font-medium' }, row.original.customerName)
              ]),
              h('div', [
                h('div', { class: 'text-sm text-muted-foreground' }, t('invoices.columns.date')),
                h('div', { class: 'font-medium' }, formatDate(row.original.date))
              ]),
              h('div', [
                h('div', { class: 'text-sm text-muted-foreground' }, t('invoices.columns.dueDate')),
                h('div', { class: 'font-medium' }, formatDate(row.original.dueDate))
              ])
            ])
          ]),

          // Line Items Table
          h(Table, {}, {
            default: () => [
              h(TableHeader, {}, () => [
                h(TableRow, {}, () => [
                  h(TableHead, { class: 'w-[40%]' }, t('invoices.lineItems.item')),
                  h(TableHead, {}, t('invoices.lineItems.quantity')),
                  h(TableHead, {}, t('invoices.lineItems.amount')),
                  h(TableHead, { class: 'text-right' }, t('invoices.actions.title'))
                ])
              ]),
              h(TableBody, {}, () => 
                (row.original.lineItems || []).map((item, index) => 
                  h(TableRow, { key: index }, () => [
                    h(TableCell, { class: 'font-medium' }, [
                      h('div', {}, item.itemName),
                      item.description && h('div', { 
                        class: 'text-sm text-muted-foreground mt-1' 
                      }, item.description)
                    ]),
                    h(TableCell, {}, `${item.quantity} × ${formatCurrency(item.unitPrice)}`),
                    h(TableCell, { class: 'font-medium' }, formatCurrency(item.amount)),
                    h(TableCell, { class: 'text-right flex gap-2 justify-end' }, [
                      row.original.balance > 0 && h(Button, {
                        variant: 'outline',
                        size: 'sm',
                        onClick: () => {
                          console.log('Pay item:', index, item.itemName);
                        }
                      }, () => [
                        h(CreditCard, { class: 'mr-2 h-4 w-4' }),
                        t('invoices.actions.pay')
                      ]),
                      h(Button, {
                        variant: 'destructive',
                        size: 'sm',
                        onClick: () => {
                          console.log('Delete item:', index, item.itemName);
                        }
                      }, () => [
                        h('svg', {
                          xmlns: "http://www.w3.org/2000/svg",
                          width: "16",
                          height: "16",
                          viewBox: "0 0 24 24",
                          fill: "none",
                          stroke: "currentColor",
                          strokeWidth: "2",
                          strokeLinecap: "round",
                          strokeLinejoin: "round",
                          class: 'mr-2 h-4 w-4'
                        }, [
                          h('path', { d: "M3 6h18" }),
                          h('path', { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" }),
                          h('path', { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" })
                        ]),
                      ])
                    ])
                  ])
                )
              )
            ]
          }),

          // Footer with Totals
          h('div', { 
            class: 'mt-6 pt-4 border-t flex items-center justify-between'
          }, [
            h('div', { class: 'space-y-1' }, [
              h('div', { class: 'text-sm text-muted-foreground' }, 
                `${row.original.lineItems?.length || 0} ${t('invoices.lineItems.item')}(s)`
              ),
              row.original.memo && h('div', { class: 'text-sm text-muted-foreground' }, [
                h('span', { class: 'font-medium' }, `${t('invoices.memo')}: `),
                row.original.memo
              ])
            ]),
            h('div', { class: 'text-right space-y-1' }, [
              h('div', { class: 'text-sm text-muted-foreground' }, t('invoices.total')),
              h('div', { class: 'text-2xl font-bold' }, formatCurrency(row.original.totalAmount)),
              row.original.balance > 0 && h(Button, {
                class: 'mt-2',
                onClick: () => {
                  console.log('Pay full invoice:', row.original.docNumber);
                }
              }, () => [
                h(CreditCard, { class: 'mr-2 h-4 w-4' }),
                t('invoices.actions.payFull')
              ])
            ])
          ])
        ])
      ]
    });
  };

  return [
    {
      accessorKey: "docNumber",
      header: t('invoices.columns.number'),
      cell: ({ row }: { row: Row }) => renderLineItemsDialog(row)
    },
    {
      accessorKey: "customerName",
      header: t('invoices.columns.customer'),
      cell: ({ row }: { row: Row }) => row.original.customerName,
    },
    {
      accessorKey: "date",
      header: t('invoices.columns.date'),
      cell: ({ row }: { row: Row }) => formatDate(row.original.date),
    },
    {
      accessorKey: "dueDate",
      header: t('invoices.columns.dueDate'),
      cell: ({ row }: { row: Row }) => formatDate(row.original.dueDate),
    },
    {
      accessorKey: "totalAmount",
      header: t('invoices.columns.totalAmount'),
      cell: ({ row }: { row: Row }) => formatCurrency(row.original.totalAmount),
    },
    {
      accessorKey: "balance",
      header: t('invoices.columns.balance'),
      cell: ({ row }: { row: Row }) => {
        const isPaid = row.original.balance === 0;
        return h(Badge, {
          variant: isPaid ? 'default' : 'destructive',
          class: isPaid ? 'bg-green-500 hover:bg-green-600' : ''
        }, () => isPaid ? t('invoices.columns.status.paid') : formatCurrency(row.original.balance));
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }: { row: Row }) => h(InvoiceActions, { invoice: row.original }),
    },
  ];
};
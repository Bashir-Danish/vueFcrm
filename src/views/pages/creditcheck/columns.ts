import { ColumnDef } from "@tanstack/vue-table";
import { Checklist, Customer, Equipment } from "@/types/types";
import { h } from 'vue';
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

// Define a new interface that extends Checklist
interface ChecklistWithActions extends Checklist {
  onShowDetails: (id: string) => void;
}

export const getColumns = (t: any): ColumnDef<ChecklistWithActions>[] => [
  {
    accessorKey: "customerName",
    header: t('creditCheck.columns.customer'),
    cell: ({ row }) => {
      const customer = row.original.customerId as Customer;
      if (customer && typeof customer === 'object') {
        const name = customer.name ?? "No Name";
        const lastName = customer.lastName ?? "";
        return h(HoverCard, {}, {
          default: () => [
            h(HoverCardTrigger, {}, () => 
              h('span', { class: 'cursor-pointer underline capitalize' }, `${name} ${lastName}`)
            ),
            h(HoverCardContent, { class: 'w-64' }, () => [
              h('div', { class: 'space-y-1' }, [
                h('p', { class: 'text-sm font-medium' }, `${name} ${lastName}`),
                h('p', { class: 'text-sm' }, `${t('creditCheck.details.customerInfo.phone')}: ${customer.phones?.[0] || 'N/A'}`),
                h('p', { class: 'text-sm' }, `${t('creditCheck.details.customerInfo.email')}: ${customer.email || 'N/A'}`),
                h('p', { class: 'text-sm' }, `${t('creditCheck.details.customerInfo.address')}: ${customer.address || 'N/A'}`),
                h('p', { class: 'text-sm' }, `${t('creditCheck.details.customerInfo.customerType')}: ${customer.custType || 'N/A'}`),
                customer.custType === 'business' ? h('p', { class: 'text-sm' }, `${t('creditCheck.details.customerInfo.companyName')}: ${customer.companyName || 'N/A'}`) : null,
                customer.custType === 'business' ? h('p', { class: 'text-sm' }, `${t('creditCheck.details.customerInfo.licenseNo')}: ${customer.licenseNo || 'N/A'}`) : null,
                customer.custType === 'individual' ? h('p', { class: 'text-sm' }, `${t('creditCheck.details.customerInfo.nid')}: ${customer.nid || 'N/A'}`) : null,
              ])
            ])
          ]
        });
      }
      return "N/A";
    },
  },
  {
    accessorKey: "total",
    header: t('creditCheck.columns.total'),
    cell: ({ row }) => {
      const customer = row.original.customerId as Customer;
      let deviceTotal = 0;
      let packageTotal = 0;

      if (typeof customer === 'object' && customer !== null) {
        if (Array.isArray(customer.devices)) {
          deviceTotal = customer.devices.reduce((total, device) => {
            if (!device.device || typeof device.device !== 'object') return total;
            const devicePrice = (device.device as Equipment).price || 0;
            return total + (devicePrice * (device.quantity || 1));
          }, 0);
        }
        if (customer.currentService?.service?.Price) {
          packageTotal = parseFloat(customer.currentService.service.Price) || 0;
        }
      }

      const total = deviceTotal + packageTotal;

      return h('div', { class: 'space-y-1' }, [
        h('div', { class: 'text-sm' }, 
          `${t('creditCheck.details.devices.title')}: اف${deviceTotal.toFixed(2)}`
        ),
        h('div', { class: 'text-sm' }, 
          `${t('creditCheck.details.package.title')}: اف${packageTotal.toFixed(2)}`
        ),
        h('div', { class: 'font-bold' }, 
          `${t('creditCheck.details.totalAmount')}: اف${total.toFixed(2)}`
        )
      ]);
    },
  },
  {
    accessorKey: "status",
    header: t('creditCheck.columns.status'),
    cell: ({ row }) => {
      return h('span', { class: `px-2 py-1 rounded-full text-xs font-medium
        ${row.original.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
          row.original.status === 'done' ? 'bg-green-100 text-green-800' : 
          'bg-gray-100 text-gray-800'}` 
      }, row.original.status);
    },
  },
  {
    accessorKey: "createdAt",
    header: t('creditCheck.columns.createdAt'),
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      if (createdAt) {
        const date = new Date(createdAt);
        return h('span', { class: 'text-xs text-gray-500' }, [
          h('div', {}, date.toLocaleDateString()),
          h('div', {}, date.toLocaleTimeString())
        ]);
      }
      return h('span', { class: 'text-xs text-gray-500' }, 'N/A');
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      return h(Badge, {
        variant: 'outline',
        class: 'cursor-pointer hover:bg-primary hover:text-primary-foreground',
        onClick: () => row.original.onShowDetails(row.original._id)
      }, () => t('creditCheck.actions.check'));
    },
  },
];

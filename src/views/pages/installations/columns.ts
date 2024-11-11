import { h } from "vue";
import { ColumnDef } from "@tanstack/vue-table";
import { Installation } from "@/types/types";
import InstallationActions from "./InstallationActions.vue";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card/index";

const truncateText = (text: any, maxLength: number) => {
  const str = String(text);
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "...";
};

export const getColumns = (t: any): ColumnDef<Installation>[] => [
  {
    accessorKey: "customerId",
    header: t('installations.columns.customer'),
    cell: ({ row }) => {
      const customer = row.original.customerId;
      const name = customer?.name ?? "No Name";
      const lastName = customer?.lastName ?? "";
      const fullName = `${name} ${lastName}`.trim();
      
      return h(HoverCard, { openDelay: 10, closeDelay: 10 }, {
        default: () => [
          h(HoverCardTrigger, { asChild: true }, () => 
            h('span', { class: 'cursor-pointer underline capitalize' }, truncateText(fullName, 20))
          ),
          h(HoverCardContent, { class: 'w-72' }, () => [
            h('h4', { class: 'font-medium leading-none mb-2' }, t('installations.customerDetails.title')),
            h('p', { class: 'text-sm' }, [
              h('strong', `${t('installations.customerDetails.id')}: `),
              customer?.customerId ?? 'N/A'
            ]),
            h('p', { class: 'text-sm' }, [
              h('strong', 'Type: '),
              customer?.custType ?? 'N/A'
            ]),
            h('p', { class: 'text-sm' }, [
              h('strong', `${t('installations.customerDetails.email')}: `),
              customer?.email ?? 'N/A'
            ]),
            h('p', { class: 'text-sm' }, [
              h('strong', `${t('installations.customerDetails.address')}: `),
              customer?.address ?? 'N/A'
            ]),
            h('p', { class: 'text-sm' }, [
              h('strong', `${t('installations.customerDetails.phone')}: `),
              customer?.phones && customer.phones.length > 0 ? customer.phones[0] : 'N/A'
            ])
          ])
        ]
      });
    },
    meta: {
      width: "25%",
    },
  },
  {
    accessorKey: "status",
    header: t('installations.columns.status'),
    cell: ({ row }) => {
      const statusMap: { [key: string]: string } = {
        'pending': 'Pending',
        'in-progress': 'In Progress',
        'done': 'Done',
        'failed': 'Failed'
      };
      return statusMap[row.original.status] || row.original.status;
    },
    meta: {
      width: "18.75%",
    },
  },
  {
    accessorKey: "devices",
    header: t('installations.columns.devices'),
    cell: ({ row }) => {
      const devices = row.original.customerId?.devices ?? [];
      return h(HoverCard, { openDelay: 10, closeDelay: 10 }, {
        default: () => [
          h(HoverCardTrigger, { asChild: true }, () => 
            h('span', { class: 'cursor-pointer underline' }, 
              devices.length > 0 ? `${devices.length} device(s)` : t('installations.deviceDetails.noDevices')
            )
          ),
          h(HoverCardContent, { class: 'w-72' }, () => [
            h('h4', { class: 'font-medium leading-none mb-2' }, t('installations.deviceDetails.title')),
            devices.length > 0 
              ? devices.map((deviceItem: any, index: number) => 
                  h('div', { key: index, class: 'text-sm mt-2' }, [
                    h('p', [
                      h('strong', `${t('installations.deviceDetails.name')}: `),
                      deviceItem.device?.name ?? "N/A"
                    ]),
                    h('p', [
                      h('strong', `${t('installations.deviceDetails.quantity')}: `),
                      deviceItem.quantity ?? "N/A"
                    ])
                  ])
                )
              : h('p', { class: 'text-sm' }, t('installations.deviceDetails.noDevices'))
          ])
        ]
      });
    },
    meta: {
      width: "18.75%",
    },
  },
  {
    accessorKey: "type",
    header: t('installations.columns.type'),
    cell: ({ row }) => {
      const typeMap: { [key: string]: string } = {
        'installation': 'Installation',
        'troubleshooting': 'Troubleshooting'
      };
      return typeMap[row.original.type] || row.original.type;
    },
    meta: {
      width: "18.75%",
    },
  },
  {
    id: "actions",
    cell: ({ row }) => h(InstallationActions, { 
      installation: row.original,
      onInstallationUpdated: () => {} 
    }),
    header: "",
    meta: {
      width: "18.75%",
    },
  },
];

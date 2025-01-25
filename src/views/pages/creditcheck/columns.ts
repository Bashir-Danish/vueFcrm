import { ColumnDef } from "@tanstack/vue-table";
import { Branch, Checklist, Customer, Equipment } from "@/types/types";
import { h } from 'vue';
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { useMainStore } from "@/stores/main";
import IndeterminateCheckbox from "@/components/ui/indeterminate-checkbox/IndeterminateCheckbox.vue";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { 
  MoreHorizontal, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  RefreshCw, 
  EyeOff, 
  Settings,
  FileCheck
} from 'lucide-vue-next';

interface ChecklistWithActions extends Checklist {
  onShowDetails: (id: string) => void;
  selected?: boolean;
  createdAt?: Date;
  devices?: Array<{
    equipmentId: string | Equipment;
    quantity: number;
    _id: string;
  }>;
  service?: {
    service: {
      Service_Id: string;
      ServiceName: string;
      Description: string;
      Price: string;
      ServiceType: string;
      ISEnable: string;
      UserChoosable: string;
      ResellerChoosable: string;
    };
    startDate: Date;
    endDate: Date;
    serviceStatus: string;
    User_ServiceBase_Id: string;
  };
  branch_id?: string | Branch;
  sentToQuickbooks: boolean;
  customerCreatedInQB: boolean;
  invoiceCreated: boolean;
  isManual: boolean;
  isHidden: boolean;
}

export const getColumns = (
  t: any,
  toast: ReturnType<typeof useToast>['toast'],
  store: ReturnType<typeof useMainStore>
): ColumnDef<ChecklistWithActions>[] => [
  {
    id: "select",
    header: ({ table }) => {
      return h(IndeterminateCheckbox, {
        checked: table.getIsAllPageRowsSelected(),
        indeterminate: table.getIsSomePageRowsSelected(),
        onChange: (checked: boolean) => {
          console.log('Select all toggled:', checked);
          table.toggleAllPageRowsSelected(checked);
          // Emit event for all rows
          const allPageRows = table.getRowModel().rows;
          allPageRows.forEach(row => {
            window.dispatchEvent(new CustomEvent('row-selection-change', {
              detail: { 
                id: row.original._id,
                checked: checked
              }
            }));
          });
        },
      });
    },
    cell: ({ row }) => {
      return h(IndeterminateCheckbox, {
        checked: row.getIsSelected(),
        disabled: !row.getCanSelect(),
        indeterminate: row.getIsSomeSelected(),
        onChange: (checked: boolean) => {
          console.log('Row selection toggled:', row.original._id, checked);
          row.toggleSelected(checked);
          window.dispatchEvent(new CustomEvent('row-selection-change', {
            detail: { 
              id: row.original._id,
              checked: checked
            }
          }));
        },
      });
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "createdAt",
    header: () => h('div', { class: 'cursor-pointer' }, t('creditCheck.columns.createdAt')),
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
    sortingFn: 'datetime'
  },
  {
    accessorKey: "customerName",
    header: () => h('div', { class: 'cursor-pointer' }, t('creditCheck.columns.customer')),
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
            h(HoverCardContent, { class: 'w-96 p-4' }, () => [
              h('div', { class: 'space-y-3' }, [
                // Customer Type Badge
                h('div', { class: 'flex items-center gap-2' }, [
                  h('p', { class: 'text-lg font-semibold' }, `${name} ${lastName}`),
                  h('span', { 
                    class: 'px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800'
                  }, customer.custType)
                ]),

                // Common Information
                h('div', { class: 'grid grid-cols-2 gap-x-4 gap-y-2 text-sm' }, [
                  // Left Column - Basic Info
                  h('div', { class: 'space-y-1' }, [
                    h('p', {}, [
                      h('span', { class: 'text-gray-500' }, `${t('creditCheck.details.customerInfo.customerId')}: `),
                      h('span', { class: 'font-medium' }, customer.customerId || 'N/A')
                    ]),
                    h('p', {}, [
                      h('span', { class: 'text-gray-500' }, `${t('creditCheck.details.customerInfo.phone')}: `),
                      h('span', { class: 'font-medium' }, customer.phones?.[0] || 'N/A')
                    ]),
                    h('p', {}, [
                      h('span', { class: 'text-gray-500' }, `${t('creditCheck.details.customerInfo.email')}: `),
                      h('span', { class: 'font-medium' }, customer.email || 'N/A')
                    ])
                  ]),
                  
                  // Right Column - Type Specific Information
                  h('div', { class: 'space-y-1' }, [
                    // Individual specific information
                    customer.custType === 'individual' && h('p', {}, [
                      h('span', { class: 'text-gray-500' }, `${t('creditCheck.details.customerInfo.nid')}: `),
                      h('span', { class: 'font-medium' }, customer.nid || 'N/A')
                    ]),
                    
                    // Business specific information
                    customer.custType === 'business' && [
                      h('p', {}, [
                        h('span', { class: 'text-gray-500' }, `${t('creditCheck.details.customerInfo.companyName')}: `),
                        h('span', { class: 'font-medium' }, customer.companyName || 'N/A')
                      ]),
                      h('p', {}, [
                        h('span', { class: 'text-gray-500' }, `${t('creditCheck.details.customerInfo.licenseNo')}: `),
                        h('span', { class: 'font-medium' }, customer.licenseNo || 'N/A')
                      ]),
                      h('p', {}, [
                        h('span', { class: 'text-gray-500' }, `${t('creditCheck.details.customerInfo.activity')}: `),
                        h('span', { class: 'font-medium' }, customer.activity || 'N/A')
                      ])
                    ]
                  ])
                ]),

                // Internet Usage Information
                // h('div', { class: 'text-sm border-t pt-2 mt-2 space-y-1' }, [
                //   h('p', {}, [
                //     h('span', { class: 'text-gray-500' }, `${t('creditCheck.details.customerInfo.internetUsage')}: `),
                //     h('span', { class: 'font-medium' }, customer.internetUsage || 'N/A')
                //   ]),
                //   h('p', {}, [
                //     h('span', { class: 'text-gray-500' }, `${t('creditCheck.details.customerInfo.internetPurpose')}: `),
                //     h('span', { class: 'font-medium' }, customer.internetUsagePurpose || 'N/A')
                //   ]),
                //   h('p', {}, [
                //     h('span', { class: 'text-gray-500' }, `${t('creditCheck.details.customerInfo.previousPackage')}: `),
                //     h('span', { class: 'font-medium' }, customer.previousPackage || 'N/A')
                //   ]),
                //   h('p', {}, [
                //     h('span', { class: 'text-gray-500' }, `${t('creditCheck.details.customerInfo.familiarityWithUs')}: `),
                //     h('span', { class: 'font-medium' }, customer.familiarityWithUs || 'N/A')
                //   ])
                // ]),

                // Bottom Information
                h('div', { class: 'text-sm border-t pt-2 mt-2' }, [
                  h('p', {}, [
                    h('span', { class: 'text-gray-500' }, `${t('creditCheck.details.customerInfo.address')}: `),
                    h('span', { class: 'font-medium' }, customer.address || 'N/A')
                  ]),
                  h('p', {}, [
                    h('span', { class: 'text-gray-500' }, `${t('creditCheck.details.customerInfo.deltaId')}: `),
                    h('span', { class: 'font-medium' }, customer.deltaSibUserId || 'N/A')
                  ])
                ])
              ])
            ])
          ]
        });
      }
      return "N/A";
    },
    sortingFn: (rowA, rowB) => {
      const customerA = rowA.original.customerId as Customer;
      const customerB = rowB.original.customerId as Customer;
      return `${customerA.name} ${customerA.lastName || ''}`.localeCompare(
        `${customerB.name} ${customerB.lastName || ''}`
      );
    }
  },
  {
    accessorKey: "details",
    header: () => h('div', { class: 'cursor-pointer' }, t('creditCheck.columns.details')),
    cell: ({ row }) => {
      const item = row.original;

      if (item.type === 'device') {
        const deviceCount = item.devices?.length || 0;
        return h(HoverCard, {}, {
          default: () => [
            h(HoverCardTrigger, {}, () => 
              h('span', { class: 'cursor-pointer underline' }, `${deviceCount} ${deviceCount === 1 ? 'Device' : 'Devices'}`)
            ),
            h(HoverCardContent, { class: 'w-80' }, () => 
              h('div', { class: 'space-y-2' }, 
                item.devices?.map(device => {
                  const equipment = device.equipmentId as Equipment;
                  if (!equipment || typeof equipment === 'string') {
                    return h('div', { class: 'border-b pb-2' }, 
                      h('p', { class: 'text-sm' }, 'Equipment details not available')
                    );
                  }
                  
                  return h('div', { class: 'border-b pb-2' }, [
                    h('p', { class: 'font-medium' }, `${equipment.name} (${equipment.model})`),
                    h('p', { class: 'text-sm' }, `Company: ${equipment.company}`),
                    h('p', { class: 'text-sm' }, `Quantity: ${device.quantity}`),
                    h('p', { class: 'text-sm' }, `Price: اف${equipment.price} per ${equipment.unit}`),
                    h('p', { class: 'text-sm font-medium' }, `Subtotal: اف${(equipment.price * device.quantity).toFixed(2)}`)
                  ]);
                })
              )
            )
          ]
        });
      } else if (item.type === 'service' && item.service) {
        const service = item.service.service;
        if (service) {
          return h(HoverCard, {}, {
            default: () => [
              h(HoverCardTrigger, {}, () => 
                h('span', { class: 'cursor-pointer underline' }, service.ServiceName)
              ),
              h(HoverCardContent, { class: 'w-80' }, () => 
                h('div', { class: 'space-y-1' }, [
                  h('p', { class: 'font-medium' }, service.ServiceName),
                  h('p', { class: 'text-sm' }, `Description: ${service.Description}`),
                  h('p', { class: 'text-sm' }, `Price: اف${service.Price}`),
                  h('p', { class: 'text-sm' }, `Service ID: ${service.Service_Id}`),
                  h('p', { class: 'text-sm' }, `Status: ${item.service?.serviceStatus || 'N/A'}`),
                  h('p', { class: 'text-sm' }, `Start Date: ${item.service?.startDate ? new Date(item.service.startDate).toLocaleDateString() : 'N/A'}`),
                  h('p', { class: 'text-sm' }, `End Date: ${item.service?.endDate ? new Date(item.service.endDate).toLocaleDateString() : 'N/A'}`),
                  h('p', { class: 'text-sm' }, `Service Base ID: ${item.service?.User_ServiceBase_Id || 'N/A'}`),
                ])
              )
            ]
          });
        }
      }
      return 'N/A';
    },
    sortingFn: (rowA, rowB) => {
      if (rowA.original.type === 'device' && rowB.original.type === 'device') {
        return (rowA.original.devices?.length || 0) - (rowB.original.devices?.length || 0);
      }
      if (rowA.original.type === 'service' && rowB.original.type === 'service') {
        const serviceA = rowA.original.service?.service?.ServiceName || '';
        const serviceB = rowB.original.service?.service?.ServiceName || '';
        return serviceA.localeCompare(serviceB);
      }
      return 0;
    }
  },
  {
    accessorKey: "total",
    header: () => h('div', { class: 'cursor-pointer' }, t('creditCheck.columns.total')),
    cell: ({ row }) => {
      const totalPrice = row.original.totalPrice;
      if (typeof totalPrice === 'undefined') return h('div', { class: 'text-sm' }, 'اف0.00');
      return h('div', { class: 'text-sm' }, `اف${totalPrice.toFixed(2)}`);
    },
    sortingFn: (rowA, rowB) => {
      const priceA = typeof rowA.original.totalPrice === 'number' ? rowA.original.totalPrice : 0;
      const priceB = typeof rowB.original.totalPrice === 'number' ? rowB.original.totalPrice : 0;
      return priceA - priceB;
    }
  },
  {
    accessorKey: "status",
    header: () => h('div', { class: 'cursor-pointer' }, t('creditCheck.columns.status')),
    cell: ({ row }) => {
      return h('span', { class: `px-2 py-1 rounded-full text-xs font-medium
        ${row.original.isHidden ? 'bg-gray-100 text-gray-500' :
          row.original.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
          row.original.status === 'done' ? 'bg-green-100 text-green-800' : 
          'bg-gray-100 text-gray-800'}` 
      }, row.original.isHidden ? 'hidden' : row.original.status);
    },
    sortingFn: 'alphanumeric'
  },
  {
    accessorKey: "QB",
    header: () => h('div', { class: 'cursor-pointer' }, t('QB')),
    cell: ({ row }) => {
      const item = row.original;
      const syncStatus = getSyncStatus(item);
      return h('div', { 
        class: 'flex items-center',
        title: getSyncStatusTitle(item, t)
      }, [
        h(syncStatus.icon, { 
          class: `h-4 w-4 ${syncStatus.colorClass}`
        })
      ])
    },
    sortingFn: 'alphanumeric'
  },
  {
    id: "actions",
    header: () => h('div', {}, ""),
    cell: ({ row }) => {
      return h(Badge, {
        variant: 'outline',
        class: 'cursor-pointer hover:bg-primary hover:text-primary-foreground',
        onClick: () => row.original.onShowDetails(row.original._id)
      }, () => t('creditCheck.actions.check'));
    },
    enableSorting: false
  },
  {
    id: "location",
    header: () => h('div', {}, ""),
    cell: ({ row }) => {
      const item = row.original;
      const isSuccessful = item.sentToQuickbooks && item.invoiceCreated;
      const isFailed = item.status === 'done' && (!item.sentToQuickbooks || !item.invoiceCreated);

      return h('div', { class: 'flex items-center justify-between gap-2' }, [
        h(DropdownMenu, {}, {
          default: () => [
            h(DropdownMenuTrigger, { class: 'cursor-pointer' }, () => 
              h(MoreHorizontal, { class: 'h-4 w-4' })
            ),
            h(DropdownMenuContent, { align: 'end' }, () => [
              // Send/Resend option
              h(DropdownMenuItem, {
                onClick: () => {
                  if (!isSuccessful) {
                    window.dispatchEvent(new CustomEvent('resend-checklist', {
                      detail: { id: item._id }
                    }))
                  }
                },
                disabled: isSuccessful,
                class: 'flex items-center gap-2',
              }, () => [
                h(RefreshCw, { 
                  class: `h-4 w-4 ${isFailed ? 'text-destructive' : ''}`
                }),
                h('span', { 
                  class: isFailed ? 'text-destructive' : '' 
                }, t('creditCheck.actions.resend'))
              ]),

              // Try Again option
              h(DropdownMenuItem, {
                onClick: () => {
                  if (!isSuccessful) {
                    window.dispatchEvent(new CustomEvent('resend-checklist', {
                      detail: { id: item._id }
                    }))
                  }
                },
                disabled: isSuccessful,
                class: 'flex items-center gap-2',
              }, () => [
                h(AlertCircle, { 
                  class: `h-4 w-4 ${isFailed ? 'text-destructive' : ''}`
                }),
                h('span', { 
                  class: isFailed ? 'text-destructive' : '' 
                }, t('creditCheck.actions.tryAgain'))
              ]),

              h(DropdownMenuSeparator),

              // Manual sync toggle
              h(DropdownMenuItem, {
                onClick: async () => {
                  try {
                    await store.toggleManualStatus(item._id, !item.isManual);
                    toast({
                      title: t('creditCheck.notifications.manual.title'),
                      description: t('creditCheck.notifications.manual.description')
                    });
                  } catch (error) {
                    toast({
                      title: t('creditCheck.notifications.error.title'),
                      description: t('creditCheck.notifications.error.description'),
                      variant: 'destructive'
                    });
                  }
                },
                class: 'flex items-center gap-2'
              }, () => [
                h(Settings, { class: 'h-4 w-4' }),
                h('span', {}, item.isManual ? 
                  t('creditCheck.actions.unsetManual') : 
                  t('creditCheck.actions.setManual')
                )
              ]),

              // Hide/Unhide option
              h(DropdownMenuItem, {
                onClick: async () => {
                  try {
                    await store.toggleHideStatus(item._id);
                    toast({
                      title: t('creditCheck.notifications.hidden.title'),
                      description: t('creditCheck.notifications.hidden.description')
                    });
                  } catch (error) {
                    toast({
                      title: t('creditCheck.notifications.error.title'),
                      description: t('creditCheck.notifications.error.description'),
                      variant: 'destructive'
                    });
                  }
                },
                class: 'flex items-center gap-2'
              }, () => [
                h(EyeOff, { class: 'h-4 w-4' }),
                h('span', {}, t(item.isHidden ? 'creditCheck.actions.unhide' : 'creditCheck.actions.hide'))
              ])
            ])
          ]
        })
      ]);
    }
  },
];

const getSyncStatus = (item: ChecklistWithActions) => {
  if (item.isManual) {
    return {
      icon: FileCheck,
      colorClass: 'text-blue-500',
      status: 'manual'
    };
  }

  if (item.status !== 'done') {
    return {
      icon: AlertCircle,
      colorClass: 'text-gray-400',
      status: 'pending'
    };
  }

  if (item.sentToQuickbooks && item.invoiceCreated) {
    return {
      icon: CheckCircle2,
      colorClass: 'text-green-500',
      status: 'success'
    };
  }

  return {
    icon: XCircle,
    colorClass: 'text-red-500',
    status: 'failed'
  };
};

const getSyncStatusTitle = (item: ChecklistWithActions, t: any) => {
  if (item.isManual) {
    return t('creditCheck.sync.manual');
  }

  if (item.status !== 'done') {
    return t('creditCheck.sync.pending');
  }

  if (item.sentToQuickbooks && item.invoiceCreated) {
    return t('creditCheck.sync.success');
  }

  return t('creditCheck.sync.failed');
};

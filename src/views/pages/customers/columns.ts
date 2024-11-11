import { Customer } from "@/types/types";
import CustomerActions from "./CustomerActions.vue";
import { h, computed, ref } from 'vue';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card/index";
import { useI18n } from 'vue-i18n';
import { Eye, EyeOff } from 'lucide-vue-next';

interface Row {
  original: Customer;
}

const truncateText = (text: any, maxLength: number) => {
  const str = String(text);
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "...";
};

export const useCustomerColumns = () => {
  const { t } = useI18n();
  const showPassword = ref(false);
  
  // Make columns reactive using computed and ensure it always returns an array
  const columns = computed(() => {
    try {
      return [
        {
          accessorKey: "customerId",
          header: t('customers.columns.id'),
          cell: ({ row }: { row: Row }) => {
            const customerId = row.original.customerId;
            return h('div', { class: 'px-5' }, [
              h('span', { title: customerId?.toString() }, customerId)
            ]);
          },
        },
        {
          accessorKey: "name",
          header: t('customers.columns.name'),
          cell: ({ row }: { row: Row }) => {
            const togglePassword = () => {
              showPassword.value = !showPassword.value;
            };

            if (row.original.custType === "individual") {
              const name = row.original.name ?? t('customers.noName');
              const lastName = row.original.lastName ?? "";
              return h(HoverCard, { openDelay: 10, closeDelay: 10 }, {
                default: () => [
                  h(HoverCardTrigger, { asChild: true }, () =>
                    h('span', { title: `${name} ${lastName}` }, 
                      `${truncateText(name, 10)} ${truncateText(lastName, 10)}`
                    )
                  ),
                  h(HoverCardContent, { class: 'w-48 rtl:text-right' }, () => [
                    h('div', { class: 'space-y-2' }, [
                      h('p', { class: 'text-sm' }, [
                        h('strong', 'Username: '),
                        row.original.username || 'N/A'
                      ]),
                      h('div', { class: 'flex items-center gap-2' }, [
                        h('strong', { class: 'text-sm' }, 'Password: '),
                        h('span', { class: 'text-sm' }, 
                          showPassword.value ? (row.original.password || 'N/A') : '*'.repeat(row.original.password?.length || 0)
                        ),
                        h('button', {
                          onClick: togglePassword,
                          class: 'rtl:mr-2 ltr:ml-2 p-1 hover:bg-secondary rounded-full'
                        }, [
                          h(showPassword.value ? EyeOff : Eye, { size: 16 })
                        ])
                      ])
                    ])
                  ])
                ]
              });
            } else {
              const companyName = row.original.companyName ?? t('customers.noCompany');
              return h(HoverCard, { openDelay: 10, closeDelay: 10 }, {
                default: () => [
                  h(HoverCardTrigger, { asChild: true }, () =>
                    h('span', { title: companyName }, truncateText(companyName, 20))
                  ),
                  h(HoverCardContent, { class: 'w-48 rtl:text-right' }, () => [
                    h('div', { class: 'space-y-2' }, [
                      h('p', { class: 'text-sm' }, [
                        h('strong', 'Username: '),
                        row.original.username || 'N/A'
                      ]),
                      h('div', { class: 'flex items-center gap-2' }, [
                        h('strong', { class: 'text-sm' }, 'Password: '),
                        h('span', { class: 'text-sm' }, 
                          showPassword.value ? (row.original.password || 'N/A') : '*'.repeat(row.original.password?.length || 0)
                        ),
                        h('button', {
                          onClick: togglePassword,
                          class: 'rtl:mr-2 ltr:ml-2 p-1 hover:bg-secondary rounded-full'
                        }, [
                          h(showPassword.value ? EyeOff : Eye, { size: 16 })
                        ])
                      ])
                    ])
                  ])
                ]
              });
            }
          },
        },
        {
          accessorKey: "licenseOrNID",
          header: t('customers.columns.licenseOrNID'),
          cell: ({ row }: { row: Row }) => {
            const value = row.original.custType === "individual" ? row.original.nid : row.original.licenseNo;
            return h('span', { title: String(value) }, truncateText(String(value), 15));
          },
        },
        {
          accessorKey: "email",
          header: t('customers.columns.email'),
          cell: ({ row }: { row: Row }) => {
            const email = row.original.email ?? "N/A";
            return h('span', { title: email }, truncateText(email, 15));
          },
        },
        {
          accessorKey: "address",
          header: t('customers.columns.address'),
          cell: ({ row }: { row: Row }) => {
            const address = row.original.address ?? "N/A";
            return h('span', { title: address }, truncateText(address, 30));
          },
        },
        {
          accessorKey: "phones",
          header: t('customers.columns.phones'),
          cell: ({ row }: { row: Row }) => {
            const phones = row.original.phones ?? [];
            return h(HoverCard, { openDelay: 10, closeDelay: 10 }, {
              default: () => [
                h(HoverCardTrigger, { asChild: true }, () => 
                  h('span', { class: 'cursor-pointer underline' }, 
                    phones.length > 0 ? phones[0] : t('customers.columns.noPhone')
                  )
                ),
                h(HoverCardContent, { class: 'w-48 rtl:text-right' }, () => [
                  h('h4', { class: 'font-medium leading-none' }, t('customers.columns.phones')),
                  phones.length > 0 
                    ? phones.map((phone: string, index: number) => 
                        h('p', { key: index, class: 'text-sm' }, phone)
                      )
                    : h('p', { class: 'text-sm' }, t('customers.columns.noPhone'))
                ])
              ]
            });
          },
        },
        {
          accessorKey: "customFields",
          header: t('customers.columns.fields'),
          cell: ({ row }: { row: Row }) => {
            const customFields = row.original.customFields ?? [];
            return h(HoverCard, { openDelay: 10, closeDelay: 10 }, {
              default: () => [
                h(HoverCardTrigger, { asChild: true }, () => 
                  h('span', { class: 'cursor-pointer' }, 
                    customFields.length > 0 ? customFields[0].key : t('customers.columns.noFields')
                  )
                ),
                h(HoverCardContent, { class: 'w-48' }, () => [
                  h('h4', { class: 'font-medium leading-none' }, t('customers.columns.fields')),
                  customFields.length > 0 
                    ? customFields.map((field: any, index: number) => 
                        h('div', { key: index, class: 'text-sm' }, [
                          h('p', [
                            h('strong', `${field.key}: `),
                            field.value
                          ])
                        ])
                      )
                    : h('p', { class: 'text-sm' }, t('customers.columns.noFields'))
                ])
              ]
            });
          },
        },
        {
          accessorKey: "devices",
          header: t('customers.columns.devices'),
          cell: ({ row }: { row: Row }) => {
            const devices = row.original.devices ?? [];
            return h(HoverCard, { openDelay: 10, closeDelay: 10 }, {
              default: () => [
                h(HoverCardTrigger, { asChild: true }, () => 
                  h('span', { class: 'cursor-pointer underline' }, 
                    devices.length > 0 ? t('customers.columns.deviceCount', { count: devices.length }) : t('customers.columns.noDevices')
                  )
                ),
                h(HoverCardContent, { class: 'w-40' }, () => [
                  h('h4', { class: 'font-medium leading-none' }, t('customers.columns.devices')),
                  devices.length > 0 
                    ? devices.map((deviceItem: any, index: number) => 
                        h('div', { key: index, class: 'text-sm mt-2' }, [
                          h('p', [
                            h('strong', `${t('customers.devices.table.name')}: `),
                            deviceItem.device?.name ?? "N/A"
                          ]),
                          h('p', [
                            h('strong', `${t('customers.devices.table.quantity')}: `),
                            deviceItem.quantity ?? "N/A"
                          ])
                        ])
                      )
                    : h('p', { class: 'text-sm' }, t('customers.columns.noDevices'))
                ])
              ]
            });
          },
        },
        {
          id: "actions",
          cell: ({ row }: { row: Row }) => h(CustomerActions, { customer: row.original }),
          header: "",
        },
      ];
    } catch (error) {
      console.error('Error creating columns:', error);
      return []; // Return empty array as fallback
    }
  });

  return columns;
};

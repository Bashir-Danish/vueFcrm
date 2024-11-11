import { h } from "vue";
import { ColumnDef } from "@tanstack/vue-table";
import { Branch } from "@/types/types";
import BranchActions from "./BranchActions.vue";

export const getColumns = (t: any): ColumnDef<Branch>[] => [
  {
    accessorKey: "name",
    header: t('branches.columns.name'),
    cell: ({ row }) => h('div', { 
      class: 'w-full rtl:text-right ltr:text-left' 
    }, row.getValue('name')),
  },
  {
    accessorKey: "location",
    header: t('branches.columns.location'),
    cell: ({ row }) => h('div', { 
      class: 'w-full rtl:text-right ltr:text-left' 
    }, row.getValue('location')),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => h(BranchActions, { branch: row.original }),
  },
];

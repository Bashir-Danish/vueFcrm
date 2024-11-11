import { ColumnDef } from "@tanstack/vue-table";
import { User } from "@/types/types";
import UserActions from "./UserActions.vue";
import { h } from 'vue';
import { useI18n } from 'vue-i18n';

// Create a function that returns the columns with translations
export const createColumns = () => {
  const { t } = useI18n();

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "cartId",
      header: t('users.columns.cartId'),
      cell: ({ row }) => {
        return h('div', { class: 'px-5' }, [
          h('div', row.original.cartId)
        ]);
      },
    },
    {
      accessorKey: "name",
      header: t('users.columns.name'),
      cell: ({ row }) => {
        return h('div', {}, row.getValue('name'));
      },
    },
    {
      accessorKey: "email",
      header: t('users.columns.email'),
      cell: ({ row }) => {
        return h('div', {}, row.getValue('email'));
      },
    },
    {
      accessorKey: "role",
      header: t('users.columns.role'),
      cell: ({ row }) => {
        return h('span', {}, row.original.role);
      },
    },
    {
      accessorKey: "branch_id",
      header: t('users.columns.branch'),
      cell: ({ row }) => {
        if (row.original.branch_id && typeof row.original.branch_id === 'object') {
          return h('span', { class: 'text-gray-500' }, `${row.original.branch_id.name}`);
        } else {
          return h('span', { class: 'text-yellow-600' }, t('users.columns.unassigned'));
        }
      },
    },
    {
      id: "actions",
      cell: ({ row }) => h(UserActions, { user: row.original, onUserUpdated: () => {} }),
      header: "",
    },
  ];

  return columns;
};

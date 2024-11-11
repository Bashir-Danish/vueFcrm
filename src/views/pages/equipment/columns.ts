import { ColumnDef } from "@tanstack/vue-table";
import { Equipment } from "@/types/types";
import EquipmentActions from "@/views/pages/equipment/EquipmentActions.vue";
import { h } from 'vue';
import { useI18n } from 'vue-i18n';

// Create a composable to get the translated columns
export const useEquipmentColumns = () => {
  const { t } = useI18n();
  
  const columns: ColumnDef<Equipment>[] = [
    {
      accessorKey: "name",
      header: t('equipment.columns.name'),
    },
    {
      accessorKey: "model",
      header: t('equipment.columns.model'),
    },
    {
      accessorKey: "company",
      header: t('equipment.columns.company'),
    },
    {
      accessorKey: "unit",
      header: t('equipment.columns.unit'),
    },
    {
      accessorKey: "price",
      header: t('equipment.columns.price'),
      cell: ({ row }) => {
        return h('div', `$${row.original.price.toFixed(2)}`);
      },
    },
    {
      id: "actions",
      cell: ({ row }) => h(EquipmentActions, { equipment: row.original }),
      header: "",
    },
  ];

  return columns;
};
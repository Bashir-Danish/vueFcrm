import { ColumnDef } from "@tanstack/vue-table";
import { AssignedTask } from "@/types/types";
import { h } from "vue";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import TaskActions from "@/views/pages/installer_tasks/TaskActions.vue";

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

export const columns: ColumnDef<AssignedTask>[] = [
  {
    accessorKey: "installationId.customerId.name",
    header: "Customer",
    cell: ({ row }) => {
      const customer =
        row.original.installationId &&
        typeof row.original.installationId !== "string"
          ? row.original.installationId.customerId
          : null;
      const name = customer ? `${customer.name} ${customer.lastName}` : "N/A";
      return h(HoverCard, { openDelay: 10, closeDelay: 10 }, {
        default: () => [
          h(HoverCardTrigger, { asChild: true }, () =>
            h("span", { class: "cursor-pointer underline capitalize" }, truncateText(name, 20))
          ),
          h(HoverCardContent, { class: "w-72" }, () => [
            h("h4", { class: "font-medium leading-none" }, "Customer Details"),
            h("p", { class: "text-sm capitalize" }, [
              h("strong", "Name: "),
              name
            ]),
            h("p", { class: "text-sm" }, [
              h("strong", "Phone: "),
              customer && customer.phones ? customer.phones[0] : "N/A"
            ]),
            h("p", { class: "text-sm" }, [
              h("strong", "Email: "),
              customer ? customer.email : "N/A"
            ]),
            h("p", { class: "text-sm" }, [
              h("strong", "Address: "),
              customer ? customer.address : "N/A"
            ])
          ])
        ]
      });
    },
  },
  {
    accessorKey: "installationId.type",
    header: "Installation Type",
    cell: ({ row }) => {
      const type =
        row.original.installationId &&
        typeof row.original.installationId !== "string"
          ? row.original.installationId.type
          : "N/A";
      return h("span", { title: type }, truncateText(type, 15));
    },
  },
//   {
//     accessorKey: "status",
//     header: "Status",
//     cell: ({ row }) => {
//       const status = row.original.status ?? "N/A";
//       return h(
//         "span",
//         {
//           class: `px-2 py-1 rounded-full text-xs font-medium ${
//             status === "assigned"
//               ? "bg-blue-100 text-blue-800"
//               : status === "in-progress"
//               ? "bg-yellow-100 text-yellow-800"
//               : status === "completed"
//               ? "bg-green-100 text-green-800"
//               : status === "cancelled"
//               ? "bg-red-100 text-red-800"
//               : "bg-gray-100 text-gray-800"
//           }`,
//         },
//         status
//       );
//     },
//   },
  {
    accessorKey: "assignedAt",
    header: "Assigned At",
    cell: ({ row }) => {
      const date = new Date(row.original.assignedAt);
      return h("span", {}, date.toLocaleString());
    },
  },
  {
    accessorKey: "installationId.customerId.address",
    header: "Address",
    cell: ({ row }) => {
      const address =
        row.original.installationId &&
        typeof row.original.installationId !== "string" &&
        row.original.installationId.customerId
          ? row.original.installationId.customerId.address
          : "N/A";
      return h(
        HoverCard,
        { openDelay: 10, closeDelay: 10 },
        {
          default: () => [
            h(HoverCardTrigger, { asChild: true }, () =>
              h(
                "span",
                { class: "cursor-pointer underline" },
                truncateText(address, 20)
              )
            ),
            h(HoverCardContent, { class: "w-72" }, () => [
              h("p", { class: "text-sm" }, address),
            ]),
          ],
        }
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => h(TaskActions, { task: row.original }),
    header: "",
  },
];

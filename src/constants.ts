import {
  BarChart3,
  UserCircle,
  Package,
  WalletCards,
  Search,
  UserRoundCog,
  ListTodo,
  Router,
  Settings,
  Building2,
  ClipboardList,
  Receipt,
} from 'lucide-vue-next';

const roleBasedSidebarLinks = [
  {
    label: "sidebar.dashboard",
    href: "/",
    icon: BarChart3,
    access: ["admin", "noc", "installer","sales", "financeAdmin","creditChecker", "cashier"],
    show: true,
  },
  {
    label: "sidebar.branches",
    href: "/branches",
    icon: Building2,
    access: ["admin", "financeAdmin","cashier"],
    show: true,
  },
  {
    label: "sidebar.tasks",
    href: "/tasks",
    icon: ClipboardList,
    access: ["admin", "financeAdmin" , "installer"],
    show: true,
  },
  {
    label: "sidebar.sales.main",
    href: "/customer",
    icon: WalletCards,
    access: ["admin", "cashier","sales", "financeAdmin", "noc" , "installer"],
    show: true,
    children: [
      {
        label: "sidebar.sales.findCustomer",
        href: "/customers/search",
        icon: Search,
        access: ["admin", "cashier"],
        show: true,
      },
      {
        label: "sidebar.sales.customersList",
        href: "/customers",
        icon: UserCircle,
        access: ["admin", "cashier"],
        show: true,
      },
      {
        label: "sidebar.sales.addCustomer",
        href: "/customers/manage",
        icon: UserRoundCog,
        access: ["admin", "cashier"],
        show: true,
      },
    ],
  },
  {
    label: "sidebar.equipment",
    href: "/equipment/list",
    icon: Package,
    access: ["admin", "cashier" ,"sales"],
    show: true,
  },
  {
    label: "sidebar.creditCheck",
    href: "/creditcheck",
    icon: ListTodo,
    access: ["admin", "creditChecker"],
    show: true,
  },
  {
    label: "sidebar.installations",
    href: "/installations",
    icon: Router,
    access: ["admin", "noc", "financeAdmin" , "installer"],
    show: true,
  },
  {
    label: "sidebar.invoices.main",
    href: "/invoices",
    icon: Receipt,
    access: ["admin", "cashier"],
    show: true,
    children: [
      {
        label: "sidebar.invoices.search",
        href: "/invoices/search",
        icon: Search,
        access: ["admin", "cashier"],
        show: true,
      },
      {
        label: "sidebar.invoices.list",
        href: "/invoices",
        icon: Receipt,
        access: ["admin", "cashier"],
        show: true,
      }
    ]
  },
  {
    label: "sidebar.users",
    href: "/users",
    icon: UserCircle,
    access: ["admin", "cashier", "noc"],
    show: true,
  },
  {
    label: "sidebar.settings",
    href: "/settings",
    icon: Settings,
    access: ["admin", "cashier", "noc", "financeAdmin", "sales", "installer","creditChecker"],
    show: true,
  },
  {
    label: "sidebar.tasks",
    href: "/reset-password",
    icon: ClipboardList,
    access: ["admin", "cashier", "noc", "financeAdmin", "sales", "installer","creditChecker"],
    show: false,
  },
];

export default roleBasedSidebarLinks;
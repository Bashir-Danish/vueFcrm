import { Router } from "vue-router";
import LayoutContainer from "@/views/layouts/base/LayoutContainer.vue";
import UsersHome from "@/views/pages/users/UsersHome.vue";
import QuickBooksConnect from "@/views/pages/quickbooks/QuickBooksConnect.vue";

const createDefaultRouter = (router: Router): void => {
  router.addRoute({
    path: "/",
    component: LayoutContainer,
    children: [
      {
        path: "",
        name: "dashboard",
        component: () => import("@/views/pages/dashboard/DashboardHome.vue"),
      },
      {
        path: "branches",
        name: "branches",
        component: () => import("@/views/pages/branches/BranchesHome.vue"),
      },
      {
        path: "tasks",
        name: "installer_tasks",
        component: () => import("@/views/pages/installer_tasks/page.vue"),
      },
      {
        path: "customers",
        children: [
          {
            path: "",
            name: "customersList",
            component: () =>
              import("@/views/pages/customers/CustomersList.vue"),
          },
          {
            path: "search",
            name: "customersSearch",
            component: () =>
              import("@/views/pages/customers/CustomersSearch.vue"),
          },
          {
            path: "manage",
            name: "customersManage",
            component: () =>
              import("@/views/pages/customers/manage/CustomersManage.vue"),
          },
        ],
      },
      {
        path: "equipment",
        children: [
          {
            path: "list",
            name: "equipmentList",
            component: () =>
              import("@/views/pages/equipment/EquipmentList.vue"),
          },
        ],
      },
      {
        path: "receipts",
        name: "receipts",
        component: () => import("@/views/pages/receipts/ReceiptsHome.vue"),
      },
      {
        path: "invoices",
        children: [
          {
            path: "",
            name: "invoices",
            component: () => import("@/views/pages/invoices/InvoicesList.vue"),
          },
          {
            path: "search",
            name: "invoicesSearch", 
            component: () => import("@/views/pages/searchInvoce/InvoicesList.vue"),
          }
        ]
      },
      {
        path: "payments/payment",
        name: "payment",
        component: () => import("@/views/pages/payments/Payment.vue"),
      },
      {
        path: "payments/receive/:customerId",
        name: "receivePayment",
        component: () => import("@/views/pages/payments/ReceivePayment.vue"),
      },
      {
        path: "payments",
        name: "payments",
        component: () => import("@/views/pages/payments/PaymentsList.vue"),
      },
      {
        path: "creditcheck",
        name: "creditCheck",
        component: () =>
          import("@/views/pages/creditcheck/CreditCheckHome.vue"),
      },
      {
        path: "installations",
        children: [
          {
            path: "",
            name: "installations",
            component: () =>
              import("@/views/pages/installations/InstallationsList.vue"),
          },
          {
            path: "assign",
            name: "installationsAssign",
            component: () =>
              import("@/views/pages/installations/InstallationsAssign.vue"),
          },
        ],
      },
      {
        path: "users",
        name: "users",
        component: () => import("@/views/pages/users/UsersHome.vue"),
      },
      {
        path: "settings",
        name: "settings",
        component: () => import("@/views/pages/settings/SettingsHome.vue"),
      },
      {
        path: "help",
        name: "help",
        component: () => import("@/views/pages/help/HelpHome.vue"),
      },
      {
        path: "/users",
        name: "Users",
        component: UsersHome,
        meta: {
          requiresAuth: true,
          layout: "default",
        },
      },
      {
        path: "/profile",
        children: [
          {
            path: "",
            name: "Profile",
            component: () => import("@/views/pages/profile/ProfilePage.vue"),
          },
          {
            path: "reset-password",
            name: "ProfileResetPassword",
            component: () => import("@/views/pages/profile/ResetPassword.vue"),
          }
        ]
      },
      {
        path: "/quickbooks-connect",
        name: "QuickBooksConnect",
        component: QuickBooksConnect,
        meta: {
          requiresAuth: true,
          allowedRoles: ['admin']
        }
      },
    ],
  });

  createHttpRouter(router);
  createUserRouter(router);
  createFormRouter(router);
  createCardRouter(router);
};

/**
 * Create an HTTP router with a route for common errors.
 *
 * @param {Router} router - the router to add the route to
 * @return {void}
 */
const createHttpRouter = (router: Router): void => {
  router.addRoute({
    path: "/403",
    name: "forbidden",
    component: () => import("@/views/common/error/Forbidden.vue"),
  });

  router.addRoute({
    path: "/:pathMatch(.*)*",
    name: "notFound",
    component: () => import("@/views/common/error/NotFound.vue"),
  });
};

/**
 * Creates a user router.
 *
 * @param {Router} router - the router to add the user routes to
 * @return {void}
 */
const createUserRouter = (router: Router): void => {
  router.addRoute({
    path: "/user",
    name: "user",
    children: [
      {
        name: "forgot",
        path: "forgot",
        children: [
          {
            name: "password",
            path: "password",
            component: () => import("@/views/pages/user/ForgotPassword.vue"),
          },
        ],
      },
    ],
  });
};

const createFormRouter = (router: Router): void => {
  router.addRoute({
    path: "/forms",
    name: "form",
    component: LayoutContainer,
    children: [
      {
        name: "basic",
        path: "basic",
        component: () => import("@/views/pages/form/FormBasic.vue"),
      },
      {
        name: "withAction",
        path: "withAction",
        component: () => import("@/views/pages/form/FormWithAction.vue"),
      },
      {
        name: "withSplitField",
        path: "withSplitField",
        component: () => import("@/views/pages/form/FormWithSplitField.vue"),
      },
      {
        name: "withImage",
        path: "withImage",
        component: () => import("@/views/pages/form/FormWithImage.vue"),
      },
      {
        name: "withThird",
        path: "withThird",
        component: () => import("@/views/pages/form/FormWithThird.vue"),
      },
      {
        name: "withValidate",
        path: "withValidate",
        component: () => import("@/views/pages/form/FormWithValidate.vue"),
      },
    ],
  });
};

const createCardRouter = (router: Router): void => {
  router.addRoute({
    path: "/cards",
    name: "cardExample",
    component: LayoutContainer,
    children: [
      {
        name: "index",
        path: "index",
        component: () => import("@/views/pages/card/CardHome.vue"),
      },
      {
        name: "git",
        path: "git",
        component: () => import("@/views/pages/card/CardWithGit.vue"),
      },
      {
        name: "team",
        path: "team",
        component: () => import("@/views/pages/card/CardWithTeam.vue"),
      },
    ],
  });
};





export { createDefaultRouter };

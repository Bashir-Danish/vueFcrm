import { Router } from "vue-router";
import LayoutContainer from "@/views/layouts/base/LayoutContainer.vue";
import UsersHome from "@/views/pages/users/UsersHome.vue";
import QuickBooksConnect from "@/views/pages/quickbooks/QuickBooksConnect.vue";

const createDefaultRouter = (router: Router): void => {
  router.addRoute({
    path: "/",
    component: LayoutContainer,
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "dashboard",
        component: () => import("@/views/pages/dashboard/DashboardHome.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "branches",
        name: "branches",
        component: () => import("@/views/pages/branches/BranchesHome.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "tasks",
        name: "installer_tasks",
        component: () => import("@/views/pages/installer_tasks/page.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "customers",
        meta: { requiresAuth: true },
        children: [
          {
            path: "",
            name: "customersList",
            component: () =>
              import("@/views/pages/customers/CustomersList.vue"),
            meta: { requiresAuth: true },
          },
          {
            path: "search",
            name: "customersSearch",
            component: () =>
              import("@/views/pages/customers/CustomersSearch.vue"),
            meta: { requiresAuth: true },
          },
          {
            path: "manage",
            name: "customersManage",
            component: () =>
              import("@/views/pages/customers/manage/CustomersManage.vue"),
            meta: { requiresAuth: true },
          },
        ],
      },
      {
        path: "equipment",
        meta: { requiresAuth: true },
        children: [
          {
            path: "list",
            name: "equipmentList",
            component: () =>
              import("@/views/pages/equipment/EquipmentList.vue"),
            meta: { requiresAuth: true },
          },
        ],
      },
      {
        path: "receipts",
        name: "receipts",
        component: () => import("@/views/pages/receipts/ReceiptsHome.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "invoices",
        meta: { requiresAuth: true },
        children: [
          {
            path: "",
            name: "invoices",
            component: () => import("@/views/pages/invoices/InvoicesList.vue"),
            meta: { requiresAuth: true },
          },
          {
            path: "search",
            name: "invoicesSearch", 
            component: () => import("@/views/pages/searchInvoce/InvoicesList.vue"),
            meta: { requiresAuth: true },
          }
        ]
      },
      {
        path: "payments/payment",
        name: "payment",
        component: () => import("@/views/pages/payments/Payment.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "payments/receive/:customerId",
        name: "receivePayment",
        component: () => import("@/views/pages/payments/ReceivePayment.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "payments",
        name: "payments",
        component: () => import("@/views/pages/payments/PaymentsList.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "creditcheck",
        name: "creditCheck",
        component: () =>
          import("@/views/pages/creditcheck/CreditCheckHome.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "installations",
        meta: { requiresAuth: true },
        children: [
          {
            path: "",
            name: "installations",
            component: () =>
              import("@/views/pages/installations/InstallationsList.vue"),
            meta: { requiresAuth: true },
          },
          {
            path: "assign",
            name: "installationsAssign",
            component: () =>
              import("@/views/pages/installations/InstallationsAssign.vue"),
            meta: { requiresAuth: true },
          },
        ],
      },
      {
        path: "users",
        name: "users",
        component: () => import("@/views/pages/users/UsersHome.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "settings",
        name: "settings",
        component: () => import("@/views/pages/settings/SettingsHome.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "help",
        name: "help",
        component: () => import("@/views/pages/help/HelpHome.vue"),
        meta: { requiresAuth: true },
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
        meta: { requiresAuth: true },
        children: [
          {
            path: "",
            name: "Profile",
            component: () => import("@/views/pages/profile/ProfilePage.vue"),
            meta: { requiresAuth: true },
          },
          {
            path: "reset-password",
            name: "ProfileResetPassword",
            component: () => import("@/views/pages/profile/ResetPassword.vue"),
            meta: { requiresAuth: true },
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
    meta: { requiresAuth: true },
    children: [
      {
        name: "forgot",
        path: "forgot",
        meta: { requiresAuth: true },
        children: [
          {
            name: "password",
            path: "password",
            component: () => import("@/views/pages/user/ForgotPassword.vue"),
            meta: { requiresAuth: true },
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
    meta: { requiresAuth: true },
    children: [
      {
        name: "basic",
        path: "basic",
        component: () => import("@/views/pages/form/FormBasic.vue"),
        meta: { requiresAuth: true },
      },
      {
        name: "withAction",
        path: "withAction",
        component: () => import("@/views/pages/form/FormWithAction.vue"),
        meta: { requiresAuth: true },
      },
      {
        name: "withSplitField",
        path: "withSplitField",
        component: () => import("@/views/pages/form/FormWithSplitField.vue"),
        meta: { requiresAuth: true },
      },
      {
        name: "withImage",
        path: "withImage",
        component: () => import("@/views/pages/form/FormWithImage.vue"),
        meta: { requiresAuth: true },
      },
      {
        name: "withThird",
        path: "withThird",
        component: () => import("@/views/pages/form/FormWithThird.vue"),
        meta: { requiresAuth: true },
      },
      {
        name: "withValidate",
        path: "withValidate",
        component: () => import("@/views/pages/form/FormWithValidate.vue"),
        meta: { requiresAuth: true },
      },
    ],
  });
};

const createCardRouter = (router: Router): void => {
  router.addRoute({
    path: "/cards",
    name: "cardExample",
    component: LayoutContainer,
    meta: { requiresAuth: true },
    children: [
      {
        name: "index",
        path: "index",
        component: () => import("@/views/pages/card/CardHome.vue"),
        meta: { requiresAuth: true },
      },
      {
        name: "git",
        path: "git",
        component: () => import("@/views/pages/card/CardWithGit.vue"),
        meta: { requiresAuth: true },
      },
      {
        name: "team",
        path: "team",
        component: () => import("@/views/pages/card/CardWithTeam.vue"),
        meta: { requiresAuth: true },
      },
    ],
  });
};





export { createDefaultRouter };

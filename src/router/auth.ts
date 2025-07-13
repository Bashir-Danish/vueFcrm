import { RouteRecordRaw } from 'vue-router'

const authRoutes: RouteRecordRaw[] = [
    {
        path: '/auth',
        component: () => import('@/views/layouts/auth/AuthLayout.vue'),
        children: [
            {
                path: 'signin',
                name: 'signin',
                component: () => import('@/views/auth/AuthSignin.vue')
            },
            {
                path: 'signup',
                name: 'signup',
                component: () => import('@/views/auth/AuthSignup.vue'),
                meta: { allowUnauthenticated: true }
            },
            {
                path: 'forgot-password',
                name: 'forgotPassword',
                component: () => import('@/views/auth/AuthForgotPassword.vue'),
                meta: { allowUnauthenticated: true }
            },
            {
                path: 'reset-password',
                name: 'auth-reset-password',
                component: () => import('@/components/auth/ResetPasswordFlow.vue'),
                props: (route) => ({
                    email: route.query.email,
                    token: route.query.token
                }),
                meta: { allowUnauthenticated: true }
            },
            {
                path: 'reset-password-profile',
                name: 'resetPassword',
                component: () => import('@/views/pages/profile/ResetPassword.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '',
                redirect: { name: 'signin' }
            }
        ]
    }
]

export default authRoutes

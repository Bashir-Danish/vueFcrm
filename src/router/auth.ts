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
                path: '',
                redirect: { name: 'signin' }
            }
        ]
    }
]

export default authRoutes

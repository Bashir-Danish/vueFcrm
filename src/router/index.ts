import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import authRoutes from '@/router/auth'
import { createDefaultRouter } from '@/router/default'
import { useAuthStore } from '@/stores/auth'

const routes: Array<RouteRecordRaw> = [...authRoutes]

const router = createRouter({
    history: createWebHistory(),
    routes
})

createDefaultRouter(router)

router.beforeEach((to, _from, next) => {
    const authStore = useAuthStore()
    const isAuthenticated = authStore.checkAuth()

    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/auth/signin')
    } else if ((to.path === '/auth/signin' || to.path === '/auth/signup') && isAuthenticated) {
        next('/')
    } else if (to.matched.length === 0) {
        next('/404')
    } else {
        next()
    }
})

export default router

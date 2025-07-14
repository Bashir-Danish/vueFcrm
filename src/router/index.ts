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

    // If going to a protected route and not authenticated, redirect to login
    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/auth/signin')
        return
    } 
    
    // If going to auth pages and already authenticated, redirect to dashboard
    if ((to.path === '/auth/signin' || to.path === '/auth/signup') && isAuthenticated) {
        next('/')
        return
    } 
    
    // If going to root and not authenticated, redirect to login
    if (to.path === '/' && !isAuthenticated) {
        next('/auth/signin')
        return
    }
    
    // Handle 404 routes
    if (to.matched.length === 0) {
        next('/404')
        return
    } 
    
    // Allow the navigation
    next()
})

export default router

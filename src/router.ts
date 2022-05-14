import {
    createRouter as createClientRouter,
    createWebHistory,
} from 'vue-router'
import NProgress from 'nprogress'
import generatedRoutes from 'virtual:generated-pages'
import { setupLayouts } from 'virtual:generated-layouts'

const routes = setupLayouts(generatedRoutes)

export function createRouter() {
    const router = createClientRouter({
        history: createWebHistory(),
        routes,
    });

    router.beforeEach(() => {
        NProgress.start()
    })
    router.afterEach(() => {
        NProgress.done()
        document.body.scrollTo({ top: 0, behavior: "smooth" });
    })

    return router
}
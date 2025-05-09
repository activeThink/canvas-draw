import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/system',
    component: Layout,
    name: 'system',
    redirect: '/system/canvas',
    meta: {
      title: '系统管理',
      icon: 'el-icon-s-home'
    },
    children: [{
      path: '/system/canvas',
      name: 'canvas',
      meta: {
        title: '画板',
        icon: 'el-icon-s-home'
      },
      component: () => import('@/views/system/canvas/index')
    },
    {
      path: '/system/scrollBoard',
      name: 'scrollBoard',
      meta: {
        title: '滚动表格',
        icon: 'el-icon-s-home'
      },
      component: () => import('@/views/system/scrollBoard/index')
    }, {
      path: '/system/scrollList',
      name: 'scrollList',
      meta: {
        title: '滚动列表',
        icon: 'el-icon-s-home'
      },
      component: () => import('@/views/system/scroolList/index')
    },
    {
      path: '/system/virtualScroll',
      name: 'virtualScroll',
      meta: {
        title: '虚拟滚动',
        icon: 'el-icon-s-home'
      },
      component: () => import('@/views/system/virtualScroll/index')
    },
    {
      path: '/system/cropperjs',
      name: 'cropperjs',
      meta: {
        title: '图片裁剪',
        icon: 'el-icon-s-home'
      },
      component: () => import('@/views/system/cropperjs/index')
    },
    {
      path: '/system/wangEditor',
      name: 'wangEditor',
      meta: {
        title: 'wangEditor编辑器',
        icon: 'el-icon-s-home'
      },
      component: () => import('@/views/system/wangEditor/index')
    }]
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

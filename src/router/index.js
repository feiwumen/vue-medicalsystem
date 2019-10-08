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
    icon: 'svg-name'             the icon show in the sidebar
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
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  // 主页
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    children: [{
      path: 'index',
      name: 'index',
      component: () => import('@/views/basic/agency'),
      meta: { title: '主页', icon: 'dashboard' }
    }]
  },

  // 基础
  {
    path: '/basic',
    component: Layout,
    redirect: '/basic/agency',
    name: 'basic',
    meta: { title: '基础', icon: 'example' },
    children: [
      {
        path: 'agency',
        name: 'agency',
        component: () => import('@/views/basic/agency'),
        meta: { title: '机构管理', icon: 'table' }
      },

      {
        path: 'user',
        name: 'user',
        component: () => import('@/views/basic/user'),
        meta: { title: '用户管理', icon: 'table' }
      },

      {
        path: 'hospital',
        name: 'hospital',
        component: () => import('@/views/basic/hospital'),
        meta: { title: '医院管理', icon: 'table' }
      },

      {
        path: 'doctor',
        name: 'doctor',
        component: () => import('@/views/basic/doctor'),
        meta: { title: '医生管理', icon: 'table' }
      },

      {
        path: 'medical',
        name: 'medical',
        component: () => import('@/views/basic/medical'),
        meta: { title: '医疗管理', icon: 'table' }
      },

      {
        path: 'service',
        name: 'service',
        component: () => import('@/views/basic/service'),
        meta: { title: '服务管家', icon: 'table' }
      },

      {
        path: 'serviceOrder',
        name: 'serviceOrder',
        component: () => import('@/views/basic/serviceOrder'),
        meta: { title: '服务订单', icon: 'table' }
      },

      {
        path: 'poverty',
        name: 'poverty',
        component: () => import('@/views/basic/poverty'),
        meta: { title: '帮扶订单', icon: 'table' }
      }
    ]
  },

  // 安全
  {
    path: '/security',
    component: Layout,
    redirect: '/security/call',
    name: 'security',
    meta: { title: '安全', icon: 'example' },
    children: [
      {
        path: 'call',
        name: 'call',
        component: () => import('@/views/security/call'),
        meta: { title: '呼叫中心', icon: 'table' }
      },

      {
        path: 'device',
        name: 'device',
        component: () => import('@/views/security/device'),
        meta: { title: '设备管理', icon: 'table' }
      },

      {
        path: 'alarm',
        name: 'alarm',
        component: () => import('@/views/security/alarm'),
        meta: { title: '健康预警', icon: 'table' }
      },

      {
        path: 'event',
        name: 'event',
        component: () => import('@/views/security/event'),
        meta: { title: '事件处理日志', icon: 'table' }
      },

      {
        path: 'complaint',
        name: 'complaint',
        component: () => import('@/views/security/complaint'),
        meta: { title: '投诉管理', icon: 'table' }
      }
    ]
  },

  // 系统
  {
    path: '/system',
    component: Layout,
    redirect: '/system/care',
    name: 'system',
    meta: { title: '系统', icon: 'example' },
    children: [
      {
        path: 'care',
        name: 'care',
        component: () => import('@/views/system/care'),
        meta: { title: '关怀模版', icon: 'table' }
      },

      {
        path: 'notify',
        name: 'notify',
        component: () => import('@/views/system/notify'),
        meta: { title: '通知公告', icon: 'table' }
      },

      {
        path: 'news',
        name: 'news',
        component: () => import('@/views/system/news'),
        meta: { title: '资讯文章', icon: 'table' }
      },

      {
        path: 'role',
        name: 'role',
        component: () => import('@/views/system/role'),
        meta: { title: '角色管理', icon: 'table' }
      },

      {
        path: 'systemArea',
        name: 'systemArea',
        component: () => import('@/views/system/systemArea'),
        meta: { title: '区域管理', icon: 'table' }
      }
    ]
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

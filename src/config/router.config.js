// eslint-disable-next-line
import {
  UserLayout,
  BasicLayout,
  RouteView,
  BlankLayout,
  PageView
} from '@/components/layouts'

export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: {
      title: '首页',
      keepAlive:true
    },
    redirect: '/dashboard/analysis',
    children: [
      // dashboard
      {
        path: '/dashboard/analysis',
        name: 'dashboard',
        // redirect: '/dashboard/analysis',
        // component: RouteView,
        component: () => import('@/views/dashboard/Analysis'),
        meta: {
          title: '总览',
          keepAlive: true,
          icon: 'dashboard',
          permission: ['dashboard']
        }
      },
      {
        path: '/report',
        component: () => import('@/views/report/index'),
        meta: {
          title: '报表',
          keepAlive: true,
          icon: 'fund',
          permission: ['report']
        },
        children:[
          {
            path:'/report/digital',
            name:'report.digital',
            component:()=>import('@/views/report/digital_report/index'),
            meta:{
              title: '数据报表',
              keepAlive:true,
              icon:'fund',
              permission:['report']
            }
          },
          {
            path:'/report/fans',
            name:'report.fans',
            component:()=>import('@/views/report/fans_report/index'),
            meta:{
              title: '粉丝报表',
              keepAlive:true,
              icon:'fund',
              permission:['report']
            }
          },
        ]
      },
      {
        path: '/account',
        // component: RouteView,
        name: 'account',
        component: () => import('@/views/wechat/account'),
        // name: 'account',
        redirect: '/wechat/list',
        alwaysShow: true,
        meta: {
          title: '账号管理',
          icon: 'cloud',
          keepAlive: true,
          permission: ['account']
        },
        children: [
          {
            path: '/wechat/list',
            name: 'WechatList',
            component: () => import('@/views/wechat/WechatList'),
            meta: {
              title: '公众号管理',
              hidden: true,
              keepAlive: true,
              permission: ['wechat']
            }
          },
          {
            path: '/Taobao/list',
            name: 'TaobaoList',
            component: () => import('@/views/wechat/TaobaoList'),
            meta: {
              title: '淘宝联盟账号',
              hidden: true,
              keepAlive: true,
              permission: ['Taobao']
            }
          },
          
        ]
      },
      {
        path: '/wechat/edit',
        name: 'wechat.edit',
        hidden: true,
        component: () => import('@/views/wechat/components/edit'),
        meta: {
          title: '公众号编辑',
          icon: 'wechat',
          permission: ['wechat']
        }
      },
      {
        path: '/order',
        name: 'OrderList',
        component: () => import('@/views/order/OrderList'),
        // redirect: '/list/order/pdd',
        meta: {
          title: '订单管理',
          keepAlive: true,
          icon: 'shopping-cart',
          permission: ['order']
        }
      },
      {
        path: '/fans/list',
        name: 'FansList',
        component: () => import('@/views/fans/FansList'),
        // redirect: '/list/order/pdd',
        meta: {
          title: '用户管理',
          keepAlive: true,
          icon: 'team',
          permission: ['fans']
        }
      },
      {
        path: '/reward/list',
        name: 'RewardList',
        component: () => import('@/views/reward/RewardList'),
        // redirect: '/list/order/pdd',
        meta: {
          title: '提现记录',
          keepAlive: true,
          icon: 'money-collect',
          permission: ['reward']
        }
      },
      {
        path: '/service/edit',
        name: 'service',
        component: () => import('@/views/service/index'),
        // redirect: '/list/order/pdd',
        meta: {
          title: '客服管理',
          keepAlive: true,
          icon: 'customer-service',
          permission: ['message']
        }
      },
      
      {
        path: '/link_switch',
        name: 'link_switch',
        component: () => import('@/views/link_switch'),
        // redirect: '/list/order/pdd',
        meta: {
          title: '链接转换',
          keepAlive: true,
          icon: 'file-text',
          permission: ['products']
        }
      },
      {
        path: '/products/edit',
        name: 'products.edit',
        hidden: true,
        component: () => import('@/views/products/edit/index'),
        meta: {
          title: '主题编辑',
          icon: 'wechat',
          permission: ['products']
        }
      },
      {
        path: '/products/recommend',
        name: 'products.recommend',
        hidden: true,
        component: () => import('@/views/products/recommand'),
        meta: {
          title: '链接推广',
          icon: 'wechat',
          permission: ['products']
        }
      },
      {
        path: '/banner/edit',
        name: 'banner.edit',
        hidden: true,
        component: () => import('@/views/floor_manage/floor_banner/banner_edit'),
        meta: {
          title: 'banner编辑',
          icon: 'wechat',
          permission: ['banner']
        }
      },
      {
        path: '/top/edit',
        name: 'top.edit',
        hidden: true,
        component: () => import('@/views/floor_manage/top10/top_edit'),
        meta: {
          title: 'top编辑',
          icon: 'wechat',
          permission: ['top']
        }
      },    
      {
        path: '/icon/edit',
        name: 'icon.edit',
        hidden: true,
        component: () => import('@/views/floor_manage/icon/icon_edit'),
        meta: {
          title: 'icon编辑',
          icon: 'wechat',
          permission: ['icon']
        }
      },
    
      // {
      //   path: '/products/list',
      //   name: 'products',
      //   component: () => import('@/views/products/list'),
      //   // redirect: '/list/order/pdd',
      //   meta: {
      //     title: '选品管理',
      //     keepAlive: true,
      //     icon: 'file-text',
      //     permission: ['products']
      //   }
      // },
      {
        path:'/floor',
        name:'floor',
        component:()=>import('@/views/floor_manage/index'),
        redirect:'/products/list',
        meta: {
          title: '楼层管理',
          keepAlive: true,
          icon: 'form',
        },
        children:[
          {
            path: '/products/list',
            name: 'products',
            component: () => import('@/views/products/list'),
            // redirect: '/list/order/pdd',
            meta: {
              title: '选品管理',
              keepAlive: true,
              icon: 'file-text',
              permission: ['products']
            }
          },
          {
            path: '/banner/list',
            name: 'banner',
            component: () => import('@/views/floor_manage/floor_banner/banner_list'),
            meta: {
              title: 'banner管理',
              keepAlive: true,
              icon: 'file-text',
              permission: ['banner']
            }
          },
          {
            path: '/top/list',
            name: 'top',
            component: () => import('@/views/floor_manage/top10/top_list'),
            meta: {
              title: 'top10管理',
              keepAlive: true,
              icon: 'file-text',
              permission: ['top']
            }
          },
          {
            path: '/icon/list',
            name: 'icon',
            component: () => import('@/views/floor_manage/icon/icon_list'),
            meta: {
              title: 'icon管理',
              keepAlive: true,
              icon: 'file-text',
              permission: ['icon']
            }
          },
          {
            path: '/tabbar/list',
            name: 'tabbar',
            component: () => import('@/views/floor_manage/tabbar/tabbaredit.vue'),
            meta: {
              title: 'tabbar管理',
              keepAlive: true,
              icon: 'file-text',
              permission: ['tabbar']
            }
          },
        ]
      },
      {
        path: '/notification',
        name: 'notification',
        component: () => import('@/views/notification/index'),
        redirect: '/notification/deal_notification',
        meta: {
          title: '推送管理',
          keepAlive: true,
          icon: 'customer-service',
        },
        children: [
          {
            path: '/notification/deal_notification',
            name: 'notification.deal_notification',
            component: () => import('@/views/notification/deal_notification/index'),
            meta: {
              title: '消息推送',
              keepAlive: true,
              icon: 'shopping-cart'
            }
          },
          {
            path: '/notification/history',
            name: 'notification.history',
            component: () => import('@/views/notification/history/index'),
            meta: {
              title: '推送历史',
              keepAlive: true,
              icon: 'shopping-cart'
            }
          },
          {
            path: '/notification/template',
            name: 'notification.template',
            component: () => import('@/views/notification/template_message/index'),
            meta: {
              title: '模板消息',
              keepAlive: true,
              icon: 'shopping-cart'
            }
          }
        ]
      },

      // settings
      {
        path: '/settings/index',
        // component: RouteView,
        name: 'settings',
        component: () => import('@/views/settings/Index'),
        // name: 'account',
        redirect: '/settings/message',
        alwaysShow: true,
        meta: {
          title: '系统设置',
          icon: 'setting',
          keepAlive: true,
          permission: ['setting']
        },
        children: [
          {
            path: '/settings/message',
            name: 'MessageSettings',
            component: () => import('@/views/settings/Message'),
            meta: {
              title: '自动回复设置',
              hidden: true,
              keepAlive: true,
              permission: ['setting']
            }
          },
          {
            path: '/settings/domain',
            name: 'DomainSettings',
            component: () => import('@/views/settings/Domain'),
            meta: {
              title: '域名管理',
              hidden: true,
              keepAlive: true,
              permission: ['setting']
            }
          },
          {
            path: '/settings/role',
            name: 'RoleSettings',
            component: () => import('@/views/settings/Role'),
            meta: {
              title: '角色管理',
              hidden: true,
              keepAlive: true,
              permission: ['setting']
            }
          },
          {
            path: '/settings/permission',
            name: 'PermissionSettings',
            component: () => import('@/views/settings/Permission'),
            meta: {
              title: '权限管理',
              hidden: true,
              keepAlive: true,
              permission: ['setting']
            }
          }
        ]
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [{
  path: '/user',
  component: UserLayout,
  redirect: '/user/login',
  hidden: true,
  children: [{
    path: 'login',
    name: 'login',
    component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
  },
  {
    path: 'register',
    name: 'register',
    component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
  },
  {
    path: 'register-result',
    name: 'registerResult',
    component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
  }
  ]
},
{
  path: '/api/edit',
  name: 'api.edit',
  hidden: true,
  component: () => import('@/views/APIfile/apicompontents/api_edit'),
  meta: {
    title: 'api编辑',
    icon: 'wechat',
    permission: ['api']
  }
},
{
  path: '/api',
  component: BlankLayout,
  redirect: '/api/home',
  children: [{
    path: 'home',
    name: 'TestHome',
    component: () => import('@/views/APIfile/index')
  }]
},

{
  path: '/404',
  component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
}

]

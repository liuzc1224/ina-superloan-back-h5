import Main from '@/components/main'

export default [
    {
        path: '/operation-center',
        name: 'operation-center',
        meta: {
            icon: 'md-cloud-upload',
            title: '运营中心'
        },
        component: Main,
        children: [
            {
                path: 'message-push',
                name: 'message-push',
                meta: {
                    icon: 'ios-document',
                    title: '消息中心管理'
                },
                component: () => import('@/view/operation-center/message-push.vue')
            },
            {
                path: 'help-center',
                name: 'help-center',
                meta: {
                    icon: 'md-clipboard',
                    title: '帮助中心管理'
                },
                component: () => import('@/view/operation-center/help-center.vue')
            },
            {
                path: 'feedback-record',
                name: 'feedback-record',
                meta: {
                    icon: 'md-clipboard',
                    title: '产品反馈记录',
                },
                component: () => import('@/view/operation-center/feedback-record.vue')
            },
            {
                path: 'data-center',
                name: 'data-center',
                meta: {
                    icon: 'ios-document',
                    title: '数据中心'
                },
                component: () => import('@/view/data-center/data-center.vue')
            },
            {
              path: 'productConfiguration',
              name: 'productConfiguration',
              meta: {
                icon: 'md-clipboard',
                title: '产品配置',
              },
              component: () => import('@/view/operation-center/productConfiguration.vue')
            },
            {
              path: 'bannerConfiguration',
              name: 'bannerConfiguration',
              meta: {
                icon: 'md-clipboard',
                title: 'banner配置',
              },
              component: () => import('@/view/operation-center/bannerConfiguration.vue')
            },
          {
            path: 'channelManagement',
            name: 'channelManagement',
            meta: {
              icon: 'md-clipboard',
              title: '渠道管理',
            },
            component: () => import('@/view/operation-center/channel.vue')
          },
        ]
    }
]

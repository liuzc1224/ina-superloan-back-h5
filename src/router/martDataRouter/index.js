import Main from '@/components/main'
import parentView from '@/components/parent-view'
export default [
    {
        path: '/mart-data',
        name: 'mart-data',
        meta: {
            icon: 'md-cloud-upload',
            title: '贷超数据中心'
        },
        component: Main,
        children: [
            {
                path: 'data-total',
                name: 'data-total',
                meta: {
                    icon: 'ios-document',
                    title: '数据总览'
                },
                component: () => import('@/view/mart-data/data-total.vue')
            },
            {
                path: '/operation-report',
                name: 'operation-report',
                meta: {
                    icon: 'ios-document',
                    title: '运营报表'
                },
                component: parentView,
                children: [
                    {
                        path: 'product-click',
                        name: 'product-click',
                        meta: {
                            icon: 'ios-document',
                            title: '产品点击报表'
                        },
                        component: () => import('@/view/mart-data/operation-report/product-click.vue')
                    },
                    {
                        path: 'user-change',
                        name: 'user-change',
                        meta: {
                            icon: 'ios-document',
                            title: '每日用户转化报表'
                        },
                        component: () => import('@/view/mart-data/operation-report/user-change.vue')
                    },
                    {
                        path: 'channel-change',
                        name: 'channel-change',
                        meta: {
                            icon: 'ios-document',
                            title: '渠道转化报表'
                        },
                        component: () => import('@/view/mart-data/operation-report/channel-change.vue')
                    }
                ]
            }
        ]
    }
]

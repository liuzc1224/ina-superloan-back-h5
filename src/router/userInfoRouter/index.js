import Main from '@/components/main'
export default [
    {
        path: '/user-manage',
        name: 'user-manage',
        meta: {
            icon: 'md-cloud-upload',
            title: '用户管理'
        },
        component: Main,
        children: [
            {
                path: 'user-list',
                name: 'user-list',
                meta: {
                    icon: 'ios-document',
                    title: '用户列表'
                },
                component: () => import('@/view/user-manage/user-list')
            },
            {
                path: 'white-list',
                name: 'white-list',
                meta: {
                    icon: 'ios-document',
                    title: '黑白名单管理',
                },
                component: () => import('@/view/user-manage/user-detail')
            }
        ]
    }
]

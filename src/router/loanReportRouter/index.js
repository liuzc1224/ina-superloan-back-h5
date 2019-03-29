import Main, { Wrap } from "@/components/main";
export default [
  {
    path: "/loan-report",
    name: "loan-report",
    meta: {
      icon: "md-cloud-upload",
      title: "现金贷报表"
    },
    component: Main,
    children: [
      {
        path: "operation-report",
        name: "operation-report",
        meta: {
          icon: "ios-document",
          title: "运营报表中心"
        },
        component: () => import("@/view/loan-report/operation-report-center/index.vue")
      },
      {
        path: "risk-report",
        name: "risk-report",
        meta: {
          icon: "ios-document",
          title: "风控报表中心"
        },
        component: Wrap,
        children: [
          {
            path: "order-audit-report",
            name: "order-audit-report",
            meta: {
              icon: "ios-document",
              title: "订单审核报表"
            },
            component: () => import("@/view/loan-report/order-audit-report")
          },
          {
            path: "reviewers-audit-today",
            name: "reviewers-audit-today",
            meta: {
              icon: "ios-document",
              title: "今日信审人员审核情况"
            },
            component: () => import("@/view/loan-report/reviewers-audit-today")
          },
          {
            path: "historical-ending",
            name: "historical-ending",
            meta: {
              icon: "ios-document",
              title: "历史放款情况"
            },
            component: () => import("@/view/loan-report/historical-ending")
          },
          {
            path: "historical-repayment",
            name: "historical-repayment",
            meta: {
              icon: "ios-document",
              title: "历史案件还款情况"
            },
            component: () => import("@/view/loan-report/historical-repayment")
          },
          {
            path: "channel-transformation",
            name: "channel-transformation",
            meta: {
              icon: "ios-document",
              title: "渠道转化情况"
            },
            component: () => import("@/view/loan-report/channel-transformation")
          },
          {
            path: "refusal-today",
            name: "refusal-today",
            meta: {
              icon: "ios-document",
              title: "今日拒绝情况"
            },
            component: () => import("@/view/loan-report/refusal-today")
          },
          {
            path: "total-data",
            name: "total-data",
            meta: {
              icon: "ios-document",
              title: "报表操作页"
            },
            component: () => import("@/view/loan-report/total-data")
          }
        ]
      }
    ]
  }
];

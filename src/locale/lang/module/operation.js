const operationCN = {
  common:{
    add:'新增',
    search:'搜索',
    reset:'重置',
    operating:'操作',
    edit:'编辑',
    delete:'删除',
    cancel:'取消',
    submit:'确定',
    editSuccess:'编辑成功',
    addSuccess:"新增成功",
    imgSuccess:"图片上传成功",
  },

  'operation-center': '运营中心',
  // 消息中心管理
  'message-push': '消息中心管理',
  messagePush: {
    id: '序号',
    takeEffectTime: '生效时间',
    selectTime: '请选择生效时间',
    searchDate: '请选择日期',
    sendChannel: '发送渠道',
    selectChannel: '请选择发送渠道',
    messageCenter: '消息中心',
    push: 'push推送',
    messageAndPush: '消息+push',
    messageType: '消息类型',
    selectType: '请选择消息类型',
    messageTitle: '消息标题',
    inputTitle: '请输入消息标题',
    messageText: '消息内容',
    inputText: '请输入消息内容',
    announcement: '公告',
    notice: '通知',
    sendTarget: '发送人群',
    selectTarget: '请选择发送人群',
    allPeople: '所有人',
    sendStaus: '发送状态',
    isSend: '已发送',
    waitSend: '等待发送',
    operator: '操作人',
    search: '搜索',
    reSet: '重置',
    addMessage: '新增消息',
    editMessage: '修改消息'
  },
  // 帮助中心管理
  'help-center': '帮助中心管理',
  helpCenter: {
    textFlag: '类别',
    selectFlag: '请选择类别',
    bill: '账单',
    charge: '记账',
    credit: '征信',
    isShow: '是否显示',
    selectShow: '请选择是否显示',
    yes: '是',
    no: '否',
    addHelp: '新增问答',
    editHelp: '编辑问答',
    textOrder: '当页排序',
    question: '问题',
    inputQuestion: '请输入问题',
    answer: '答案',
    inputAnswer: '请输入答案',
    operatTime: '操作时间'
  },
  // 产品反馈记录
  'feedback-record': '产品反馈记录',
  feedbackRecord: {
    feedbackTime: '反馈时间',
    feedbackTimeTip: '请输入反馈时间',
    addFeedback: '新增反馈',
    editFeedback: '编辑反馈',
    feedbackEmail: '反馈账户',
    feedbackEmailTip: '请输入反馈账户',
    feedbackTitle: '反馈标题',
    feedbackContent: '反馈内容',
    feedbackVersion: '反馈时版本',
    feedbackStatus: '处理状态',
    feedbackStatusTip: '请选择处理状态',
    unhandle: '未处理',
    handling: '处理中',
    handled: '已完成',
    opinionRemark: '备注',
    opinionRemarkTip: '请输入备注'
  },
  // 数据中心
  'data-center': '数据中心',
  dataCenter: {
    registerTotal: '历史用户总注册数',
    registerToday: '今日注册用户数',
    creditTotal: '历史信用卡账单用户数量',
    creditAdd: '当日信用卡账单用户新增数量',
    recordToTal: '历史记账用户数量',
    recordAdd: '当日记账用户新增数量',
    recordQueryToTal: '历史征信查询用户数量',
    recordQueryAdd: '当日征信查询新增数量',
    registerWeek: '近七天总注册数趋势',
    registerMonth:'近30天总注册数趋势',
    registerOneday: '当天注册数'
  },
  //产品配置
  'productConfiguration':'产品配置',
  product:{
    tabData:{
      serialNumber:'序号',
      name:'APP名称',
      whether:'是否新品',
      time:'新品过期时间',
      icon:'icon',
      max:'最大贷款金额',
      processDays:'放款流程时长',
      loanDays:'贷款天数',
      dailyInterestRate:'最低日利率',
      slogan:'宣传语',
      get:'下载跳转链接',
      status:'上架状态',
      updateTime:'更新时间',
      feature:"产品特点",
      dateAdded:"谷歌上架日期",
      borrowingRequirements:'借款要求',
      claim:"要求",
      process:"借款流程",
      description:"下载描述",
      info:"填写信息",
      reviewProcess:"审核流程",
      repayment:"放还款项",

    },
    prompt:{
      whether:'请选择是否新品',
      time:'请输入新品过期时间',
      name:'请输入APP名称',
      status:'请选择状态',
      serialNumber:'请选择序号',
      icon:'请上传icon',
      max:'请输入最大贷款金额',
      processDays:'请输入放款流程时长',
      loanDays:'请输入贷款天数',
      dailyInterestRate:'请输入最低日利率',
      slogan:'请输入宣传语',
      get:'请输入下载跳转链接',
      claim:"请输入要求",
      description:"请输入下载描述",
      info:"请输入填写信息",
      reviewProcess:"请输入审核流程",
      repayment:"请输入放还款项",
      feature:"请输入产品特点",
      dateAdded:"请输入谷歌上架日期",
    },
    status:[
      {
        desc:'已上架',
        value:1
      },
      {
        desc:'已下架',
        value:0
      }
    ],
    state:[
      {
        desc:'是',
        value:1
      },
      {
        desc:'否',
        value:0
      }
    ],
    modal:{
      add:'新增产品',
      edit:'编辑产品',
    }
  },
  //banner配置
  'bannerConfiguration':'banner配置',
  banner:{
    tabData:{
      phoneNumber:'手机号',
      serialNumber:'序号',
      source:'来源',
      banner:'banner图',
      description:'描述',
      link:'跳转链接',
      status:'上架状态',
      updateTime:'更新时间'
    },
    prompt:{
      phoneNumber:'请输入手机号',
      status:'请选择状态',
      serialNumber:'请选择序号',
      source:'请输入来源',
      banner:'请上传banner图',
      description:'请输入描述',
      link:'请输入跳转链接',
    },
    status:[
      {
        desc:'已上架',
        value:1
      },
      {
        desc:'已下架',
        value:0
      }
    ],
    modal:{
      add:'新增banner',
      edit:'编辑banner',
    }
  },
  //渠道管理
  'channelManagement':'渠道管理',
  channel:{
    tabData:{
      channelId:'渠道号',
      channelName:'渠道名称',
      registerIp:'下载并打开IP',
      applyIp:'注册服务器IP',
      loanIp:'申请服务器IP',
      status:'合作状态',
      modifyTime:'最后操作时间'
    },
    prompt:{
      channelId:'请输入渠道号',
      status:'请选择合作状态',
      channelName:'请输入渠道名称',
      registerIp:'请输入注册成功IP',
      applyIp:'请输入申请成功IP',
      loanIp:'请输入放款成功IP',
    },
    status:[
      {
        desc:'合作中',
        value:1
      },
      {
        desc:'未合作',
        value:0
      }
    ],
    modal:{
      add:'新增渠道',
      edit:'编辑渠道',
      downLoad:'下载SDK'
    }
  }
};

const operationBR = {
  common:{
    add:'新增',
    search:'搜索',
    reset:'重置',
    operating:'操作',
    edit:'编辑',
    delete:'删除',
    cancel:'取消',
    submit:'确定',
    editSuccess:'编辑成功',
    addSuccess:"新增成功",
    imgSuccess:"图片上传成功",
  },
  'operation-center': 'Centro de operações',
  // 消息中心管理
  'message-push': 'Gerenciar centro de informacões',
  messagePush: {
    id: 'Número',
    takeEffectTime: 'Tempo de entrar em vigor',
    selectTime: 'Selecione tempo de entrar em vigor',
    searchDate: 'Selecione data',
    sendChannel: 'Canal de envio',
    selectChannel: 'Selecione canal de envio',
    messageCenter: 'Centro de informações',
    push: 'Envio',
    messageAndPush: 'Envio de mensagem',
    messageType: 'Tipo de mensagem',
    selectType: 'Selecione tipo de mensagem',
    messageTitle: 'Título de mensagem',
    inputTitle: 'Insira título de mensagem',
    messageText: 'Conteúdo de mensagem',
    inputText: ' Insira conteúdo de mensagem',
    announcement: 'Anúncio público',
    notice: 'Aviso',
    sendTarget: 'Multidão para envio',
    selectTarget: 'Selecione multidão para envio',
    allPeople: 'Todas as pessoas',
    sendStaus: 'Status de envio',
    isSend: 'Enviado',
    waitSend: 'Espera por enviar',
    operator: 'Operador',
    search: 'Pesquisar',
    reSet: 'Reinstalar',
    addMessage: 'Adicionar mensagem',
    editMessage: 'Alterar mensagem',
  },
  // 帮助中心管理
  'help-center': 'Gerenciamento de centro de ajuda',
  helpCenter: {
    textFlag: 'Categoria',
    selectFlag: 'Selecione categoria',
    bill: 'Fatura',
    charge: 'Contabilizar',
    credit: 'Investigação de crédito',
    isShow: 'Se monstra ou não',
    selectShow: 'Selecione se monstra ou não',
    yes: 'Sim',
    no: 'Não',
    addHelp: 'Adicionar pergunta e resposta',
    editHelp: 'Editar pergunta e resposta',
    textOrder: 'Ordenação da página',
    question: 'Pergunta',
    inputQuestion: 'Insira pergunta',
    answer: 'Resposta',
    inputAnswer: 'Insira resposta',
    operatTime: 'Tempo de operação'
  },
  // 产品反馈记录
  'feedback-record': 'Registro de feedback de produto',
  feedbackRecord: {
    feedbackTime: 'Tempo de feedback',
    feedbackTimeTip: 'Insira tempo de feedback',
    addFeedback: 'Adicionar feedback',
    editFeedback: 'Editar feedback',
    feedbackEmail: 'Conta de feedback',
    feedbackEmailTip: 'Insira conta de feedback',
    feedbackTitle: 'Título de feedback',
    feedbackContent: 'Conteúdo de feedback',
    feedbackVersion: 'Versão de feedback',
    feedbackStatus: 'Status de processamento',
    feedbackStatusTip: 'Selecione status de processamento',
    unhandle: 'Não processado',
    handling: 'Em processamento',
    handled: 'Finalizado',
    opinionRemark: 'Notas',
    opinionRemarkTip: 'Insira notas'
  },



  // 数据中心
  'data-center': 'Centro de dados',
  dataCenter: {
    registerTotal: 'Número total de cadastro histórico de usuários',
    registerToday: 'Número de usuário cadastrado hoje',
    creditTotal: 'Número de usuários históricos que consultaram o crédito',
    creditAdd: 'Crescimento de usuário de fatura de cartão de crédito hoje',
    recordToTal: 'Número de usuários históricos de contabilidade',
    recordAdd: 'Número de aumento de usuários de contabilidade',
    recordQueryToTal: 'Número de usuários históricos que consultaram o crédito',
    recordQueryAdd: 'Número de aumento de consulta de crédito hoje',
    registerWeek: 'Tendência de cadastros totais nos últimos sete dias',
    registerMonth:'近30天总注册数趋势',
    registerOneday: 'Número de usuário cadastrado hoje',
  },

  //产品配置
  'productConfiguration':'产品配置',
  product:{
    tabData:{
      serialNumber:'序号',
      name:'APP名称',
      whether:'是否新品',
      time:'新品过期时间',
      icon:'icon',
      max:'最大贷款金额',
      processDays:'放款流程时长',
      loanDays:'贷款天数',
      dailyInterestRate:'最低日利率',
      slogan:'宣传语',
      get:'下载跳转链接',
      status:'上架状态',
      updateTime:'更新时间',
      feature:"产品特点",
      dateAdded:"谷歌上架日期",
      borrowingRequirements:'借款要求',
      claim:"要求",
      process:"借款流程",
      description:"下载描述",
      info:"填写信息",
      reviewProcess:"审核流程",
      repayment:"放还款项",

    },
    prompt:{
      whether:'请选择是否新品',
      time:'请输入新品过期时间',
      name:'请输入APP名称',
      status:'请选择状态',
      serialNumber:'请选择序号',
      icon:'请上传icon',
      max:'请输入最大贷款金额',
      processDays:'请输入放款流程时长',
      loanDays:'请输入贷款天数',
      dailyInterestRate:'请输入最低日利率',
      slogan:'请输入宣传语',
      get:'请输入下载跳转链接',
      claim:"请输入要求",
      description:"请输入下载描述",
      info:"请输入填写信息",
      reviewProcess:"请输入审核流程",
      repayment:"请输入放还款项",
      feature:"请输入产品特点",
      dateAdded:"请输入谷歌上架日期",
    },
    status:[
      {
        desc:'已上架',
        value:1
      },
      {
        desc:'已下架',
        value:0
      }
    ],
    state:[
      {
        desc:'是',
        value:1
      },
      {
        desc:'否',
        value:0
      }
    ],
    modal:{
      add:'新增产品',
      edit:'编辑产品',
    }
  },
  //banner配置
  'bannerConfiguration':'banner配置',
  banner:{
    tabData:{
      phoneNumber:'手机号',
      serialNumber:'序号',
      source:'来源',
      banner:'banner图',
      description:'描述',
      link:'跳转链接',
      status:'上架状态',
      updateTime:'更新时间'
    },
    prompt:{
      phoneNumber:'请输入手机号',
      status:'请选择状态',
      serialNumber:'请选择序号',
      source:'请输入来源',
      banner:'请上传banner图',
      description:'请输入描述',
      link:'请输入跳转链接',
    },
    status:[
      {
        desc:'已上架',
        value:1
      },
      {
        desc:'已下架',
        value:0
      }
    ],
    modal:{
      add:'新增banner',
      edit:'编辑banner',
    }
  },
  //渠道管理
  'channelManagement':'渠道管理',
  channel:{
    tabData:{
      channelId:'渠道号',
      channelName:'渠道名称',
      registerIp:'下载并打开IP',
      applyIp:'注册服务器IP',
      loanIp:'申请服务器IP',
      status:'合作状态',
      modifyTime:'最后操作时间'
    },
    prompt:{
      channelId:'请输入渠道号',
      status:'请选择合作状态',
      channelName:'请输入渠道名称',
      registerIp:'请输入注册成功IP',
      applyIp:'请输入申请成功IP',
      loanIp:'请输入放款成功IP',
    },
    status:[
      {
        desc:'合作中',
        value:1
      },
      {
        desc:'未合作',
        value:0
      }
    ],
    modal:{
      add:'新增渠道',
      edit:'编辑渠道',
    }
  }
};

export {
  operationCN,
  operationBR
}

module.exports = {
  stringEncoding: process.env.STRING_ENCODING || 'utf-8',
  base64Encoding: process.env.BASE64_ENCODING || 'base64',
  algorithm: process.env.ENCRYPTION_ALGORITH || 'aes256',
  hashAlgorithm: process.env.HASH_ALGORITHM || 'sha256',
  secret: process.env.APP_SECRET || 'TybomcUDJmlkjK1bfZEBscyTFLZGnR2B',
  iv: process.env.IV || 'cxeF5YjtlyKZnLbZ',
  aisoDomainURL: process.env.DOMAIN || 'http://localhost:3000/aios',
  appAuditLogSuffix: process.env.AUDIT_LOG_SUFFIX || 'appaudit-log',
  auditEventIterations: process.env.AUDIT_EVENT_ITERATIONS || 50,
  auditlasttskey: process.env.AUDIT_LAST_TIMESTAMP_KEY || 'auditLastTS',
  semaphoreIndex: process.env.SEMAPHORE_INDEX || 23,
  sourceEmailAddress: process.env.SOURCE_EMAIL_ADDRESS || 'eswar.p@bahwancybertek.com',
  sessionTimeOut: 15000 * 60 * 60,
  complaintPrefix: 'CT',
  inquiryPrefix: 'INQ',
  adjustmentPrefix: 'ADJ',
  refundPrefix: 'REF',
  systemUserId: 1,
  chatCount: 10,
  abandonedChatTimeout: 5,
  chatRoleId: 88,
  dbProperties: {
    database: process.env.POSTGRES_DATABASE || 'pharmacraft',
    schema: process.env.POSTGRES_DATABASE || 'pharmacraft',
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    dialect: process.env.DATABASE_DIALECT || 'postgres',
    port: process.env.DATABASE_PORT || 5432,
    dialectOptions: {
      statement_timeout: 5000
    }
  },
  aios: {
    host: process.env.SERVICE_HOST || 'http://localhost',
    port: process.env.SERVICE_PORT || 4000
  },
  tibco: {
    apiEndPoint: 'http://172.17.21.6:9208',
    customerAPIEndPoint: 'http://172.17.21.6:9209',
    accessNumberAPI: '/aios/accessnumbers',
    iccidValidationAPI: '/aios/validateiccid',
    customerSummaryAPI: '/aios/customersummary',
    soapAPIEndpoint: 'http://172.17.21.6:9030',
    addBalanceAPI: '/addBalanceServiceBinding/addBalanceService',
    addBalanceMobileAPIEndpoint: 'http://172.17.21.6:9214',
    addBalanceMobileAPI: '/addbalance',
    ticketApiEndPoint: 'http://172.17.21.6:9211',
    ticketDetailsAPI: '/viewticket',
    ocsBarEndPoint: 'http://172.17.21.6:9212',
    ocsBarAPI: '/barsubscription',
    ocsUnBarEndPoint: 'http://172.17.21.6:9213',
    ocsUnBarAPI: '/unbarsubscription',
    fixedLineAddBalanceEndPoint: 'http://172.17.21.6:9146',
    fixedLineAddBalanceAPI: '/addbalance',
    ocsCustomerSummaryEndPoint: 'http://172.17.21.6:9043',
    ocsCustomerSummaryAPI: '/searchcustomer',
    username: 'Aios',
    passwd: '$Tibc0@Aios$',
    source: 'AIOS'
  },
  dropthought: {
    apiEndPoint: 'https://api.dropthought.com/dtapp/api',
    login: '/authenticate/login',
    renewToken: '/token/renew',
    createParticipant: '/participant/?participantgroupuuid=7f4834d1-eef0-4063-9f69-1354c05852de',
    loginEmail: 'imagine1.brunei@dropthought.com',
    loginPassword: 'Welcome123$',
    createdBy: 'af12d9c1-d094-4959-80de-46b4bd51407f',
    header: [
      'Account Name',
      'Primary Email ID',
      'Primary Contact Number',
      'Ticket ID',
      'Ticket Type',
      'Ticket Close Date',
      'Service Type',
      'Service Number'
    ]
  },
  smtp: {
    //host: '172.17.207.2',
    host: '172.17.5.12',
    port: 25,
    userName: 'no-reply@imagine.com.bn',
    password: '!m@gin3n0rEpLy',
    fromEmailAddress: 'no-reply@imagine.com.bn'
  },
  sms: {
    URL: 'http://172.17.196.15/index.php',
    app: 'ws',
    u: 'cuetrackuser',
    h: 'caeef2a26dc25a0db7edbc66b15e317f',
    op: 'pv'
  },
  unnCredentials: {
    workFlowName: 'CoreLoginService',
    workFlowParams: {
      methodName: 'RestLogin',
      strUserId: 'AIOS2',
      strPassword: '123'
    }
  },
  unnProperties: {
    URL: 'https://oms-dev.unn.com.bn/C2MS/JMSRestInitService'
  }
}

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
    database: process.env.POSTGRES_DATABASE || 'pharmakraftpacka_pharmacraft',
    schema: process.env.POSTGRES_DATABASE || 'pharmacraft',
    username: process.env.POSTGRES_USER || 'pharmakraftpacka_pharma',
    password: process.env.POSTGRES_PASSWORD || 'k4acJ&KP7',
    host: process.env.POSTGRES_HOST || '103.154.184.93',
    dialect: process.env.DATABASE_DIALECT || 'postgres',
    port: process.env.DATABASE_PORT || 5432,
    dialectOptions: {
      statement_timeout: 5000
    }
  },
  // dbProperties: {
  //   database: process.env.POSTGRES_DATABASE || 'pharmacraft',
  //   schema: process.env.POSTGRES_DATABASE || 'pharmacraft',
  //   username: process.env.POSTGRES_USER || 'postgres',
  //   password: process.env.POSTGRES_PASSWORD || 'postgres',
  //   host: process.env.POSTGRES_HOST || 'localhost',
  //   dialect: process.env.DATABASE_DIALECT || 'postgres',
  //   port: process.env.DATABASE_PORT || 5432,
  //   dialectOptions: {
  //     statement_timeout: 5000
  //   }
  // },
  aios: {
    host: process.env.SERVICE_HOST || 'http://localhost',
    port: process.env.SERVICE_PORT || 4000
  }
}

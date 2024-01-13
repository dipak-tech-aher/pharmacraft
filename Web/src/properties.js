export const properties = {
  API_ENDPOINT: process.env.REACT_APP_API_ENDPOINT,
  API_SERVICE_PORT: process.env.REACT_APP_SERVICE_PORT,
  SOCKET_PATH: process.env.REACT_APP_SOCKET_PATH,
  ASSIGN_USER_TO_AGENT: 5,
  USER_API: "/api/users",
  THEME_API: "/api/config",
  CATEGORY_API: "/api/category",
  INVENTORY_API: "/api/inventory",
  PURCHASE_ORDER_API: "/api/purchase-order",
  SALES_ORDER_API: "/api/sale-orders",
  COMPANY_API: "/api/company",
  BILING_API: "/api/billing",
  REPORT_API: "/api/reports",
  PAYMENTS_API: "/api/payments",
  BUSINESS_ENTITY_API: '/api/lookup/business-entity',


  CUSTOMER_API: "/api/customer",
  ACCESS_NUMBER: "/api/accessNumber",
  BUSINESS_PARAMETER_API: '/api/business-parameter',
  ADDRESS_LOOKUP_API: '/api/lookup/address-lookup',
  ORGANIZATION: '/api/organization',
  PLANS_API: '/api/plans',
  CREATE_TOPUP_API: '/api/connection/service/booster',
  CREATE_VAS_API: '/api/connection/service/vas',
  CUSTOMER360_API: '/api/customer',
  ACTIVE_BOOSTERS_API: '/api/customer/active-boosters',
  PURCHASE_HISTORY_API: '/api/customer/purchase-history',
  VAS_API: '/api/customer/vas',
  AVAILABLE_TOPUP_API: '/api/plans?plantype=TOPUP',
  ROLE_API: '/api/role',
  SERVICES_SUMMARY_API: '/api/customer/services-summary',
  ACCOUNTS_LIST_API: '/api/customer/account-id-list',
  ACCOUNT_DETAILS_API: '/api/customer/account',
  SERVICES_LIST_API: '/api/customer/services-list',
  SERVICE_API: '/api/customer/service-details',
  SERVICE_REALTIME_API: '/api/customer/service-realtime',
  PLAN_UPGRADE_API: '/api/connection/service/upgrade',
  PLAN_DOWNGRADE_API: '/api/connection/service/downgrade',
  SERVICE_BADGE_API: '/api/customer/service-badge',
  TELEPORT_RELOCATE_API: "/api/connection/service/teleport-relocate",
  PENDING_PLANS_API: '/api/customer/pending-plans',
  ATTACHMENT_API: '/api/attachment',
  BAR_SERVICE: '/api/connection/service/bar',
  UNBAR_SERVICE: '/api/connection/service/unbar',
  CUSTOMER_DETAILS: '/api/customer',
  COMPLAINT_API: '/api/complaint',
  SERVICE_TYPE_COUNT: '/api/interaction/count',
  SERVICE_REQUEST_LIST_BY_CUSTOMER: '/api/service-request/list',
  SERVICE_REQUEST_DETAILS: '/api/service-request',
  ICCID_API: '/api/iccid',
  CUSTOMER_INQUIRY_API: "/api/lead",
  CUSTOMER_INQUIRY_API_2: "/api/inquiry",
  INTERACTION_API: '/api/interaction',
  CATALOGUE_API: '/api/catalog',
  CAMPAIGN_API: '/api/campaign',
  ROLE_LOOKUP_API: '/api/lookup/roles',
  USER_LOOKUP_API: '/api/lookup/users',
  KIOSK_GET_API: '/api/kiosk/createKiosk',
  KIOSK_REF_API: '/api/kiosk',
  KIOSK_CANCEL_API: '/api/kiosk/cancelKiosk',
  CONNECTION_API: '/api/connection/service/list',
  WORKFLOW_API: '/api/workflow/executeWorkFlow',
  NOTIFICATION_API: '/api/notification',
  NOTES_API: '/api/notes',
  CONNECTION_TERMINATE_API: "/api/connection/service/terminate",
  CONNECTION_TERMINATED_NUMBERS_API: "/api/connection/service/terminate-list",
  CONNECTION_TELEPORTANDRELOCATE_API: "/api/connection/service/getTeleportRelocation",
  RESOLVE_FAILED_INTERACTION_API: '/api/customer/interaction/resolve',
  CHAT_API: '/api/live-chat',
  AMEYO_CREATE_TICKET_API: '/api/ameyo/create-ticket',
  REPORTS_API: '/api/reports',
  SALES_DASHBOARD_GRAPH: '/api/dashboard/salesDashboardGraph',
  SALES_DASHBOARD_API: '/api/dashboard/salesDashboard',
  SALES_DASHBOARD_DAILY_API: '/api/dashboard/salesDashboardDailyCount',
  SALES_DASHBOARDDATA_API: '/api/dashboard/salesDashboardData',
  DASHBOARD: '/api/dashboard',
  WORKFLOW_API: '/api/workflow/executeWorkFlow',
  WORKFLOW_DEFN_API: '/api//workflow-new',
  WORKFLOW_ASSIGN_SELF_API: '/api//workflow-new/assign/self',
  WORKFLOW_GET_STATE_API: '/api//workflow-new/state',
  WORKFLOW_HIERARCHY_API: '/api/lookup/org-hierarchy-roles',
  WORKFLOW_DBMODEL_API: '/api/lookup/db-schema-info',
  FORMS_DEFN_API: '/api/forms',
  FORMS_DATA_API: '/api/forms/form-data',
  GETSERVICEDETAILS_API: '/api/web-live-chat/get-customer-summary',
  WEBCHAT_API: '/api/web-live-chat',
  GETTARRIFCODE_API: '/api/web-live-chat/get-tarrif-name',
  WHATSAPP: '/api/whatsapp'
};

import { ReportsService } from './service'
import express from 'express'
import { validateToken } from '../utils/authentication-helper'
import { validatePermission } from '../validation/permission-validator'
const reportRouter = express.Router()
const reportService = new ReportsService()

reportRouter
  .post('/get-invoice-report', reportService.getInvoicereports.bind(reportService))

module.exports = reportRouter

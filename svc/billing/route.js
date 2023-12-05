import { BillingService } from './service'
import express from 'express'
import { validateToken } from '../utils/authentication-helper'
import { validatePermission } from '../validation/permission-validator'
const billingRouter = express.Router()
const billingService = new BillingService()

billingRouter
  .post('/', billingService.create.bind(billingService))
  .put('/:id', validateToken, billingService.update.bind(billingService))
  .post('/add-stock-entry', validateToken, billingService.addStockEntry.bind(billingService))
  .get('/:id', validateToken, billingService.get.bind(billingService))
  .get('/', validateToken, billingService.getBills.bind(billingService))
  .post('/company', validateToken, billingService.getCompany.bind(billingService))

module.exports = billingRouter

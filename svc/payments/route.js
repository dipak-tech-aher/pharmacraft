import { PaymentsService } from './service'
import express from 'express'
import { validateToken } from '../utils/authentication-helper'
import { validatePermission } from '../validation/permission-validator'
const paymentsRouter = express.Router()
const paymentsService = new PaymentsService()

paymentsRouter
  .post('/add-receipts', validateToken, paymentsService.addReceipts.bind(paymentsService))
  .post('/get-receipts', validateToken, paymentsService.getReceipts.bind(paymentsService))
  .post('/get-receipts-by-company/:prCId', validateToken, paymentsService.getReceiptsByCompany.bind(paymentsService))
  .post('/apply-receipt-on-invoice', validateToken, paymentsService.applyReceipt.bind(paymentsService))
  .put('/:pId', validateToken, paymentsService.update.bind(paymentsService))
  .get('/:id', validateToken, paymentsService.get.bind(paymentsService))

module.exports = paymentsRouter

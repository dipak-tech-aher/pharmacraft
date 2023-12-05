import { SoService } from './service'
import express from 'express'
import { validateToken } from '../utils/authentication-helper'
import { validatePermission } from '../validation/permission-validator'
const soRouter = express.Router()
const soService = new SoService()

soRouter
  .post('/', soService.create.bind(soService))
  .put('/:id', validateToken, soService.update.bind(soService))
  .post('/add-stock-entry', validateToken, soService.addStockEntry.bind(soService))
  .get('/:id', validateToken, soService.get.bind(soService))
  .get('/', validateToken, soService.getSos.bind(soService))
  .post('/company', validateToken, soService.getCompany.bind(soService))

module.exports = soRouter

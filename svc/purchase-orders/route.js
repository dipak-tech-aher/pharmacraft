import { PoService } from './service'
import express from 'express'
import { validateToken } from '../utils/authentication-helper'
import { validatePermission } from '../validation/permission-validator'
const poRouter = express.Router()
const poService = new PoService()

poRouter
  .post('/', validateToken, poService.create.bind(poService))
  .put('/:id', validateToken, poService.update.bind(poService))
  .post('/add-stock-entry', validateToken, poService.addStockEntry.bind(poService))
  .get('/:id', validateToken, poService.get.bind(poService))
  .get('/', validateToken, poService.getPos.bind(poService))
  .post('/company', validateToken, poService.getCompany.bind(poService))

module.exports = poRouter

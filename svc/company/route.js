import { CompanyService } from './service'
import express from 'express'
import { validateToken } from '../utils/authentication-helper'
import { validatePermission } from '../validation/permission-validator'
const companyRouter = express.Router()
const companyService = new CompanyService()

companyRouter
  .post('/', validateToken, companyService.create.bind(companyService))
  .put('/:cId', validateToken, companyService.update.bind(companyService))
  .get('/:id', validateToken, companyService.get.bind(companyService))
  .get('/', validateToken, companyService.getCompanies.bind(companyService))

module.exports = companyRouter

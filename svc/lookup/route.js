import { LookupService } from './service'
import express from 'express'
import { validateToken } from '../utils/authentication-helper'

const lookupRouter = express.Router()
const lookupService = new LookupService()

lookupRouter
  .post('/business-entity', lookupService.getMultipleBusinessEntities.bind(lookupService))
  .get('/business-entity', lookupService.getBusinessEntity.bind(lookupService))
  .get('/address-lookup', validateToken, lookupService.getAddressLookup.bind(lookupService))
  .get('/roles', validateToken, lookupService.getDepartmentAndRoles.bind(lookupService))
  .get('/users', validateToken, lookupService.getUsersRoleId.bind(lookupService))
  .get('/db-schema-info', validateToken, lookupService.getDBSchemaInfo.bind(lookupService))
  .get('/product-lookup', validateToken, lookupService.loadProductsLookup.bind(lookupService))
  .get('/department-user', validateToken, lookupService.userByDepartment.bind(lookupService))

module.exports = lookupRouter

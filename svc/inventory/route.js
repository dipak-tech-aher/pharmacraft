import { InventoryService } from './service'
import express from 'express'
import { validateToken } from '../utils/authentication-helper'
import { validatePermission } from '../validation/permission-validator'
const inventoryRouter = express.Router()
const inventoryService = new InventoryService()

inventoryRouter
  .post('/', validateToken, inventoryService.create.bind(inventoryService))
  .put('/:invId', validateToken, inventoryService.update.bind(inventoryService))
  .get('/:id', validateToken, inventoryService.get.bind(inventoryService))
  .get('/', validateToken, inventoryService.getInventories.bind(inventoryService))

module.exports = inventoryRouter

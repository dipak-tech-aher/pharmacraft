import { CategoryService } from './service'
import express from 'express'
import { validateToken } from '../utils/authentication-helper'
import { validatePermission } from '../validation/permission-validator'
const categoryRouter = express.Router()
const categoryService = new CategoryService()

categoryRouter
  .post('/', validateToken, categoryService.createCategory.bind(categoryService))
  .put('/:id', /*validateToken,*/ categoryService.updateCategory.bind(categoryService))
  .get('/:id', validateToken, categoryService.getCategory.bind(categoryService))
  .get('/', validateToken, categoryService.getCategories.bind(categoryService))
  
module.exports = categoryRouter

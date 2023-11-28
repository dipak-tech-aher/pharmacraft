import { logger } from '../config/logger'
import { ResponseHelper } from '../utils'
import {
  Category, sequelize, BusinessEntity, Inventory, User
} from '../model'
import { defaultMessage } from '../utils/constant'
import { get, isEmpty } from 'lodash'
import { QueryTypes, Op } from 'sequelize'
import { camelCaseConversion } from '../utils/string'

export class InventoryService {
  constructor() {
    this.responseHelper = new ResponseHelper()
  }

  async create(req, res) {
    const t = await sequelize.transaction();
    try {
      logger.info('Creating new inventory');
      const inventory = req.body;
      const { userId } = req;
      console.log('inventory--------->', inventory)

      if (!inventory) {
        return this.responseHelper.validationError(res, new Error(defaultMessage.MANDATORY_FIELDS_MISSING));
      }

      const inventoryInfo = await Inventory.findAll({
        where: {
          invCatId: Number(inventory?.invCatId)
        },
        logging: true
      });

      if (inventoryInfo.length > 0) {
        return this.responseHelper.conflict(res, new Error('Inventory already exist in the system..Try to  update the Inventory'));
      }

      const commonAttributes = {
        createdBy: userId,
        createdAt: new Date(),
        updatedBy: userId,
        updatedAt: new Date(),
      };


      const newInventory = await Inventory.create({
        ...inventory,
        ...commonAttributes,
      }, { transaction: t });

      await t.commit();
      logger.debug('New inventory created successfully');
      return this.responseHelper.onSuccess(res, 'Inventory created successfully', newInventory);
    } catch (error) {
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        return this.responseHelper.validationError(res, error);
      } else if (error.name === 'NotFoundError') {
        return this.responseHelper.notFound(res, defaultMessage.NOT_FOUND);
      } else {
        logger.error(error, defaultMessage.ERROR);
        await t.rollback();
        return this.responseHelper.onError(res, new Error('Error while creating inventory'));
      }
    }
  }

  async update(req, res) {
    const t = await sequelize.transaction()
    try {
      logger.debug('Updating inventry data')
      const inventory = req.body
      const userId = req.userId
      const { invId } = req.params
      const response = {}
      if (!inventory && !invId) {
        return this.responseHelper.validationError(res, new Error(defaultMessage.MANDATORY_FIELDS_MISSING))
      }

      const inventoryInfo = await Inventory.findOne({
        where: {
          invId
        }
      })
      if (!inventoryInfo) {
        logger.debug(defaultMessage.NOT_FOUND)
        return this.responseHelper.notFound(res, new Error(defaultMessage.NOT_FOUND))
      }
      const commonAttributes = {
        updatedBy: userId,
        updatedAt: new Date(),
      };
      await Inventory.update({ ...inventory, ...commonAttributes }, {
        where: {
          invId
        },
        transaction: t
      });
      await t.commit()
      logger.debug('inventory data updated successfully')
      return this.responseHelper.onSuccess(res, 'inventory updated successfully', response)
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return this.responseHelper.notFound(res, defaultMessage.NOT_FOUND)
      } else {
        logger.error(error, defaultMessage.ERROR)
        return this.responseHelper.onError(res, new Error('Error while updating inventory'))
      }
    } finally {
      if (t && !t.finished) {
        await t.rollback()
      }
    }
  }

  async get(req, res) {
    try {
      logger.debug('Getting Inventory details by ID')
      const { invId } = req.params
      if (!invId) {
        return this.responseHelper.validationError(res, new Error(defaultMessage.MANDATORY_FIELDS_MISSING))
      }
      let response = {}
      const inventory = await Inventory.findOne({
        include: [{ model: Category, as: 'categoryDetails' },
        { model: BusinessEntity, as: 'statusDesc', attributes: ['code', 'description'] }],
        where: {
          invId
        }
      })
      if (!inventory) {
        logger.debug(defaultMessage.NOT_FOUND)
        return this.responseHelper.notFound(res, new Error(defaultMessage.NOT_FOUND))
      }
      response = inventory?.dataValues ?? inventory
      logger.debug('Successfully fetch inventory data')
      return this.responseHelper.onSuccess(res, defaultMessage.SUCCESS, response)
    } catch (error) {
      logger.error(error, 'Error while fetching inventory data')
      return this.responseHelper.onError(res, new Error('Error while fetching inventory data'))
    }
  }

  async getInventories(req, res) {
    try {
      logger.debug('Getting inventory')

      const inventory = await Inventory.findAll({
        include: [
          { model: User, as: 'createdByDetails', attributes: ['firstName', 'lastName'] },
          { model: User, as: 'updatedByDetails', attributes: ['firstName', 'lastName'] },
          { model: Category, as: 'categoryDetails' },
          { model: BusinessEntity, as: 'statusDesc', attributes: ['code', 'description'] }
        ],
        where: {
          invStatus: ['AC', 'ACTIVE']
        }
      })
      if (!inventory || inventory?.length === 0) {
        logger.debug(defaultMessage.NOT_FOUND)
        return this.responseHelper.notFound(res, new Error(defaultMessage.NOT_FOUND))
      }
      logger.debug('Successfully fetch inventory data')
      return this.responseHelper.onSuccess(res, defaultMessage.SUCCESS, inventory)
    } catch (error) {
      logger.error(error, 'Error while fetching inventory data')
      return this.responseHelper.onError(res, new Error('Error while fetching inventory data'))
    }
  }
}

import { logger } from '../config/logger'
import { ResponseHelper } from '../utils'
import {
  Category, sequelize, BusinessEntity, User
} from '../model'
import { defaultMessage } from '../utils/constant'
import { get, isEmpty } from 'lodash'
import { QueryTypes, Op } from 'sequelize'
import { camelCaseConversion } from '../utils/string'

export class CategoryService {
  constructor() {
    this.responseHelper = new ResponseHelper()
  }

  async createCategory(req, res) {
    const t = await sequelize.transaction();
    try {
      logger.info('Creating new category');
      const category = req.body;
      const { userId } = req;

      if (!category) {
        return this.responseHelper.validationError(res, new Error(defaultMessage.MANDATORY_FIELDS_MISSING));
      }

      const categoryInfo = await Category.findAll({
        where: {
          catName: category.catName,
          catNumber: category.catNumber,
        },
      });

      if (categoryInfo.length > 0) {
        return this.responseHelper.conflict(res, new Error('Category already exists in the System'));
      }

      const commonAttributes = {
        createdBy: userId,
        createdAt: new Date(),
        updatedBy: userId,
        updatedAt: new Date(),
      };

      const newCategory = await Category.create({
        ...category,
        ...commonAttributes,
      }, { transaction: t });

      await t.commit();
      logger.debug('New category created successfully');
      return this.responseHelper.onSuccess(res, 'Category created successfully', newCategory);
    } catch (error) {
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        return this.responseHelper.validationError(res, error);
      } else if (error.name === 'NotFoundError') {
        return this.responseHelper.notFound(res, defaultMessage.NOT_FOUND);
      } else {
        logger.error(error, defaultMessage.ERROR);
        await t.rollback();
        return this.responseHelper.onError(res, new Error('Error while creating category'));
      }
    }
  }


  async updateCategory(req, res) {
    const t = await sequelize.transaction();
    try {
      console.log("req body........>", req.body)
      console.log("req params.......>", req.params)
      const response = await Category.update(req.body, { where: { catId: req?.params?.id }, transaction: t })
      await t.commit()
      logger.debug('category updated successfully')
      return this.responseHelper.onSuccess(res, 'category updated successfully', response)
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return this.responseHelper.notFound(res, defaultMessage.NOT_FOUND)
      } else {
        logger.error(error, defaultMessage.ERROR)
        return this.responseHelper.onError(res, new Error('Error while creating customer'))
      }
    } finally {
      if (t && !t.finished) {
        await t.rollback()
      }
    }
  }

  async getCategory(req, res) {
    try {
      logger.debug('Getting Customer details by ID')
      const { id } = req.params
      // const { serviceId } = req.query
      if (!id) {
        return this.responseHelper.validationError(res, new Error(defaultMessage.MANDATORY_FIELDS_MISSING))
      }
      let response = {}
      const customer = await Customer.findOne({
        include: [{ model: Address, as: 'address' },
        {
          model: Contact,
          as: 'contact',
          include: [
            { model: BusinessEntity, as: 'contactTypeDesc', attributes: ['code', 'description'] }
          ]
        },

        { model: BusinessEntity, as: 'class', attributes: ['code', 'description'] },
        { model: BusinessEntity, as: 'category', attributes: ['code', 'description'] }],
        where: {
          customerId: id
        }
      })
      if (!customer) {
        logger.debug(defaultMessage.NOT_FOUND)
        return this.responseHelper.notFound(res, new Error(defaultMessage.NOT_FOUND))
      }
      response = customer.dataValues
      // Get the single account details
      // let account = await Account.findOne({
      //   include: [{ model: Address, as: 'address' }, { model: Contact, as: 'contact' }],
      //   where: {
      //     customerId: id
      //   }
      // })
      // const accountId = account.accountId
      // if (account) {
      //   const securityQuestion = await SecurityQuestion.findOne({
      //     where: {
      //       refId: accountId
      //     }
      //   })
      //   if (securityQuestion) {
      //     account = {
      //       ...account.dataValues,
      //       securityQuestion
      //     }
      //   }
      //   const whereClause = {
      //     accountId
      //   }
      //   if (serviceId) {
      //     whereClause.connectionId = serviceId
      //   }
      //   // Get the single service details
      //   const service = await Connection.findOne({
      //     include: [
      //       { model: Address, as: 'address' },
      //       {
      //         model: ConnectionPlan,
      //         as: 'conn_plan',
      //         include: [{ model: Plan, as: 'plan' }]
      //       }
      //     ],
      //     where: whereClause
      //   })
      //   if (service) {
      //     account = {
      //       ...account,
      //       service: [service]
      //     }
      //   }
      //   response = {
      //     ...response,
      //     account: [account]
      //   }
      // }
      response = transformCustomerResponse(response)
      logger.debug('Successfully fetch customer data')
      return this.responseHelper.onSuccess(res, defaultMessage.SUCCESS, response)
    } catch (error) {
      logger.error(error, 'Error while fetching Customer data')
      return this.responseHelper.onError(res, new Error('Error while fetching Customer data'))
    }
  }

  async getCategories(req, res) {
    try {
      logger.debug('Getting Categories')

      const categories = await Category.findAll({
        include: [
          { model: User, as: 'createdByDetails', attributes: ['firstName', 'lastName'] },
          { model: User, as: 'updatedByDetails', attributes: ['firstName', 'lastName'] },
          { model: BusinessEntity, as: 'statusDesc', attributes: ['code', 'description'] }
        ],
        where: {
          catStatus: ['AC', 'ACTIVE']
        }
      })
      if (!categories || categories?.length === 0) {
        logger.debug(defaultMessage.NOT_FOUND)
        return this.responseHelper.notFound(res, new Error(defaultMessage.NOT_FOUND))
      }
      logger.debug('Successfully fetch Categories data')
      return this.responseHelper.onSuccess(res, defaultMessage.SUCCESS, categories)
    } catch (error) {
      logger.error(error, 'Error while fetching Categories data')
      return this.responseHelper.onError(res, new Error('Error while fetching Categories data'))
    }
  }
}

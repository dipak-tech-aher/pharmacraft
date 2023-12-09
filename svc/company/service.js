import { logger } from '../config/logger'
import { ResponseHelper } from '../utils'
import {
  Company, sequelize, BusinessEntity, User
} from '../model'
import { defaultMessage } from '../utils/constant'
import { get, isEmpty } from 'lodash'
import { QueryTypes, Op } from 'sequelize'
import { camelCaseConversion } from '../utils/string'

export class CompanyService {
  constructor() {
    this.responseHelper = new ResponseHelper()
  }

  async create(req, res) {
    const t = await sequelize.transaction();
    try {
      logger.info('Creating new company');
      const company = req.body;
      const { userId } = req;

      if (!company) {
        return this.responseHelper.validationError(res, new Error(defaultMessage.MANDATORY_FIELDS_MISSING));
      }

      const companyInfo = await Company.findAll({
        where: {
          cName: company.cName
        },
      });

      if (companyInfo.length > 0) {
        return this.responseHelper.conflict(res, new Error('Company already exists in the System'));
      }

      const commonAttributes = {
        createdBy: userId,
        createdAt: new Date(),
        updatedBy: userId,
        updatedAt: new Date(),
      };

      const newCompany = await Company.create({
        ...company,
        ...commonAttributes,
      }, { transaction: t });

      await t.commit();
      logger.debug('New company created successfully');
      return this.responseHelper.onSuccess(res, 'Company created successfully', newCompany);
    } catch (error) {
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        return this.responseHelper.validationError(res, error);
      } else if (error.name === 'NotFoundError') {
        return this.responseHelper.notFound(res, defaultMessage.NOT_FOUND);
      } else {
        logger.error(error, defaultMessage.ERROR);
        await t.rollback();
        return this.responseHelper.onError(res, new Error('Error while creating company'));
      }
    }
  }

  async update(req, res) {
    const t = await sequelize.transaction();
    try {
      console.log("req body........>", req.body)
      console.log("req params.......>", req.params)
      const response = await Company.update(req.body, { where: { cId: req?.params?.cId }, transaction: t })
      await t.commit()
      logger.debug('company updated successfully')
      return this.responseHelper.onSuccess(res, 'company updated successfully', response)
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return this.responseHelper.notFound(res, defaultMessage.NOT_FOUND)
      } else {
        logger.error(error, defaultMessage.ERROR)
        return this.responseHelper.onError(res, new Error('Error while updating company'))
      }
    } finally {
      if (t && !t.finished) {
        await t.rollback()
      }
    }
  }

  async get(req, res) {
    try {
      logger.debug('Getting Customer details by ID')
      const { id } = req.params
      // const { serviceId } = req.query
      if (!id) {
        return this.responseHelper.validationError(res, new Error(defaultMessage.MANDATORY_FIELDS_MISSING))
      }
      let response = {}
      const customer = await Company.findOne({
        include: [{ model: Address, as: 'address' },
        {
          model: Contact,
          as: 'contact',
          include: [
            { model: BusinessEntity, as: 'contactTypeDesc', attributes: ['code', 'description'] }
          ]
        },

        { model: BusinessEntity, as: 'class', attributes: ['code', 'description'] },
        { model: BusinessEntity, as: 'company', attributes: ['code', 'description'] }],
        where: {
          customerId: id
        }
      })
      if (!customer) {
        logger.debug(defaultMessage.NOT_FOUND)
        return this.responseHelper.notFound(res, new Error(defaultMessage.NOT_FOUND))
      }
      response = customer.dataValues
      response = transformCustomerResponse(response)
      logger.debug('Successfully fetch customer data')
      return this.responseHelper.onSuccess(res, defaultMessage.SUCCESS, response)
    } catch (error) {
      logger.error(error, 'Error while fetching Customer data')
      return this.responseHelper.onError(res, new Error('Error while fetching Customer data'))
    }
  }

  async getCompanies(req, res) {
    try {
      logger.debug('Getting Companies')

      const companies = await Company.findAll({
        include: [
          { model: User, as: 'createdByDetails', attributes: ['firstName', 'lastName'] },
          { model: User, as: 'updatedByDetails', attributes: ['firstName', 'lastName'] },
          { model: BusinessEntity, as: 'statusDesc', attributes: ['code', 'description'] },
          { model: BusinessEntity, as: 'typeDesc', attributes: ['code', 'description'] },
          { model: BusinessEntity, as: 'cCountryDesc', attributes: ['code', 'description', 'mappingPayload'] }
        ],
        where: {
          cStatus: ['AC', 'ACTIVE']
        },
        order: [["cId", "DESC"]]
      })
      if (!companies || companies?.length === 0) {
        logger.debug(defaultMessage.NOT_FOUND)
        return this.responseHelper.notFound(res, new Error(defaultMessage.NOT_FOUND))
      }
      logger.debug('Successfully fetch Companies data')
      return this.responseHelper.onSuccess(res, defaultMessage.SUCCESS, companies)
    } catch (error) {
      logger.error(error, 'Error while fetching Companies data')
      return this.responseHelper.onError(res, new Error('Error while fetching Companies data'))
    }
  }
}

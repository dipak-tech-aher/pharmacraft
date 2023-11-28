import { logger } from '../config/logger'
import { ResponseHelper } from '../utils'
import {
  Category, sequelize, BusinessEntity,User
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
    const t = await sequelize.transaction()
    try {
      logger.debug('Updating customer data')
      const customer = req.body
      const userId = req.userId
      const { id } = req.params
      const response = {}
      if (!customer && !id) {
        return this.responseHelper.validationError(res, new Error(defaultMessage.MANDATORY_FIELDS_MISSING))
      }
      let addressId
      const customerId = id
      // Getting customer info
      const customerInfo = await Customer.findOne({
        where: {
          customerId: id
        }
      })
      if (!customerInfo) {
        logger.debug(defaultMessage.NOT_FOUND)
        return this.responseHelper.notFound(res, new Error(defaultMessage.NOT_FOUND))
      }
      const contactId = customerInfo.contactId
      // If user has address we will update or we will create
      if (customerInfo.addressId && Array.isArray(customer.address)) {
        const address = get(customer, 'address[0]', '')
        addressId = customerInfo.addressId
        if (address) {
          await updateAddress(address, addressId, userId, t)
        }
      } else if (Array.isArray(customer.address)) {
        const address = get(customer, 'address[0]', '')
        if (address) {
          const data = await createAddress(address, userId, t)
          if (data) {
            addressId = data.addressId
          }
        }
      }
      await updateContact(customer, contactId, userId, t)
      // Updating customer data
      const customerData = await updateCustomer(customer, userId, addressId, contactId, customerId, t)
      if (!customerData) {
        return this.responseHelper.onError(res, new Error('Error while updating customer'))
      }
      response.customerId = customerId
      // Updating account data
      if (Array.isArray(customer.account)) {
        for (const accounts of customer.account) {
          let accountAddressId
          let accountContactId
          if (accounts.accountId) {
            response.accountId = accounts.accountId
            const accountInfo = await Account.findOne({
              where: {
                accountId: accounts.accountId,
                customerId
              }
            })
            if (!accountInfo) {
              return this.responseHelper.notFound(res, new Error(defaultMessage.NOT_FOUND))
            }
            // If user has address we will update or we will create
            if (accounts.billingAddress && accounts.billingAddress.sameAsCustomerAddress === 'yes') {
              accountAddressId = accountInfo.addressId
              accountContactId = accountInfo.contactId
              await updateAddress(accounts.billingAddress, accountAddressId, userId, t)
              await updateContact(accounts, accountContactId, userId, t)
            } else if (accounts.billingAddress && accounts.billingAddress.sameAsCustomerAddress === 'no') {
              const address = await createAddress(accounts.billingAddress, userId, t)
              if (address) {
                accountAddressId = address.addressId
              }
              const contact = await createContact(accounts, userId, t)
              if (contact) {
                accountContactId = contact.contactId
              }
            }
            // Updating account data
            await updateAccount(customerInfo.customerType, accounts, customerId, accountAddressId, accountContactId, userId, accounts.accountId, t)

            const securityQuestion = await SecurityQuestion.findOne({
              accountId: accounts.accountId
            })
            // If user has SecurityQuestion we will update or we will create
            if (securityQuestion && accounts.security) {
              await updateSecurityQuestion(accounts.security, accounts.accountId, securityQuestion.profileId)
            } else {
              await createSecurityQuestion(accounts.security, accounts.accountId)
            }
            // Updating service data
            if (Array.isArray(accounts.service)) {
              for (const service of accounts.service) {
                if (service.serviceId) {
                  let serviceAddressId
                  const serviceInfo = await Connection.findOne({
                    where: {
                      connectionId: service.serviceId,
                      accountId: accounts.accountId
                    }
                  })
                  if (!serviceInfo) {
                    return this.responseHelper.notFound(res, new Error(defaultMessage.NOT_FOUND))
                  }
                  const connectionId = service.serviceId
                  // If user has address we will update or we will create
                  if (Array.isArray(service.serviceAddress)) {
                    for (const address of service.serviceAddress) {
                      if (serviceAddressId && address.sameAsBillingAddress === 'yes') {
                        serviceAddressId = serviceInfo.addressId
                        await updateAddress(address, serviceAddressId, userId, t)
                      } else if (address.sameAsBillingAddress === 'no') {
                        const addressInfo = await createAddress(address, userId, t)
                        if (addressInfo) {
                          serviceAddressId = addressInfo.addressId
                        }
                      }
                    }
                  }

                  const planId = get(service, 'product', '')
                  const connectionPlanInfo = await ConnectionPlan.findOne({
                    where: {
                      connectionId
                    }
                  })
                  if (connectionPlanInfo) {
                    // If user has selected new plan then need to update the connection plan table
                    if (planId !== connectionPlanInfo.planId) {
                      const plan = await Plan.findOne({
                        where: {
                          planId: get(service, 'product', '')
                        }
                      })
                      const prodCatalogue = get(service, 'catalog', '')
                      await updateConnectionPlan(plan, userId, connectionId, connectionPlanInfo.connPlanId, prodCatalogue, t)
                    }
                  }
                  // Updating Service data
                  const connection = await updateConnection(service, serviceAddressId, userId, connectionId, accounts.accountId, t)
                  if (connection) {
                    response.serviceId = connection.connectionId
                  }

                  // const serviceRequest = await createServiceRequest(customerId, accountInfo.accountId, plan, userId, t)
                  // if (serviceRequest) {
                  //   response.serviceRequest = serviceRequest
                  // }
                }
              }
            }
          }
        }
      }
      await t.commit()
      logger.debug('Customer data updated successfully')
      return this.responseHelper.onSuccess(res, 'customer updated successfully', response)
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return this.responseHelper.notFound(res, defaultMessage.NOT_FOUND)
      } else {
        logger.error(error, defaultMessage.ERROR)
        return this.responseHelper.onError(res, new Error('Error while updating customer'))
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

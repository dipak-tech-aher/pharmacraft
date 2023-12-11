import { logger } from '../config/logger'
import { ResponseHelper } from '../utils'
import {
  Category, Company, sequelize, BusinessEntity, Payments, PaymentReceipts, User, InvoiceHdr,
} from '../model'
import { defaultMessage } from '../utils/constant'
import { get, isEmpty } from 'lodash'
import { QueryTypes, Op } from 'sequelize'
import { camelCaseConversion } from '../utils/string'

export class PaymentsService {
  constructor() {
    this.responseHelper = new ResponseHelper()
  }

  async applyReceipt(req, res) {
    const t = await sequelize.transaction();
    try {
      logger.info('Applying receipt on invoice');
      const payloadData = req.body;
      const { userId } = req;
      console.log('payloadData--------->', payloadData)

      if (!payloadData) {
        return this.responseHelper.validationError(res, new Error(defaultMessage.MANDATORY_FIELDS_MISSING));
      }

      const payloadDataInfo = await PaymentReceipts.findAll({
        where: {
          prId: Number(payloadData?.prId)
        },
        logging: true
      });

      if (payloadDataInfo.length < 0) {
        return this.responseHelper.conflict(res, new Error('Invalid receipt applied'));
      }

      const commonAttributes = {
        createdBy: userId,
        createdAt: new Date(),
        updatedBy: userId,
        updatedAt: new Date(),
      };

      const newPayments = await Promise.all(
        (payloadData?.pPrId || []).map(async (ele) => {
          const payment = await Payments.create(
            {
              pPrId: ele?.pPrId,
              pReceiptAmount: payloadData?.pReceiptAmount,
              pCId: payloadData?.pCId,
              pInvId: payloadData?.pInvId,
              pAmount: payloadData?.pAmount,
              pStatus: "PAID",
              ...commonAttributes,
            },
            { transaction: t }
          );

          await PaymentReceipts.update({
            prAmount,
            prActivationStatus,
            prAmountApplied,
            prAvailableAmount,
            ...commonAttributes
          }, {
            where: {
              pPrId: ele?.pPrId
            },
            transaction: t
          });

          return payment;
        })
      )
      await t.commit();
      logger.debug('New payloadData created successfully');
      return this.responseHelper.onSuccess(res, 'Payments created successfully', newPayments);
    } catch (error) {
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        return this.responseHelper.validationError(res, error);
      } else if (error.name === 'NotFoundError') {
        return this.responseHelper.notFound(res, defaultMessage.NOT_FOUND);
      } else {
        logger.error(error, defaultMessage.ERROR);
        await t.rollback();
        return this.responseHelper.onError(res, new Error('Error while creating payloadData'));
      }
    }
  }

  async addReceipts(req, res) {
    const t = await sequelize.transaction();
    try {
      logger.info('Creating new receipt');
      const receipt = req.body;
      const { userId } = req;
      console.log('receipt--------->', receipt)

      if (!receipt) {
        return this.responseHelper.validationError(res, new Error(defaultMessage.MANDATORY_FIELDS_MISSING));
      }

      const commonAttributes = {
        createdBy: userId,
        createdAt: new Date(),
        updatedBy: userId,
        updatedAt: new Date(),
      };


      const newPayments = await PaymentReceipts.create({
        ...receipt,
        prAmountApplied: 0,
        prAvailableAmount: receipt?.prAmount,
        prActivationStatus: 'ACTIVE',
        ...commonAttributes,
      }, { transaction: t });

      await t.commit();
      logger.debug('New receipt created successfully');
      return this.responseHelper.onSuccess(res, 'Payments created successfully', newPayments);
    } catch (error) {
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        return this.responseHelper.validationError(res, error);
      } else if (error.name === 'NotFoundError') {
        return this.responseHelper.notFound(res, defaultMessage.NOT_FOUND);
      } else {
        logger.error(error, defaultMessage.ERROR);
        await t.rollback();
        return this.responseHelper.onError(res, new Error('Error while creating receipt'));
      }
    }
  }

  async update(req, res) {
    const t = await sequelize.transaction()
    try {
      logger.debug('Updating inventry data')
      const payments = req.body
      const userId = req.userId
      const { invId } = req.params
      const response = {}
      if (!payments && !invId) {
        return this.responseHelper.validationError(res, new Error(defaultMessage.MANDATORY_FIELDS_MISSING))
      }

      const paymentsInfo = await Payments.findOne({
        where: {
          invId
        }
      })
      if (!paymentsInfo) {
        logger.debug(defaultMessage.NOT_FOUND)
        return this.responseHelper.notFound(res, new Error(defaultMessage.NOT_FOUND))
      }
      const commonAttributes = {
        updatedBy: userId,
        updatedAt: new Date(),
      };
      await Payments.update({ ...payments, ...commonAttributes }, {
        where: {
          invId
        },
        transaction: t
      });
      await t.commit()
      logger.debug('payments data updated successfully')
      return this.responseHelper.onSuccess(res, 'payments updated successfully', response)
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return this.responseHelper.notFound(res, defaultMessage.NOT_FOUND)
      } else {
        logger.error(error, defaultMessage.ERROR)
        return this.responseHelper.onError(res, new Error('Error while updating payments'))
      }
    } finally {
      if (t && !t.finished) {
        await t.rollback()
      }
    }
  }

  async get(req, res) {
    try {
      logger.debug('Getting Payments details by ID')
      const { invId } = req.params
      if (!invId) {
        return this.responseHelper.validationError(res, new Error(defaultMessage.MANDATORY_FIELDS_MISSING))
      }
      let response = {}
      const payments = await Payments.findOne({
        include: [{ model: Category, as: 'categoryDetails' },
        { model: BusinessEntity, as: 'statusDesc', attributes: ['code', 'description'] }],
        where: {
          invId: catUnit
        }
      })
      if (!payments) {
        logger.debug(defaultMessage.NOT_FOUND)
        return this.responseHelper.notFound(res, new Error(defaultMessage.NOT_FOUND))
      }
      response = payments?.dataValues ?? payments
      logger.debug('Successfully fetch payments data')
      return this.responseHelper.onSuccess(res, defaultMessage.SUCCESS, response)
    } catch (error) {
      logger.error(error, 'Error while fetching payments data')
      return this.responseHelper.onError(res, new Error('Error while fetching payments data'))
    }
  }

  async getReceipts(req, res) {
    try {
      logger.debug('Getting receipts')

      const receipts = await PaymentReceipts.findAll({
        include: [
          { model: User, as: 'createdByDetails', attributes: ['firstName', 'lastName'] },
          { model: User, as: 'updatedByDetails', attributes: ['firstName', 'lastName'] },
          { model: Company, as: 'companyDetails' },
          { model: BusinessEntity, as: 'receiptTypeDesc', attributes: ['code', 'description'] },
          { model: BusinessEntity, as: 'statusDesc', attributes: ['code', 'description'] }
        ],
        // where: {
        //   prActivationStatus: ['AC', 'ACTIVE']
        // },
        order: [["prId", "DESC"]]
      })
      if (!receipts || receipts?.length === 0) {
        logger.debug(defaultMessage.NOT_FOUND)
        return this.responseHelper.notFound(res, new Error(defaultMessage.NOT_FOUND))
      }
      logger.debug('Successfully fetch receipts data')
      return this.responseHelper.onSuccess(res, defaultMessage.SUCCESS, receipts)
    } catch (error) {
      logger.error(error, 'Error while fetching receipts data')
      return this.responseHelper.onError(res, new Error('Error while fetching receipts data'))
    }
  }

  async getReceiptsByCompany(req, res) {
    try {
      logger.debug('Getting receipts')

      const receipts = await PaymentReceipts.findAll({
        include: [
          { model: User, as: 'createdByDetails', attributes: ['firstName', 'lastName'] },
          { model: User, as: 'updatedByDetails', attributes: ['firstName', 'lastName'] },
          { model: Company, as: 'companyDetails' },
          { model: BusinessEntity, as: 'receiptTypeDesc', attributes: ['code', 'description'] },
          { model: BusinessEntity, as: 'statusDesc', attributes: ['code', 'description'] }
        ],
        where: {
          prCId: req?.params?.prCId
        },
        order: [["prAvailableAmount", "DESC"]]
      })
      if (!receipts || receipts?.length === 0) {
        logger.debug(defaultMessage.NOT_FOUND)
        return this.responseHelper.notFound(res, new Error(defaultMessage.NOT_FOUND))
      }
      logger.debug('Successfully fetch receipts data')
      return this.responseHelper.onSuccess(res, defaultMessage.SUCCESS, receipts)
    } catch (error) {
      logger.error(error, 'Error while fetching receipts data')
      return this.responseHelper.onError(res, new Error('Error while fetching receipts data'))
    }
  }
}

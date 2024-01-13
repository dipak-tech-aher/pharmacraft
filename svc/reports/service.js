import { logger } from '../config/logger'
import { ResponseHelper } from '../utils'
import {
  Category, sequelize, BusinessEntity, User, Company, Inventory, InvoiceHdr, InvoiceTxn, SalesOrderTxn, SalesOrderHdr, Payments
} from '../model'
import { defaultMessage } from '../utils/constant'
import { get, isEmpty } from 'lodash'
import { QueryTypes, Op } from 'sequelize'
import { camelCaseConversion } from '../utils/string'
import salesOrderTxn from '../model/sales-order-txn'

export class ReportsService {
  constructor() {
    this.responseHelper = new ResponseHelper()
  }

  async getInvoicereports(req, res) {
    try {
      logger.debug('Getting invoice report');
      const requestpayload = req?.body;
      let whereClause = {}
      if (requestpayload?.fromDate && requestpayload?.toDate) {
        whereClause.invDate = {
          [Op.between]: [requestpayload?.fromDate, requestpayload?.toDate],
        };
      }
      if (requestpayload?.compId) {
        whereClause.invBillToId = requestpayload?.compId?.value
      }
      if (requestpayload?.invStatus) {
        whereClause.invStatus = requestpayload?.invStatus
      }
      if (requestpayload?.invNo) {
        whereClause.invNo = requestpayload?.invNo
      }
      const invoices = await InvoiceHdr.findAll({
        include: [
          { model: Company, as: 'fromDetails' },
          { model: Company, as: 'billToDetails' },
          { model: Company, as: 'shipToDetails' },
          { model: User, as: 'createdByDetails', attributes: ['firstName', 'lastName'] },
          { model: User, as: 'updatedByDetails', attributes: ['firstName', 'lastName'] },
          {
            model: SalesOrderHdr, as: 'soHdrDetails',
            model: InvoiceTxn, as: 'invoiceTxnDetails',
            include: [
              {
                model: Category, as: 'categoryDetails',
                include: [
                  {
                    model: Inventory, as: 'invDetails'
                  }
                ]
              }
            ]
          },
          { model: BusinessEntity, as: 'statusDesc', attributes: ['code', 'description'] }
        ],
        where: whereClause,
        order: [['invId', 'DESC']],
        logging: true
      })
     
      logger.debug('Successfully fetch invoices reports')
      return this.responseHelper.onSuccess(res, defaultMessage.SUCCESS, invoices)
    } catch (error) {
      logger.error(error, 'Error while fetching invoice report data')
      return this.responseHelper.onError(res, new Error('Error while fetching invoice reports'))
    }
  }
}

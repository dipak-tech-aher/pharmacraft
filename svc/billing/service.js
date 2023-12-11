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

export class BillingService {
  constructor() {
    this.responseHelper = new ResponseHelper()
  }

  async create(req, res) {
    const t = await sequelize.transaction();
    try {
      logger.info('generating invoice');
      const invoice = req.body;
      const { userId } = req;
      let invoiceItems = invoice?.items;
      // Function to calculate GST amount based on percentage and total rate
      function calculateGst(percentage, totalRate) {
        return (Number(percentage) / 100) * totalRate;
      }

      const updatedInvoiceItems = invoiceItems?.map((ele) => {
        const invTotalRate = Number(ele?.soQtyToBilled) * Number(ele?.soRate);
        return {
          soId: ele?.soId,
          soTxnId: ele?.soTxnId,
          invCatId: ele?.soCatId,
          invRate: ele?.soRate,
          invQty: ele?.soQtyToBilled,
          invTotalRate
        };
      });

      // Check if 'po' is falsy or 'poItems' is not an array
      if (!invoice || !Array.isArray(updatedInvoiceItems)) {
        return this.responseHelper.validationError(res, new Error(defaultMessage.MANDATORY_FIELDS_MISSING));
      }

      // Remove 'items' property from 'po' as it is being handled separately
      delete invoice.items;

      const commonAttributes = {
        createdBy: userId,
        createdAt: new Date(),
        updatedBy: userId,
        updatedAt: new Date(),
      };
      let invSubTotal = updatedInvoiceItems?.reduce((total, ele) => total + (Number(ele?.invTotalRate) || 0), 0);
      const invOtherCharges = invoice?.soOtherCharges ? Number(invoice?.soOtherCharges) : 0
      invSubTotal = invSubTotal + invOtherCharges

      let invTotalCgst = invoice?.soCgstPercentage ? calculateGst(invoice?.soCgstPercentage, invSubTotal) : 0;
      let invTotalSgst = invoice?.soSgstPercentage ? calculateGst(invoice?.soSgstPercentage, invSubTotal) : 0;
      let invTotalIgst = invoice?.soIgstPercentage ? calculateGst(invoice?.soIgstPercentage, invSubTotal) : 0;
      let invTotal = Number(invSubTotal) + Number(invTotalSgst) + Number(invTotalCgst) + Number(invTotalIgst)
      // Create a new InvoiceHdr

      const newInvoice = await InvoiceHdr.create({
        invOtherCharges: invoice?.invOtherCharges,
        invSoId: invoice?.soId,
        invFromId: invoice?.soFromId,
        invBillToId: invoice?.soBillToId,
        invShipToId: invoice?.soShipToId,
        invTotalQty: updatedInvoiceItems?.reduce((total, ele) => total + (Number(ele?.soQtyToBilled) || 0), 0),
        invCgstPercentage: invoice?.soCgstPercentage,
        invSgstPercentage: invoice?.soSgstPercentage,
        invIgstPercentage: invoice?.soIgstPercentage,
        invTotalSgst: invoice?.soTotalSgst,
        invTotalCgst: invoice?.soTotalCgst,
        invTotalIgst: invoice?.soTotalIgst,
        invTotal: invoice?.soTotal,
        invSubTotal: invoice?.soSubTotal,
        invNumber: invoice?.soNumber,
        invMrpNumber: invoice?.soMrpNumber,
        invTransporter: invoice?.soTransporter,
        invTransportMode: invoice?.soTransportMode,
        invFriegth: invoice?.soFriegth,
        invPackingForwarding: invoice?.soPackingForwarding,
        invInsurance: invoice?.soInsurance,
        invDate: new Date(),
        invDeliveryNoteDate: invoice?.soDeliveryNoteDate,
        invDeliveryNote: invoice?.soDeliveryNote,
        invPaymentTerms: invoice?.soPaymentTerms,
        invMrpDate: invoice?.soMrpDate,
        invDeliveryDate: invoice?.soDeliveryDate,
        invStatus: invoice?.billStatus === "BILLED" ? "INV_CLS" : "INV_PEND",
        invTotalSgst,
        invTotalCgst,
        invTotalIgst,
        invTotal,
        invOutstandingAmount: invoice?.billStatus === "BILLED" ? 0 : invoice?.billStatus === "PARTIALY-BILLED" ? Number(invTotal) - Number(invoice?.partialBillAmount) : invTotal,
        invSubTotal,
        invTotalQty: updatedInvoiceItems?.reduce((total, ele) => total + (ele?.soQtyToBilled || 0), 0),
        ...commonAttributes,
      }, { transaction: t });

      for (const ele of updatedInvoiceItems) {
        console.log('ele------------>', ele)
        try {
          const invExist = await Inventory.findOne({
            where: {
              invCatId: ele?.invCatId
            }
          });

          console.log('invExist---------->', invExist)

          if (invExist) {
            // Use sequelize.literal to perform an addition operation on invQty

            const items = await InvoiceTxn.create({
              invCatId: ele?.invCatId,
              invRate: ele?.invRate,
              invQty: ele?.invQty,
              invTotalRate: Number(ele?.invQty) * Number(ele?.invRate),
              ...commonAttributes,
              invId: newInvoice?.dataValues?.invId ?? newInvoice?.invId
            }, { transaction: t });

            // Update sale order txn
            const soQtyToBilled = ele?.invQty || 0;

            await SalesOrderTxn.update(
              {
                soBilledQty: sequelize.literal(`COALESCE(so_billed_qty, 0) + ${Number(soQtyToBilled)}`),
                ...commonAttributes
              },
              {
                where: {
                  soTxnId: ele?.soTxnId
                },
                transaction: t
              }
            );

            // Update Sale Order hdr
            await SalesOrderHdr.update(
              {
                soBilledQty: sequelize.literal(`COALESCE(so_billed_qty, 0) + ${Number(soQtyToBilled)}`),
                ...commonAttributes
              },
              {
                where: {
                  soId: ele?.soId
                },
                transaction: t
              }
            );

            // Update inventory

            console.log('soQtyToBilled----------->', soQtyToBilled)
            await Inventory.update(
              {
                invQty: sequelize.literal(`inv_qty - ${Number(soQtyToBilled)}`),
                ...commonAttributes
              },
              {
                where: {
                  invId: invExist?.dataValues?.invId ?? invExist.invId
                },
                transaction: t
              }
            );
          } else {
            // If inventory doesn't exist
            return this.responseHelper.onError(res, new Error('Out of stock'));

          }
        } catch (error) {
          await t.rollback();
          console.log('error-------->', error)
          return this.responseHelper.onError(res, new Error('Error while updating inventory'));
        }
      }

      if (invoice?.billStatus === "BILLED") {
        await Payments.create({
          pCId: invoice?.soBillToId,
          pInvId: newInvoice?.invId,
          pAmount: invTotal,
          pStatus: invoice?.billStatus,
          ...commonAttributes
        }, { transaction: t })
      } else if (invoice?.billStatus === "PARTIALY-BILLED") {
        await Payments.create({
          pCId: invoice?.soBillToId,
          pInvId: newInvoice?.invId,
          pAmount: invoice?.partialBillAmount,
          pStatus: invoice?.billStatus,
          ...commonAttributes
        }, { transaction: t })
      }

      // Commit the transaction
      await t.commit();
      logger.debug('New invoice generated successfully');

      return this.responseHelper.onSuccess(res, 'invoice generated successfully', newInvoice);
    } catch (error) {
      // Handle specific Sequelize errors
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        return this.responseHelper.validationError(res, error);
      } else if (error.name === 'NotFoundError') {
        return this.responseHelper.notFound(res, defaultMessage.NOT_FOUND);
      } else {
        // Log the error, rollback the transaction, and send a generic error response
        logger.error(error, defaultMessage.ERROR);
        await t.rollback();
        return this.responseHelper.onError(res, new Error('Error while generating invoice'));
      }
    }
  }

  async update(req, res) {
    const t = await sequelize.transaction()
    try {
      logger.debug('Updating inventry data')
      const po = req.body
      const userId = req.userId
      const { invId } = req.params
      const response = {}
      if (!po && !invId) {
        return this.responseHelper.validationError(res, new Error(defaultMessage.MANDATORY_FIELDS_MISSING))
      }

      const poInfo = await InvoiceHdr.findOne({
        where: {
          invId
        }
      })
      if (!poInfo) {
        logger.debug(defaultMessage.NOT_FOUND)
        return this.responseHelper.notFound(res, new Error(defaultMessage.NOT_FOUND))
      }
      const commonAttributes = {
        updatedBy: userId,
        updatedAt: new Date(),
      };
      await InvoiceHdr.update({ ...po, ...commonAttributes }, {
        where: {
          invId
        },
        transaction: t
      });
      await t.commit()
      logger.debug('po data updated successfully')
      return this.responseHelper.onSuccess(res, 'po updated successfully', response)
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return this.responseHelper.notFound(res, defaultMessage.NOT_FOUND)
      } else {
        logger.error(error, defaultMessage.ERROR)
        return this.responseHelper.onError(res, new Error('Error while updating po'))
      }
    } finally {
      if (t && !t.finished) {
        await t.rollback()
      }
    }
  }

  async addStockEntry(req, res) {
    const t = await sequelize.transaction()
    try {
      logger.debug('Updating stock data')
      const po = req.body
      const userId = req.userId
      const response = {}
      if (!po) {
        return this.responseHelper.validationError(res, new Error(defaultMessage.MANDATORY_FIELDS_MISSING))
      }

      const commonAttributes = {
        createdBy: userId,
        updatedBy: userId,
        updatedAt: new Date(),
        createdAt: new Date(),
      };

      const invExist = await Inventory.findOne({
        where: {
          invCatId: po?.soCatId
        }
      });

      if (invExist) {
        // Use sequelize.literal to perform an addition operation on invQty
        await Inventory.update(
          {
            invQty: sequelize.literal(`inv_qty + ${po?.recievedQty}`),
            ...commonAttributes
          },
          {
            where: {
              invId: invExist?.dataValues?.invId ?? invExist?.invId
            },
            transaction: t
          }
        );

      } else {
        await Inventory.create(
          {
            invCatId: po?.soCatId,
            invQty: po?.recievedQty,
            invStatus: 'AC',
            ...commonAttributes
          },
          { transaction: t }
        );
      }

      await InvoiceTxn.update(
        {
          soQty: sequelize.literal(`coalesce(po_qty, 0)  - ${po?.recievedQty}`),
          poRecievedQty: sequelize.literal(`coalesce(po_recieved_qty, 0) + ${po?.recievedQty}`),
          ...commonAttributes
        },
        {
          where: {
            poTxnId: po?.poTxnId
          },
          transaction: t
        }
      );

      await t.commit()
      logger.debug('po data updated successfully')
      return this.responseHelper.onSuccess(res, 'po updated successfully', response)
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return this.responseHelper.notFound(res, defaultMessage.NOT_FOUND)
      } else {
        logger.error(error, defaultMessage.ERROR)
        return this.responseHelper.onError(res, new Error('Error while updating po'))
      }
    } finally {
      if (t && !t.finished) {
        await t.rollback()
      }
    }
  }

  async get(req, res) {
    try {
      logger.debug('Getting po details by ID')
      const { invId } = req.params
      if (!invId) {
        return this.responseHelper.validationError(res, new Error(defaultMessage.MANDATORY_FIELDS_MISSING))
      }
      let response = {}
      const po = await InvoiceHdr.findOne({
        include: [{ model: Category, as: 'categoryDetails' },
        { model: BusinessEntity, as: 'statusDesc', attributes: ['code', 'description'] }],
        where: {
          invId
        }
      })
      if (!po) {
        logger.debug(defaultMessage.NOT_FOUND)
        return this.responseHelper.notFound(res, new Error(defaultMessage.NOT_FOUND))
      }
      response = po?.dataValues ?? po
      logger.debug('Successfully fetch po data')
      return this.responseHelper.onSuccess(res, defaultMessage.SUCCESS, response)
    } catch (error) {
      logger.error(error, 'Error while fetching po data')
      return this.responseHelper.onError(res, new Error('Error while fetching po data'))
    }
  }

  async getBills(req, res) {
    try {
      logger.debug('Getting bills')

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
        order: [['invId', 'DESC']]
        // where: {
        //   poStatus: ['AC', 'ACTIVE']
        // }
      })
      if (!invoices || invoices?.length === 0) {
        logger.debug(defaultMessage.NOT_FOUND)
        return this.responseHelper.notFound(res, new Error(defaultMessage.NOT_FOUND))
      }
      logger.debug('Successfully fetch invoices data')
      return this.responseHelper.onSuccess(res, defaultMessage.SUCCESS, invoices)
    } catch (error) {
      logger.error(error, 'Error while fetching po data')
      return this.responseHelper.onError(res, new Error('Error while fetching invoices data'))
    }
  }

  async getPendingInvoices(req, res) {
    try {
      logger.debug('Getting bills')

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
        order: [['invId', 'DESC']],
        where: {
          invStatus: ['INV_PEND']
        }
      })
      if (!invoices || invoices?.length === 0) {
        logger.debug(defaultMessage.NOT_FOUND)
        return this.responseHelper.notFound(res, new Error(defaultMessage.NOT_FOUND))
      }
      logger.debug('Successfully fetch invoices data')
      return this.responseHelper.onSuccess(res, defaultMessage.SUCCESS, invoices)
    } catch (error) {
      logger.error(error, 'Error while fetching po data')
      return this.responseHelper.onError(res, new Error('Error while fetching invoices data'))
    }
  }

  async getCompany(req, res) {
    try {
      logger.debug('Getting company')

      const company = await Company.findAll({
        include: [
          { model: BusinessEntity, as: 'typeDesc', attributes: ['code', 'description'] },
          { model: BusinessEntity, as: 'statusDesc', attributes: ['code', 'description'] }
        ],
        where: {
          cStatus: ['AC', 'ACTIVE']
        }
      })
      if (!company || company?.length === 0) {
        logger.debug(defaultMessage.NOT_FOUND)
        return this.responseHelper.notFound(res, new Error(defaultMessage.NOT_FOUND))
      }
      logger.debug('Successfully fetch po data')
      return this.responseHelper.onSuccess(res, defaultMessage.SUCCESS, company)
    } catch (error) {
      logger.error(error, 'Error while fetching company data')
      return this.responseHelper.onError(res, new Error('Error while fetching company data'))
    }
  }
}

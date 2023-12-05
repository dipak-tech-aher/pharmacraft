import { logger } from '../config/logger'
import { ResponseHelper } from '../utils'
import {
  Category, sequelize, BusinessEntity, SalesOrderHdr, SalesOrderTxn, User, Company, Inventory
} from '../model'
import { defaultMessage } from '../utils/constant'
import { get, isEmpty } from 'lodash'
import { QueryTypes, Op } from 'sequelize'
import { camelCaseConversion } from '../utils/string'

export class SoService {
  constructor() {
    this.responseHelper = new ResponseHelper()
  }

  async create(req, res) {
    const t = await sequelize.transaction();
    try {
      logger.info('Creating new so');
      const so = req.body;
      const { userId } = req;
      let soItems = so?.items;
      console.log('so----------->', so)
      // Function to calculate GST amount based on percentage and total rate
      function calculateGst(percentage, totalRate) {
        return (Number(percentage) / 100) * totalRate;
      }

      const updatedSoItems = soItems?.map((ele) => {
        const soTotalRate = Number(ele?.soQty) * Number(ele?.soRate);
        // const poCgst = ele?.soCgstPercentage ? calculateGst(ele?.soCgstPercentage, soTotalRate) : 0;
        // const poSgst = ele?.soSgstPercentage ? calculateGst(ele?.soSgstPercentage, soTotalRate) : 0;
        // const poIgst = ele?.poIgstPercentage ? calculateGst(ele?.poIgstPercentage, soTotalRate) : 0;

        return {
          ...ele,
          soTotalRate,
          // poCgst,
          // poSgst,
          // poIgst,
        };
      });


      // Check if 'po' is falsy or 'poItems' is not an array
      if (!so || !Array.isArray(updatedSoItems)) {
        return this.responseHelper.validationError(res, new Error(defaultMessage.MANDATORY_FIELDS_MISSING));
      }

      // Remove 'items' property from 'po' as it is being handled separately
      delete so.items;

      const commonAttributes = {
        createdBy: userId,
        createdAt: new Date(),
        updatedBy: userId,
        updatedAt: new Date(),
      };
      let soSubTotal = updatedSoItems?.reduce((total, ele) => total + (Number(ele?.soTotalRate) || 0), 0);
      console.log('soSubTotal----------->', soSubTotal)
      const soOtherCharges = so?.soOtherCharges ? Number(so?.soOtherCharges) : 0
      soSubTotal = soSubTotal + soOtherCharges
      console.log('soSubTotal----xx------->', soSubTotal)

      let soTotalCgst = so?.soCgstPercentage ? calculateGst(so?.soCgstPercentage, soSubTotal) : 0;
      let soTotalSgst = so?.soSgstPercentage ? calculateGst(so?.soSgstPercentage, soSubTotal) : 0;
      let soTotalIgst = so?.soIgstPercentage ? calculateGst(so?.soIgstPercentage, soSubTotal) : 0;
      let soTotal = Number(soSubTotal) + Number(soTotalSgst) + Number(soTotalCgst) + Number(soTotalIgst)
      // Create a new SalesOrderHdr

      console.log('soTotalCgst--------->', soTotalCgst)
      console.log('soTotalSgst--------->', soTotalSgst)
      console.log('soTotalIgst--------->', soTotalIgst)
      console.log('soTotal--------->', soTotal)

      const newSo = await SalesOrderHdr.create({
        ...so,
        soTotalSgst,
        soTotalCgst,
        soTotalIgst,
        soTotal,
        soSubTotal,
        soTotalQty: updatedSoItems?.reduce((total, ele) => total + (ele?.soQty || 0), 0),
        ...commonAttributes,
      }, { transaction: t });

      // Map 'soItems' to include 'soId' and common attributes
      console.log('updatedSoItems-------->', updatedSoItems)
      const items = await SalesOrderTxn.bulkCreate(updatedSoItems.map(item => ({
        ...item,
        ...commonAttributes,
        soId: newSo?.dataValues?.soId ?? newSo?.soId
      })), { transaction: t });

      // Commit the transaction
      await t.commit();
      logger.debug('New so created successfully');

      return this.responseHelper.onSuccess(res, 'so created successfully', newSo);
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
        return this.responseHelper.onError(res, new Error('Error while creating po'));
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

      const poInfo = await SalesOrderHdr.findOne({
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
      await SalesOrderHdr.update({ ...po, ...commonAttributes }, {
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

      await SalesOrderTxn.update(
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
      const po = await SalesOrderHdr.findOne({
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

  async getSos(req, res) {
    try {
      logger.debug('Getting so')

      const po = await SalesOrderHdr.findAll({
        include: [
          { model: User, as: 'createdByDetails', attributes: ['firstName', 'lastName'] },
          { model: User, as: 'updatedByDetails', attributes: ['firstName', 'lastName'] },
          { model: Company, as: 'fromDetails' },
          { model: Company, as: 'toDetails' },
          {
            model: SalesOrderTxn, as: 'soTxnDetails',
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
        order: [['soId', 'DESC']]
        // where: {
        //   poStatus: ['AC', 'ACTIVE']
        // }
      })
      if (!po || po?.length === 0) {
        logger.debug(defaultMessage.NOT_FOUND)
        return this.responseHelper.notFound(res, new Error(defaultMessage.NOT_FOUND))
      }
      logger.debug('Successfully fetch po data')
      return this.responseHelper.onSuccess(res, defaultMessage.SUCCESS, po)
    } catch (error) {
      logger.error(error, 'Error while fetching po data')
      return this.responseHelper.onError(res, new Error('Error while fetching po data'))
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

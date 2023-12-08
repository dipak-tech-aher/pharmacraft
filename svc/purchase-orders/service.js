import { logger } from '../config/logger'
import { ResponseHelper } from '../utils'
import {
  Category, sequelize, BusinessEntity, po, PurchaseOrderHdr, PurchaseOrderTxn, User, Company, Inventory
} from '../model'
import { defaultMessage } from '../utils/constant'
import { get, isEmpty } from 'lodash'
import { QueryTypes, Op } from 'sequelize'
import { camelCaseConversion } from '../utils/string'

export class PoService {
  constructor() {
    this.responseHelper = new ResponseHelper()
  }

  async create(req, res) {
    const t = await sequelize.transaction();
    try {
      logger.info('Creating new po');
      const po = req.body;
      const { userId } = req;
      let poItems = po?.items;
      console.log('po----------->', po)
      // Function to calculate GST amount based on percentage and total rate
      function calculateGst(percentage, totalRate) {
        return (Number(percentage) / 100) * totalRate;
      }

      const updatedPoItems = poItems?.map((ele) => {
        const poTotalRate = Number(ele?.poQty) * Number(ele?.poRate);
        const poRecievedQty = po?.poStatus === "CLS" ? Number(ele?.poQty) : 0
        const poQty = po?.poStatus === "CLS" ? 0 : Number(ele?.poQty)

        return {
          ...ele,
          poTotalRate,
          poRecievedQty,
          poQty
        };
      });


      // Check if 'po' is falsy or 'poItems' is not an array
      if (!po || !Array.isArray(updatedPoItems)) {
        return this.responseHelper.validationError(res, new Error(defaultMessage.MANDATORY_FIELDS_MISSING));
      }

      // Remove 'items' property from 'po' as it is being handled separately
      delete po.items;

      const commonAttributes = {
        createdBy: userId,
        createdAt: new Date(),
        updatedBy: userId,
        updatedAt: new Date(),
      };
      let poSubTotal = updatedPoItems?.reduce((total, ele) => total + (Number(ele?.poTotalRate) || 0), 0);
      const poOtherCharges = po?.poOtherCharges ? Number(po?.poOtherCharges) : 0
      poSubTotal = poSubTotal + poOtherCharges

      let poTotalCgst = po?.poCgstPercentage ? calculateGst(po?.poCgstPercentage, poSubTotal) : 0;
      let poTotalSgst = po?.poSgstPercentage ? calculateGst(po?.poSgstPercentage, poSubTotal) : 0;
      let poTotalIgst = po?.poIgstPercentage ? calculateGst(po?.poIgstPercentage, poSubTotal) : 0;
      let poTotal = Number(poSubTotal) + Number(poTotalSgst) + Number(poTotalCgst) + Number(poTotalIgst)

      const newPo = await PurchaseOrderHdr.create({
        ...po,
        poTotalSgst,
        poTotalCgst,
        poTotalIgst,
        poTotal,
        poSubTotal,
        poTotalQty: updatedPoItems?.reduce((total, ele) => total + (po?.poStatus === "CLS" ? Number(ele?.poRecievedQty) : Number(ele?.poQty) || 0), 0),
        ...commonAttributes,
      }, { transaction: t });

      // Map 'poItems' to include 'poId' and common attributes
      console.log('updatedPoItems-------->', updatedPoItems)

      const items = await PurchaseOrderTxn.bulkCreate(updatedPoItems.map(item => ({
        ...item,
        ...commonAttributes,
        poId: newPo?.dataValues?.poId ?? newPo?.poId
      })), { transaction: t });

      if (po?.poStatus === "CLS") {
        for (const ele of updatedPoItems) {
          try {
            const invExist = await Inventory.findOne({
              where: {
                invCatId: ele?.poCatId
              }
            });
            console.log('invExist------->', invExist)
            console.log('invExist?.dataValues?.invId ?? invExist.invId------->', invExist?.dataValues?.invId ?? invExist?.invId)
            if (invExist) {
              // Use sequelize.literal to perform an addition operation on invQty
              await Inventory.update(
                {
                  invCompanyId: po?.poFromId,
                  invQty: sequelize.literal(`inv_qty + ${ele?.poRecievedQty}`),
                  invStatus: 'AC',
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
              // If inventory doesn't exist, create a new inventory item
              await Inventory.create(
                {
                  invCatId: ele?.poCatId,
                  invQty: ele?.poRecievedQty,
                  invStatus: 'AC',
                  invCompanyId: po?.poFromId,
                  ...commonAttributes
                },
                { transaction: t }
              );
            }
          } catch (error) {
            await t.rollback();
            console.log('error-------->', error)
            return this.responseHelper.onError(res, new Error('Error while updating inventory'));
          }
        }
      }

      // Commit the transaction
      await t.commit();
      logger.debug('New po created successfully');

      return this.responseHelper.onSuccess(res, 'po created successfully', newPo);
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
      logger.debug('Updating po data')
      const po = req.body
      const userId = req.userId
      const { poId } = req.params
      const response = {}
      if (!po && !poId) {
        return this.responseHelper.validationError(res, new Error(defaultMessage.MANDATORY_FIELDS_MISSING))
      }

      const poInfo = await PurchaseOrderHdr.findOne({
        where: {
          poId
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
      await PurchaseOrderHdr.update({ ...po, ...commonAttributes }, {
        where: {
          poId
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
          invCatId: po?.poCatId
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
            invCatId: po?.poCatId,
            invQty: po?.recievedQty,
            invStatus: 'AC',
            ...commonAttributes
          },
          { transaction: t }
        );
      }

      await PurchaseOrderTxn.update(
        {
          poQty: sequelize.literal(`coalesce(po_qty, 0)  - ${po?.recievedQty}`),
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
      const po = await PurchaseOrderHdr.findOne({
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

  async getPos(req, res) {
    try {
      logger.debug('Getting po')

      const po = await PurchaseOrderHdr.findAll({
        include: [
          { model: User, as: 'createdByDetails', attributes: ['firstName', 'lastName'] },
          { model: User, as: 'updatedByDetails', attributes: ['firstName', 'lastName'] },
          { model: Company, as: 'fromDetails' },
          { model: Company, as: 'toDetails' },
          {
            model: PurchaseOrderTxn, as: 'poTxnDetails',
            include: [
              {
                model: Category, as: 'categoryDetails'
              }
            ]
          },
          { model: BusinessEntity, as: 'statusDesc', attributes: ['code', 'description'] }
        ],
        order: [['poId', 'DESC']]
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

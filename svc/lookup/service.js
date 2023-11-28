import { logger } from '../config/logger'
import { ResponseHelper } from '../utils'
import db, { BusinessEntity, AddressLookup, sequelize, BusinessUnit, Role, Plan, AssetMst, Service, AddonMst, User } from '../model'
import { defaultMessage } from '../utils/constant'
import { QueryTypes } from 'sequelize'
import { camelCaseConversion } from '../utils/string'

export class LookupService {
  constructor () {
    this.responseHelper = new ResponseHelper()
  }

  async getBusinessEntity (req, res) {
    try {
      logger.debug('Getting business entity details by code type')

      const { codeType } = req.query
      if (!codeType) {
        return this.responseHelper.validationError(res, new Error(defaultMessage.MANDATORY_FIELDS_MISSING))
      }
      const response = await BusinessEntity.findAll({
        where: {
          codeType: codeType,
          status: 'AC'
        },
        order: [['description', 'ASC']]
      })

      const businessEntities = []
      for (const row of response) {
        businessEntities.push({
          code: row.code,
          description: row.description
        })
      }
      if (codeType === 'PLAN_TYPE') {
        businessEntities.push({
          code: 'BOOSTER',
          description: 'Booster'
        })
      }
      logger.debug('Successfully fetched business entity data')
      return this.responseHelper.onSuccess(res, defaultMessage.SUCCESS, businessEntities)
    } catch (error) {
      logger.error(error, 'Error while fetching business entity data')
      return this.responseHelper.onError(res, new Error('Error while fetching business entity data'))
    }
  }

  async getMultipleBusinessEntities (req, res) {
    try {
      logger.debug('Getting multiple business entities')

      const codeTypes = req.body

      const businessEntities = {}
      for (const codeType of codeTypes) {
        const response = await BusinessEntity.findAll({
          where: {
            codeType: codeType,
            status: 'AC'
          },
          order: [['description', 'ASC']]
        })

        businessEntities[codeType] = []

        for (const row of response) {
          businessEntities[codeType].push({
            code: row.code,
            description: row.description,
            codeType: row.codeType,
            mapping: row.mappingPayload,
            status: row.status
          })
        }
        if (codeType === 'PLAN_TYPE') {
          businessEntities[codeType].push({
            code: 'BOOSTER',
            description: 'Booster',
            mapping: {}
          })
        }
      }
      logger.debug('Successfully fetched business entities data')
      return this.responseHelper.onSuccess(res, defaultMessage.SUCCESS, businessEntities)
    } catch (error) {
      logger.error(error, 'Error while fetching business entities data')
      return this.responseHelper.onError(res, new Error('Error while fetching business entities data'))
    }
  }

  async getAddressLookup (req, res) {
    try {
      logger.debug('Getting address details')

      const response = await AddressLookup.findAll()

      const addressLookup = []
      for (const row of response) {
        addressLookup.push({
          postCode: row.postCode,
          kampong: row.admUnit1,
          district: row.district,
          mukim: row.subDistrict
        })
      }

      logger.debug('Successfully fetched address lookup data')
      return this.responseHelper.onSuccess(res, defaultMessage.SUCCESS, addressLookup)
    } catch (error) {
      logger.error(error, 'Error while fetching address lookup data')
      return this.responseHelper.onError(res, new Error('Error while fetching address lookup data'))
    }
  }

  async getDepartmentAndRoles (req, res) {
    try {
      logger.debug('Getting departments and roles list')
      const departments = await BusinessUnit.findAll({
        attributes: ['unitId', 'unitName', 'unitType', 'status', 'mappingPayload']
      })
      const response = []
      if (Array.isArray(departments)) {
        for (const dept of departments) {
          if (dept.mappingPayload && dept.mappingPayload.unitroleMapping) {
            const roleIds = dept.mappingPayload.unitroleMapping
            const roles = await Role.findAll({
              attributes: ['roleId', 'roleName'],
              where: {
                roleId: roleIds
              }
            })
            const unitId = dept.unitId
            const unitName = dept.unitName
            const unitType = dept.unitType
            response.push({ unitId, unitName, unitType, roles })
          }
        }
      }
      logger.debug('Successfully fetch departments and roles list')
      return this.responseHelper.onSuccess(res, defaultMessage.SUCCESS, response)
    } catch (error) {
      logger.error(error, 'Error while fetching  departments and roles list')
      return this.responseHelper.onError(res, new Error('Error while fetching  departments and roles list'))
    }
  }

  async getUsersRoleId (req, res) {
    try {
      logger.debug('Getting users list')
      const roleId = Number(req.query['role-id'])
      const { dept } = req.query
      if (!roleId) {
        return this.responseHelper.validationError(res, new Error(defaultMessage.MANDATORY_FIELDS_MISSING))
      }
      let response = []
      const roleInfo = await Role.findOne({
        where: {
          roleId
        }
      })
      if (roleInfo) {
        response = await sequelize.query(`SELECT user_id, user_type, title, first_name, last_name FROM users
        WHERE status in ('AC','ACTIVE') and mapping_payload @> '{"userDeptRoleMapping":[{"roleId":[` + roleId + '] , "unitId" :' + dept + '}]}\'', {
          type: QueryTypes.SELECT
        })
        if (response) {
          response = camelCaseConversion(response)
        }
      }
      logger.debug('Successfully fetch users list')
      return this.responseHelper.onSuccess(res, defaultMessage.SUCCESS, response)
    } catch (error) {
      logger.error(error, 'Error while fetching users list')
      return this.responseHelper.onError(res, new Error('Error while fetching users list'))
    }
  }

  async getDBSchemaInfo (req, res) {
    try {
      logger.info('Fetching database schema details')

      const out = []

      for (const t of Object.keys(db.sequelize.models)) {
        out.push({
          tableName: db[t].tableName,
          displayName: t,
          columns: []
        })

        const idx = out.length - 1

        for (const c of Object.keys(db.sequelize.models[t].rawAttributes)) {
          out[idx].columns.push({
            columnName: db.sequelize.models[t].rawAttributes[c].field,
            displayName: db.sequelize.models[t].rawAttributes[c].fieldName
          })
          const cIdx = out[idx].columns.length - 1

          if (['STRING', 'JSONB'].includes(db.sequelize.models[t].rawAttributes[c].type.toSql())) {
            out[idx].columns[cIdx].dataType = 'TEXT'
          }

          if (db.sequelize.models[t].rawAttributes[c].type.toSql() === 'INTEGER') {
            out[idx].columns[cIdx].dataType = 'NUMBER'
          }

          if (db.sequelize.models[t].rawAttributes[c].primaryKey &&
            (db.sequelize.models[t].rawAttributes[c].autoIncrement) === true) {
            out[idx].columns[cIdx].allowedOps = ['SELECT', 'UPDATE']
          } else {
            out[idx].columns[cIdx].allowedOps = ['SELECT', 'UPDATE', 'INSERT']
          }
        }
      }

      logger.debug('Successfully fetched database schema details')
      return this.responseHelper.onSuccess(res, 'Successfully fetched database schema details', out)
    } catch (error) {
      logger.error(error, 'Uexpected error while fetching database schema details')
      return this.responseHelper.onError(res, new Error('Uexpected error while fetching database schema details'))
    }
  }

  async loadProductsLookup (req, res) {
    logger.debug('Getting Product Lookup')
    // const Op = require('sequelize').Op
    try {
      const planLookup = await Plan.findAll({
        where: {
          status: 'ACTIVE'
        },
        order: [['createdAt', 'ASC']]
      })

      const addOnLookup = await AddonMst.findAll({
        where: {
          status: 'ACTIVE'
        },
        order: [['createdAt', 'ASC']]
      })

      const serviceLookup = await Service.findAll({
        where: {
          status: 'ACTIVE'
        },
        order: [['createdAt', 'ASC']]
      })

      const assetLookup = await AssetMst.findAll({
        where: {
          status: 'ACTIVE'
        },
        order: [['createdAt', 'ASC']]
      })

      // console.log('planLookup:::', planLookup)
      // console.log('addOnLookup:::', addOnLookup)
      // console.log('serviceLookup:::', serviceLookup)
      // console.log('assetLookup:::', assetLookup)

      // rows = transformChatSearchResponse(rows);
      const response = {
        planLookup,
        serviceLookup,
        assetLookup,
        addOnLookup
      }
      logger.debug('Successfully fetch Product Lookup')
      return this.responseHelper.onSuccess(
        res,
        defaultMessage.SUCCESS,
        response
      )
    } catch (error) {
      logger.error(error, 'Error while fetching Product Lookup')
      return this.responseHelper.onError(
        res,
        new Error('Error while fetching Product Lookup')
      )
    }
  }

  async userByDepartment (req, res) {
    try {
      logger.info('Finding users and department')
      const users = await User.findAll({
        attributes: ['userId', 'firstName', 'lastName', 'email', 'mappingPayload'],
        where: {
          email: { [Op.ne]: null },
          mappingPayload: { [Op.ne]: null }
        }
      })
      let departments = []
      for (const user of users) {
        for (const u of user.mappingPayload.userDeptRoleMapping) {
          // usersArr.push({ unit: u.unitId, user })
          departments.push(u.unitId)
        }
      }
      departments = [...new Set(departments)]
      const unitNames = await BusinessUnit.findAll({
        attributes: ['unitName', 'unitId'],
        where: { unitId: departments }
      })

      const newFinal = []
      for (const user of users) {
        for (const unit of user.mappingPayload.userDeptRoleMapping) {
          let unitName
          for (const unitN of unitNames) {
            if (unit.unitId === unitN.unitId) {
              unitName = unitN.unitName
            }
          }
          const users = {
            unit: unit.unitId,
            unitName,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            userId: user.userId
          }
          newFinal.push(users)
        }
      }

      // const usersArr = []
      // for (const user of users) {
      //   for (const u of user.mappingPayload.userDeptRoleMapping) {
      //     // usersArr.push({ unit: u.unitId, user })
      //     departments.push(u.unitId)
      //   }
      // }
      // departments = [...new Set(departments)]
      // const unitNames = await BusinessUnit.findAll({
      //   attributes: ['unitName', 'unitId'],
      //   where: { unitId: departments }
      // })
      // const final = []
      // for (const dep of departments) {
      //   const arr = []
      //   for (const user of usersArr) {
      //     if (dep === user.unit) {
      //       const value = {
      //         firstName: user.user.firstName,
      //         lastName: user.user.lastName,
      //         email: user.user.email
      //       }
      //       arr.push(value)
      //     }
      //   }
      //   let unitName
      //   for (const unit of unitNames) {
      //     if (dep === unit.unitId) {
      //       unitName = unit.unitName
      //     }
      //   }
      //   final.push({
      //     unit: dep,
      //     unitName,
      //     users: arr
      //   })
      // }
      // console.log(departments)
      logger.debug('Successfully fetch users list')
      return this.responseHelper.onSuccess(res, defaultMessage.SUCCESS, newFinal)
    } catch (error) {
      logger.error(error, 'Error while fetching Product Lookup')
      return this.responseHelper.onError(
        res,
        new Error('Error while fetching Product Lookup')
      )
    }
  }
}

export const getUsersByRole = (roleId, deptId) => {
  try {
    logger.debug('Getting users list')

    let response = []
    const roleInfo = Role.findOne({
      where: {
        roleId
      }
    })
    if (roleInfo) {
      response = sequelize.query(`SELECT user_id, user_type, title, first_name, last_name, email, contact_no FROM users
      WHERE mapping_payload @> '{"userDeptRoleMapping":[{"roleId":[` + roleId + '] , "unitId" :"' + deptId + '"}]}\'', {
        type: QueryTypes.SELECT
      })
      if (response) {
        response = camelCaseConversion(response)
      }
    }
    logger.debug('Successfully fetch users list')
    return response
  } catch (error) {
    logger.error(error, 'Error while fetching users list')
  }
}

export const getBusinessEntityByCode = (code) => {
  try {
    logger.debug('Getting business entity details by code type')

    const response = BusinessEntity.findOne({
      attributes: ['description'],
      where: {
        code: code
      }
    })
    logger.debug('Successfully fetched business entity data')
    return response
  } catch (error) {
    logger.error(error, 'Error while fetching business entity data')
  }
}

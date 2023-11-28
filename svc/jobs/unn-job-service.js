import Got from 'got'
import { isEmpty } from 'lodash'
import { logger } from '../config/logger'
import { sequelize, Interaction } from '../model/index'
import { systemUserId, unnCredentials, unnProperties } from 'config'

export const processUNNService = async () => {
  logger.debug('Processing fetch recodrs from UNN service')
  const t = await sequelize.transaction()
  try {
    const accessToken = await authenticateUNN()
    if (accessToken) {
      const records = await fetchRecords(accessToken)
      console.log('records=>', records)
      if (records && Array.isArray(records) && !isEmpty(records)) {
        for (const record of records) {
          await createInteraction(record, t)
        }
      } else {
        logger.debug('No Records found in unn service')
      }
    } else {
      logger.debug('AccessToken not found')
    }
    await t.commit()
  } catch (error) {
    logger.error(error, 'Error while fetching records from UNN service')
  } finally {
    if (t && !t.finished) {
      await t.rollback()
    }
  }
}

const authenticateUNN = async () => {
  logger.debug('Authenticating UNN service')
  const loginResponse = await Got.post({
    headers: { 'content-type': 'application/json' },
    url: unnProperties.URL,
    body: JSON.stringify(unnCredentials),
    retry: 0
  })
  if (loginResponse && loginResponse.body) {
    const response = JSON.parse(loginResponse.body)
    if (response.responseStatus === 'SUCCESS') {
      return response.hdrcache[0].strToken
    }
  } else {
    logger.debug('Unable to reach UNN service')
  }
  return null
}

const fetchRecords = async (accessToken) => {
  logger.debug('Fetching tickets from unn service')
  const reqBody = {
    workFlowName: 'APITKTCoreTicketTS',
    workFlowParams: {
      methodName: 'GlobleSearchTicketTS',
      strId: 'SASRQ',
      strSrvcNum: '2222320',
      strToken: accessToken,
      strUserId: 'AIOS2'
    }
  }
  const response = await Got.post({
    headers: { 'content-type': 'application/json' },
    url: unnProperties.URL,
    body: JSON.stringify(reqBody),
    retry: 0
  })
  if (response && response.body) {
    const data = JSON.parse(response.body)
    if (data.responseStatus === 'SUCCESS') {
      return data
    }
  }
  return null
}

const createInteraction = async (data, t) => {
  logger.debug('Creating Interaction record')
  const interaction = {
    intxnType: 'REQCOMP',
    intxnCatType: 'REQCOMP',
    assignedDate: (new Date()),
    // identificationNo: customer.account[0].service[0].identificationNo,
    // customerId: customer.customerId,
    // accountId: customer.account[0].accountId,
    // botProcess: 'N',
    // currUser: userId,
    // createdEntity: departmentId,
    // currEntity: departmentId,
    // currRole: roleId,
    createdBy: systemUserId,
    updatedBy: systemUserId
    // addressId: customer.account[0].service[0].addressId,
    // connectionId: customer.account[0].service[0].connectionId,
    // isBotReq: 'Y',
    // planId: srData.planId,
    // businessEntityCode: srData.prodType,
    // description: 'Teleport Service',
    // woType: 'TELEPORT',
    // currStatus: 'CREATED',
    // existingConnectionId: customer.account[0].service[0].existingConnectionId
  }
  await Interaction.create(interaction, { transaction: t })
  logger.debug('Successfully created Interaction Record')
}

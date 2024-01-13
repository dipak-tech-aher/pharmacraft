import 'babel-polyfill'

import express from 'express'
import bodyParser from 'body-parser'
import config from 'config'
import { logger } from './config/logger'
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')

const cors = require('cors')
const app = express()
const port = config.aios.port

app.use(cors())

app.use(bodyParser.json({ limit: '20mb' }))
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
const routes = require('./route')

app.get('/get-msg', (req, res) => {
  console.log('welcome');
  res.json({ msg: 'Welcome' })
})
app.use('/api', routes)


const server = require('http').createServer(app)

server.listen(port, (err) => {
  if (err) {
    logger.error('Error occured while starting server: ', err)
    return
  }
  if (process.env.NODE_ENV === 'production' || (process.env.NODE_ENV === 'uat')) {
    task.start()
    retries.start()
  }
  logger.debug('Server started in port no: ', port)
})
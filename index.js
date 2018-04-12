/*This is the lambda entry point. localRun.js is the file used to run the app locally*/

const app                  = require('./app').app
const awsServerlessExpress = require('aws-serverless-express')
const server               = awsServerlessExpress.createServer(app)

exports.handler = (event, context) => awsServerlessExpress.proxy(server, event, context)

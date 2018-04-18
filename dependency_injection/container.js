/*IocC Container (Service Locatator not really DI but still good)*/
const bottlejs = require("bottlejs")
const bottle   = new bottlejs.Bottle();

/*Remote services and their fakes*/
const sql                   = require("mysql")
const sqlFake               = require('./fakes/sql.fakes')
const dynamoDBFake          = require('./fakes/dynamodb.fakes')
const DynamoDBCreator       = require('aws-sdk/clients/dynamodb')
const dynamodb              = new DynamoDBCreator({'region': 'us-east-1'})
const snsFake               = require('./fakes/sns.fakes')
const SNSCreator            = require('aws-sdk/clients/sns')
const sns                   = new SNSCreator({'region': 'us-east-1'});
const cloudformationFake    = require('./fakes/cloudformation.fakes')
const CloudformationBuilder = require('aws-sdk/clients/cloudformation')
const cloudformation        = new CloudformationBuilder({'region': 'us-east-1'})

function Container(){
  if(process.env.NODE_ENV !== "test") {
    this.loadDepedencies(); //Ensure real non-unit test dependencies loaded by default
  } else {
    this.loadFakes();
  }
}

/*Define non-unit test implementations here*/
Container.prototype.loadDepedencies = function() {
  bottle.service('Sql', function() { return sql })
  bottle.service('DynamoDB', function() { return dynamodb })
  bottle.service('Sns', function() { return sns })
  bottle.service('Cloudformation', function() { return cloudformation })
}

/*Define unit-test mocks of remote services here*/
Container.prototype.loadFakes = function() {
  bottle.service('Sql', function() { return sqlFake })
  bottle.service('DynamoDB', function() { return dynamoDBFake })
  bottle.service('Sns', function() { return snsFake })
  bottle.service('Cloudformation', function() { return cloudformationFake })
  //bottle.service('UserService', function() { return userServiceFake })
}

/*Export the container and services*/
Container.prototype.services = bottle.container
const container = new Container();
module.exports.init = () => {
  return container
}

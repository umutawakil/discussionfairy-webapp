//const sinon      = require("sinon")
const container          = require("../../../dependency_injection/container").init()
container.loadFakes()

//TODO: Need a error switch for the fakes

const rdsService = require("../../../services/rds.services.js")
const assert     = require('chai').assert
//const sql        = require("mysql")

var dataset = [
  {
    table:"some_table1",
    data:{
      name:"some_object_name1"
    }
  },
  {
    table:"some_table2",
    data:{
      name:"some_object_name2"
    }
  }
]

/*var Connection = function() {
  this.release = () => {},
  this.query = (q,cb) => {
    cb(undefined,{})
  },
  this.beginTransaction = cb => {
    cb()
  },
  this.commit = c => {
    cb()
  }
}

var Pool = function() {
  this.query = (q,cb) => {},
  this.on = () => {},
  this.getConnection = (c) => {
    c(undefined,new Connection())
  }
}*/

describe("RDS Service:",function(){
    /*var connection
    var pool = rdsService.getPool()
    var sql = rdsService.getSQL()

    beforeEach(function(){
      var fakeSQL = {
        format:() => { return ""},
        createPool: () => {
          var poolError = undefined
          var connectionError = undefined
          var transactionError = undefined
          var commitError = undefined
          var resultsResponse = {}
          var fieldsResponse = {}
          return createMockPool(poolError,connectionError,transactionError,commitError,resultsResponse,fieldsResponse)
        }
      }
      rdsService.setSQL(fakeSQL)
    })
    afterEach(function(){
      rdsService.setSQL(sql)
    })*/

    /*var sandbox;
    var poolStub;
    var getConnectionStub;

    beforeEach(function(){
      sandbox = sinon.createSandbox()

      poolStub = sandbox.stub(sql,"createPool");
      poolStub.callsFake(()=>{
       return new Pool()
     })

    })
    afterEach(function(){
      sandbox.restore()
    })*/

    it("Create connection pool",function(done){
      /*var poolError = undefined
      var connectionError = undefined
      var transactionError = undefined
      var commitError = undefined
      var resultsResponse = {}
      var fieldsResponse = {}
      rdsService.setPool(createMockPool(poolError,connectionError,transactionError,commitError,resultsResponse,fieldsResponse))*/
      rdsService.createConnectionPool()
      done()
    })

    it("sends a prepared statement",function(done){
        /*var poolError = undefined
        var connectionError = undefined
        var transactionError = undefined
        var commitError = undefined
        var resultsResponse = {}
        var fieldsResponse = {}
        rdsService.setPool(createMockPool(poolError,connectionError,transactionError,commitError,resultsResponse,fieldsResponse))*/

        rdsService.preparedStatement("SOME SQL QUERY",[]).then(r=>{
        assert(r,"undefined response")
        done()

      }).catch(e => {
        console.log(e)
        done(e)
      })
    })

    /*it("It rejects when pool has error",function(done){
        var poolError = {}
        var connectionError = undefined
        var transactionError = undefined
        var commitError = undefined
        var resultsResponse = {}
        var fieldsResponse = {}
        rdsService.setPool(createMockPool(poolError,connectionError,transactionError,commitError,resultsResponse,fieldsResponse))

        rdsService.preparedStatement("SOME SQL QUERY",[]).catch(e=>{
        assert(e.code===500,"wrong error returned")
        done()

      }).catch(e => {
        console.log(e)
        done(e)
      })
    })*/

    /*it("It rejects when transaction has error",function(done){
        var poolError = undefined
        var connectionError = undefined
        var transactionError = {}
        var commitError = undefined
        var resultsResponse = {}
        var fieldsResponse = {}
        rdsService.setPool(createMockPool(poolError,connectionError,transactionError,commitError,resultsResponse,fieldsResponse))

        rdsService.storeDataSets(dataset).catch(e=>{
        assert(e.code===500,"wrong error returned")
        done()

      }).catch(e => {
        console.log(e)
        done(e)
      })
    })

    it("It rejects when commit has error",function(done){
        var poolError = undefined
        var connectionError = undefined
        var transactionError = undefined
        var commitError = {}
        var resultsResponse = {}
        var fieldsResponse = {}
        rdsService.setPool(createMockPool(poolError,connectionError,transactionError,commitError,resultsResponse,fieldsResponse))

        rdsService.storeDataSets(dataset).catch(e=>{
        assert(e.code===500,"wrong error returned")
        done()

      }).catch(e => {
        console.log(e)
        done(e)
      })
    })

    it("It rejects when connection has error",function(done){
        var poolError = undefined
        var connectionError = {}
        var transactionError = undefined
        var commitError = undefined
        var resultsResponse = {}
        var fieldsResponse = {}
        rdsService.setPool(createMockPool(poolError,connectionError,transactionError,commitError,resultsResponse,fieldsResponse))

        rdsService.preparedStatement("SOME SQL QUERY",[]).catch(e=>{
        assert(e.code===500,"wrong error returned")
        done()

      }).catch(e => {
        console.log(e)
        done(e)
      })
    })*/

    it("stores data sets",function(done){
      /*var poolError = undefined
      var connectionError = undefined
      var transactionError = undefined
      var commitError = undefined
      var resultsResponse = {}
      var fieldsResponse = {}
      rdsService.setPool(createMockPool(poolError,connectionError,transactionError,commitError,resultsResponse,fieldsResponse))*/

      rdsService.storeDataSets(dataset).then(r=>{
        done()
      }).catch(e=>{
        console.log(e)
        done(e)
      })
    })

    //rdsService.setPool(pool)
})

/*function createMockPool(poolError,connectionError,transactionError,commitError,connectionResponse,fieldsResponse){
  var pool = {
    //createPool: () => {},
    on: () => {},
    query: () => {},
    getConnection: function(callback){
      callback(poolError,this.connection)
    }
  }
  var connection = {
    query: function(sql,callback){
      callback(connectionError,connectionResponse,fieldsResponse)
    },
    beginTransaction: function(callback){
      callback(transactionError)
    },
    commit:function(callback){
      callback(commitError)
    },
    rollback:function(callback){
      callback()
    },
    release:function(){}
  }
  pool.connection = connection

  return pool
}*/

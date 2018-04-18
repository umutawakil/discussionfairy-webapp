//var sql                = require("mysql")
const container        = require("../dependency_injection/container").init()
const sql              = container.services.Sql
var   pool             = undefined
const rdsDecision      = require("../decisions/rds.decisions.js")
const ApplicationError = require("../types/responses/application.error")

/*module.exports.setPool = function(x){
  pool = x
}
module.exports.getPool = function(){
  return pool
}
module.exports.setSQL = function(x){
  sql = x
}
module.exports.getSQL = function(){
  return sql
}*/

//TODO:The effect of restarting the application has the effect of adding a new set of connections
//UPDATE: Not entirely true. THis module seems smart enough to use connections that already exist. How it does that is beyond me, perhaps
//worth a stackoverflow question on pool connection management.

module.exports.createConnectionPool  = createConnectionPool

function createConnectionPool(){
  if(pool){
    console.log("Pool Already Created..Skiping this call")
    return
  }
  console.log("Creating connection pool...")
  var config = {
     connectionLimit : 10,
     queueLimit      : 10,
     host            : process.env.DatabaseHostName,
     port            : process.env.RDSPort,
     user            : process.env.MasterUsername,
     password        : process.env.MasterUserPassword,
     database        : "discussionfairy"
   }
   pool  = sql.createPool(config);
   createPoolCallbacks()
}

function createPoolCallbacks(){
  pool.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
     if (error){
       console.log("POOL ERROR")
       console.log(error)
     } else {
       console.log('POOL GOD: 1 + 1 = ', results[0].solution);
     }
   })

   pool.on('acquire', function (connection) {
     console.log('Connection %d acquired', connection.threadId);
   });

   pool.on('release', function (connection) {
     console.log('Connection %d released', connection.threadId);
   });

   pool.on('enqueue', function () {
     console.log('Waiting for available connection slot');
   });

   pool.on('connection', function (connection) {
     connection.query('SET SESSION auto_increment_increment=1')
   });
}

function createPoolRequiringFunction(func) {
  return () => {
    if(!pool) {
      createConnectionPool()
    }
    return func()
  }
}

module.exports.preparedStatement = function(queryString,values){
  var func = () => {
    console.log("\r\n"+queryString)
    console.log(JSON.stringify(values)+"\r\n")

    var outerResolve;
    var outerReject;
    var promise = new Promise((resolve,reject) => {
      outerReject=reject;
      outerResolve=resolve
    })

    pool.getConnection(function(err,connection){
      if(err){
        outerReject(new ApplicationError("database error",err))
      } else {
        var sqlQuery = sql.format(queryString, values);
        console.log("SENDING preparedStatement")
        connection.query(sqlQuery,(error, results, fields) =>{
          if(error){
            console.log(error)
            outerReject(new ApplicationError("database error",error))
          } else {
            console.log(JSON.stringify(results))
            outerResolve(results)
          }
          connection.release();
        })
      }
    })
    return promise
  }

  return createPoolRequiringFunction(func)()
}

module.exports.storeDataSets = function(dataSets){
  const func = () => {
    const querySets = rdsDecision.createQuerySetsFromDataSets(dataSets)
    var outerResolve;
    var outerReject;
    const promise = new Promise((resolve,reject) => {
      outerResolve = resolve
      outerReject  = reject
    })

    pool.getConnection(function(err,connection){
      if(err){
        outerReject(new ApplicationError("database connection error",err))
        return
      }

    const transaction = function(tError){
      storeDataSetsTransaction(tError,outerResolve,outerReject,connection,querySets)
    }
    connection.beginTransaction(transaction)
    })
    console.log("StoreDataSets Called and promise returned")

    return promise
  }

  return createPoolRequiringFunction(func)()
}

function storeDataSetsTransaction(tError,resolve,reject,connection,querySets){
  console.log("storeDataSetsTransaction")
  if (tError) {
    console.log(tError)
    connection.release();
    reject(new ApplicationError("database transaction error",tError))
  } else {
    saveQuerySets(connection,0,querySets,resolve,reject)
  }
}

function saveQuerySets(connection,position,querySets,resolve,reject){
    var qs = querySets[position]
    console.log("Saving Query Set...")
    console.log("Query: "+qs.query)
    console.log("Values: "+qs.values)
    const sqlQuery = sql.format(qs.query, qs.values);
    connection.query(sqlQuery,(error, results, fields) =>{
      if(error){
        console.log("Error rolling back")
        return connection.rollback(function(){
          console.log("Rollback callback called")
          connection.release();
          reject(new ApplicationError("database error",error))
        })
      } else {
        console.log("Save Result: "+JSON.stringify(results))
        if(position < querySets.length - 1){
          console.log("Saving A query set")
          saveQuerySets(connection,position + 1,querySets,resolve,reject)
        } else {
          console.log("commiting..")
          commit(connection,resolve,reject)
        }
      }
    })
}

function commit(connection,resolve,reject){
    connection.commit(function(err) {
      if (err) {
        console.log(err)
        return connection.rollback(function() {
          connection.release();
          reject(new ApplicationError("database rollback error",err))
        })
      } else {
        console.log("Commit succesful")
        connection.release()
        resolve()
      }
    })
}

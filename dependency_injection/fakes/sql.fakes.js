const sql = require("mysql")

const connection = {
  release: () =>{ },
  query: (inputQuery, c) => {
    if(c) {
      c(false, [], {})
    } else {
      //connection has two kinds of query. query(a,b) and query(a)
    }
  },
  beginTransaction: c => { c(false) },
  commit: c => { c(false) },
  rollback: c => { c() }
}

const pool = {
  query: (input,c)=>{},
  getConnection: c => { c(false,connection) },
  on: (input,c) => { c(connection) }
}

module.exports.createPool  = function(){
  console.log("Returning pool")
    return pool
}

module.exports.format = function(queryString, values) {
  return sql.format(queryString, values);
}

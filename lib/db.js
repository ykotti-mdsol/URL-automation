var mysql = require('mysql2');

function connectToDatabase(){
  const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "ROOT",
    database:'url_automation'
  });
  
  con.connect(function(err) {
    if (err) {
      console.log(err);
      return;
    }else{
    console.log("Connected!");
    }
  });
  return con;
}


const insertData = (currentUser, orderId, app, version, productVersion, dbServerName, URLToShowInLogs, currentDateTime, creationStatus) => {
  const con = connectToDatabase();
  var sql = "INSERT INTO databag_creation_logs ( `username`, `resource_id`, `app`,  `version`, `product_version`, `db_server` ,  `url`, `creation_date_time`, `creation_status`) VALUES ( '"+currentUser+"', '"+orderId+"', '"+app+"', '"+version+"', '"+productVersion+"', '"+dbServerName+"', '"+URLToShowInLogs+"', '"+currentDateTime+"', '"+creationStatus+"')";
  con.query(sql, function (err, data) {  
    if (err) throw err;  
    console.log(" record inserted");  
    });  
    con.end((err)=>{
      if(err){
        console.log(err);
        return ;
      }
      console.log("connection closed");
    });
}

const findByUser=async (username,callback)=>{
  const con = connectToDatabase();
  var temp;
var sql="Select * from databag_creation_logs where username= '"+username+"' ";
con.query({ sql:sql, rowsAsArray: true }, function(err, results, fields) {
 // console.log(results); // in this query, results will be an array of arrays rather than an array of objects
 
 // console.log(fields); // fields are unchanged
 callback(null,results);

});
con.end((err)=>{
  if(err){
    console.log(err);
    return ;
  }
  console.log("connection closed");
});

  
}


module.exports ={ insertData,findByUser};
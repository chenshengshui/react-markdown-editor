var mysql = require('mysql');
var db = {};
var pool = mysql.createPool({
	connectionLimit:10,
	host:'119.23.238.79',
	user: 'root',
	password:'12350006',
	database: 'db_blog'
});
//查询数据
db.query = function(sql, callback){  
  
    if (!sql) {  
        callback();  
        return;  
    }  
    pool.query(sql, function(err, rows, fields) {  
      if (err) {  
        console.log(err);  
        callback(err, null);  
        return;  
      };  
      callback(null, rows, fields);  
    });  
} 
//增加数据
db.add = function(sql,initarr,callback){
	if(!sql){
		callback();
		return;
	};
	pool.query(sql,initarr,function(err,result){
		if(err){
			callback(err,null);
			return;
		};
		callback(null,result);
	})
}
//更新数据
db.update = function(sql,initarr,callback){
	if(!sql){
		callback();
		return;
	};
	pool.query(sql,initarr,function(err,result){
		if(err){
			callback(err,null);
			return;
		};
		callback(null,result);
	})
}
//删除数据
db.delete = function(sql, callback){  
  
    if (!sql) {  
        callback();  
        return;  
    }  
    pool.query(sql, function(err, rows, fields) {  
      if (err) {  
        console.log(err);  
        callback(err, null);  
        return;  
      };  
      callback(null, rows, fields);  
    });  
} 
module.exports = db;
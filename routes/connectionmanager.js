var mysql=require('mysql');

exports.getConnection=function(){
   //var con = mysql.createConnection({
  /*{
   host     : 'localhost',
   user     : "root",
   password : 'password',
   database : 'sampledb'
  };*/
 //});
//return JSON.stringify({host:"localhost",user:'root',password:'password',database:'sampledb'});
//return {host:'localhost',user:'root',password:'password',database:'sampledb'}.toString();
return 'mysql://root:password@localhost/sampledb';
};

var express = require('express');
var connection=require('./connectionmanager');
var router = express.Router();
var mysql = require('mysql');
var mailer = require("nodemailer");

var con=mysql.createConnection(connection.getConnection());

router.get('/userList',function(req,res,next){	
	console.log('inside userList1'+con.toString());
	//connection.getConnection();
	//con.connect();
	console.log('connected');
	//var con =connection.getConnection();
  
	con.query('SELECT * from tbl_users', function(err, rows) {
     if (!err)
      console.log('List: ', rows);
     else
     console.log('Error while performing Query.'+err.stack);
   res.json(rows);
   
  });
});

router.post('/login',function(req,res){   
  var user=con.query('SELECT * FROM tbl_users WHERE email=? AND password=?',[req.body.email,req.body.password], function(err,result) {
     if (result==null || result==''){
      console.log('Login Failed For :'+req.body.email);
      res.json({'login':'false'});
     }      
     else{
      //var data =JSON.stringify(result);
      //console.log('ID:'+data[7]);
      //res.json({'login':'true','user_id':data[7]});
      //console.log('User_ID :'+JSON.stringify(result));
      //console.log('ID:'+result[0].id)      ;
      res.json({'login':'true','user_id':result[0].id});
      console.log('Login By :'+req.body.email);
     }     
  });  
});


router.post('/signup',function(req,res,err){  
// Check Email exist
var emailExist=con.query('SELECT * FROM tbl_users WHERE email =?',[req.body.email],function(err,result){
   
  // CHECK CORPORATE EMAIL ID  
  /*var email=req.body.email;
  if(email.match('mail-acc') ||email.match('appliedcloudcomputing')){
    console.log('match found');
    res.json({message:"Not a Corprate id"});
  }*/


  if(result ==null || result ==''){            
      console.log('Email ID Not Exist');
      var query = con.query('INSERT INTO tbl_users (email) values ("'+ req.body.email+'")', function(err, result) {
      console.log('Email ID Inserted :'+req.body.email);
      });

      //GENERATE OTP
      getOtp= function()
      {
      var text = " ";
      var charset ="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      for( var i=0; i < 6; i++ )
          text+=charset.charAt(Math.floor(Math.random()*charset.length));
      return text.trim();
      }
      var otp=getOtp();

      var query = con.query('UPDATE tbl_users SET OTP=? WHERE email=? ',[otp.trim(),req.body.email], function(err, result) {
      if (err){
        console.log('OTP Update Error :'+err);
      }
      console.log('Updated :'+result) ;
      });


      // Use Smtp Protocol to send Email
      var smtpTransport = mailer.createTransport("SMTP",{
      service: "Gmail",
      auth: {
          user: "acctech.test@gmail.com",
          pass: "acctech123"
      }
      });

      var mail = {
        from: "acctech.test@gmail.com",
        to: req.body.email,
        subject: "Your OTP Password",
        text: "",
        html: "<b>Your OPT Password IS :</b>"+otp
      }
      console.log('OTP :'+otp);

      smtpTransport.sendMail(mail, function(error, res){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent successfully: " + res.message);
        }    
        smtpTransport.close();
      });
      //res.json({message:'Signup successfully'});
      res.json({'signup':'true'});
  }
  else {
      //res.json({value:'Email ID Already Exist'});
      //res.json({message:'Email Already Exist'});
      res.json({'signup':'false'});
  }
  });  
});

router.post('/verifyOtp',function(req,res,next){  
  con.query('SELECT * FROM tbl_users WHERE email =? AND otp=?',[req.body.email,req.body.otp],function(err,result){
    console.log('otp verifyOtp:'+result);
    if(result ==null || result ==''){      
      res.json({value:'false'});
    }
    else{
      res.json({value:'true'});
    }

  });  
});

router.post('/changepassword',function(req,res){   
  con.query('UPDATE tbl_users SET password=? WHERE email=? AND otp=?',[req.body.password,req.body.email,req.body.otp], function(err,result) {
     if (result==null){
      res.json({message:'Error While changepassword'});
     }      
     else{
      res.json({message:'Password Updated successfully'});
     }     
  });
});


router.post('/addPost',function(req,res){   
  if(req.body.post_id!=null || req.body.post!=null || req.body.user_id!=null){
  var query = con.query('INSERT INTO tbl_posts (post,user_id) values ("' + req.body.post+ '", "' + req.body.user_id+'")', function(err, result) {
      res.json({message:'Post added successfully'});
     });

}else{
  res.json({message:'wrong posts'});
}
});

router.post('/getPostList',function(req,res,err){
  
  console.log('Start Index :'+req.body.maxIndex);
  console.log('Max Index :'+req.body.maxIndex);

   //con.query('SELECT * FROM tbl_posts LIMIT '+req.body.startIndex+','+req.body.maxIndex+'',function(err,postList){
   con.query('SELECT * FROM tbl_posts WHERE post_id BETWEEN '+req.body.startIndex+'  AND  '+req.body.maxIndex+'',function(err,postList){
   if(err){
    console.log('Error Fetching List'+err);
    res.json({message:"error"});
   }
   else{
    console.log('Post :'+JSON.stringify(postList));
    res.json(postList);
   }
  });
});

router.post('/addComment',function(req,res){
if(req.body.post_id!=null || req.body.comment!=null || req.body.user_id!=null|| req.body.comment_id!=null){
      con.query('INSERT INTO tbl_comments (post_id,user_id,comment) values ("' +req.body.post_id+ '", "' + req.body.user_id+ '", "' + req.body.comment+'")', function(err, result) {
      console.log('Comment Added :'+req.body.comment);
      if(!err){
       res.json({message:'comment added successfully'});
      }
      else{
        console.log('Add Pst Error :'+err);
        res.json({message:'Some Error Occured.'});
      }

     });

}else{
  res.json({message:"Error while adding comment"});
}
});

router.post('/getCommentList',function(req,res){
  con.query('SELECT * FROM tbl_comments WHERE post_id ='+req.body.post_id+' AND comment_id BETWEEN '+req.body.startIndex+'  AND  '+req.body.maxIndex+'',function(err,commentList){
    if(err){
      console.log('Error:'+err);
      res.json({message:'Error'+err});
    }
    else{
      console.log('Comment List:'+JSON.stringify(commentList));
      res.json(commentList);
    }
  });
});


//Unhandled Exception
process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
});


module.exports = router;
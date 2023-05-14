const express=require('express'); 
const app=express();
const cors=require('cors');
const PORT=process.env.PORT || 9000;
 const connection=require('./config')
const multer=require('multer');
 
app.use(express.json())
app.use(cors())



var fileFilter=((req,file,dilip)=>{
  if(file.mimetype=='image/jpeg' || file.mimetype=='image/jpg' || file.mimetype=='image/png'){
dilip(null,true)
  }else{
      dilip(null.false)
  }
})
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './upload')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' +uniqueSuffix+ file.originalname)
  }
})

const upload = multer({ storage: storage ,
limits:{
  fieldSize:1024*1024*5
},
fileFilter:fileFilter
}

)

//================================products tbl

app.get('/products/image/:url',(req,res)=>{

  // let fullUrl = req.protocol + "://"+req.get('host') +"/upload/"+ req.params.url;
  // console.log(fullUrl);

  let pathUrl = __dirname+"/upload/"+ req.params.url;
  console.log(pathUrl);
   res.sendFile(pathUrl);

})

app.get('/products',(req,res)=>{
  try{ 
   var sql = 'SELECT * FROM products';
  connection.query( sql ,(err,result)=>{
       if(err ){
           
           console.log(" data not matched....")
       }else{
          
            res.status(200).json({
              code : 200,
              message : "Image data",
              data : result,
              status : true,
              error : false,
            });
           console.log(result)   
       }
     })
     
    }catch(error){
   console.log(error)
    }
})

app.post('/products',upload.single('product_image'),(req,resp)=>{
  try{ 
    let sql = 'INSERT INTO products SET ?'
   let data={
    product_name:req.body.product_name,
    product_image:req.file.filename,
    product_price:req.body.product_price,
    category_id:req.body.category_id,
    created_at:req.body.created_at,
    updated_at:req.body.updated_at
    
    }
    console.log("req.boy ka "+data)
     connection.query(sql, data, (err, res) => {
      if(err) throw err;
      console.log(data);
      resp.send(res)
  });
  }catch(errr){
    console.log(errr)
  }
})

app.put("/products:product_id",upload.single('image'),(req,resp)=>{
  const data= [req.body.product_name,req.file.filename,req.body.product_price,req.body.category_id,req.body.created_at,req.body.updated_at,req.params.product_id];
  con.query("UPDATE products SET product_name = ?, product_image = ?, product_price = ?,category_id = ?,created_at = ?,updated_at = ? WHERE product_id = ?",
  data,(error,results,fields)=>{
    if(error) throw error;
    resp.send(results)
  })
 
})
app.delete("/products:product_id", (req,resp)=>{
  const data= [req.params.product_id];

  con.query("DELETE FROM products WHERE product_id = ?",
  data,(error,results,fields)=>{
    if(error) throw error;
    resp.send(results)
  })
 
})
//================================category tbl

app.get('/category',(req,res)=>{
  try{ 

    
   var sql = 'SELECT * FROM category  ';
  connection.query( sql ,(err,result)=>{
       if(err ){
           
           console.log(" data not matched....")
       }else{
            res.send(result)
           console.log(result)   
       }
     })
     
    }catch(error){
   console.log(error)
    }
})

app.post('/category',(req,resp)=>{
  try{ 
    let sql = 'INSERT INTO  category SET ?'
   let data={

   
    category_name:req.body.category_name,
    created_at:req.body.created_at,
    updated_at:req.body.updated_at
     

    }
     connection.query(sql, data, (err, res) => {
      if(err) throw err;
      console.log('success');
      resp.send(res)
  });
  }catch(errr){
    console.log(errr)
  }
})
app.put("/category:category_id" ,(req,resp)=>{
  const data= [ req.body.category_name, req.body.created_at, req.body.updated_at,req.params.category_id];
  con.query("UPDATE category SET category_name= ?, created_at = ?,updated_at = ? WHERE category_id = ?",
  data,(error,results,fields)=>{
    if(error) throw error;
    resp.send(results)
  })
 
})
app.delete("/category:category_id", (req,resp)=>{
  const data= req.params.category_id;
console.log(data)
  con.query("DELETE FROM category WHERE category_id = ?",
  data,(error,results,fields)=>{
    if(error) throw error;
    resp.send(results)
  })
 
})
//================================multer


app.post('/login',(req,res)=>{
   try{ 

    let  id=req.body.user_id;
    let password=req.body.password;
    var sql = 'SELECT * FROM admin WHERE email = ? and password = ?';
   connection.query( sql, [ id, password],(err,result)=>{
        if(err ){
            
          res.status(404).json(
                {
                    "code": 404,
                    "message": "Invalid User details, Try Again.  ",
                    "data": [],
                    "error": false,
                    "status": false
                }
            )
        }else{
              res.status(200).json(
                {
                    "code": 200,
                    "message": "user Login successfully",
                    "data": result,
                    "error": false,
                    "status": true
                }
            )
        }
      })
      
     }catch(error){
    console.log(error)
     }
})
app.get('/user',(req,res)=>{
  try{ 

    
   var sql = 'SELECT * FROM admin  ';
  connection.query( sql ,(err,result)=>{
       if(err ){
           
           console.log(" data not matched....")
       }else{
            res.send(result)
           console.log(result)   
       }
     })
     
    }catch(error){
   console.log(error)
    }
})

app.post('/user',(req,resp)=>{
  try{ 
    let sql = 'INSERT INTO  admin SET ?'
   let data={

   
    email:req.body.email,
    password:req.body.password,
    name:req.body.name,
    user_role:req.body.user_role

    }
     connection.query(sql, data, (err, res) => {
      if(err) throw err;
      console.log('success');
      resp.send(res)
  });
  }catch(errr){
    console.log(errr)
  }
})

app.listen(PORT,(req,res)=>{
    console.log('server started '+PORT)
})
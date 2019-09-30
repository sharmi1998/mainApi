const Express=require('express')
var bodyParser=require('body-parser')
var app=new Express()
var request=require('request')
const session=require('express-session');
app.use(session({secret: 'ssshhhhh'}));
const Mongoose=require('mongoose');
// const viewall="http://localhost:3001/viewall"
// const getdata="http://localhost:3001/getdata"
// const viewuser="http://localhost:3001/viewuser"
app.set('view engine','ejs')
app.use(Express.static(__dirname+"/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200' );

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

//creating collection for the engineers
const   WorkerModel=Mongoose.model("workdetails",{
    name:String,
    address:String,
    des:String,
    phone:String,
    rate:String,
    image:String ,
    pincode:String  
});
const PlumperModel=Mongoose.model("pludetails",{
    name1:String,
    add1:String,
    des1:String,
    phone1:String,
    rate1:String,
    image1:String,
    pincode1:String,
})
var LoginModel=Mongoose.model("login",{
    username:String,
    password:String,
    utype:String
});
var RegistrationModel=Mongoose.model("registration",{
    name:String,
    mailid:String,
    password:String
});
// Mongoose.connect("mongodb://localhost:27017/workersdb")
Mongoose.connect("mongodb+srv://sharmi1998:sharmi1998@cluster0-rwxfj.mongodb.net/test?retryWrites=true&w=majority")

app.get('/',(req,res)=>{
    res.render('home')
    
})
app.get('/add1',(req,res)=>{
    res.render('add1')
})
app.get('/signup',(req,res)=>{
    res.render('signup')
})

//saving engineer deatils
app.post('/read',(req,res)=>{

    //console.log('test')
    console.log(req.body)
    var worker=new WorkerModel(req.body);
    var result=worker.save((error,data)=>{
        if(error){
            throw error;
        }
        else{
            res.send(data)
            //res.send("<script>alert('added')</script><script> window.location.href='/' </script> ");
        }
    })

})
//saving plumper details
app.post('/read1',(req,res)=>{
    console.log(req.body)
    var plumper=new PlumperModel(req.body);
    var result=plumper.save((error,data)=>{
        if(error){
            throw error;
        }
        else{
            res.send(data)
        }
    })

})

app.get('/registration',(req,res)=>{
    res.render('registration',{title:"Registration",val:"",emsg:""});
});
app.get('/login',(req,res)=>{
    res.render('login',{title:"Login page"});
});

app.post('/register',(req,res)=>{
    // console.log(req.body);
     var regdata=new RegistrationModel(req.body);
     var logdata=new LoginModel();
     logdata.username=req.body.mailid;
     logdata.password=req.body.password;
     logdata.utype="user";
 
     logdata.save((error)=>{
 
         if(error)
         {
             throw error;
         }
     });
 
 
     regdata.save((error)=>
     {
         if(error)
         {
            
             throw error;
         }
         else
         {
          
            console.log(regdata);
             res.send(regdata);
         }
     });
 
 });
 

//validate
app.post('/readLogApi',(req,res)=>{

    LoginModel.find({$and:[{username:req.body.username},{password:req.body.password}]},(error,data)=>{
        if(error)
        {
            throw error;
        }
        else
        {
            console.log(data);
            res.send(data);
        }
    })

})


app.get('/user',(req,res)=>{
    res.render('user')
})
//registration for user
// app.post('/read2',(req,res)=>{
//     console.log(req.body)
//     var user=new SignupModel(req.body);
//     var result=user.save((error,data)=>{
//         if(error){
//             throw error;
//         }
//         else{
//             res.send(data)
//         }
//     })
// })


//deleting a worker
app.post('/delete',(req,res)=>
{
    WorkerModel.remove({_id:req.body[0]._id},(error,response)=>{
        if(error)
        {
            throw error;
        }
        else{
            res.send(response);
        }
    });
});
//delete plumper details
app.post('/delete1',(req,res)=>
{
    PlumperModel.remove({_id:req.body[0]._id},(error,response)=>{
        if(error)
        {
            throw error;
        }
        else{
            res.send(response);
        }
    });
});
//updating a worker details

app.post('/update',(req,res)=>{

    console.log(req.body)
    WorkerModel.findOneAndUpdate({_id:req.body._id},
    req.body,(error,response)=>{
        if(error){
            throw error;
        }
        else{
            res.send(response)
        }
    })
})
//update plumper details
app.post('/update1',(req,res)=>{

    console.log(req.body)
    PlumperModel.findOneAndUpdate({_id:req.body._id},
    req.body,(error,response)=>{
        if(error){
            throw error;
        }
        else{
            res.send(response)
        }
    })
})
//viewing all worker deails Api
app.get('/viewall',(req,res)=>{

    result=WorkerModel.find((error,data)=>{
        if(error){
            throw error;
        }
        else{
            res.send(data);
        }
    })
    
 })
 //to view all plumperApi
 app.get('/getdata',(req,res)=>{

    result=PlumperModel.find((error,data)=>{
        if(error){
            throw error;
        }
        else{
            res.send(data);
        }
    })
    
 })
 //to get userdeatils
 app.get('/viewuser',(req,res)=>{

    result=SignupModel.find((error,data)=>{
        if(error){
            throw error;
        }
        else{
            res.send(data);
        }
    })
    
 })
//to view a single workser Api

//  app.get('/readmore/:id',(req,res)=>{

//     const x=req.params.id;
//    const read="http://localhost:3001/getAempApi/"+x;
//     request(read,(error,response,body)=>
// {
//    var data=JSON.parse(body);
//    console.log(data);
//    res.render('readmore',{data:data[0]});

// })
    
// });
 //to view the all workers details
 app.get('/view',(req,res)=>{
    request(viewall,(error,response,body)=>{
        var data=JSON.parse(body);
        console.log(data)
        res.render('view',{'data':data})
    })
})

//to view the plumpers
app.get('/view1',(req,res)=>{
    request(getdata,(error,response,body)=>{
        var data=JSON.parse(body);
        console.log(data)
        res.render('view1',{'data':data})
    })
})
//view user
app.get('/view2',(req,res)=>{
    request(viewuser,(error,response,body)=>{
        var data=JSON.parse(body);
        console.log(data)
        res.render('view2',{'data':data})
    })
})
//search for a worker
app.get('/search/:pincode',(req,res)=>{
    var ph=req.params.pincode;
    //var phonenum=new EmployeeModel(req.body);
    WorkerModel.find({pincode:ph},(error,data)=>{
        if(error){
            throw error;
        }
        else{
            res.send(data)
        }
    })
})
//plumper search
app.get('/search1/:pincode1',(req,res)=>{
    var ph=req.params.pincode1;
    //var phonenum=new EmployeeModel(req.body);
    PlumperModel.find({pincode1:ph},(error,data)=>{
        if(error){
            throw error;
        }
        else{
            res.send(data)
        }
    })
})

//to get a single worker Api
app.get('/getAempApi/:id',(req,res)=>{
    var id=req.params.id;
    WorkerModel.find({_id:id},(error,data)=>{
        if(error)
        {
            throw error;
        }
        else{
            res.send(data);
        }
    });
});

//to listen the localhost
app.listen(process.env.PORT || 3001,()=>{
    console.log("Server is running on localhost 3001")
})
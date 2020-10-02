const express=require("express");
const app=express();
let server=require("./server");
let middleware=require("./middleware");
const bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
const MongoClient=require('mongodb').MongoClient;
const url='mongodb://127.0.0.1:27017';
const dbName='HOSPITALDETAILS';
let db
MongoClient.connect(url,{useUnifiedTopology:true},(err,client)=>{
    if(err) return console.log(err);
    db=client.db(dbName);
    console.log("Database Connected");
});
app.get('/HOSPITAL',middleware.checkToken,(req,res)=>{
    var d=db.collection('HOSPITAL').find().toArray().then(result=>res.json(result));
});
app.get('/VENTILATOR',middleware.checkToken,(req,res)=>{
    var data=db.collection('VENTILATOR').find().toArray().then(result=>res.json(result));
});
app.post('/searchventilatorbystatus',middleware.checkToken,(req,res)=>{
    var status=req.query.status;
    var data=db.collection('VENTILATOR').find({status:status}).toArray().then(result=>res.json(result));
});
app.post('/searchventilatorbyname',middleware.checkToken,(req,res)=>{
    var name=req.query.name;
    var data=db.collection('VENTILATOR').find({name:name}).toArray().then(result=>res.json(result));
});
app.post('/searchhospitalbyname',middleware.checkToken,(req,res)=>{
    var name=req.query.name;
    var data=db.collection('HOSPITAL').find({name:name}).toArray().then(result=>res.json(result));
});
app.put('/updateventilatordetails',middleware.checkToken,(req,res)=>{
    var status=req.query.status;
    var ventilatorId=req.query.ventilatorId;
    var data=db.collection('VENTILATOR').updateOne({ventilatorId:ventilatorId},{$set:{status:status}},function(err,result){
        res.json('1 document updated');
    });
    

});
app.post('/addventilator',middleware.checkToken,(req,res)=>{
    var hId=req.query.hId;
    var ventilatorId=req.query.ventilatorId;
    var status=req.query.status;
    var name=req.query.name;
    var data=db.collection('VENTILATOR').insertOne({hId:hId,ventilatorId:ventilatorId,status:status,name:name},function(err,result){
        res.json('Item inserted');
    });
});
app.delete('/deleteventilator',middleware.checkToken,(req,res)=>{
    var ventilatorId=req.query.ventilatorId;
    var data=db.collection('VENTILATOR').deleteOne({ventilatorId:ventilatorId},function(err,result){
        res.json('Item deleted');
    });
});
app.listen(3030);
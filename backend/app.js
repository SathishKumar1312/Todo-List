const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();

app.use(express.json());
app.use(cors());

//connecting db
mongoose.connect(process.env.MONGODB_URI)
.then(()=>console.log("Mongoose DB Connected Successfully!"))
.catch((err)=>console.log(err))

//schema creation
const todoSchema = new mongoose.Schema({
    title: String,
    description: String
},{
    minimize:true,
    versionKey:false
})

//collection- model creation
const todoModel = mongoose.model('todo',todoSchema);

app.post('/todos', async(req,res)=>{
    let {title, description} = req.body;
    try{
        const todo = new todoModel({title,description});
        await todo.save();
        res.status(201).json(todo)
    }catch(err){
        console.log(err)
    }
})

app.get('/todos',async(req,res)=>{
    try{
        let docs = await todoModel.find()
        res.json(docs);
    } catch(e) {
        console.log(e);
    }
})

app.put('/todos/:id',async(req,res)=>{
    let id = req.params.id;
    let {title,description} = req.body;
    try{
        await todoModel.findByIdAndUpdate(id,{title,description})
        res.json({"message":"update successful"})
    } catch(e){
        console.log(e);
        res.send('cannot update')
    }
})

app.delete('/todos/:id',async(req,res)=>{
    let id = req.params.id;
    try{
        await todoModel.deleteOne({_id:id})
        res.json({"message":"Delete successful"})
    } catch(e){
        console.log(e);
        res.send('cannot delete')
    }
})

app.listen(5000,()=>{
    console.log('Server is running on port 5000')
})
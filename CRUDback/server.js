const express =require('express');
const cors =require('cors');
const bodyParser = require('body-parser');
const mongoose=require('mongoose')

const routes = require('./routes');

const app=express()

app.use(cors())

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/todoApp',{
  useNewUrlParser:true,
  useUnifiedTopology:true
}).then(()=>{
  console.log("Database Connected");
}).catch((err)=>{err})

app.use('/api', routes);


const port=8000;
app.listen(port,()=>{
  console.log("Server is running on port "+port);
  
})

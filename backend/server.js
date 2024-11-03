const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoute = require('./userRoute');
const todoRoute = require('./todoRoute');
const auth = require('./auth');


const PORT = process.env.PORT || 3000;

async function connect(){
    try{
        await mongoose.connect('')
        console.log('Connected to mongoDB')
    } catch(e){
        console.log('Connection To MongoDB Failed');
    }
}
connect();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/user',userRoute);
app.use('/todo',auth,todoRoute);


app.listen(PORT,()=>{
    console.log(`Listening on Port ${PORT}`);
})

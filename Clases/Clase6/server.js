import express from "express";
import { manager } from './UserManager.js';

const app = express();

app.get('/',(req,res)=>{
    res.send('Probando')
})

app.get('/api',(req,res)=>{
    console.log(req);
    //res.send('Probando API')
    res.json({message:'Probando'})
})

app.get('/api/users',async (req,res)=>{
    const queryObj = req.query;
    const users = await manager.getUsers(queryObj);
    res.status(200).json({message:'Users found', users})
})

app.get('/api/users/:id',async (req,res)=>{
    const {id} = req.params;
    const user = await manager.getUserById(id);
    res.status(200).json({message:'User found', user})
})

app.listen(8080,()=>{
    console.log('escuchando 8080');
})

/*
app.post('/api/character',(req,res)=>{
    res.send('Probando API')
})

app.get('/user',(req,res)=>{
    res.send('Probando USER')
})*/
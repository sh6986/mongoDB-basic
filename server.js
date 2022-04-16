const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const users = [];

const MONGO_URI = `mongodb+srv://osh:${process.env.MONGODB}@mongodbtutorial.44uam.mongodb.net/BlogService?retryWrites=true&w=majority`;

const server = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected');

        app.use(express.json());
    
        app.get(`/user`, function(req, res) {
            return res.send({users: users});
        });
        
        app.post(`/user`, function(req, res) {
            users.push({name: req.body.name, age: req.body.age});
            return res.send({success: true});
        });
        
        app.listen(3000, function() {
            console.log('server listening on port 3000');
        });

    } catch (err) {
        console.log(err);
    }
};

server();

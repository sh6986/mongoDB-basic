const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { User } = require('./models/User');

const dotenv = require('dotenv');
dotenv.config();

const MONGO_URI = `mongodb+srv://osh:${process.env.MONGODB}@mongodbtutorial.44uam.mongodb.net/BlogService?retryWrites=true&w=majority`;

const server = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected');

        app.use(express.json());
    
        app.get(`/user`, (req, res) => {
            // return res.send({users: users});
        });
        
        app.post(`/user`, async (req, res) => {
            try {
                let { username, name } = req.body;
                
                if (!username) {
                    return res.status(400).send({err: 'username is required'});
                }

                if (!name || !name.first || !name.last) {
                    return res.status(400).send({err: 'Both first and last names are required'});
                }

                const user = new User(req.body);    // 유저문서를 생성한것. 몽구스로 인스턴스를 생성했다.
                await user.save();                  // 실제로 저장
                return res.send({user});
            } catch (err) {
                console.log(err);
                return res.status(500).send({err: err.message});
            }
        });
        
        app.listen(3000, () => {
            console.log('server listening on port 3000');
        });

    } catch (err) {
        console.log(err);
    }
};

server();

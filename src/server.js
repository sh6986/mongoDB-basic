const express = require('express');
const app = express();
const { userRouter } = require('./routes/userRoute');
const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config();

const MONGO_URI = `mongodb+srv://osh:${process.env.MONGODB}@mongodbtutorial.44uam.mongodb.net/BlogService?retryWrites=true&w=majority`;

const server = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        mongoose.set('debug', true);        // 쿼리 로그로 찍혀서 볼 수 있다.
        console.log('MongoDB connected');

        app.use(express.json());
    
        app.use(`/user`, userRouter);

        app.listen(3000, () => {
            console.log('server listening on port 3000');
        });

    } catch (err) {
        console.log(err);
    }
};

server();

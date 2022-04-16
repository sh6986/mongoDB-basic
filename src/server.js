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
    
        /**
         * 사용자 전체 조회
         */
        app.get(`/user`, async (req, res) => {
            try {
                const users = await User.find({});  // 조건없이 다 조회
                return res.send({ users });
            } catch (err) {
                return res.status(500).send({err: err.message});
            }
        });

        /**
         * 사용자 단건 조회
         */
        app.get(`/user/:userId`, async (req, res) => {
            try {
                const { userId } = req.params;

                if (!mongoose.isValidObjectId(userId)) {     // objectId 형식에 맞는지 확인
                    return res.status(400).send({err: 'invalid userId'});
                }

                // findOne 첫번째인자는 필터조건
                const user = await User.findOne({
                    _id: userId
                });
                return res.send({ user });
            } catch (err) {
                console.log(err);
                return res.status(500).send({err: err.message});
            }
        });
        
        /**
         * 사용자 등록
         */
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

        /**
         * 사용자 수정
         */
        app.put(`/user/:userId`, async (req, res) => {
            try {
                const { userId } = req.params;

                if (!mongoose.isValidObjectId(userId)) {
                    return res.status(400).send('invalid userId');
                }

                const { age } = req.body;

                if (!age) {
                    return res.status(400).send({err: "age is required"});
                }

                if (typeof age !== 'number') {
                    return res.status(400).send({err: "age must be a number"});
                }

                const user = await User.findByIdAndUpdate(userId, {
                    $set: {
                        age
                        // age: age
                    }
                }, {
                    new: true   // true 해주지 않으면 업데이트 되기 전 문서를 리턴한다.
                });

                return res.send({ user });

            } catch (err) {
                console.log(err);
                return res.status(500).send({err: err.message});
            }
        });

        /**
         * 사용자 삭제
         */
        app.delete(`/user/:userId`, async (req, res) => {
            try {
                const { userId } = req.params;
                
                if (!mongoose.isValidObjectId(userId)) {
                    return res.status(400).send('invalid userId');
                }

                const user = await User.findOneAndDelete({
                    _id: userId
                });

                return res.send({ user });

            } catch (err) {
                console.log(err);
                return res.status(500).send({err: err.message});
            }
        });

    } catch (err) {
        console.log(err);
    }
};

server();

const { Router } = require('express');
const userRouter = Router();
const { User } = require('../models/User');
const mongoose = require('mongoose');

/**
 * 사용자 전체 조회
 */
userRouter.get(`/`, async (req, res) => {
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
userRouter.get(`/:userId`, async (req, res) => {
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
userRouter.post(`/`, async (req, res) => {
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

/**
 * 사용자 수정
 */
userRouter.put(`/:userId`, async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).send('invalid userId');
        }

        const { age, name } = req.body;

        if (!age && !name) {
            return res.status(400).send({err: "age or name is required"});
        }

        if (age && typeof age !== 'number') {
            return res.status(400).send({err: "age must be a number"});
        }

        if (name && typeof name.first !== 'string' && typeof name.last !== 'string') {
            return res.status(400).send({err: "first and last name are strings"});
        }

        // let updateBody = {};

        // if (age) {
        //     updateBody.age = age;
        // }

        // if (name) {
        //     updateBody.name = name;
        // }

        // const user = await User.findByIdAndUpdate(userId, updateBody, {
        //     new: true   // true 해주지 않으면 업데이트 되기 전 문서를 리턴한다.
        // });

        let user = await User.findById(userId);

        if (age) {
            user.age = age;
        }

        if (name) {
            user.name = name;
        }

        await user.save();

        return res.send({ user });

    } catch (err) {
        console.log(err);
        return res.status(500).send({err: err.message});
    }
});

/**
 * 사용자 삭제
 */
userRouter.delete(`/:userId`, async (req, res) => {
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

module.exports = {
    userRouter
};
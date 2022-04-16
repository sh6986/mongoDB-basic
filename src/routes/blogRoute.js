const { Router } = require('express');
const blogRouter = Router();
const { Blog } = require('../models/Blog');
const { User } = require('../models/User');
const { isValidObjectId } = require('mongoose');
const { commentRouter } = require('./commentRoute');

blogRouter.use(`/:blogId/comment`, commentRouter);

blogRouter.post(`/`, async (req, res) => {
    try {
        const { title, content, islive, userId} = req.body;

        if (typeof title !== 'string') {
            res.status(400).send({err: 'title is required'});
        }

        if (typeof content !== 'string') {
            res.status(400).send({err: 'content is required'});
        }

        if (islive && islive !== 'boolean') {
            res.status(400).send({err: 'islive must be a boolean'});
        }

        if (!isValidObjectId(userId)) {
            res.status(400).send({err: 'userId is invalid'});
        }

        let user = await User.findById(userId);

        if (!user) {
            res.status(400).send({err: 'user does not exist'});
        }

        let blog = new Blog({...req.body, user});   // userId를 보내는 게 맞지만 이렇게 user를 통째로 보내도 몽구스가 알아서 userId로 저장한다.
                                            // 리턴받는 객체에 user 객체 전체를 가져오므로 이러한 이점이 있다.
        await blog.save();

        return res.send({ blog });

    } catch (err) {
        console.log(err);
        return res.status(500).send({err: err.message});
    }
});

blogRouter.get(`/`, async (req, res) => {
    try {
        const blogs = await Blog.find({});
        return res.send({ blogs });
    } catch (err) {
        console.log(err);
        return res.status(500).send({err: err.message});
    }
});

blogRouter.get(`/:blogId`, async (req, res) => {
    try {
        const { blogId } = req.params;

        if (!isValidObjectId(blogId)) {
            res.status(400).send({err: 'blogId is invalid'});
        }

        const blog = await Blog.findOne({
            _id: blogId
        });

        return res.send({ blog });
    } catch (err) {
        console.log(err);
        return res.status(500).send({err: err.message});
    }
});

blogRouter.put(`/:blogId`, async (req, res) => {
    try {
        const { blogId } = req.params;

        if (!isValidObjectId(blogId)) {
            return res.status(400).send({err: 'blogId is invalid'});
        }

        const { title, content } = req.body;

        if (typeof title !== 'string') {
            res.status(400).send({err: 'title is required'});
        }

        if (typeof content !== 'string') {
            res.status(400).send({err: 'content is required'});
        }

        const blog = await Blog.findOneAndUpdate({
            _id: blogId
        }, {
            title, 
            content
        }, {
            new: true
        });

        return res.send({ blog });

    } catch (err) {
        console.log(err);
        return res.status(500).send({err: err.message});
    }
});

blogRouter.patch(`/:blogId/live`, async (req, res) => {
    try {
        const { blogId } = req.params;

        if (!isValidObjectId(blogId)) {
            return res.status(400).send({err: 'blogId is invalid'});
        }

        const { islive } = req.body;

        if (typeof islive !== 'boolean') {
            res.status(400).send({err: 'boolean islive is required'});
        }

        const blog = await Blog.findByIdAndUpdate(blogId, { islive }, {
            new: true
        });

        return res.send({ blog });
    } catch (err) {
        console.log(err);
        return res.status(500).send({err: err.message});
    }
});

module.exports = { blogRouter };
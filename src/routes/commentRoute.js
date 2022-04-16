const { Router } = require('express');
const commentRouter = Router({ mergeParams: true });    // mergeParams : 상위에서 받은 주소의 파라미터 받을 수 있음
const { Comment } = require('../models/Comment');
const { Blog } = require('../models/Blog');
const { User } = require('../models/User');
const { isValidObjectId } = require('mongoose');

/**
    /user
    /blog
    /blog/:blogId/comment
 */

commentRouter.post(`/`, async (req, res) => {
    try {
        const { blogId } = req.params;
        const { content, userId } = req.body;

        if (!isValidObjectId(blogId)) {
            return res.status(400).send({err: 'blogId is invalid'});
        }

        if (!isValidObjectId(userId)) {
            return res.status(400).send({err: 'userId is invalid'});
        }

        if (typeof content !== 'string') {
            return res.status(400).send({err: 'content is required'});
        }

        const blog = await Blog.findById(blogId);
        const user = await User.findById(userId);

        if (!blog || !user) {
            return res.status(400).send({err: 'blog or user does not exist'});
        }

        if (!blog.islive) {
            return res.status(400).send({err: 'blog is not available'});
        }

        const comment = new Comment({ content, user, blog });
        return res.send({ comment });
    } catch (err) {
        return res.status(400).send({err: err.message});
    }
});

commentRouter.get(`/`)

module.exports = { commentRouter };
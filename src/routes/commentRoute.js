const { Router } = require('express');
const commentRouter = Router({ mergeParams: true });    // mergeParams : 상위에서 받은 주소의 파라미터 받을 수 있음
const { Blog, User, Comment } = require('../models');
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

        // const blog = await Blog.findById(blogId);
        // const user = await User.findById(userId);

        // Promise all 사용해서 걸리는시간 줄이기
        const [blog, user] = await Promise.all([
            Blog.findById(blogId),
            User.findById(userId)
        ]);

        if (!blog || !user) {
            return res.status(400).send({err: 'blog or user does not exist'});
        }

        if (!blog.islive) {
            return res.status(400).send({err: 'blog is not available'});
        }

        const comment = new Comment({ content, user, blog });
        await comment.save();

        return res.send({ comment });
    } catch (err) {
        return res.status(400).send({err: err.message});
    }
});

commentRouter.get(`/`, async (req, res) => {
    const { blogId } = req.params;

    if (!isValidObjectId(blogId)) {
        return res.status(400).send({err: 'blogId is invalid'});
    }

    const comments = await Comment.find({
        blog: blogId
    });

    return res.send({ comments });
});

module.exports = { commentRouter };
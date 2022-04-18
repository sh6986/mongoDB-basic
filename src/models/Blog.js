const { Schema, model, Types} = require('mongoose');

const BlogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    islive: {   // true이면 유저들한테 노출되고, false이면 임시저장상태
        type: Boolean,
        required: true,
        default: false
    },
    user: {
        type: Types.ObjectId, 
        required: true,
        ref: 'user' // user선언할 때 넣어준 컬렉션 이름. 대문자면 대문자 소문자면 소문자 두 컬렉션이름이 같아야한다.
    }
}, {
    timestamps: true
});

BlogSchema.virtual('comments', {
    ref: 'comment',
    localField: '_id',
    foreignField: 'blog'
});

BlogSchema.set('toObject', {virtuals: true});
BlogSchema.set('toJSON', {virtuals: true});

const Blog = model('blog', BlogSchema);

module.exports = { Blog };
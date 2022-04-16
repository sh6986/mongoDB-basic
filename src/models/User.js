const { Schema, model } = require('mongoose');

// 첫번째 인자로 객체를 받고 (객체안의 key value 값 포함), 두번째는 옵션 정보
const UserSchema = new Schema({
    username: {
        type: String, 
        required: true
    },
    name: {
        first: { 
            type: String, 
            required: true
        },
        last: { 
            type: String, 
            required: true 
        }
    },
    age: Number,
    // age: {type: Number} 와 동일한데 필수가 아니면 이렇게 짧게 작성 가능
    email: String
}, {
    timestamps: true
    // 데이터 생성시 생성시간 createdAt을 만들고 수정시간 updateAt을 수정해준다.
});

const User = model('user', UserSchema);
// users 라는 이름으로 컬렉션이 생성된다.

module.exports = { User };
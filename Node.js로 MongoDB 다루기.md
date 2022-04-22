## Mongoose Connection

mongodb 모듈을 사용하지 않고 mongoose 모듈을 사용한다.

mongoose 는 내부적으로 mongodb를 사용하고 있고 추가적인 편의기능들이 있다.

```jsx
npm i mongoose
```

## GET /user

조회하기

### find()

```jsx
const users = await User.find({});
```

- 배열을 리턴한다.

### findOne({})

```jsx
const users = await User.findOne({});
```

- 하나만 리턴한다.

## GET /user/:userId

- 조건주려면 첫번째인자에 필터조건걸어준다.

```jsx
const user = await User.findOne({
	_id: userId
});
```

## DELETE /user/:userId

```jsx
const user = await User.deleteOne({
	_id: userId
});
```

```jsx
const user = await User.findOneAndDelete({ 
	_id: userId
});
```

- findOneAndDelete 를 사용하면 삭제성공시에 user를 리턴하고, 존재하지 않는 user이면 null을 리턴하므로 좀 더 유용하다.

## PUT /user/:userId

- 첫번째 파라미터에 _id, 두번째 파라미터에 수정할 내용

```jsx
const user = await User.findOneAndUpdate({
	_id: userId
}, {
	// 수정할 내용
});
```

```jsx
const user = await USer.findByIdAndUpdate(userId, {
	// $set 안쓰고 그냥 age 이렇게 넘겨도 된다. 몽구스가 해줌
	age
	// $set: {
	//	age: age
	// }
}, {
	new: true
});
```

- findByIdAndUpdate를 사용하면 조건으로 객체 넘길 필요 없이 id값을 바로 파라미터로 넘기면 된다.
- 3번째 파라미터에 new 값을 true 해주지 않으면 업데이트 되기 전 문서를 리턴한다.

## Mongoose 가 내부적으로 어떤 작업을 하는가

- update시 $set 안써도 알아서 해준다.
- String을 objectId로 넘겨도 알아서 objectId로 파싱해준다.
- 쿼리 확인하는 방법 (몽구스가 어떻게 변경해서 쿼리 날리는지)
    
    ```jsx
    mongoose.set('debug', true);
    ```
    

## findOneAndUpdate vs save

수정시 주의할점으로 여러개의 값 수정시 일부만 넘기면 나머지값들은 없어지게 수정된다.

- 이때 의문점은 모델 만들시에 require에 true값으로 넘긴 값도 수정할때 없어질 수 있다. 왜냐면 몽구스가 모델옵션조건을 확인하는 시점은 도큐먼트를 생성하고 저장할 때 확인한다.
- 수정할시에 다른설정없이 수정하면 수정과정이 온전히 다 몽고디비에서 되므로 몽구스를 타지 않고 몽구스에서 설정한 것들이 생략되므로 이런 문제가 생긴다.
- 수정할 때도 수정한 후에 save를 하면서 업데이트를 할 수 있다. 이 경우에는 모델조건을 확인가능하다.

### 해결방법 1. 몽구스 사용하지 않고 코드 수정해서 해결하는 방법 (findOneAndUpdate)

```jsx
let updateBody = {};

if (age) {
	updateBody.age = age;
}

if (name) {
	upateBody.name = name;
}

const user = await User.findByIdAndUpdate(userId, updateBody, {
	new: true
});
```

- 요런식으로 수정할 값이 들어가는 객체 updateBody 를 따로 생성해서 값이 없는것들은 걸러낸 후에 보낸다.
- 장점 : db에 한번만 왔다갔다 하면 된다.

### 해결방법 2. 몽구스 사용해서 해결하는 방법 (save)

```jsx
let user = await User.findById(userId);

if (age) {
	user.age = age;
}

if (name) {
	user.name = name;
}

await user.save();
```

- 몽구스가 바뀐부분을 찾은 후 알아서 수정처리 해준다.
- 단점 : db 를 두번 왔다갔다 한다. 찾는데 한번, 업데이트 한번
- 장점 : 객체가 복잡해질 시 처리가 좀 더 효율적, new true 같은 설정 안해줘도 된다.
- 데이터 구조가 복잡할 시 이 방법 사용
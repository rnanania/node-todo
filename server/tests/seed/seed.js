const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { Todo } = require('./../../models/todo');
const { User } = require('./../../models/user');

const SECRET_KEY = process.env.JWT_SECRET;
const userOneID = new ObjectID();
const userTwoID = new ObjectID();

// Initial dummy Todos
const todos = [{
    _id: new ObjectID(),
    text: 'First test todo',
    _creator: userOneID
},{
    _id: new ObjectID(),
    text: 'Second test todo',
    _creator: userTwoID
}];

const populateTodos = (done) => {
    // Remove all previous todos from DB before each test execution.
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => {
        done();
    });
};


const users = [{
    _id: userOneID,
    email: 'rohit.nanania@gmail.com',
    password: 'mypasword',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneID, access: 'auth'}, SECRET_KEY).toString()
    }]
}, {
    _id: userTwoID,
    email: 'vishal.nanania@gmail.com',
    password: 'mypasword',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userTwoID, access: 'auth'}, SECRET_KEY).toString()
    }]
}];

const populateUsers = (done) => {
    // Remove all previous users from DB before each test execution.
    User.remove({}).then(() => {
        let user1 = new User(users[0]).save();
        let user2 = new User(users[1]).save();

        return Promise.all([user1, user2]);
    }).then(() => {
        done();
    });
};

module.exports = { todos, populateTodos, users, populateUsers };
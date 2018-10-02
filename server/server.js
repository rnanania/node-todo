let config = require('./config/config.js');
let express = require('express');
let bodyParser = require('body-parser');
let _ = require('lodash');

let { ObjectID } = require('mongodb');
let { mongoose } = require('./db/mongoose');
let { Todo } = require('./models/todo');
let { User } = require('./models/user');
let { authenticate } = require('./middleware/authenticate');

let app = express();
const PORT  = process.env.PORT;
app.use(bodyParser.json());

app.post('/todos', authenticate, (req, resp) => {
    let todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });
    todo.save().then((doc) => {
        resp.send(doc);
    }, (e) => {
        resp.status(400).send(e);
    });
});

app.get('/todos', authenticate, (req, resp) => {
    Todo.find({ _creator: req.user._id }).then((todos) => {
        resp.send({todos});
    }, (err) => {
        resp.status(400).send(err);
    });
});

app.get('/todos/:id', authenticate, (req, resp) => {
    let id = req.params.id;

    // Check if id is valid or not.
    if(!ObjectID.isValid(id)){
        return resp.status(404).send();
    }

    Todo.findOne({ _id: id, _creator: req.user._id }).then((todo) => {
        if(!todo){
            return resp.status(404).send();
        }
        resp.send({todo});
    }, (err) => {
        resp.status(404).send();
    });
});

app.delete('/todos/:id', authenticate, (req, resp) => {
    let id = req.params.id;
    // Check if id is valid or not.

    if(!ObjectID.isValid(id)){
        return resp.status(404).send();
    }

    Todo.findOneAndRemove({ _id: id, _creator: req.user._id }).then((todo) => {
        if(!todo){
            return resp.status(404).send();
        }
        resp.status(200).send({todo});
    }, (err) => {
        resp.status(400).send();
    });
});

app.patch('/todos/:id', authenticate, (req, res) => {
    let id = req.params.id;
    
    if(!ObjectID.isValid(id)){
        return resp.status(404).send();
    }

    let body = _.pick(req.body, ['text', 'completed']);

    // CompletedAt calculation based on completed update    
    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({ _id: id, _creator: req.user._id }, { $set:body }, { new: true })
    .then((todo) => {
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e) => {
        res.send(404).send();
    });
});

app.post('/users', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);
    let user = new User(body);

    user.save().then((user) => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});


app.post('/users/login', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);
    let user = new User(body);

    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((e) => {
        res.status(400).send();
    });
});

app.delete('/users/me', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, (err) => {
        res.status(400).send();
    });
});


app.listen(PORT, () => {
    console.log('Server started on port 3000');
});

module.exports = { app };
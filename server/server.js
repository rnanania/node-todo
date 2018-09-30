let config = require('./config/config.js');
let express = require('express');
let bodyParser = require('body-parser');
let _ = require('lodash');

let { ObjectID } = require('mongodb');
let { mongoose } = require('./db/mongoose');
let { Todo } = require('./models/todo');
let { User } = require('./models/user');

let app = express();
const PORT  = process.env.PORT;
app.use(bodyParser.json());

app.post('/todos', (req, resp) => {
    let todo = new Todo({
        text: req.body.text
    });
    todo.save().then((doc) => {
        resp.send(doc);
    }, (e) => {
        resp.status(400).send(e);
    });
});

app.get('/todos', (req, resp) => {
    Todo.find().then((todos) => {
        resp.send({todos});
    }, (err) => {
        resp.status(400).send(err);
    });
});

app.get('/todos/:id', (req, resp) => {
    let id = req.params.id;
    // Check if id is valid or not.
    if(!ObjectID.isValid(id)){
        return resp.status(404).send();
    }

    Todo.findById(id).then((todo) => {
        if(!todo){
            return resp.status(404).send();
        }
        resp.send({todo});
    }, (err) => {
        resp.status(404).send();
    });
});

app.delete('/todos/:id', (req, resp) => {
    let id = req.params.id;
    // Check if id is valid or not.

    if(!ObjectID.isValid(id)){
        return resp.status(404).send();
    }

    Todo.findByIdAndRemove(id).then((todo) => {
        if(!todo){
            return resp.status(404).send();
        }
        resp.status(200).send({todo});
    }, (err) => {
        resp.status(400).send();
    });
});

app.patch('/todos/:id', (req, res) => {
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

    Todo.findByIdAndUpdate(id, { $set:body }, { new: true })
    .then((todo) => {
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e) => {
        res.send(404).send();
    });
});

app.listen(PORT, () => {
    console.log('Server started on port 3000');
});

module.exports = { app };
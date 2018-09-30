const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

// Initial dummy Todos
const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
},{
    _id: new ObjectID(),
    text: 'Second test todo'
}];

beforeEach((done) => {
    // Remove all previous todos from DB before each test execution.
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => {
        done();
    });
});

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        let text = 'Test Todo using mocha';
        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((resp) => {
                expect(resp.body.text).toBe(text)
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((err) => {
                    done(err);
                });
            });
    });

    it('should not create todo with invalid body data', (done) => {
        request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end((err, res) => {
            if(err){
                return done(err);
            }

            Todo.find().then((todos) => {
                expect(todos.length).toBe(2);
                done();
            }).catch((e) => {
                done(e);
            });
        });
    });
});


describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
        .get('/todos')
        .expect(200)
        .expect((res) => {
            expect(res.body.todos.length).toBe(2);
        })
        .end((err, res) => {
            if(err){
                done(err);
            }
            done();
        });
    });
});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo._id).toBe(todos[0]._id.toHexString());
        })
        .expect((res) => {
            expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
    });

    it('should return 404 if todo doc not found', (done) => {
        let hexId = new ObjectID().toHexString();

        request(app)
        .get(`/todos/${hexId}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 for non-object ids', (done) => {
        request(app)
        .get(`/todos/1234`)
        .expect(404)
        .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should delete todo doc', (done) => {
        request(app)
        .delete(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo._id).toBe(todos[0]._id.toHexString());
        })
        .expect((res) => {
            expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
    });

    it('should return 404 if todo doc not found', (done) => {
        let hexId = new ObjectID().toHexString();
        request(app)
        .delete(`/todos/${hexId}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 for non-object ids', (done) => {
        request(app)
        .delete(`/todos/1234`)
        .expect(404)
        .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('should update todo doc', (done) => {
        request(app)
        .patch(`/todos/${todos[0]._id.toHexString()}`)
        .send({ text: 'Updated text', completed: true })
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe('Updated text');
            expect(res.body.todo.completed).toBe(true);
        })
        .end(done);
    });

    it('should update todo doc', (done) => {
        request(app)
        .patch(`/todos/${todos[0]._id.toHexString()}`)
        .send({ text: 'Updated text', completed: false })
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe('Updated text');
            expect(res.body.todo.completed).toBe(false);
        })
        .end(done);
    });    

    it('should return 404 if todo doc not found', (done) => {
        let hexId = new ObjectID().toHexString();
        request(app)
        .patch(`/todos/${hexId}`)
        .send({})
        .expect(404)
        .end(done);
    });
});
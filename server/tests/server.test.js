const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');
const { User } = require('./../models/user');

const { todos, populateTodos, users, populateUsers } = require('./seed/seed');

beforeEach(populateTodos);
beforeEach(populateUsers);

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

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
        .get('/users/me')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body._id).toBe(users[0]._id.toHexString());
            expect(res.body.email).toBe(users[0].email);
        })
        .end(done);
    });

    it('should return 401 if user is not authenticated', (done) => {
        request(app)
        .get('/users/me')
        .expect(401)
        .expect((res) => {
            expect(res.body).toEqual({});
        })
        .end(done);
    });
});

describe('POST /users', () => {
    it('should create a user', (done) => {
        let email = 'example@example.com';
        let password = 'mypassword';

        request(app)
        .post('/users')
        .send({email, password})
        .expect(200)
        .expect((res) => {
            expect(res.headers['x-auth']).toBeDefined();
            expect(res.body.email).toBeDefined();
            expect(res.body.email).toBe(email);
        })
        .end((err) => {
            if(err){
                return done(err);
            }

            User.findOne({email}).then((user) => {
                expect(user).toBeDefined();
                //expect(user.password).toNotBe(password);
                done();
            });
        });
    });

    
    it('should return validation error on invalid request', (done) => {
        let email = 'invalidEmail';
        let password = 'pass';
        request(app)
        .post('/users')
        .send({email, password})
        .expect(400)
        .end(done);
    });
 
    it('should return 400 on unique email constraint', (done) => {
        request(app)
        .post('/users')
        .send({email: users[0].email, password: users[0].password})
        .expect(400)
        .end(done);
    });
});

describe('POST /users/login', () => {
    it('should login user', (done) => {
        request(app)
        .post('/users/login')
        .send({email: users[1].email, password: users[1].password})
        .expect(200)
        .expect((res) => {
            expect(res.headers['x-auth']).toBeDefined();
        })
        .end((err, res) => {
            if(err){
                return done(err);
            }

            User.findById(users[1]._id).then((user) => {
                expect(user.tokens[0].access).toBe('auth');
                expect(user.tokens[0].token).toBe(res.headers['x-auth']);
                done();
            }).catch(done);
        });
    });
 
    it('should reject invalid user', (done) => {
        request(app)
        .post('/users/login')
        .send({email: users[1].email, password: users[1].password + 'extra'})
        .expect(400)
        .end(done);
    });
});
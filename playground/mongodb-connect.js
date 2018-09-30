const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if(err) {
        return console.log('Unable to connect to MongoDB - TodoApp');
    }
    console.log('Connected to MongoDb Server...');

    // const db = client.db('TodoApp');
    // db.collection('Todos').insertOne({
    //     test: 'Something to do',
    //     completed: false
    // }, (err, result) => {
    //     if(err) {
    //         return console.info('Collection insert failed...', err);
    //     }
    //     console.info(JSON.stringify(result.ops, undefined, 2));
    // });

    const db = client.db('TodoApp');
    db.collection('Todos').find().toArray().then((docs)=>{
        console.log('Todos');
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('Unable to fetch docs', err);
    });

    // const db = client.db('Users');
    // db.collection('Todos').insertOne({
    //     name: 'Rohit Nanania',
    //     age: 30,
    //     location: 'Jersey City'
    // }, (err, result) => {
    //     if(err) {
    //         return console.info('Collection insert failed...', err);
    //     }
    //     console.info(JSON.stringify(result.ops, undefined, 2));
    // });

    client.close();
});
Create sample config.json file under 'server/config/' folder to run this app locally.

Sample config.json file
{
    "test" : {
        "PORT" : 3000,
        "MONGODB_URI": "mongodb://localhost:27017/TodoAppTest",
        "JWT_SECRET": "mysecretjwt"
    },
    "development": {
        "PORT" : 3000,
        "MONGODB_URI": "mongodb://localhost:27017/TodoApp",
        "JWT_SECRET": "mysecretjwt"
    }
} 
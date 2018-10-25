# Todo App using NodeJS

Todo application using NodeJS. Includes features like
* Login
* Logout
* Authentication using JWT Token
* Password hashing using BCryptJs
* Todo APIs protected with authentication
* Test coverage using Mocha

## Getting Started

* Clone this repository
* Create a sample configuration file config.json under 'server/config' folder.
* Here is the sample configuration file

```
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
```

### Prerequisites

* Install and run mongodb instance locally.
* Install Studio-3D to view MongoDb content.
* Install POSTMAN to test APIs locally.

### Installing

```
npm install
node server/server.js
```

## Running the tests

```
npm run test
```

## Authors

* **Rohit Nanania** - [GitHub](https://github.com/rnanania)


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone whose code was used
* Inspiration
* etc
